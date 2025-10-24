import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface TabHeaderProps {
  title?: string;
  subtitle?: string;
}

export const TabHeader: React.FC<TabHeaderProps> = ({ title, subtitle }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Logo della mascotte */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/Mascotte.png')} 
          style={styles.mascotteLogo}
          resizeMode="contain"
        />
      </View>
      
      {/* Titolo e sottotitolo - solo se forniti */}
      {(title || subtitle) && (
        <View style={styles.textContainer}>
          {title && (
            <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
              {title}
            </ThemedText>
          )}
          {subtitle && (
            <ThemedText style={[styles.subtitle, { color: colors.muted }]}>
              {subtitle}
            </ThemedText>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  mascotteLogo: {
    width: 80,
    height: 80,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
});
