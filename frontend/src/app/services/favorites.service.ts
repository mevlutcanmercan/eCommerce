import { Injectable } from '@angular/core';
import { Product } from './product.service';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl: string;

  constructor(
    private authService: AuthService, private http:HttpClient, private envService:EnvironmentService
  )
  {
    this.apiUrl = envService.getApiUrl();
  }

  createDefault(){
    const headers = this.authService.addTokenToHeaders();
    return this.http.post(`${this.apiUrl}/createdefaultfavorites`, {}, { headers });
  }
  getUserCollections(): Observable<any> {
    const headers = this.authService.addTokenToHeaders();
    return this.http.get(`${this.apiUrl}/getusercollections`, { headers });
  }

  createCollection(collectionName: string): Observable<any> {
    const headers = this.authService.addTokenToHeaders();
    return this.http.post(`${this.apiUrl}/createnewcollection`, { collectionName }, { headers });
  }

  addToCollection(collectionId: string, productId: string): Observable<any> {
    const headers = this.authService.addTokenToHeaders();
    return this.http.post(`${this.apiUrl}/addTofavoritecollection`, { collectionId, productId }, { headers });
  }
  addToFavorites(product: Product) {
    this.getUserCollections().subscribe({
      next: (collections) => {
        if (collections.length === 1) {
          this.addToCollection(collections[0]._id, product._id).subscribe({
            next: () => console.log('Product added to default collection'),
            error: (error) => console.error('Error adding product:', error)
          });
        }
      },
      error: (error) => console.error('Error fetching collections:', error)
    });
  }
}

export interface Favorites {
  _id: string;
  favoritesName: string;
  favoritesIsDefault: boolean;
  favoritesByUser: string;
  favoritesProducts: string[];
}
