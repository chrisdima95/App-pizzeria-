import { PizzaColors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface PizzaDividerProps {
  style?: ViewStyle;
  color?: 'light' | 'medium' | 'dark' | 'primary' | 'secondary';
  thickness?: 'thin' | 'medium' | 'thick';
  orientation?: 'horizontal' | 'vertical';
  margin?: 'small' | 'medium' | 'large';
}

export function PizzaDivider({
  style,
  color = 'light',
  thickness = 'medium',
  orientation = 'horizontal',
  margin = 'medium',
}: PizzaDividerProps) {
  const getDividerStyle = () => {
    const baseStyle = [styles.divider, styles[orientation], styles[thickness], styles[`${color}Color`], styles[`${margin}Margin`]];
    return [...baseStyle];
  };

  return <View style={[...getDividerStyle(), style]} />;
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: PizzaColors.gray[200],
  },
  
  // Orientamento
  horizontal: {
    height: 1,
    width: '100%',
  },
  vertical: {
    width: 1,
    height: '100%',
  },
  
  // Spessore
  thin: {
    height: 0.5,
  },
  medium: {
    height: 1,
  },
  thick: {
    height: 2,
  },
  
  // Colori
  lightColor: {
    backgroundColor: PizzaColors.gray[200],
  },
  mediumColor: {
    backgroundColor: PizzaColors.gray[300],
  },
  darkColor: {
    backgroundColor: PizzaColors.gray[400],
  },
  primaryColor: {
    backgroundColor: PizzaColors.primary,
  },
  secondaryColor: {
    backgroundColor: PizzaColors.secondary,
  },
  
  // Margini
  smallMargin: {
    marginVertical: 8,
  },
  mediumMargin: {
    marginVertical: 16,
  },
  largeMargin: {
    marginVertical: 24,
  },
});
