import { Component, OnInit } from '@angular/core';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { Category, CategoryService, UpperCategory } from '../../services/category.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { FilterComponent } from '../filter/filter.component';

@Component({
    selector: 'app-categoryselection',
    imports: [NgFor, NgForOf, NgIf],
    templateUrl: './categoryselection.component.html',
    styleUrl: './categoryselection.component.scss'
})
export class CategoryselectionComponent implements OnInit {
  upperCategories: UpperCategory[] = [];
  subcategories: { [key: string]: Category[] } = {};
  selectedUpperCategoryId?: string;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(private categoryService: CategoryService, private router: Router, private authService: AuthService ) { }

  ngOnInit(): void {
    this.loadCategories();

    this.authService.isAdmin.subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
    });
  }

  loadCategories(): void {
    this.categoryService.getUpperCategories().subscribe(
      (categories: UpperCategory[]) => {
        this.upperCategories = categories;

        this.upperCategories.forEach((upperCategory) => {
          const upperCategories_id = upperCategory._id;
          this.categoryService.getSubcategories(upperCategories_id).subscribe(
            (subcategories: Category[]) => {
              this.subcategories[upperCategories_id] = subcategories;
            },
            (error) => {
              console.error('Error fetching subcategories:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching upper categories:', error);
      }
    );
  }

  toggleDropdown(upperCategoryId: string): void {
    this.selectedUpperCategoryId =
      this.selectedUpperCategoryId === upperCategoryId ? undefined : upperCategoryId;
  }

  onSubcategoryClick(category: string): void {
    if (this.isAdmin) {
      this.router.navigate(['admin/products'], { queryParams: { category } });
    } else {
      this.router.navigate(['/products'], { queryParams: { category } });
    }
  }
}
