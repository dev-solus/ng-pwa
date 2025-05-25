import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BasketService } from '../../services/basket.service';
import { BasketItem } from '../../models/basket.model';
import { ShippingAddress, BillingAddress, PaymentMethod } from '../../models/user.model';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  currentStep = 1;
  totalSteps = 4;

  // Basket data
  basketItems: BasketItem[] = [];
  subtotal = 0;
  shipping = 9.99;
  tax = 0;
  total = 0;

  // Form data
  shippingAddress: ShippingAddress = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  };

  billingAddress: BillingAddress = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  };

  paymentMethod: PaymentMethod = {
    type: 'card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    nameOnCard: ''
  };

  sameAsShipping = true;
  newsletterSignup = false;
  termsAccepted = false;

  // UI states
  processing = false;
  orderComplete = false;
  orderNumber = '';

  constructor(
    private basketService: BasketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBasketData();

    // Redirect if basket is empty
    if (this.basketItems.length === 0) {
      this.router.navigate(['/']);
    }
  }
  loadBasketData() {
    this.basketService.getItems().subscribe((items: BasketItem[]) => {
      this.basketItems = items;
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.subtotal = this.basketService.getSubtotal();
    this.tax = this.subtotal * 0.08; // 8% tax
    this.total = this.subtotal + this.shipping + this.tax;
  }

  nextStep() {
    if (this.validateCurrentStep()) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step <= this.currentStep) {
      this.currentStep = step;
    }
  }

  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1: // Shipping
        return this.validateShippingAddress();
      case 2: // Billing
        return this.validateBillingAddress();
      case 3: // Payment
        return this.validatePaymentMethod();
      default:
        return true;
    }
  }

  validateShippingAddress(): boolean {
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    return required.every(field => this.shippingAddress[field as keyof ShippingAddress]?.toString().trim());
  }

  validateBillingAddress(): boolean {
    if (this.sameAsShipping) {
      return true;
    }
    const required = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
    return required.every(field => this.billingAddress[field as keyof BillingAddress]?.toString().trim());
  }

  validatePaymentMethod(): boolean {
    if (this.paymentMethod.type === 'card') {
      const required = ['cardNumber', 'expiryMonth', 'expiryYear', 'cvv', 'nameOnCard'];
      return required.every(field => this.paymentMethod[field as keyof PaymentMethod]?.toString().trim());
    }
    return true;
  }

  onSameAsShippingChange() {
    if (this.sameAsShipping) {
      this.billingAddress = {
        firstName: this.shippingAddress.firstName,
        lastName: this.shippingAddress.lastName,
        address: this.shippingAddress.address,
        city: this.shippingAddress.city,
        state: this.shippingAddress.state,
        zipCode: this.shippingAddress.zipCode,
        country: this.shippingAddress.country
      };
    }
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      this.paymentMethod.cardNumber = parts.join(' ');
    } else {
      this.paymentMethod.cardNumber = value;
    }
  }

  async placeOrder() {
    if (!this.termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }

    this.processing = true;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate order number
      this.orderNumber = 'SB' + Date.now();

      // Clear basket
      this.basketService.clearBasket();

      // Show success
      this.orderComplete = true;
      this.currentStep = 5;

    } catch (error) {
      alert('Order failed. Please try again.');
    } finally {
      this.processing = false;
    }
  }

  continueShopping() {
    this.router.navigate(['/']);
  }

  getStepTitle(step: number): string {
    const titles = {
      1: 'Shipping Information',
      2: 'Billing Address',
      3: 'Payment Method',
      4: 'Review Order',
      5: 'Order Complete'
    };
    return titles[step as keyof typeof titles] || '';
  }

  getStepIcon(step: number): string {
    const icons = {
      1: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2M7 13h10M7 17h4',
      2: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      3: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
      4: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      5: 'M5 13l4 4L19 7'
    };
    return icons[step as keyof typeof icons] || '';
  }
}
