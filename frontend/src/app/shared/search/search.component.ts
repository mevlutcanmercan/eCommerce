import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgForOf, NgIf } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatAutocompleteModule,ReactiveFormsModule,FormsModule,MatInputModule,NgForOf,NgIf,ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchQuery: string = '';
  results: any = {
    products: [],
    categories: [],
    upperCategories: [],
  };

  constructor(private http: HttpClient, private searchService:SearchService, private router:Router) {}
  onSearch() {
    if (this.searchQuery.trim()) {
      this.searchService.search(this.searchQuery).subscribe((response: any) => {
        if (response.success) {
          this.results = response.data;
        } else {
          this.results = {
            products: [],
            categories: [],
          };
        }
      });
    } else {
      this.results = {
        products: [],
        categories: [],
      };
    }
  }

  // Kategoriye yönlendirme
  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }

  // Ürün detayına yönlendirme
  navigateToProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { q: this.searchQuery } });
    }
  }
}
