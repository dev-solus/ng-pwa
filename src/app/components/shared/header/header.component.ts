import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BasketService } from '../../../services/basket.service';
import { ProductService } from '../../../services/product.service';
import { TranslationService } from '../../../services/translation.service';
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
  isDarkMode = false;
  currentLanguage = 'fr';
  languageMenuOpen = false;
  availableLanguages: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private basketService: BasketService,
    private productService: ProductService,
    private translationService: TranslationService
  ) {
    // Check for saved dark mode preference
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.updateDarkMode();

    // Initialize available languages
    this.availableLanguages = this.translationService.getAvailableLanguages();
  }

  ngOnInit(): void {
    this.basketService.getBasketSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe(summary => {
        this.basketSummary = summary;
      });

    // Subscribe to language changes
    this.translationService.getCurrentLanguage()
      .pipe(takeUntil(this.destroy$))
      .subscribe(language => {
        this.currentLanguage = language;
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

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.updateDarkMode();
  }

  toggleLanguageMenu(): void {
    this.languageMenuOpen = !this.languageMenuOpen;
  }

  changeLanguage(languageCode: string): void {
    this.translationService.setLanguage(languageCode);
    this.languageMenuOpen = false;
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  getCurrentLanguageFlag(): string {
    const currentLang = this.availableLanguages.find(lang => lang.code === this.currentLanguage);
    return currentLang?.flag || '🌐';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-selector')) {
      this.languageMenuOpen = false;
    }
  }

  private updateDarkMode(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
