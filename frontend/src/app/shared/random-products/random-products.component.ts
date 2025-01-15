import { Product, ProductService } from './../../services/product.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { Category, CategoryService } from '../../services/category.service';

@Component({
    selector: 'app-random-products',
    imports: [NgFor, NgIf, MatCardContent, MatCardTitle, MatCard, CurrencyPipe],
    templateUrl: './random-products.component.html',
    styleUrl: './random-products.component.scss'
})
export class RandomProductsComponent implements OnInit{
  randomProducts: Product[] = [];
  productCategories: { [productId: string]: string } = {};

constructor(private productsService: ProductService,private categoryService:CategoryService){}

ngOnInit(): void {
  this.loadRandomProducts();

}

 // Load random products and match them to their categories
 loadRandomProducts(): void {
  this.productsService.getRandomProducts().subscribe(
    (products: Product[]) => {
      this.randomProducts = products;
      this.matchProductsToCategories();
    },
    (error) => {
      console.error('Random products not working:', error);
    }
  );
}

matchProductsToCategories(): void {

 const categoryIds = this.randomProducts.map((product) => product.productCategoryID);

 this.categoryService.getCategoriesByIds(categoryIds).subscribe(
   (categories: Category[]) => {

    categories.forEach((category) => {
       const matchingProduct = this.randomProducts.find(
         (product) => product.productCategoryID === category._id
       );
       if (matchingProduct) {
         this.productCategories[matchingProduct._id] = category.category_Name;
       }
     });
   },
   (error) => {
     console.error('Error fetching categories:', error);
   }
 );
}

onProductClick(productId: string): void {
  this.productsService.onProductClick(productId);
}
}
