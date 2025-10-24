/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Colori tema pizzeria - palette calda e appetitosa
const tintColorLight = '#E53E3E'; // Rosso pomodoro
const tintColorDark = '#F6AD55'; // Arancione caldo

export const Colors = {
  light: {
    text: '#2D3748', // Marrone scuro per testi
    background: '#F7FAFC', // Beige crema per sfondi
    tint: tintColorLight,
    icon: '#718096', // Grigio medio
    tabIconDefault: '#A0AEC0', // Grigio chiaro
    tabIconSelected: tintColorLight,
    // Colori aggiuntivi per la pizzeria
    primary: '#E53E3E', // Rosso pomodoro
    secondary: '#38A169', // Verde basilico
    accent: '#F6AD55', // Arancione caldo
    success: '#38A169', // Verde per successi
    warning: '#F6AD55', // Arancione per avvisi
    error: '#E53E3E', // Rosso per errori
    card: '#FFFFFF', // Bianco per le card
    border: '#E2E8F0', // Grigio chiaro per bordi
    muted: '#718096', // Grigio per testi secondari
  },
  dark: {
    text: '#F7FAFC', // Beige crema per testi
    background: '#1A202C', // Marrone molto scuro
    tint: tintColorDark,
    icon: '#A0AEC0', // Grigio chiaro
    tabIconDefault: '#718096', // Grigio medio
    tabIconSelected: tintColorDark,
    // Colori aggiuntivi per la pizzeria
    primary: '#F6AD55', // Arancione caldo
    secondary: '#68D391', // Verde chiaro
    accent: '#E53E3E', // Rosso pomodoro
    success: '#68D391', // Verde per successi
    warning: '#F6AD55', // Arancione per avvisi
    error: '#FC8181', // Rosso chiaro per errori
    card: '#2D3748', // Marrone scuro per le card
    border: '#4A5568', // Grigio scuro per bordi
    muted: '#A0AEC0', // Grigio chiaro per testi secondari
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
