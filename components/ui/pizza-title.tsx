import { PizzaColors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface PizzaTitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  style?: TextStyle;
  color?: 'primary' | 'secondary' | 'accent' | 'dark' | 'muted';
}

export function PizzaTitle({
  children,
  level = 1,
  style,
  color = 'dark',
}: PizzaTitleProps) {
  const getTitleStyle = () => {
    const baseStyle = [styles.title, styles[`h${level}`]];
    
    switch (color) {
      case 'primary':
        return [...baseStyle, styles.primaryColor];
      case 'secondary':
        return [...baseStyle, styles.secondaryColor];
      case 'accent':
        return [...baseStyle, styles.accentColor];
      case 'dark':
        return [...baseStyle, styles.darkColor];
      case 'muted':
        return [...baseStyle, styles.mutedColor];
      default:
        return [...baseStyle, styles.darkColor];
    }
  };

  return (
    <Text style={[...getTitleStyle(), style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    lineHeight: 1.2,
  },
  
  // Livelli
  h1: {
    fontSize: 32,
    marginBottom: 16,
  },
  h2: {
    fontSize: 28,
    marginBottom: 14,
  },
  h3: {
    fontSize: 24,
    marginBottom: 12,
  },
  h4: {
    fontSize: 20,
    marginBottom: 10,
  },
  h5: {
    fontSize: 18,
    marginBottom: 8,
  },
  h6: {
    fontSize: 16,
    marginBottom: 6,
  },
  
  // Colori
  primaryColor: {
    color: PizzaColors.primary,
  },
  secondaryColor: {
    color: PizzaColors.secondary,
  },
  accentColor: {
    color: PizzaColors.accent,
  },
  darkColor: {
    color: PizzaColors.gray[700],
  },
  mutedColor: {
    color: PizzaColors.gray[500],
  },
});
