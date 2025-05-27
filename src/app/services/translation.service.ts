import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Translations {
  [key: string]: {
    [language: string]: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage$ = new BehaviorSubject<string>('fr');

  private translations: Translations = {
    'home': {
      'fr': 'Accueil',
      'en': 'Home',
      'ar': 'الرئيسية'
    },
    'products': {
      'fr': 'Produits',
      'en': 'Products',
      'ar': 'المنتجات'
    },
    'search.placeholder': {
      'fr': 'Rechercher des produits de sommeil bébé...',
      'en': 'Search baby sleep products...',
      'ar': 'البحث عن منتجات نوم الأطفال...'
    },
    'darkMode.toggle': {
      'fr': 'Basculer le mode sombre',
      'en': 'Toggle dark mode',
      'ar': 'تبديل الوضع المظلم'
    },
    'lightMode.toggle': {
      'fr': 'Basculer le mode clair',
      'en': 'Toggle light mode',
      'ar': 'تبديل الوضع الفاتح'
    }
  };

  constructor() {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && ['fr', 'en', 'ar'].includes(savedLanguage)) {
      this.currentLanguage$.next(savedLanguage);
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage$.asObservable();
  }

  getCurrentLanguageValue() {
    return this.currentLanguage$.value;
  }

  setLanguage(language: string) {
    if (['fr', 'en', 'ar'].includes(language)) {
      this.currentLanguage$.next(language);
      localStorage.setItem('language', language);

      // Update document direction for RTL languages
      if (language === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', language);
      }
    }
  }

  translate(key: string): string {
    const currentLang = this.getCurrentLanguageValue();
    return this.translations[key]?.[currentLang] || key;
  }

  getAvailableLanguages() {
    return [
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'ar', name: 'العربية', flag: '🇲🇦' }
    ];
  }
}
