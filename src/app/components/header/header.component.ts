import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  private _cart: Cart = { items: [] };
  itemsQuantity = 0;
  user: any;

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;

    this.itemsQuantity = cart.items
      .map((item) => item.quantity)
      .reduce((prev, curent) => prev + curent, 0);
  }

  constructor(private cartService: CartService, private storeService: StoreService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.user$.subscribe(() => { 
      this.setUser();
     });

     if (sessionStorage.getItem('user')) {
      this.setUser();
     }
  }

  setUser() {
    this.user = sessionStorage.getItem('user');
  }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onKey(event: any): void {
    let productName = (event.target as HTMLInputElement).value
    this.storeService.searchProducts(productName);
  }

  onLogout() {
    sessionStorage.clear();
    location.reload();
    this.router.navigateByUrl('/');
  }
}
