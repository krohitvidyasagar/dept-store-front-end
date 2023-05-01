import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ProductDetails } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {

  private _productNameSource = new Subject<string>();
  authHeader: any;

  productName$ = this._productNameSource.asObservable();
  
  constructor(private httpClient: HttpClient) {}

  getAllDepartments() {
    return this.httpClient.get('/api/department');
  }

  getProducts(subcategory?: number) {
    return this.httpClient.get(`/api/product${subcategory ? '?subcategory_number=' + subcategory: ''}`);
  }

  getProductsByName(name: string, subcategory?: number) {
    return this.httpClient.get(`/api/product?name=${name}&${subcategory ? 'subcategory_number=' + subcategory: ''}`);
  }

  searchProducts(productName: string) {
    this._productNameSource.next(productName);
  }

  getProductDetails(productId: string): Observable<ProductDetails> {
    return this.httpClient.get<ProductDetails>(`api/product/${productId}`);
  }

  getAuthHeader() {
    let authToken = sessionStorage.getItem('access');
      
      let headers_object = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + authToken
      })

      return {
        headers: headers_object
      }
  }

  addProductReview(productId: string, rating: number, review: string) {
    if (!this.authHeader) {
      this.authHeader = this.getAuthHeader()
    }

    let body = {
      'rating': +rating,
      'review': review
    }

    return this.httpClient.post(`/api/product/${productId}/review`, body, this.authHeader);
  }
}
