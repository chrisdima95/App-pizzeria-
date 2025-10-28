/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

// Colori tema pizzeria - palette calda e appetitosa
const tintColorLight = "#703537"; // Marrone scuro per elementi attivi
const tintColorDark = "#F6AD55"; // Arancione caldo

export const Colors = {
  light: {
    text: "#2D1B1B", // Marrone molto scuro per testi - miglior contrasto (4.5:1)
    background: "#ffeec9", // Beige crema per sfondi
    tint: tintColorLight,
    icon: "#718096", // Grigio medio
    tabIconDefault: "#A0AEC0", // Grigio chiaro
    tabIconSelected: tintColorLight,
    // Colori aggiuntivi per la pizzeria
    primary: "#703537", // Marrone scuro per bottoni e elementi principali
    secondary: "#38A169", // Verde basilico standardizzato
    accent: "#F6AD55", // Arancione caldo
    success: "#22C55E", // Verde brillante per successi - distintivo dal secondary
    warning: "#F6AD55", // Arancione per avvisi
    error: "#DC2626", // Rosso acceso per errori - distintivo dal rosso pomodoro
    urgent: "#E53E3E", // Rosso pomodoro per elementi di urgenza
    highlight: "#F6E05E", // Giallo mozzarella per highlights
    card: "#FFFFFF", // Bianco per le card
    border: "#E2E8F0", // Grigio chiaro per bordi
    muted: "#718096", // Grigio per testi secondari
  },
  dark: {
    text: "#F7FAFC", // Beige crema per testi
    background: "#1A202C", // Marrone molto scuro
    tint: tintColorDark,
    icon: "#A0AEC0", // Grigio chiaro
    tabIconDefault: "#718096", // Grigio medio
    tabIconSelected: tintColorDark,
    // Colori aggiuntivi per la pizzeria
    primary: "#8B4513", // Marrone più chiaro per coerenza brand
    secondary: "#38A169", // Verde basilico standardizzato - stesso verde light mode
    accent: "#F6AD55", // Arancione caldo - unificato con light mode
    success: "#22C55E", // Verde brillante per successi - distintivo
    warning: "#F6AD55", // Arancione per avvisi
    error: "#DC2626", // Rosso acceso per errori - distintivo dal rosso pomodoro
    urgent: "#E53E3E", // Rosso pomodoro per elementi di urgenza
    highlight: "#F6E05E", // Giallo mozzarella per highlights
    card: "#2D3748", // Marrone scuro per le card
    border: "#4A5568", // Grigio scuro per bordi
    muted: "#A0AEC0", // Grigio chiaro per testi secondari
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
