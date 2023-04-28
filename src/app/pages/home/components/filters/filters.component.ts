import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Output() showCategory = new EventEmitter<string>();
  @Output() subcategoryChangeEvent = new EventEmitter<number>();
  categories: string[] | undefined;
  departments: any;
  categoriesSubscription: Subscription | undefined;
  departmentsSubscription: Subscription | undefined;
  subcategoriesSubscription: Subscription | undefined;


  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.categoriesSubscription = this.storeService
      .getAllCategories()
      .subscribe((response: Array<string>) => {
        this.categories = response;
      });

    this.departmentsSubscription = this.storeService.
    getAllDepartments().subscribe((response) => {
      this.departments = response;
      console.log(this.departments)
    })
  }

  // onShowCategory(category: string): void {
  //   this.showCategory.next(category);
  // }

  onSubcategoryChange(subcategory_number: number): void {
    this.subcategoryChangeEvent.emit(subcategory_number);
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}
