import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Basket, BasketItem, BasketSummary } from '../models/basket.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private basketSubject = new BehaviorSubject<Basket>({
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  });

  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);

  public basket$ = this.basketSubject.asObservable();
  public sidebarOpen$ = this.sidebarOpenSubject.asObservable();

  constructor() {
    // Load basket from localStorage if available
    this.loadBasket();
  }

  addToBasket(product: Product, quantity: number = 1): void {
    const currentBasket = this.basketSubject.value;
    const existingItemIndex = currentBasket.items.findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      // Update existing item
      currentBasket.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      currentBasket.items.push({ product, quantity });
    }

    this.updateBasket(currentBasket);
    this.openSidebar();
  }

  removeFromBasket(productId: string): void {
    const currentBasket = this.basketSubject.value;
    currentBasket.items = currentBasket.items.filter(item => item.product.id !== productId);
    this.updateBasket(currentBasket);
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentBasket = this.basketSubject.value;
    const itemIndex = currentBasket.items.findIndex(item => item.product.id === productId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        this.removeFromBasket(productId);
      } else {
        currentBasket.items[itemIndex].quantity = quantity;
        this.updateBasket(currentBasket);
      }
    }
  }

  clearBasket(): void {
    this.updateBasket({
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0
    });
  }

  getBasketSummary(): Observable<BasketSummary> {
    return new Observable(observer => {
      this.basket$.subscribe(basket => {
        const itemCount = basket.items.reduce((sum, item) => sum + item.quantity, 0);
        observer.next({ itemCount, total: basket.total });
      });
    });
  }

  openSidebar(): void {
    this.sidebarOpenSubject.next(true);
  }

  closeSidebar(): void {
    this.sidebarOpenSubject.next(false);
  }

  getItems(): Observable<BasketItem[]> {
    return new Observable(observer => {
      this.basket$.subscribe(basket => {
        observer.next(basket.items);
      });
    });
  }

  getSubtotal(): number {
    return this.basketSubject.value.subtotal;
  }

  private updateBasket(basket: Basket): void {
    // Calculate totals
    basket.subtotal = basket.items.reduce((sum, item) =>
      sum + (item.product.price * item.quantity), 0
    );

    basket.tax = basket.subtotal * 0.08; // 8% tax
    basket.shipping = basket.subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    basket.total = basket.subtotal + basket.tax + basket.shipping;

    this.basketSubject.next(basket);
    this.saveBasket(basket);
  }

  private saveBasket(basket: Basket): void {
    try {
      localStorage.setItem('baby-sleep-basket', JSON.stringify(basket));
    } catch (error) {
      console.warn('Could not save basket to localStorage:', error);
    }
  }

  private loadBasket(): void {
    try {
      const saved = localStorage.getItem('baby-sleep-basket');
      if (saved) {
        const basket = JSON.parse(saved);
        this.basketSubject.next(basket);
      }
    } catch (error) {
      console.warn('Could not load basket from localStorage:', error);
    }
  }
}
