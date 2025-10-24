/**
 * Utilità per la gestione dei colori
 * Funzioni helper per manipolare e convertire i colori
 */

import { PizzaColors } from '@/constants/colors';

/**
 * Converte un colore hex in RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Converte un colore hex in RGBA
 */
export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Aggiunge trasparenza a un colore
 */
export function addOpacity(color: string, opacity: number): string {
  if (color.startsWith('#')) {
    return hexToRgba(color, opacity);
  }
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }
  return color;
}

/**
 * Genera una versione più chiara di un colore
 */
export function lightenColor(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const { r, g, b } = rgb;
  const newR = Math.min(255, Math.floor(r + (255 - r) * amount));
  const newG = Math.min(255, Math.floor(g + (255 - g) * amount));
  const newB = Math.min(255, Math.floor(b + (255 - b) * amount));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * Genera una versione più scura di un colore
 */
export function darkenColor(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const { r, g, b } = rgb;
  const newR = Math.max(0, Math.floor(r * (1 - amount)));
  const newG = Math.max(0, Math.floor(g * (1 - amount)));
  const newB = Math.max(0, Math.floor(b * (1 - amount)));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * Verifica se un colore è chiaro o scuro
 */
export function isLightColor(color: string): boolean {
  const rgb = hexToRgb(color);
  if (!rgb) return true;
  
  const { r, g, b } = rgb;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
}

/**
 * Restituisce il colore del testo appropriato per un background
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? PizzaColors.gray[700] : PizzaColors.gray[50];
}

/**
 * Genera un gradiente CSS per React Native
 */
export function createGradient(colors: string[], direction: 'horizontal' | 'vertical' = 'vertical') {
  return {
    background: `linear-gradient(${direction === 'horizontal' ? '90deg' : '180deg'}, ${colors.join(', ')})`,
  };
}

/**
 * Restituisce i colori della pizzeria in formato array per i gradienti
 */
export function getPizzaGradient(variant: keyof typeof PizzaColors.gradients) {
  return PizzaColors.gradients[variant];
}

/**
 * Genera una palette di colori basata su un colore principale
 */
export function generateColorPalette(baseColor: string) {
  return {
    50: lightenColor(baseColor, 0.9),
    100: lightenColor(baseColor, 0.8),
    200: lightenColor(baseColor, 0.6),
    300: lightenColor(baseColor, 0.4),
    400: lightenColor(baseColor, 0.2),
    500: baseColor,
    600: darkenColor(baseColor, 0.2),
    700: darkenColor(baseColor, 0.4),
    800: darkenColor(baseColor, 0.6),
    900: darkenColor(baseColor, 0.8),
  };
}

export default {
  hexToRgb,
  hexToRgba,
  addOpacity,
  lightenColor,
  darkenColor,
  isLightColor,
  getContrastTextColor,
  createGradient,
  getPizzaGradient,
  generateColorPalette,
};
