import { PizzaColors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface PizzaPriceProps {
  amount?: number | string | null;
  price?: number | string | null; // Supporto per la proprietà 'price' per compatibilità
  currency?: string;
  size?: 'small' | 'medium' | 'large';
  style?: TextStyle;
  showCurrency?: boolean;
}

export function PizzaPrice({
  amount,
  price, // Supporto per la proprietà 'price'
  currency = '€',
  size = 'medium',
  style,
  showCurrency = true,
}: PizzaPriceProps) {
  // Funzione per formattare l'importo in stringa con due decimali o restituire direttamente la stringa fornita
  const formatAmount = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return '0.00';
    if (typeof value === 'string') return value;
    return value.toFixed(2);
  };

  // Sceglie quale valore usare (price o amount) per gestire compatibilità
  const actualAmount = price !== undefined ? price : amount;

  const getPriceStyle = () => {
    const baseStyle = [styles.price, styles[size]];
    return [...baseStyle];
  };

  return (
    <Text style={[...getPriceStyle(), style]}>
      {showCurrency && currency}
      {formatAmount(actualAmount)}
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
