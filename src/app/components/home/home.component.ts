import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { BasketService } from '../../services/basket.service';
import { Product } from '../../models/product.model';

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
}

interface Partner {
  name: string;
  logo?: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  bestProducts: Product[] = [];
  searchTerm = '';

  testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      location: 'New York, NY',
      rating: 5,
      comment: 'The organic mattress has made such a difference in my baby\'s sleep. Highly recommend!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b76c?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      location: 'San Francisco, CA',
      rating: 5,
      comment: 'Amazing quality and fast shipping. Our little one loves the sound machine!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      location: 'Austin, TX',
      rating: 5,
      comment: 'The convertible crib is beautiful and will grow with our daughter. Perfect investment!',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];
  partners: Partner[] = [
    { name: 'Société Française de Pédiatrie' },
    { name: 'Association des Pédiatres de France' },
    { name: 'Centre de Recherche Sommeil Enfant' },
    { name: 'Institut Français du Sommeil Bébé' }
  ];

  constructor(
    private productService: ProductService,
    private basketService: BasketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBestProducts();
  }

  loadBestProducts(): void {
    this.productService.getBestProducts().subscribe(products => {
      this.bestProducts = products;
    });
  }

  onHeroSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
  }

  searchProducts(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchTerm.trim() }
      });
    } else {
      this.navigateToProducts();
    }
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  addToBasket(product: Product): void {
    this.basketService.addToBasket(product, 1);
  }
}
