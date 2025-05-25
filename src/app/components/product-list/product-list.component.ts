import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { BasketService } from '../../services/basket.service';
import { Product, ProductCategory } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];  categories: ProductCategory[] = [];
  brands: string[] = [];

  // Filter states
  selectedCategory: string = 'all';
  selectedBrand: string = 'all';
  minPrice: number = 0;
  maxPrice: number = 1000;
  sortBy: 'name' | 'price' | 'rating' | 'newest' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  // UI states
  showFilters = false;
  loading = true;
  searchQuery = '';

  constructor(
    private productService: ProductService,
    private basketService: BasketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadFilterOptions();

    // Check for search query from route
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
        this.applyFilters();
      }
    });
  }
  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      this.filteredProducts = products;
      this.loading = false;
      this.applyFilters();
    });
  }
  loadFilterOptions() {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories.filter(Boolean) as ProductCategory[];
    });

    this.productService.getBrands().subscribe((brands: string[]) => {
      this.brands = brands;
    });
  }

  applyFilters() {
    let filtered = [...this.products];

    // Apply search filter
    if (this.searchQuery) {
      this.productService.searchProducts(this.searchQuery).subscribe((searchResults: Product[]) => {
        filtered = searchResults;
        this.applyOtherFilters(filtered);
      });
    } else {
      this.applyOtherFilters(filtered);
    }
  }
  private applyOtherFilters(filtered: Product[]) {
    // Apply category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category.id === this.selectedCategory);
    }

    // Apply brand filter
    if (this.selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brand === this.selectedBrand);
    }

    // Apply price filter
    filtered = filtered.filter(p => p.price >= this.minPrice && p.price <= this.maxPrice);

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'newest':
          comparison = a.reviewCount - b.reviewCount; // Use reviewCount as proxy for newest
          break;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredProducts = filtered;
  }

  onFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.selectedCategory = 'all';
    this.selectedBrand = 'all';
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.sortBy = 'name';
    this.sortOrder = 'asc';
    this.searchQuery = '';
    this.applyFilters();
  }
  addToBasket(product: Product) {
    this.basketService.addToBasket(product, 1);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.floor(rating));
  }
}
