import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Favorites, FavoritesService } from '../../services/favorites.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NgFor, NgForOf } from '@angular/common';

@Component({
  selector: 'app-favoriteselection',
  imports: [MatFormField,MatLabel,MatOption,MatSelect,FormsModule,NgFor,NgForOf],
  templateUrl: './favoriteselection.component.html',
  styleUrl: './favoriteselection.component.scss'
})
export class FavoriteselectionComponent {
  selectedCollection: string = '';
  newCollectionName: string = '';
  collection: Favorites[]=[];

  constructor(
    public dialogRef: MatDialogRef<FavoriteselectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { collections: any[], productId: string },
    private favoritesService: FavoritesService
  ) {}

  addToCollection() {
    if (this.selectedCollection) {
      this.favoritesService.addToCollection(this.selectedCollection, this.data.productId).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }


}
