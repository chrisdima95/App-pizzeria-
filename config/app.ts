/**
 * Configurazione dell'app della pizzeria
 * Definisce le configurazioni generali dell'applicazione
 */

import { PizzaColors } from '@/constants/colors';

export const AppConfig = {
  // Informazioni dell'app
  app: {
    name: 'Pizzeria App',
    version: '1.0.0',
    description: 'App per ordinare pizze online',
    author: 'Pizzeria Team',
  },
  
  // Configurazione dei colori
  colors: {
    primary: PizzaColors.primary,
    secondary: PizzaColors.secondary,
    accent: PizzaColors.accent,
    background: PizzaColors.gray[50],
    surface: PizzaColors.white,
    text: PizzaColors.gray[700],
    textSecondary: PizzaColors.gray[500],
  },
  
  // Configurazione del layout
  layout: {
    padding: {
      horizontal: 16,
      vertical: 20,
    },
    borderRadius: 16,
    elevation: 3,
  },
  
  // Configurazione delle animazioni
  animations: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
  
  // Configurazione delle immagini
  images: {
    placeholder: '🍕',
    quality: 0.8,
    maxWidth: 800,
    maxHeight: 600,
  },
  
  // Configurazione delle API
  api: {
    baseUrl: 'https://api.pizzeria.com',
    timeout: 10000,
    retries: 3,
  },
  
  // Configurazione della cache
  cache: {
    ttl: 300000, // 5 minuti
    maxSize: 50, // 50 elementi
  },
  
  // Configurazione delle notifiche
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
  },
  
  // Configurazione della geolocalizzazione
  location: {
    accuracy: 'balanced',
    timeout: 10000,
    maximumAge: 300000, // 5 minuti
  },
  
  // Configurazione della fotocamera
  camera: {
    quality: 0.8,
    allowsEditing: false,
    aspect: [4, 3],
  },
  
  // Configurazione delle mappe
  maps: {
    region: {
      latitude: 41.9028,
      longitude: 12.4964,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    },
    style: 'standard',
  },
  
  // Configurazione dei form
  forms: {
    validation: {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\+?[\d\s-()]+$/,
      name: /^[a-zA-Z\s]+$/,
    },
    debounce: 300,
  },
  
  // Configurazione delle liste
  lists: {
    pageSize: 20,
    refreshThreshold: 0.1,
    loadMoreThreshold: 0.8,
  },
  
  // Configurazione degli errori
  errors: {
    showDetails: __DEV__,
    logLevel: __DEV__ ? 'debug' : 'error',
    reportToCrashlytics: !__DEV__,
  },
  
  // Configurazione del debug
  debug: {
    enabled: __DEV__,
    logLevel: 'debug',
    showPerformanceMetrics: __DEV__,
  },
  
  // Configurazione delle funzionalità
  features: {
    darkMode: true,
    notifications: true,
    location: true,
    camera: true,
    maps: true,
    offline: false,
    analytics: true,
  },
  
  // Configurazione delle dimensioni
  dimensions: {
    buttonHeight: 44,
    inputHeight: 48,
    cardMinHeight: 80,
    listItemHeight: 60,
  },
  
  // Configurazione delle font
  fonts: {
    primary: 'system-ui',
    secondary: 'serif',
    mono: 'monospace',
  },
  
  // Configurazione delle icone
  icons: {
    size: {
      small: 16,
      medium: 24,
      large: 32,
      xlarge: 48,
    },
    color: PizzaColors.gray[600],
  },
  
  // Configurazione delle ombre
  shadows: {
    small: {
      shadowColor: PizzaColors.primary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: PizzaColors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    large: {
      shadowColor: PizzaColors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
  },
  
  // Configurazione delle transizioni
  transitions: {
    screen: {
      duration: 300,
      easing: 'ease-in-out',
    },
    modal: {
      duration: 250,
      easing: 'ease-out',
    },
    button: {
      duration: 150,
      easing: 'ease-in-out',
    },
  },
  
  // Configurazione delle dimensioni responsive
  breakpoints: {
    small: 320,
    medium: 768,
    large: 1024,
    xlarge: 1440,
  },
  
  // Configurazione delle lingue
  languages: {
    default: 'it',
    supported: ['it', 'en', 'es', 'fr'],
  },
  
  // Configurazione delle valute
  currencies: {
    default: 'EUR',
    supported: ['EUR', 'USD', 'GBP'],
    symbol: {
      EUR: '€',
      USD: '$',
      GBP: '£',
    },
  },
  
  // Configurazione delle date
  dates: {
    format: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    locale: 'it-IT',
  },
  
  // Configurazione delle unità
  units: {
    distance: 'km',
    weight: 'kg',
    temperature: 'celsius',
  },
};

export default AppConfig;
