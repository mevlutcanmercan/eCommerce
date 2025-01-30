import { Product } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favorites',
  imports: [NgFor,CommonModule,FormsModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoriteComponent implements OnInit {
  userCollections: any[] = [];
  newCollectionName: string = '';
  product: Product []=[];

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    this.loadCollections();
  }

  loadCollections() {
    this.favoritesService.getUserCollections().subscribe({
      next: (collections) => {
        this.userCollections = collections;
      },
      error: (error) => console.error('Error fetching collections:', error)
    });
  }

  createCollection() {
    if (!this.newCollectionName.trim()) return;

    this.favoritesService.createCollection(this.newCollectionName).subscribe({
      next: () => {
        this.loadCollections();
        this.newCollectionName = '';
      },
      error: (error) => console.error('Error creating collection:', error)
    });
  }
}
