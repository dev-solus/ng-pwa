import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Product, ProductFilter, SortOption } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {  private products: Product[] = [
    {
      id: '1',
      name: 'Matelas Bébé DreamCloud Bio',
      description: 'Matelas en coton biologique conçu pour un sommeil sûr et confortable de bébé.',
      price: 299.99,
      originalPrice: 399.99,
      images: [
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600',
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600'
      ],
      category: { id: 'mattresses', name: 'Matelas', slug: 'matelas' },
      ageRange: { min: 0, max: 24, label: '0-2 ans' },
      brand: 'DreamCloud',
      rating: 4.8,
      reviewCount: 142,
      inStock: true,
      features: ['Coton Bio', 'Hypoallergénique', 'Housse Imperméable', 'Double Fermeté'],
      safetyRating: 'GREENGUARD Gold',
      dimensions: { length: 52, width: 28, height: 6, weight: 8.5 }
    },
    {
      id: '2',
      name: 'Lit Bébé Évolutif Snuggle Pod',
      description: 'Lit moderne convertible qui grandit avec votre bébé.',
      price: 649.99,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600'
      ],
      category: { id: 'cribs', name: 'Lits', slug: 'lits' },
      ageRange: { min: 0, max: 48, label: '0-4 ans' },
      brand: 'Snuggle',
      rating: 4.6,
      reviewCount: 89,
      inStock: true,
      features: ['Convertible en Lit Enfant', 'Bois Massif', 'Finition Non-toxique', 'Hauteur Réglable'],
      safetyRating: 'JPMA Certifié',
      dimensions: { length: 54, width: 30, height: 41, weight: 45 }
    },
    {
      id: '3',
      name: 'Veilleuse Musicale SleepyTime',
      description: 'Sons apaisants pour aider votre bébé à s\'endormir paisiblement.',
      price: 49.99,
      images: [
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600'
      ],
      category: { id: 'accessories', name: 'Accessoires de Sommeil', slug: 'accessoires' },
      ageRange: { min: 0, max: 36, label: '0-3 ans' },
      brand: 'SleepyTime',
      rating: 4.4,
      reviewCount: 256,
      inStock: true,
      features: ['20 Sons Apaisants', 'Minuterie', 'Portable', 'Veilleuse'],
      safetyRating: 'CE Certifié'
    },
    {
      id: '4',
      name: 'Couverture Bébé CloudSoft',
      description: 'Couverture ultra-douce en coton biologique pour un sommeil douillet.',
      price: 34.99,
      images: [
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600'
      ],
      category: { id: 'bedding', name: 'Literie', slug: 'literie' },
      ageRange: { min: 0, max: 24, label: '0-2 ans' },
      brand: 'CloudSoft',
      rating: 4.7,
      reviewCount: 178,
      inStock: true,
      features: ['Coton Bio', 'Hypoallergénique', 'Lavable en Machine', 'Respirant'],
      safetyRating: 'OEKO-TEX Standard'
    },
    {
      id: '5',
      name: 'Mobile Musical Étoiles et Lune',
      description: 'Mobile rotatif avec mélodies douces et projection d\'étoiles apaisante.',
      price: 89.99,
      images: [
        'https://images.unsplash.com/photo-1573462927055-1d35fe00f44f?w=600'
      ],
      category: { id: 'accessories', name: 'Accessoires de Sommeil', slug: 'accessoires' },
      ageRange: { min: 0, max: 12, label: '0-1 an' },
      brand: 'DreamyNights',
      rating: 4.5,
      reviewCount: 203,
      inStock: true,
      features: ['Mélodies Classiques', 'Projection LED', 'Télécommande', 'Minuterie 30min'],
      safetyRating: 'EN 71 Certifié'
    },
    {
      id: '6',
      name: 'Oreiller Ergonomique Nouveau-né',
      description: 'Oreiller spécialement conçu pour soutenir la tête et le cou des nouveau-nés.',
      price: 45.99,
      images: [
        'https://images.unsplash.com/photo-1586244439413-bc2288941dda?w=600'
      ],
      category: { id: 'bedding', name: 'Literie', slug: 'literie' },
      ageRange: { min: 0, max: 6, label: '0-6 mois' },
      brand: 'BabyComfort',
      rating: 4.3,
      reviewCount: 167,
      inStock: true,
      features: ['Mousse Mémoire', 'Housse Amovible', 'Certifié Médical', 'Anti-Acariens'],
      safetyRating: 'CPSC Approuvé'
    },
    {
      id: '7',
      name: 'Gigoteuse 4 Saisons Premium',
      description: 'Gigoteuse évolutive adaptée à toutes les saisons avec régulation thermique.',
      price: 79.99,
      originalPrice: 99.99,
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'
      ],
      category: { id: 'bedding', name: 'Literie', slug: 'literie' },
      ageRange: { min: 0, max: 36, label: '0-3 ans' },
      brand: 'SleepSafe',
      rating: 4.9,
      reviewCount: 412,
      inStock: true,
      features: ['Régulation Thermique', 'Fermetures Sécurisées', 'Coton Bio', 'Tailles Modulables'],
      safetyRating: 'TOG 2.5 Certifié'
    },
    {
      id: '8',
      name: 'Moniteur de Sommeil Intelligent',
      description: 'Capteur de surveillance du sommeil avec notifications smartphone.',
      price: 199.99,
      images: [
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600'
      ],
      category: { id: 'accessories', name: 'Accessoires de Sommeil', slug: 'accessoires' },
      ageRange: { min: 0, max: 24, label: '0-2 ans' },
      brand: 'SmartBaby',
      rating: 4.2,
      reviewCount: 89,
      inStock: true,
      features: ['Surveillance Respiratoire', 'App Mobile', 'Alertes Temps Réel', 'Historique de Sommeil'],
      safetyRating: 'FDA Approuvé'
    },
    {
      id: '9',
      name: 'Veilleuse Projection Océan',
      description: 'Projecteur d\'ambiance marine avec sons de vagues pour un sommeil paisible.',
      price: 65.99,
      images: [
        'https://images.unsplash.com/photo-1418225043143-90858d2301b4?w=600'
      ],
      category: { id: 'accessories', name: 'Accessoires de Sommeil', slug: 'accessoires' },
      ageRange: { min: 0, max: 60, label: '0-5 ans' },
      brand: 'OceanDreams',
      rating: 4.6,
      reviewCount: 324,
      inStock: true,
      features: ['Projection Vagues', 'Sons Naturels', '8 Couleurs', 'Télécommande'],
      safetyRating: 'CE Marqué'
    },
    {
      id: '10',
      name: 'Matelas Couffin Biologique',
      description: 'Matelas parfaitement adapté aux couffins et berceaux, 100% naturel.',
      price: 129.99,
      images: [
        'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600'
      ],
      category: { id: 'mattresses', name: 'Matelas', slug: 'matelas' },
      ageRange: { min: 0, max: 6, label: '0-6 mois' },
      brand: 'NaturalSleep',
      rating: 4.7,
      reviewCount: 156,
      inStock: true,
      features: ['Fibres Naturelles', 'Anti-Bactérien', 'Respirant', 'Déhoussable'],
      safetyRating: 'Ecocert Certifié'
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
