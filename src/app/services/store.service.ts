import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {

  private _productNameSource = new Subject<string>();

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
}
