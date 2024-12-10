import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';
import { Product } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private apiUrl: string;

  constructor(private http: HttpClient, private envService: EnvironmentService,
    private router: Router
  ) {
    this.apiUrl = this.envService.getApiUrl();
  }

  // Arama API'si
  search(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?q=${query}`);
  }
  searchAllProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?q=${query}`);
  }
  getProductsByCategoryId(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?category=${categoryId}`);
  }
  // Ürün detayı
  getProductById(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/${productId}`);
  }
}

