import { HttpClient } from '@angular/common/http';
import { Component ,HostListener } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgForOf, NgIf } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-search',
    imports: [ReactiveFormsModule, FormsModule, MatInputModule, NgForOf, NgIf, ReactiveFormsModule, MatIcon],
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
  isResultsVisible: boolean = false;


  constructor(private http: HttpClient, private searchService:SearchService, private router:Router) {}

  onSearch() {
    if (this.searchQuery.trim()) {
      this.searchService.search(this.searchQuery).subscribe((response: any) => {
        if (response.success) {
          this.results = response.data;
          this.isResultsVisible = true; // Arama başarılıysa sonuçları göster
        } else {
          this.clearResults(); // Başarısız olduğunda sonuçları temizle
        }
      });
    } else {
      this.clearResults(); // Sorgu boşsa sonuçları temizle
    }
  }



  // Kategoriye yönlendirme
  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
    this.clearResults();

  }

  // Ürün detayına yönlendirme
  navigateToProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
    this.clearResults();
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { q: this.searchQuery } });
    }
    this.clearResults();

  }

  clearResults() {
    this.results = {
      products: [],
      categories: [],
    };
    this.isResultsVisible = false;
  }
    // Sayfanın herhangi bir yerine tıklayınca arama kutusunu kapat
    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        this.clearResults();
      }
    }
}
