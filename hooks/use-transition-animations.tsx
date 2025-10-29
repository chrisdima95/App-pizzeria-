import { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface TransitionAnimationsConfig {
  duration?: number;
  delay?: number;
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
}

export const useTransitionAnimations = (config: TransitionAnimationsConfig = {}) => {
  const {
    duration = 800,
    delay = 0, // tenuto per compatibilità futura
    springConfig = { damping: 15, stiffness: 150, mass: 1 }
  } = config;

  // Valori condivisi snelliti
  const fadeProgress = useSharedValue(0);
  const scaleProgress = useSharedValue(0);

  // Avvia solo le animazioni globali
  const startAnimations = () => {
    fadeProgress.value = withTiming(1, { duration: duration * 0.8, easing: Easing.out(Easing.quad) });
    scaleProgress.value = withSpring(1, springConfig);
  };

  // Stile animato per il background (usato in Home)
  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeProgress.value,
    transform: [{ scale: scaleProgress.value }],
  }));

  return {
    startAnimations,
    backgroundAnimatedStyle,
  };
};

