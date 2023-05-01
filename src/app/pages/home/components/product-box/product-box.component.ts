import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: '[app-product-box]',
  templateUrl: './product-box.component.html',
})
export class ProductBoxComponent {
  @Input() fullWidthMode = false;
  @Input() product: any;
  @Output() addToCart = new EventEmitter();

  constructor(private router: Router) {}

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  navigateToProductReviews(productId: string): void {
    this.router.navigate(['/product', productId]);
  }
}
