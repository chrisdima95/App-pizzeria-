import { Colors } from '@/constants/theme';
import React from 'react';
import { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface SmoothColorTransitionConfig {
  duration?: number;
  easing?: (value: number) => number;
}

export const useSmoothColors = (colorScheme: 'light' | 'dark' | null, config: SmoothColorTransitionConfig = {}) => {
  const { duration = 800, easing } = config;
  
  // Valore condiviso per la transizione tra i colori
  const colorProgress = useSharedValue(colorScheme === 'dark' ? 1 : 0);
  
  // Aggiorna il progresso quando cambia il color scheme
  React.useEffect(() => {
    colorProgress.value = withTiming(
      colorScheme === 'dark' ? 1 : 0,
      { duration, easing }
    );
  }, [colorScheme, duration, easing]);

  // Funzione per interpolare tra due colori
  const interpolateColorValue = (lightColor: string, darkColor: string) => {
    return interpolateColor(
      colorProgress.value,
      [0, 1],
      [lightColor, darkColor]
    );
  };

  // Stili animati per i colori
  const getAnimatedColors = () => ({
    background: interpolateColorValue(Colors.light.background, Colors.dark.background),
    text: interpolateColorValue(Colors.light.text, Colors.dark.text),
    card: interpolateColorValue(Colors.light.card, Colors.dark.card),
    border: interpolateColorValue(Colors.light.border, Colors.dark.border),
    primary: interpolateColorValue(Colors.light.primary, Colors.dark.primary),
    secondary: interpolateColorValue(Colors.light.secondary, Colors.dark.secondary),
    muted: interpolateColorValue(Colors.light.muted, Colors.dark.muted),
    accent: interpolateColorValue(Colors.light.accent, Colors.dark.accent),
    tint: interpolateColorValue(Colors.light.tint, Colors.dark.tint),
    icon: interpolateColorValue(Colors.light.icon, Colors.dark.icon),
    error: interpolateColorValue(Colors.light.error, Colors.dark.error),
  });

  // Stile animato per il background
  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: getAnimatedColors().background,
  }));

  // Stile animato per le card
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: getAnimatedColors().card,
    borderColor: getAnimatedColors().border,
  }));

  // Stile animato per il testo
  const textAnimatedStyle = useAnimatedStyle(() => ({
    color: getAnimatedColors().text,
  }));

  // Stile animato per gli elementi primari
  const primaryAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: getAnimatedColors().primary,
    borderColor: getAnimatedColors().primary,
  }));

  return {
    colorProgress,
    getAnimatedColors,
    backgroundAnimatedStyle,
    cardAnimatedStyle,
    textAnimatedStyle,
    primaryAnimatedStyle,
    interpolateColorValue,
  };
};
