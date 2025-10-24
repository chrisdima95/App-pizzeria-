import { ParticleEffect } from '@/components/ParticleEffect';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTransitionAnimations } from '@/hooks/use-transition-animations';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';

export default function IndexScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { exitAnimations } = useTransitionAnimations();
  const [showParticles, setShowParticles] = useState(false);

  // Animazioni per la schermata di benvenuto
  const fadeIn = useSharedValue(0);
  const scaleIn = useSharedValue(0.8);
  const titleTranslateY = useSharedValue(50);
  const subtitleTranslateY = useSharedValue(30);

  useEffect(() => {
    // Animazione di entrata
    fadeIn.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
    scaleIn.value = withSpring(1, { damping: 15, stiffness: 150 });
    titleTranslateY.value = withSequence(
      withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(-10, { duration: 400, easing: Easing.out(Easing.quad) })
    );
    subtitleTranslateY.value = withDelay(200, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));

    // Avvia le particelle dopo 1 secondo
    const particleTimer = setTimeout(() => {
      setShowParticles(true);
    }, 1000);

    // Dopo 2.5 secondi, avvia l'animazione di uscita e vai alla schermata successiva
    const timer = setTimeout(() => {
      exitAnimations();
      // Piccolo delay per permettere all'animazione di uscita di completarsi
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 400);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(particleTimer);
    };
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ scale: scaleIn.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleTranslateY.value }],
    opacity: fadeIn.value,
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: subtitleTranslateY.value }],
    opacity: fadeIn.value * 0.8,
  }));

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background }, containerAnimatedStyle]}>
      {/* Logo mascotte statico per la schermata di benvenuto */}
      <Animated.View style={containerAnimatedStyle}>
        <Image 
          source={require('@/assets/images/Mascotte.png')} 
          style={styles.mascotteLogo}
          resizeMode="contain"
        />
      </Animated.View>
      
      <Animated.View style={titleAnimatedStyle}>
        <ThemedText type="title" style={[styles.welcomeTitle, { color: colors.text }]}>
          Benvenuto!
        </ThemedText>
      </Animated.View>
      
      <Animated.View style={subtitleAnimatedStyle}>
        <ThemedText type="subtitle" style={[styles.welcomeSubtitle, { color: colors.muted }]}>
          La tua pizzeria preferita
        </ThemedText>
      </Animated.View>

      {/* Effetto particelle */}
      <ParticleEffect 
        isActive={showParticles} 
        duration={1500}
        particleCount={12}
        colors={[colors.primary, colors.secondary, colors.accent, '#FFD700', '#FF6B6B']}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  mascotteLogo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
  },
});
