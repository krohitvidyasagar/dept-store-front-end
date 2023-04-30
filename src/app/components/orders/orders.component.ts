import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  cartSubscription: Subscription | undefined;
  columns: string[] = ['orderNumber', 'orderDate', 'pickup', 'addressName', 'payment', 'totalCost'];
  orders: any;


  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.listOrders().subscribe((response) => {
      this.orders = response;
    });
  }

}
