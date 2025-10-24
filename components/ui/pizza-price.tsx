import { PizzaColors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface PizzaPriceProps {
  amount: number | string;
  currency?: string;
  size?: 'small' | 'medium' | 'large';
  style?: TextStyle;
  showCurrency?: boolean;
}

export function PizzaPrice({
  amount,
  currency = '€',
  size = 'medium',
  style,
  showCurrency = true,
}: PizzaPriceProps) {
  const formatAmount = (value: number | string) => {
    if (typeof value === 'string') return value;
    return value.toFixed(2);
  };

  const getPriceStyle = () => {
    const baseStyle = [styles.price, styles[size]];
    return [...baseStyle];
  };

  return (
    <Text style={[...getPriceStyle(), style]}>
      {showCurrency && currency}
      {formatAmount(amount)}
    </Text>
  );
}

const styles = StyleSheet.create({
  price: {
    fontWeight: 'bold',
    color: PizzaColors.primary,
  },
  
  // Dimensioni
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 18,
  },
  large: {
    fontSize: 24,
  },
});
