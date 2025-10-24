import { PizzaColors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface PizzaButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function PizzaButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}: PizzaButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primary, disabled && styles.disabled];
      case 'secondary':
        return [...baseStyle, styles.secondary, disabled && styles.disabled];
      case 'accent':
        return [...baseStyle, styles.accent, disabled && styles.disabled];
      case 'outline':
        return [...baseStyle, styles.outline, disabled && styles.disabled];
      default:
        return [...baseStyle, styles.primary, disabled && styles.disabled];
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'outline':
        return [...baseTextStyle, styles.outlineText, disabled && styles.disabledText];
      default:
        return [...baseTextStyle, styles.primaryText, disabled && styles.disabledText];
    }
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...PizzaColors.shadows.medium,
  },
  
  // Varianti
  primary: {
    backgroundColor: PizzaColors.primary,
  },
  secondary: {
    backgroundColor: PizzaColors.secondary,
  },
  accent: {
    backgroundColor: PizzaColors.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: PizzaColors.primary,
  },
  
  // Dimensioni
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 52,
  },
  
  // Stati
  disabled: {
    opacity: 0.5,
    ...PizzaColors.shadows.small,
  },
  
  // Testo
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: PizzaColors.white,
  },
  outlineText: {
    color: PizzaColors.primary,
  },
  disabledText: {
    opacity: 0.7,
  },
  
  // Dimensioni del testo
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});
