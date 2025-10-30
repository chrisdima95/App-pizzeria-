import { PizzaColors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface PizzaCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'small' | 'medium' | 'large';
}

export function PizzaCard({
  children,
  style,
  variant = 'default',
  padding = 'medium',
}: PizzaCardProps) {
  // Determina quali stili applicare alla card in base a variante e padding
  const getCardStyle = () => {
    const baseStyle = [styles.card, styles[padding]];
    
    switch (variant) {
      case 'elevated':
        return [...baseStyle, styles.elevated];
      case 'outlined':
        return [...baseStyle, styles.outlined];
      default:
        return [...baseStyle, styles.default];
    }
  };

  return (
    <View style={[...getCardStyle(), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: PizzaColors.white,
    borderRadius: 16,
  },
  
  // Varianti
  default: {
    ...PizzaColors.shadows.small,
  },
  elevated: {
    ...PizzaColors.shadows.medium,
  },
  outlined: {
    borderWidth: 1,
    borderColor: PizzaColors.gray[200],
  },
  
  // Padding
  small: {
    padding: 12,
  },
  medium: {
    padding: 16,
  },
  large: {
    padding: 20,
  },
});
