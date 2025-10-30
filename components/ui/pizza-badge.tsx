import { PizzaColors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface PizzaBadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function PizzaBadge({
  text,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}: PizzaBadgeProps) {
  // Funzione che restituisce gli stili corretti per la variante del badge
  const getBadgeStyle = () => {
    const baseStyle = [styles.badge, styles[size]];
    // Cambia colore e bordo in base alla "variant"
    switch (variant) {
      case 'success':
        return [...baseStyle, styles.success];
      case 'warning':
        return [...baseStyle, styles.warning];
      case 'error':
        return [...baseStyle, styles.error];
      case 'info':
        return [...baseStyle, styles.info];
      case 'primary':
        return [...baseStyle, styles.primary];
      case 'secondary':
        return [...baseStyle, styles.secondary];
      default:
        return [...baseStyle, styles.primary];
    }
  };

  // Funzione che restituisce lo stile testo per la variante richiesta
  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    switch (variant) {
      case 'success':
        return [...baseTextStyle, styles.successText];
      case 'warning':
        return [...baseTextStyle, styles.warningText];
      case 'error':
        return [...baseTextStyle, styles.errorText];
      case 'info':
        return [...baseTextStyle, styles.infoText];
      case 'primary':
        return [...baseTextStyle, styles.primaryText];
      case 'secondary':
        return [...baseTextStyle, styles.secondaryText];
      default:
        return [...baseTextStyle, styles.primaryText];
    }
  };

  return (
    <View style={[...getBadgeStyle(), style]}>
      <Text style={[...getTextStyle(), textStyle]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  
  // Varianti
  primary: {
    backgroundColor: PizzaColors.primary + '20',
    borderWidth: 1,
    borderColor: PizzaColors.primary,
  },
  secondary: {
    backgroundColor: PizzaColors.secondary + '20',
    borderWidth: 1,
    borderColor: PizzaColors.secondary,
  },
  success: {
    backgroundColor: PizzaColors.success + '20',
    borderWidth: 1,
    borderColor: PizzaColors.success,
  },
  warning: {
    backgroundColor: PizzaColors.warning + '20',
    borderWidth: 1,
    borderColor: PizzaColors.warning,
  },
  error: {
    backgroundColor: PizzaColors.error + '20',
    borderWidth: 1,
    borderColor: PizzaColors.error,
  },
  info: {
    backgroundColor: PizzaColors.info + '20',
    borderWidth: 1,
    borderColor: PizzaColors.info,
  },
  
  // Dimensioni
  small: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    minHeight: 24,
  },
  medium: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 28,
  },
  large: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 32,
  },
  
  // Testo
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: PizzaColors.primary,
  },
  secondaryText: {
    color: PizzaColors.secondary,
  },
  successText: {
    color: PizzaColors.success,
  },
  warningText: {
    color: PizzaColors.warning,
  },
  errorText: {
    color: PizzaColors.error,
  },
  infoText: {
    color: PizzaColors.info,
  },
  
  // Dimensioni del testo
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
});
