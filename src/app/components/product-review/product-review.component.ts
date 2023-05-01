import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductDetails } from 'src/app/models/product.model';
import { ProductReview } from 'src/app/models/review.model';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
})
export class ProductReviewComponent implements OnInit {

  productId!: string;
  reviews!: ProductReview[];
  productDetails!: ProductDetails;
  averageRating!: number;
  newRating!: number;
  newReview!: string;
  user: any;
  durationInSeconds = 5;

  constructor(private storeService: StoreService, private route: ActivatedRoute, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    // Get the product ID from the route params
    this.route.params.subscribe((params: Params) => {
      this.productId = params['id'];

      this.storeService.getProductDetails(this.productId).subscribe((response) => {
        this.productDetails = response;

        this.averageRating = this.productDetails['average_rating'];

        this.reviews = this.productDetails['reviews'];
      });
    });

    if (sessionStorage.getItem('user')) {
      this.user = sessionStorage.getItem('user');
     }

  }

  onSubmit(): void {
    this.storeService.addProductReview(this.productId, this.newRating, this.newReview).subscribe(
      (response) => {

        this._snackBar.openFromComponent(ReviewAddedComponent, {
          duration: this.durationInSeconds * 1000,
        });

        location.reload();
      });
  }

}

@Component({
  selector: 'review-added-component-snack',
  template: `
  <span class="review-added">
   Review added succesfully
</span>
  `,
  styles: [
    `
    .review-added {
      color: green;
    }
  `,
  ],
})
export class ReviewAddedComponent {}

