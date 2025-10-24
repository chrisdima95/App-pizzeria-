/**
 * Temi personalizzati per l'app della pizzeria
 * Definisce stili e configurazioni per diverse varianti di tema
 */

import { PizzaColors } from './colors';

export const PizzaThemes = {
  light: {
    name: 'Light',
    colors: {
      primary: PizzaColors.primary,
      secondary: PizzaColors.secondary,
      accent: PizzaColors.accent,
      background: PizzaColors.gray[50],
      surface: PizzaColors.white,
      text: PizzaColors.gray[700],
      textSecondary: PizzaColors.gray[500],
      border: PizzaColors.gray[200],
      shadow: PizzaColors.gray[300],
    },
    typography: {
      fontFamily: 'system-ui',
      fontSize: {
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
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      '2xl': 24,
      full: 9999,
    },
    shadows: {
      sm: PizzaColors.shadows.small,
      md: PizzaColors.shadows.medium,
      lg: PizzaColors.shadows.large,
    },
  },
  
  dark: {
    name: 'Dark',
    colors: {
      primary: PizzaColors.accent,
      secondary: PizzaColors.secondary,
      accent: PizzaColors.primary,
      background: PizzaColors.gray[800],
      surface: PizzaColors.gray[700],
      text: PizzaColors.gray[50],
      textSecondary: PizzaColors.gray[400],
      border: PizzaColors.gray[600],
      shadow: PizzaColors.gray[900],
    },
    typography: {
      fontFamily: 'system-ui',
      fontSize: {
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
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      '2xl': 24,
      full: 9999,
    },
    shadows: {
      sm: PizzaColors.shadows.small,
      md: PizzaColors.shadows.medium,
      lg: PizzaColors.shadows.large,
    },
  },
  
  // Tema speciale per la pizzeria
  pizza: {
    name: 'Pizza Special',
    colors: {
      primary: PizzaColors.pizza.sauce,
      secondary: PizzaColors.pizza.basil,
      accent: PizzaColors.pizza.crust,
      background: PizzaColors.pizza.cheese,
      surface: PizzaColors.white,
      text: PizzaColors.gray[700],
      textSecondary: PizzaColors.gray[500],
      border: PizzaColors.pizza.crust,
      shadow: PizzaColors.pizza.sauce,
    },
    typography: {
      fontFamily: 'system-ui',
      fontSize: {
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
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      '2xl': 24,
      full: 9999,
    },
    shadows: {
      sm: PizzaColors.shadows.small,
      md: PizzaColors.shadows.medium,
      lg: PizzaColors.shadows.large,
    },
  },
};

export type ThemeName = keyof typeof PizzaThemes;
export type Theme = typeof PizzaThemes.light;

export default PizzaThemes;
