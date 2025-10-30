import { PizzaColors } from '@/constants/colors';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface PizzaLoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'accent';
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function PizzaLoading({
  size = 'medium',
  color = 'primary',
  text,
  style,
  textStyle,
}: PizzaLoadingProps) {
  // Inizializza il valore animato per la rotazione dello spinner
  const spinValue = useRef(new Animated.Value(0)).current;

  // Imposta il loop di animazione per far ruotare continuamente lo spinner
  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spin.start();

    return () => spin.stop();
  }, [spinValue]);

  // Interpolazione del valore animato per creare la rotazione
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Restituisce gli stili per lo spinner in base al colore richiesto
  const getSpinnerStyle = () => {
    const baseStyle = [styles.spinner, styles[size]];
    
    switch (color) {
      case 'primary':
        return [...baseStyle, styles.primaryColor];
      case 'secondary':
        return [...baseStyle, styles.secondaryColor];
      case 'accent':
        return [...baseStyle, styles.accentColor];
      default:
        return [...baseStyle, styles.primaryColor];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    return [...baseStyle];
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[getSpinnerStyle(), { transform: [{ rotate: spin }] }]} />
      {text && <Text style={[...getTextStyle(), textStyle]}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  spinner: {
    borderWidth: 3,
    borderRadius: 50,
    borderTopColor: 'transparent',
  },
  
  // Dimensioni
  small: {
    width: 20,
    height: 20,
    borderWidth: 2,
  },
  medium: {
    width: 30,
    height: 30,
    borderWidth: 3,
  },
  large: {
    width: 40,
    height: 40,
    borderWidth: 4,
  },
  
  // Colori
  primaryColor: {
    borderColor: PizzaColors.primary,
  },
  secondaryColor: {
    borderColor: PizzaColors.secondary,
  },
  accentColor: {
    borderColor: PizzaColors.accent,
  },
  
  // Testo
  text: {
    marginTop: 12,
    textAlign: 'center',
    color: PizzaColors.gray[600],
  },
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
