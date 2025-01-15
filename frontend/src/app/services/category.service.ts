import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';
import { environment } from '../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  constructor(private http: HttpClient, private envService: EnvironmentService) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }

  getUpperCategories(): Observable<UpperCategory[]> {
    return this.http.get<UpperCategory[]>(`${environment.apiUrl}/uppercategories`);
  }

  getSubcategories(upperCategories_id: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/subcategories/${upperCategories_id}`);
  }
  getCategoriesByID(categoryId: string) : Observable<Category[]>{
    return this.http.get<Category[]>(`${environment.apiUrl}/categories/${categoryId}`);
  }

  getCategoriesByIds(categoryIds: string[]): Observable<Category[]> {
    return this.http.post<Category[]>(`${environment.apiUrl}/categories/all`, { categoryIds });
  }
}

export interface UpperCategory {
  _id: string;
  upperCategories_Name: string;
  subcategories?: Category[];
}

export interface Category {
  _id: string;
  category_Name: string;
  upperCategories_id: string;
}
