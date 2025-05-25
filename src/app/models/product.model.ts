export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: ProductCategory;
  ageRange: AgeRange;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  features: string[];
  safetyRating: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface AgeRange {
  min: number; // in months
  max: number; // in months
  label: string;
}

export interface ProductFilter {
  categories?: string[];
  ageRanges?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  brands?: string[];
  inStockOnly?: boolean;
  safetyRating?: string;
}

export interface SortOption {
  field: 'price' | 'rating' | 'popularity' | 'newest';
  direction: 'asc' | 'desc';
  label: string;
}
