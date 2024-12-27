import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Features, FilterService } from '../../services/filter.service';
import { CommonModule, NgFor, NgForOf } from '@angular/common';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [ReactiveFormsModule,MatCheckboxModule,NgFor,NgForOf,CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent implements OnInit {
  @Input() categoryId!: string;
  @Output() filtersApplied = new EventEmitter<{ [key: string]: string[] }>(); // Filtreleri dışarıya iletir
  features: Features[] = [];
  selectedFilters: { [key: string]: string[] } = {};

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.loadFeatures();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryId'] && changes['categoryId'].currentValue !== changes['categoryId'].previousValue) {
      this.selectedFilters = {};
      this.loadFeatures();
    }
  }
  loadFeatures(): void {
    if (this.categoryId) {
      this.filterService.getCategoryFeatures(this.categoryId).subscribe(
        (response) => {
          if (response.data.length === 0) {

            console.error('There is no feature in the category:', response);
          }
          else if (response.success) {
            this.features = response.data.map((feature: Features) => ({
              ...feature,
              featureValues: JSON.parse(feature.featureValues).map((value: string) =>
                value.replace(/^\["|"\]$/g, '').trim()
              ),
            }));
          } else {
            console.error('Failed to load features:', response);
          }
        },
        (error) => {
          console.error('Error fetching features:', error);
        }
      );
    }
  }


  onCheckboxChange(featureId: string, value: string, isChecked: boolean): void {
    if (!this.selectedFilters[featureId]) {
      this.selectedFilters[featureId] = [];
    }

    if (isChecked) {
      // Değerin zaten eklenmiş olup olmadığını kontrol et
      if (!this.selectedFilters[featureId].includes(value)) {
        this.selectedFilters[featureId].push(value);
      }
    } else {
      // Değeri çıkart
      const index = this.selectedFilters[featureId].indexOf(value);
      if (index > -1) {
        this.selectedFilters[featureId].splice(index, 1);
      }
    }

    // Filtreleri dışarıya ilet
    this.filtersApplied.emit(this.selectedFilters);
  }

}

