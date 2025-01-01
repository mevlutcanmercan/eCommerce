import { ProductService ,Product} from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/card.service';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports:[FormsModule,ReactiveFormsModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  cardForm: FormGroup;
  isFlipped: boolean = false;
  cartItems: Product[] = [];
  totalAmount: number = 0;
  buyer: any;

  constructor(private fb: FormBuilder, private cartService: CartService, private http: HttpClient,private product: ProductService, private userService: UserService) {
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
        price: parseFloat(item.productPrice.toFixed(2)),
        itemType: 'PHYSICAL'
      }))
    };
    console.log(paymentData);

    this.http.post('http://localhost:3001/api/payment', paymentData, {
  headers: { 'Content-Type': 'application/json' }
}).subscribe(
  (response) => {
    console.log('Payment successful:', response);
  },
  (error) => {
    console.error('Payment failed:', error);
  }
);

  }
}
