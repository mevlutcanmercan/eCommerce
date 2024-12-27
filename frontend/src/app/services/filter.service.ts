import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private productsUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient, private envService: EnvironmentService,
  private router: Router) {
    this.productsUrl = this.envService.getProductsUrl();
    this.apiUrl = this.envService.getApiUrl();
  }
  getCategoryFeatures(categoryId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/features/category/${categoryId}`);
  }

  getFilteredProducts(categoryId: string, filters: { [key: string]: string[] }): Observable<any> {
    const params = {
      categoryId,
      filters:  JSON.stringify(filters),
    };

    return this.http.get<any>(`${this.apiUrl}/filtered-products`, { params });
  }
}

export interface Features {
  _id: string;
  featureName: string;
  featureValues: string;
}
export interface FeaturesByProduct {
  _id: string;
  productID: string;
  featureID: string;
  featureValue: string;
}

