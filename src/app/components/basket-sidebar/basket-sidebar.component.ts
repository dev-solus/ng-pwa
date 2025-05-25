import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BasketService } from '../../services/basket.service';
import { Basket } from '../../models/basket.model';

@Component({
  selector: 'app-basket-sidebar',
  imports: [CommonModule],
  templateUrl: './basket-sidebar.component.html',
  styleUrl: './basket-sidebar.component.scss'
})
export class BasketSidebarComponent implements OnInit, OnDestroy {
  isOpen = false;
  basket: Basket | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private basketService: BasketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to sidebar state
    this.basketService.sidebarOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOpen => {
        this.isOpen = isOpen;
      });

    // Subscribe to basket changes
    this.basketService.basket$
      .pipe(takeUntil(this.destroy$))
      .subscribe(basket => {
        this.basket = basket;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(): void {
    this.basketService.closeSidebar();
  }

  updateQuantity(productId: string, quantity: number): void {
    this.basketService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string): void {
    this.basketService.removeFromBasket(productId);
  }

  navigateToProducts(): void {
    this.close();
    this.router.navigate(['/products']);
  }

  proceedToCheckout(): void {
    this.close();
    this.router.navigate(['/checkout']);
  }
}
