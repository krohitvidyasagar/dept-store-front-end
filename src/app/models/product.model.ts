import { ProductReview } from './review.model';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock_quantity: number;
}


export interface ProductDetails {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  average_rating: number;
  reviews: ProductReview[]
}