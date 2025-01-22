import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  imports: [MatTabGroup,MatTab,NgFor],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  userOrders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchUserOrders();
  }

  fetchUserOrders(): void {
    this.orderService.getUserOrders().subscribe(
      (orders) => {
        this.userOrders = orders;
        console.log('User orders:', this.userOrders);
      },
      (error) => {
        console.error('Error fetching user orders:', error);
      }
    );
  }
}
