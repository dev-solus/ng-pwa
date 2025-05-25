import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Product, ProductFilter, SortOption } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: '1',
      name: 'DreamCloud Baby Mattress',
      description: 'Organic cotton mattress designed for safe and comfortable baby sleep.',
      price: 299.99,
      originalPrice: 399.99,
      images: [
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600',
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600'
      ],
      category: { id: 'mattresses', name: 'Mattresses', slug: 'mattresses' },
      ageRange: { min: 0, max: 24, label: '0-2 years' },
      brand: 'DreamCloud',
      rating: 4.8,
      reviewCount: 142,
      inStock: true,
      features: ['Organic Cotton', 'Hypoallergenic', 'Waterproof Cover', 'Dual Firmness'],
      safetyRating: 'GREENGUARD Gold',
      dimensions: { length: 52, width: 28, height: 6, weight: 8.5 }
    },
    {
      id: '2',
      name: 'Snuggle Pod Convertible Crib',
      description: 'Modern convertible crib that grows with your baby.',
      price: 649.99,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600'
      ],
      category: { id: 'cribs', name: 'Cribs', slug: 'cribs' },
      ageRange: { min: 0, max: 48, label: '0-4 years' },
      brand: 'Snuggle',
      rating: 4.6,
      reviewCount: 89,
      inStock: true,
      features: ['Convertible to Toddler Bed', 'Solid Wood', 'Non-toxic Finish', 'Adjustable Height'],
      safetyRating: 'JPMA Certified',
      dimensions: { length: 54, width: 30, height: 41, weight: 45 }
    },
    {
      id: '3',
      name: 'SleepyTime Sound Machine',
      description: 'Gentle sounds to help your baby fall asleep peacefully.',
      price: 49.99,
      images: [
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600'
      ],
      category: { id: 'accessories', name: 'Sleep Accessories', slug: 'accessories' },
      ageRange: { min: 0, max: 36, label: '0-3 years' },
      brand: 'SleepyTime',
      rating: 4.4,
      reviewCount: 256,
      inStock: true,
      features: ['20 Soothing Sounds', 'Timer Function', 'Portable', 'Night Light'],
      safetyRating: 'CE Certified'
    },
    {
      id: '4',
      name: 'CloudSoft Baby Blanket',
      description: 'Ultra-soft organic cotton blanket for cozy sleep.',
      price: 34.99,
      images: [
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600'
      ],
      category: { id: 'bedding', name: 'Bedding', slug: 'bedding' },
      ageRange: { min: 0, max: 24, label: '0-2 years' },
      brand: 'CloudSoft',
      rating: 4.7,
      reviewCount: 178,
      inStock: true,
      features: ['Organic Cotton', 'Hypoallergenic', 'Machine Washable', 'Breathable'],
      safetyRating: 'OEKO-TEX Standard'
    }
  ];

  private searchSubject = new BehaviorSubject<string>('');
  public searchTerm$ = this.searchSubject.asObservable();

  constructor() { }

  getProducts(filter?: ProductFilter, sort?: SortOption): Observable<Product[]> {
    let filteredProducts = [...this.products];

    // Apply filters
    if (filter) {
      if (filter.categories?.length) {
        filteredProducts = filteredProducts.filter(p =>
          filter.categories!.includes(p.category.id)
        );
      }

      if (filter.priceRange) {
        filteredProducts = filteredProducts.filter(p =>
          p.price >= filter.priceRange!.min && p.price <= filter.priceRange!.max
        );
      }

      if (filter.brands?.length) {
        filteredProducts = filteredProducts.filter(p =>
          filter.brands!.includes(p.brand)
        );
      }

      if (filter.inStockOnly) {
        filteredProducts = filteredProducts.filter(p => p.inStock);
      }
    }

    // Apply sorting
    if (sort) {
      filteredProducts.sort((a, b) => {
        let comparison = 0;
        switch (sort.field) {
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'rating':
            comparison = a.rating - b.rating;
            break;
          case 'popularity':
            comparison = a.reviewCount - b.reviewCount;
            break;
          default:
            comparison = 0;
        }
        return sort.direction === 'desc' ? -comparison : comparison;
      });
    }

    return of(filteredProducts);
  }

  getProduct(id: string): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
  }

  searchProducts(term: string): Observable<Product[]> {
    this.searchSubject.next(term);
    const filtered = this.products.filter(p =>
      p.name.toLowerCase().includes(term.toLowerCase()) ||
      p.description.toLowerCase().includes(term.toLowerCase()) ||
      p.features.some(f => f.toLowerCase().includes(term.toLowerCase()))
    );
    return of(filtered);
  }

  getBestProducts(): Observable<Product[]> {
    const best = this.products
      .filter(p => p.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
    return of(best);
  }

  getCategories() {
    const categories = Array.from(new Set(this.products.map(p => p.category.id)))
      .map(id => this.products.find(p => p.category.id === id)?.category)
      .filter(Boolean);
    return of(categories);
  }

  getBrands() {
    const brands = Array.from(new Set(this.products.map(p => p.brand)));
    return of(brands);
  }
}
