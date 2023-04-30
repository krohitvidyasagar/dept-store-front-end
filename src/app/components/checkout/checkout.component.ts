import { Component, Inject, OnInit } from '@angular/core';
import { Address } from 'src/app/models/Address.model';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { Router } from '@angular/router';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  deliveryOption!: string;

  cartProductArray: Array<any> | undefined;
  addresses!: Address[];
  addressId!: string;
  totalPrice = 0;
  durationInSeconds = 5;

  cartItems!: Array<CartItem>;

  addressName = '';
  addressLine1 = '';
  addressLine2 = '';
  city = '';
  state = '';
  zipcode = '';

  cardCvv = '';
  cardExpiry = '';
  cardName = '';
  cardNumber = '';
  selectedAddress = {};
  isFormValid = false;
  cartSubscription: Subscription | undefined;


  constructor(private cartService: CartService, private userService: UserService, private router: Router,  private _snackBar: MatSnackBar) {
    this.deliveryOption = 'pickup';
  }

  ngOnInit(): void {
    this.cartService.getCartProducts().subscribe((response) => {
      for(let i=0; i<response.length; i++) {
        this.totalPrice += response[i]['product']['price'] * response[i]['quantity'];
      }
    });

    this.userService.getAddresses().subscribe((response) => {
      this.addresses = response;
    });

    this.cartSubscription = this.cartService.cart.subscribe((_cart: Cart) => {
      this.cartItems = _cart.items;
    });
  }

  chooseAddress(addressId: string): void {
    this.addressId = addressId;
  }

  submitOrder() {
    let address = {
      'address_name': this.addressName,
      'address_line_1': this.addressLine1,
      'address_line_2': this.addressLine2,
      'city': this.city,
      'state': this.state,
      'zipcode': this.zipcode
    }

    let paymentInfo = {
      'card_number': this.cardNumber,
      'security_code': this.cardCvv,
      'payment_method_name': this.cardName
    }

    let pickpUp = (this.deliveryOption === 'pickup')? true: false;

    this.cartService.placeOrder(pickpUp, this.addressId, address, paymentInfo).subscribe((response) => {
      this.router.navigateByUrl('/');

      this.cartService.clearCart();

      this._snackBar.openFromComponent(OrderConfirmationComponent, {
        duration: this.durationInSeconds * 1000,
        data: response['order_number']
      });
    })
  }

}


@Component({
  selector: 'order-confirmation-component-snack',
  template: `
  <span class="order-confirmation">
   Order: {{ data }} has been confirmed
</span>
  `,
  styles: [
    `
    .order-confirmation {
      color: green;
    }
  `,
  ],
})
export class OrderConfirmationComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) { }
}
