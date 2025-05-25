import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BasketService } from '../../../services/basket.service';
import { ProductService } from '../../../services/product.service';
import { BasketSummary } from '../../../models/basket.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  basketSummary: BasketSummary | null = null;
  mobileMenuOpen = false;
  private destroy$ = new Subject<void>();

  constructor(
    private basketService: BasketService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.basketService.getBasketSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe(summary => {
        this.basketSummary = summary;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value.trim();

    if (searchTerm) {
      this.productService.searchProducts(searchTerm).subscribe();
      // Navigate to products page with search results
      // This will be implemented when we add routing navigation
    }
  }

  openBasket(): void {
    this.basketService.openSidebar();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
