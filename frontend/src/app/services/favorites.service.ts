import { Injectable } from '@angular/core';
import { Product } from './product.service';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from './environment.service';

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

  addToFavorites(product: Product) {

}
}
export interface Favorites {
  _id: string;
  favoritesName: number;
  favoritesIsDefault: Boolean;
  favoritesByUser: string;
  favoritesProducts: string;
}
