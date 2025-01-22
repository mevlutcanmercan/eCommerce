import { ProductService ,Product} from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/card.service';
import { UserService, User } from '../../services/user.service';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SnackbarService } from '../../services/snackbar.service';
import { MESSAGES } from '../../constants';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
    selector: 'app-card',
    imports: [FormsModule, ReactiveFormsModule,MatButton,ReactiveFormsModule,MatInputModule,MatFormFieldModule],
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  cardForm: FormGroup;
  isFlipped: boolean = false;
  cartItems: Product[] = [];
  totalAmount: number = 0;
  buyer: any;

  constructor(private fb: FormBuilder, private cartService: CartService, private http: HttpClient,private product: ProductService, private userService: UserService,private snackbarService: SnackbarService,private router: Router,private orderService:OrderService) {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      cardName: ['', Validators.required],
      cardExpiryMonth: ['', Validators.required],
      cardExpiryYear: ['', Validators.required],
      cardCvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    });
  }

  ngOnInit() {
    this.cartService.cartItems.subscribe((items: Product[]) => {
      this.cartItems = items;
      this.totalAmount = this.cartItems.reduce((total, item) => total + (item.productPrice * item.count), 0);
    });

    this.userService.getCurrentUser().subscribe((user) => {
      this.buyer = user;
    });
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  onSubmit() {
    const paymentData = {
      price: parseFloat(this.totalAmount.toFixed(2)),
      paidPrice: parseFloat(this.totalAmount.toFixed(2)),
      currency: 'TRY',
      basketId: 'B67832',
      paymentCard: {
        cardHolderName: this.cardForm.get('cardName')?.value,
        cardNumber: this.cardForm.get('cardNumber')?.value,
        expireMonth: this.cardForm.get('cardExpiryMonth')?.value,
        expireYear: this.cardForm.get('cardExpiryYear')?.value,
        cvc: this.cardForm.get('cardCvc')?.value,
        registerCard: '0'
      },
      buyer: {
        id: this.buyer?._id,
        name: this.buyer?.userName,
        surname: this.buyer?.userSurname,
        identityNumber: this.buyer?.userTC,
        email: this.buyer?.userMail,
        gsmNumber: this.buyer?.userTel,
        registrationAddress: this.buyer?.address || 'Sample Address',
        ip: '85.34.78.112',
        city: this.buyer?.city || 'Istanbul',
        country: this.buyer?.country || 'Turkey'
      },
      shippingAddress: {
        contactName: this.cardForm.get('cardName')?.value,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Sample Shipping Address'
      },
      billingAddress: {
        contactName: this.cardForm.get('cardName')?.value,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Sample Billing Address'
      },
      basketItems: this.cartItems.map(item => ({
        id: item._id,
        name: item.productName,
        category1: item.productCategoryID.toString(),
        price: parseFloat((item.productPrice * item.count).toFixed(2)),
        itemType: 'PHYSICAL',
        quantity: item.count
      }))
    };
    console.log(paymentData);

    this.http.post('http://localhost:3000/api/payment', paymentData, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe(
      (response) => {
        console.log('Payment successful:', response);


        const newOrder = {
          orderShippingString: 'Sample Shipping Address',
          orderCardNumber: paymentData.paymentCard.cardNumber,
          orderQuantity: this.cartItems.length,
          orderTotalPrice: this.totalAmount
        };

        this.orderService.addOrder(newOrder).subscribe(
          (orderResponse) => {
            console.log('Order saved:', orderResponse);
            this.snackbarService.productPurchased();
            this.cartService.clearCart();
            this.router.navigate(['/home']);
          },
          (error) => {
            console.error('Error saving order:', error);
          }
        );
      },
      (error) => {
        console.error('Payment failed:', error);
      }
    );
  }
}
