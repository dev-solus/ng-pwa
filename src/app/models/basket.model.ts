import { Product } from './product.model';

export interface BasketItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Basket {
  items: BasketItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  couponCode?: string;
  discount?: number;
}

export interface BasketSummary {
  itemCount: number;
  total: number;
}
