import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: [] });
  authHeader: any;

  constructor(private _snackBar: MatSnackBar, private httpClient: HttpClient) {}

  checkValidCart(item: CartItem): boolean {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id);

    if (itemInCart && itemInCart.stock_quantity === 0) {
      return false;
    }

    return true;
  }

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id);
    if (itemInCart) {
      itemInCart.quantity += 1;
      itemInCart.stock_quantity -= 1;
    }  else {
      item.stock_quantity -= 1
      items.push(item);

    }

    this.cart.next({ items });
    this._snackBar.open('1 item added to cart.', 'Ok', { duration: 3000 });
  }

  removeFromCart(item: CartItem, updateCart = true): CartItem[] {
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );

    if (updateCart) {
      this.cart.next({ items: filteredItems });
      this._snackBar.open('1 item removed from cart.', 'Ok', {
        duration: 3000,
      });
    }

    return filteredItems;
  }

  removeQuantity(item: CartItem): void {
    let itemForRemoval!: CartItem;

    let filteredItems = this.cart.value.items.map((_item) => {
      if (_item.id === item.id) {
        _item.quantity--;
        if (_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }

      return _item;
    });

    if (itemForRemoval) {
      filteredItems = this.removeFromCart(itemForRemoval, false);
    }

    this.cart.next({ items: filteredItems });
    this._snackBar.open('1 item removed from cart.', 'Ok', {
      duration: 3000,
    });
  }

  clearCart(): void {
    this.cart.next({ items: [] });
    this._snackBar.open('Cart is cleared.', 'Ok', {
      duration: 3000,
    });
  }

  getTotal(items: CartItem[]): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
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

  updateCart(cart_products: Array<any>): Observable<object> {

    if (!this.authHeader) {
      this.authHeader = this.getAuthHeader()
    }

    return this.httpClient.put('api/cart', cart_products, this.authHeader);
  } 


  getCartProducts(): Observable<any> {
    if (!this.authHeader) {
      this.authHeader = this.getAuthHeader()
    }
    return this.httpClient.get('/api/cart', this.authHeader);
  }

  placeOrder(pickup: boolean, addressId: string, address: object, paymentInformation: object): Observable<any> {
    if (!this.authHeader) {
      this.authHeader = this.getAuthHeader()
    }

    let body: any = {
      'pickup': pickup,
      'address': address,
      'payment': paymentInformation
    }
 
    if (addressId && addressId.length > 0) {
      body['address_id'] = addressId
    }
    
    return this.httpClient.post('/api/order', body, this.authHeader);
  }

  listOrders() {
    if (!this.authHeader) {
      this.authHeader = this.getAuthHeader()
    }

    return this.httpClient.get('/api/order', this.authHeader)
  }
}
