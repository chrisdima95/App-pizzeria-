import {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

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
    delay = 0,
    springConfig = { damping: 15, stiffness: 150, mass: 1 }
  } = config;

  // Valori condivisi per le animazioni
  const fadeProgress = useSharedValue(0);
  const scaleProgress = useSharedValue(0);
  const translateY = useSharedValue(100);
  const translateX = useSharedValue(0);
  const rotateProgress = useSharedValue(0);
  const blurProgress = useSharedValue(0);
  
  // Animazioni per la mascotte rimosse - ora gestite separatamente nella tab bar

  // Animazioni per le card delle pizze (Card Stack Reveal) - inizializzate direttamente
  const card1TranslateY = useSharedValue(100);
  const card1Opacity = useSharedValue(0);
  const card1Scale = useSharedValue(0.8);
  
  const card2TranslateY = useSharedValue(100);
  const card2Opacity = useSharedValue(0);
  const card2Scale = useSharedValue(0.8);
  
  const card3TranslateY = useSharedValue(100);
  const card3Opacity = useSharedValue(0);
  const card3Scale = useSharedValue(0.8);
  
  const card4TranslateY = useSharedValue(100);
  const card4Opacity = useSharedValue(0);
  const card4Scale = useSharedValue(0.8);
  
  const card5TranslateY = useSharedValue(100);
  const card5Opacity = useSharedValue(0);
  const card5Scale = useSharedValue(0.8);

  // Animazioni per elementi flottanti
  const chefRecommendationTranslateY = useSharedValue(50);
  const chefRecommendationOpacity = useSharedValue(0);
  const chefRecommendationScale = useSharedValue(0.9);
  
  const cartButtonTranslateY = useSharedValue(100);
  const cartButtonOpacity = useSharedValue(0);
  const cartButtonScale = useSharedValue(0.8);
  const cartButtonRotate = useSharedValue(-10);
  
  const categoriesTranslateX = useSharedValue(-50);
  const categoriesOpacity = useSharedValue(0);
  const categoriesScale = useSharedValue(0.95);

  // Funzione per avviare le animazioni
  const startAnimations = () => {
    // Fade in generale
    fadeProgress.value = withTiming(1, { duration: duration * 0.8, easing: Easing.out(Easing.quad) });
    
    // Scale generale
    scaleProgress.value = withSpring(1, springConfig);
    
    // Animazioni della mascotte rimosse - ora gestite nella tab bar
    
    // Animazione delle card delle pizze con timing sfalsato
    const cardAnimations = [
      { translateY: card1TranslateY, opacity: card1Opacity, scale: card1Scale },
      { translateY: card2TranslateY, opacity: card2Opacity, scale: card2Scale },
      { translateY: card3TranslateY, opacity: card3Opacity, scale: card3Scale },
      { translateY: card4TranslateY, opacity: card4Opacity, scale: card4Scale },
      { translateY: card5TranslateY, opacity: card5Opacity, scale: card5Scale },
    ];
    
    cardAnimations.forEach((card, index) => {
      const cardDelay = delay + (index * 150);
      
      card.translateY.value = withDelay(
        cardDelay,
        withSpring(0, springConfig)
      );
      
      card.opacity.value = withDelay(
        cardDelay,
        withTiming(1, { duration: duration * 0.6, easing: Easing.out(Easing.quad) })
      );
      
      card.scale.value = withDelay(
        cardDelay,
        withSpring(1, { damping: 20, stiffness: 200 })
      );
    });

    // Animazione elementi flottanti
    chefRecommendationTranslateY.value = withDelay(
      delay + 400,
      withSpring(0, { damping: 12, stiffness: 100 })
    );
    
    chefRecommendationOpacity.value = withDelay(
      delay + 400,
      withTiming(1, { duration: duration * 0.8 })
    );
    
    chefRecommendationScale.value = withDelay(
      delay + 400,
      withSpring(1, { damping: 15, stiffness: 120 })
    );

    cartButtonTranslateY.value = withDelay(
      delay + 600,
      withSpring(0, { damping: 10, stiffness: 80 })
    );
    
    cartButtonOpacity.value = withDelay(
      delay + 600,
      withTiming(1, { duration: duration * 0.8 })
    );
    
    cartButtonScale.value = withDelay(
      delay + 600,
      withSequence(
        withTiming(1.1, { duration: duration * 0.2 }),
        withSpring(1, { damping: 15, stiffness: 150 })
      )
    );

    categoriesTranslateX.value = withDelay(
      delay + 200,
      withSpring(0, springConfig)
    );
    
    categoriesOpacity.value = withDelay(
      delay + 200,
      withTiming(1, { duration: duration * 0.7 })
    );
    
    categoriesScale.value = withDelay(
      delay + 200,
      withSpring(1, springConfig)
    );
  };

  // Funzione per animazioni di uscita
  const exitAnimations = () => {
    fadeProgress.value = withTiming(0, { duration: duration * 0.6 });
    scaleProgress.value = withTiming(0.8, { duration: duration * 0.6 });
    
    // Animazioni della mascotte rimosse - ora gestite nella tab bar
  };

  // Stili animati per la mascotte rimossi - ora gestiti nella tab bar

  // Stili animati per le card - creati direttamente come hook
  const card1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: card1TranslateY.value },
      { scale: card1Scale.value },
    ],
    opacity: card1Opacity.value,
  }));

  const card2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: card2TranslateY.value },
      { scale: card2Scale.value },
    ],
    opacity: card2Opacity.value,
  }));

  const card3AnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: card3TranslateY.value },
      { scale: card3Scale.value },
    ],
    opacity: card3Opacity.value,
  }));

  const card4AnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: card4TranslateY.value },
      { scale: card4Scale.value },
    ],
    opacity: card4Opacity.value,
  }));

  const card5AnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: card5TranslateY.value },
      { scale: card5Scale.value },
    ],
    opacity: card5Opacity.value,
  }));

  // Funzione per ottenere lo stile animato di una card
  const getCardAnimatedStyle = (index: number) => {
    const cardStyles = [
      card1AnimatedStyle,
      card2AnimatedStyle,
      card3AnimatedStyle,
      card4AnimatedStyle,
      card5AnimatedStyle,
    ];
    
    return cardStyles[index] || card1AnimatedStyle;
  };

  // Stili animati per elementi flottanti
  const chefRecommendationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: chefRecommendationTranslateY.value },
      { scale: chefRecommendationScale.value },
    ],
    opacity: chefRecommendationOpacity.value,
  }));

  const cartButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: cartButtonTranslateY.value },
      { scale: cartButtonScale.value },
      { rotate: `${cartButtonRotate.value}deg` },
    ],
    opacity: cartButtonOpacity.value,
  }));

  const categoriesAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: categoriesTranslateX.value },
      { scale: categoriesScale.value },
    ],
    opacity: categoriesOpacity.value,
  }));

  // Stile animato per il background
  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeProgress.value,
    transform: [{ scale: scaleProgress.value }],
  }));

  return {
    startAnimations,
    exitAnimations,
    getCardAnimatedStyle,
    chefRecommendationAnimatedStyle,
    cartButtonAnimatedStyle,
    categoriesAnimatedStyle,
    backgroundAnimatedStyle,
  };
};

