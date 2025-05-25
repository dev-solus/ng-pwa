export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  preferences: UserPreferences;
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserPreferences {
  currency: string;
  language: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface CheckoutForm {
  shipping: Address;
  billing?: Address;
  useBillingForShipping: boolean;
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  nameOnCard?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
