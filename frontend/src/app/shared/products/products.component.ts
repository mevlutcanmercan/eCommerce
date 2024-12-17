import { CategoryselectionComponent } from '../categoryselection/categoryselection.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatCard, MatCardContent, MatCardHeader, MatCardActions, MatCardTitle } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ProductEditDialogComponent } from '../../admin/product-edit-dialog/product-edit-dialog.component';
import { MESSAGES } from '../../constants';
import { SearchService } from '../../services/search.service';
import { FilterComponent } from "../filter/filter.component";


@Component({
    selector: 'app-products',
    standalone: true,
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss',
    imports: [MatPaginator, MatCard, MatToolbar, MatCardHeader, MatCardHeader, MatCardContent, MatCardActions, MatCardTitle, CurrencyPipe, NgFor, NgIf, MatButton, MatIcon, CategoryselectionComponent, MatInputModule, FilterComponent]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  totalProducts: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  selectedCategoryId?: string;
  selectedUpperCategoryId?: string;
  isAdmin: boolean = false;
  product: Product | null = null;


  constructor(private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
     private cartService: CartService,
    private snackbarService: SnackbarService,
     private authService: AuthService,
     private searchService: SearchService,
     private dialog: MatDialog
    ) { }

      ngOnInit(): void {
        this.route.queryParams.subscribe(params => {

          if (params['category']) {
            this.selectedCategoryId = params['category'];
            this.loadProducts();
          }

          else if (params['q']) {
            this.searchService.searchAllProducts(params['q']).subscribe(
              (response: any) => {

                if (response.success && Array.isArray(response.data.products)) {
                  this.products = response.data.products;
                  this.totalProducts = response.data.products.length;
                }

                else {
                  console.error('Invalid response format:', response);
                  this.products = [];
                }
              },
              error => console.error('Error fetching products:', error)
            );
          }
          else {
            this.loadProducts();
          }
        });
      this.authService.isAdmin.subscribe(isAdmin => {
        this.isAdmin = isAdmin;
      });
    }
    loadSearchResults(query: string): void {
      this.selectedCategoryId = '';
      this.searchService.searchAllProducts(query).subscribe(
        (products: Product[]) => {
          console.log('Fetched products:', products);  // Ürünleri kontrol edin
          this.products = products;
          this.totalProducts = products.length;
        },
        error => {
          console.error('Error fetching search results:', error);
        }
      );
    }


  loadProducts(): void {
    if (this.selectedCategoryId) {
      this.productService.getProductsByCategory(this.selectedCategoryId).subscribe(
        (products: Product[]) => {
          this.products = products;
        },
        error => {
          console.error('Error fetching products by category:', error);
        }
      );
    } else {
      this.productService.getProducts(this.currentPage + 1, this.pageSize).subscribe(
        (response: any) => {
          this.products = response.data;
          this.totalProducts = response.total;
        },
        error => {
          console.error('Error fetching products:', error);
        }
      );
    }
  }

  addToCart(product: Product): void {
    if (this.authService.isLoggedIn && !this.isAdmin) {
      this.productService.addToCart(product);
      this.snackbarService.openProductAdded;
    }
    else if(this.authService.isLoggedIn && this.isAdmin)
    {
      this.snackbarService.openPorductFail;
    }
    else{
      this.snackbarService.openProfileFailSnackBar;
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadProducts();
  }

  addProduct(): void {
    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      width: '400px',
      data: { product: {}, isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      width: '400px',
      data: { product, isEditMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.loadProducts();
    });
  }

  isLoggedIn():void{
    this.authService.isLoggedIn
  }

  onProductClick(productId: string): void {
    this.productService.onProductClick(productId)
  }
}
