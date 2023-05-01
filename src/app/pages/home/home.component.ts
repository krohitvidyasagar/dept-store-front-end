import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from 'src/app/services/store.service';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  cols = 3;
  rowHeight: number = ROWS_HEIGHT[this.cols];
  count = '12';
  sort = 'desc';
  category: number | undefined;
  
  productsSubscription: Subscription | undefined;
  products: any;

  constructor(
    private cartService: CartService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.getProducts();

    this.storeService.productName$.subscribe((prodName) => { 
      this.getProductsByName(prodName);
     });
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[colsNum];
  }

  onItemsCountChange(count: number): void {
    this.count = count.toString();
  }

  onSortChange(newSort: string): void {
    this.sort = newSort;
  }

  onChangeSubcategory(newCategory: number): void {
    this.category = newCategory;
    this.getProducts();
  }

  getProducts(): void {
    this.productsSubscription = this.storeService.getProducts(this.category).subscribe(
      (newProducts) => { this.products = newProducts }
    )
  }

  getProductsByName(productName: string): void {
    this.productsSubscription = this.storeService.getProductsByName(productName, this.category).subscribe(
      (newProducts) => { this.products = newProducts }
    )
  }

  onAddToCart(product: Product): void {
    let cartItem = {
      product: product.image,
      name: product.name,
      price: product.price,
      quantity: 1,
      id: product.id,
      stock_quantity: product.stock_quantity
    }

    if (this.cartService.checkValidCart(cartItem)) {
      this.cartService.addToCart(cartItem);
    } else {
      window.alert('Stock not available')
    }
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }
}
