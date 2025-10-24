import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSmoothColors } from '@/hooks/use-smooth-colors';
import React from 'react';
import { ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';

interface AnimatedThemedViewProps {
  style?: AnimatedStyle<ViewStyle> | ViewStyle;
  children?: React.ReactNode;
  [key: string]: any;
}

export const AnimatedThemedView: React.FC<AnimatedThemedViewProps> = ({ 
  style, 
  children, 
  ...props 
}) => {
  const colorScheme = useColorScheme();
  const { backgroundAnimatedStyle } = useSmoothColors(colorScheme);

  return (
    <Animated.View 
      style={[backgroundAnimatedStyle, style]} 
      {...props}
    >
      {children}
    </Animated.View>
  );
};

