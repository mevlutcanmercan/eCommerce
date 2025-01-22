import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl: string;

  constructor(private http: HttpClient,private envService: EnvironmentService,private authService:AuthService) {
    this.apiUrl = this.envService.getApiUrl();

  }

  addOrder(newOrder: any): Observable<any> {
    const headers = this.authService.addTokenToHeaders();
    return this.http.post(`${this.apiUrl}/addorder`, newOrder, { headers });
  }

  getUserOrders(): Observable<any> {
    const headers = this.authService.addTokenToHeaders();
    return this.http.get(`${this.apiUrl}/orderbyuser`, { headers });
  }
}
  export interface Orders {
    _id: string;
    orderID: number;
    orderShippingString: string;
    orderCardNumber: string;
    orderQuantity: number;
    orderTotalPrice: number;
    orderUserID: string;
  }
