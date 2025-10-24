/**
 * Configurazione dei componenti
 * Definisce le configurazioni predefinite per i componenti dell'app
 */

import { PizzaColors } from '@/constants/colors';

export const ComponentConfig = {
  // Configurazione dei bottoni
  button: {
    defaultVariant: 'primary' as const,
    defaultSize: 'medium' as const,
    borderRadius: 12,
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  
  // Configurazione delle card
  card: {
    defaultVariant: 'elevated' as const,
    defaultPadding: 'medium' as const,
    borderRadius: 16,
    elevation: 3,
  },
  
  // Configurazione dei badge
  badge: {
    defaultVariant: 'primary' as const,
    defaultSize: 'medium' as const,
    borderRadius: 8,
    minHeight: 28,
  },
  
  // Configurazione dei titoli
  title: {
    defaultLevel: 1 as const,
    defaultColor: 'dark' as const,
    fontFamily: 'system-ui',
  },
  
  // Configurazione dei prezzi
  price: {
    defaultSize: 'medium' as const,
    defaultCurrency: '€',
    showCurrency: true,
  },
  
  // Configurazione dei separatori
  divider: {
    defaultColor: 'light' as const,
    defaultThickness: 'medium' as const,
    defaultOrientation: 'horizontal' as const,
    defaultMargin: 'medium' as const,
  },
  
  // Configurazione del loading
  loading: {
    defaultSize: 'medium' as const,
    defaultColor: 'primary' as const,
    animationDuration: 1000,
  },
  
  // Configurazione delle liste
  list: {
    defaultItemHeight: 60,
    defaultSpacing: 12,
    borderRadius: 16,
    elevation: 2,
  },
  
  // Configurazione dei form
  form: {
    inputHeight: 48,
    inputBorderRadius: 12,
    inputBorderWidth: 1,
    labelMarginBottom: 8,
    errorMarginTop: 4,
  },
  
  // Configurazione delle immagini
  image: {
    defaultBorderRadius: 12,
    defaultAspectRatio: 1,
  },
  
  // Configurazione delle icone
  icon: {
    defaultSize: 24,
    defaultColor: PizzaColors.gray[600],
  },
  
  // Configurazione delle animazioni
  animation: {
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
  
  // Configurazione delle ombre
  shadow: {
    defaultElevation: 3,
    defaultShadowColor: PizzaColors.primary,
    defaultShadowOpacity: 0.1,
    defaultShadowRadius: 4,
  },
  
  // Configurazione dei colori
  colors: {
    primary: PizzaColors.primary,
    secondary: PizzaColors.secondary,
    accent: PizzaColors.accent,
    success: PizzaColors.success,
    warning: PizzaColors.warning,
    error: PizzaColors.error,
    info: PizzaColors.info,
  },
  
  // Configurazione delle dimensioni
  sizes: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  // Configurazione dei border radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },
  
  // Configurazione delle font
  fonts: {
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
      '5xl': 36,
      '6xl': 48,
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    families: {
      sans: 'system-ui',
      serif: 'serif',
      mono: 'monospace',
    },
  },
};

export default ComponentConfig;
