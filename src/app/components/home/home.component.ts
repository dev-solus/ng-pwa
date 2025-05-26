import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { BasketService } from '../../services/basket.service';
import { Product } from '../../models/product.model';
import AOS from 'aos';

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
      name: 'Sarah Dupont',
      location: 'Paris, France',
      rating: 5,
      comment: 'Le matelas bio a fait une énorme différence dans le sommeil de mon bébé. Je le recommande vivement !',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b76c?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Michel Leroy',
      location: 'Lyon, France',
      rating: 5,
      comment: 'Qualité incroyable et livraison rapide. Notre petit ange adore la machine à sons !',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Émilie Martin',
      location: 'Marseille, France',
      rating: 5,
      comment: 'Le lit évolutif est magnifique et grandira avec notre fille. Un investissement parfait !',
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
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
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
