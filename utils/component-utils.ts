/**
 * Utilità per i componenti
 * Funzioni helper per la gestione dei componenti e delle loro proprietà
 */

import { PizzaColors } from '@/constants/colors';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

/**
 * Combina stili in modo sicuro
 */
export function combineStyles<T extends ViewStyle | TextStyle>(
  ...styles: (T | undefined | null | false)[]
): T {
  return StyleSheet.flatten(styles.filter(Boolean)) as T;
}

/**
 * Crea stili condizionali
 */
export function conditionalStyle<T extends ViewStyle | TextStyle>(
  condition: boolean,
  trueStyle: T,
  falseStyle?: T
): T | undefined {
  return condition ? trueStyle : falseStyle;
}

/**
 * Crea stili responsive basati su dimensioni
 */
export function responsiveStyle<T extends ViewStyle | TextStyle>(
  screenWidth: number,
  breakpoints: { [key: string]: { min: number; max?: number; style: T } }
): T {
  const breakpoint = Object.entries(breakpoints).find(([_, config]) => {
    return screenWidth >= config.min && (!config.max || screenWidth <= config.max);
  });
  
  return breakpoint ? breakpoint[1].style : ({} as T);
}

/**
 * Crea stili per i bottoni con stati
 */
export function createButtonStyles(
  baseStyle: ViewStyle,
  pressedStyle?: ViewStyle,
  disabledStyle?: ViewStyle
) {
  return {
    base: baseStyle,
    pressed: pressedStyle || { opacity: 0.8 },
    disabled: disabledStyle || { opacity: 0.5 },
  };
}

/**
 * Crea stili per le card con elevazione
 */
export function createCardStyles(elevation: 'sm' | 'md' | 'lg' = 'md'): ViewStyle {
  const shadowConfig = PizzaColors.shadows[elevation];
  return {
    backgroundColor: PizzaColors.white,
    borderRadius: 16,
    ...shadowConfig,
  };
}

/**
 * Crea stili per i testi con gerarchia
 */
export function createTextStyles() {
  return {
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      lineHeight: 40,
      color: PizzaColors.gray[700],
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      lineHeight: 36,
      color: PizzaColors.gray[700],
    },
    h3: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      lineHeight: 32,
      color: PizzaColors.gray[700],
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      color: PizzaColors.gray[700],
    },
    h5: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
      color: PizzaColors.gray[700],
    },
    h6: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
      color: PizzaColors.gray[700],
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      color: PizzaColors.gray[600],
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      color: PizzaColors.gray[500],
    },
    small: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      color: PizzaColors.gray[500],
    },
  };
}

/**
 * Crea stili per i layout comuni
 */
export function createLayoutStyles() {
  return {
    container: {
      flex: 1,
      backgroundColor: PizzaColors.gray[50],
    },
    content: {
      flex: 1,
      padding: 16,
    },
    row: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    column: {
      flexDirection: 'column' as const,
    },
    center: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    spaceBetween: {
      justifyContent: 'space-between' as const,
    },
    spaceAround: {
      justifyContent: 'space-around' as const,
    },
    spaceEvenly: {
      justifyContent: 'space-evenly' as const,
    },
  };
}

/**
 * Crea stili per i form
 */
export function createFormStyles() {
  return {
    input: {
      borderWidth: 1,
      borderColor: PizzaColors.gray[300],
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      backgroundColor: PizzaColors.white,
    },
    inputFocused: {
      borderColor: PizzaColors.primary,
      ...PizzaColors.shadows.small,
    },
    inputError: {
      borderColor: PizzaColors.error,
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: PizzaColors.gray[700],
      marginBottom: 8,
    },
    error: {
      fontSize: 12,
      color: PizzaColors.error,
      marginTop: 4,
    },
  };
}

/**
 * Crea stili per le liste
 */
export function createListStyles() {
  return {
    list: {
      backgroundColor: PizzaColors.white,
      borderRadius: 16,
      ...PizzaColors.shadows.small,
    },
    listItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: PizzaColors.gray[200],
    },
    listItemLast: {
      borderBottomWidth: 0,
    },
    listHeader: {
      padding: 16,
      backgroundColor: PizzaColors.gray[100],
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    listFooter: {
      padding: 16,
      backgroundColor: PizzaColors.gray[100],
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    },
  };
}

export default {
  combineStyles,
  conditionalStyle,
  responsiveStyle,
  createButtonStyles,
  createCardStyles,
  createTextStyles,
  createLayoutStyles,
  createFormStyles,
  createListStyles,
};
