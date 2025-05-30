import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/card.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Product} from '../../services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-basket',
    imports: [NgFor, NgIf, CurrencyPipe, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule, RouterModule],
    templateUrl: './basket.component.html',
    styleUrl: './basket.component.scss'
})
export class BasketComponent implements OnInit{
  cartItems: Product[] = [];
  totalAmount: number = 0;

  constructor(private cartService: CartService,private dialog:MatDialog) {}

  ngOnInit(): void {
    this.cartService.cartItems.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.calculateTotal();
  }

  increaseQuantity(product: Product): void {
    this.cartService.addToCart(product);
    this.calculateTotal();
  }

  decreaseQuantity(product: Product): void {
    this.cartService.removeFromCart(product._id);
    this.calculateTotal();
  }
  deleteFromCart(productId: string): void {
    this.cartService.deleteFromCart(productId);
    this.calculateTotal();
  }
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => total + item.productPrice * item.count, 0);
  }


}
