import React, { useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

interface ParticleEffectProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Componente per una singola particella
const Particle: React.FC<{
  id: number;
  isActive: boolean;
  duration: number;
  colors: string[];
  delay: number;
}> = React.memo(({ id, isActive, duration, colors, delay }) => {
  // Ogni particella ha i suoi shared values
  const x = useSharedValue(screenWidth / 2);
  const y = useSharedValue(screenHeight / 2);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Animazione della particella
  useEffect(() => {
    if (!isActive) {
      // Reset quando non attiva
      opacity.value = 0;
      scale.value = 0;
      rotation.value = 0;
      return;
    }

    // Posizione di partenza (centro dello schermo)
    x.value = screenWidth / 2;
    y.value = screenHeight / 2;

    // Animazione di entrata
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })
    );

    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(0.5, { duration: 200 }),
        withSpring(1, { damping: 8, stiffness: 100 })
      )
    );

    // Movimento casuale
    const targetX = Math.random() * screenWidth;
    const targetY = Math.random() * screenHeight;

    x.value = withDelay(
      delay + 200,
      withTiming(targetX, {
        duration: duration * 0.8,
        easing: Easing.out(Easing.cubic)
      })
    );

    y.value = withDelay(
      delay + 200,
      withTiming(targetY, {
        duration: duration * 0.8,
        easing: Easing.out(Easing.cubic)
      })
    );

    // Rotazione
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      )
    );

    // Fade out
    opacity.value = withDelay(
      delay + duration * 0.7,
      withTiming(0, { duration: duration * 0.3 })
    );
  }, [isActive, duration, delay, x, y, opacity, scale, rotation]);

  // Stile animato per la particella
  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x.value - 4,
    top: y.value - 4,
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ] as any,
  }));

  return (
    <Animated.View style={animatedStyle as any}>
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors[id % colors.length],
          shadowColor: colors[id % colors.length],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
          elevation: 4,
        }}
      />
    </Animated.View>
  );
});

Particle.displayName = 'Particle';

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  isActive,
  duration = 2000,
  particleCount = 15,
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
}) => {
  // Limita il numero di particelle per evitare problemi di performance
  const maxParticles = Math.min(particleCount, 20);
  
  // Crea un array di particelle con delay progressivo
  const particles = Array.from({ length: maxParticles }, (_, index) => ({
    id: index,
    delay: index * 100,
  }));

  return (
    <View style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      pointerEvents: 'none' 
    }}>
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          id={particle.id}
          isActive={isActive}
          duration={duration}
          colors={colors}
          delay={particle.delay}
        />
      ))}
    </View>
  );
};