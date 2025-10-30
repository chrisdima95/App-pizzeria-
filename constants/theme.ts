/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

/**
 * Colors contiene la palette sia per il tema chiaro che scuro.
 * Alcuni colori cambiano (es: background, primary), altri restano simili per coerenza brand.
 * Si mappa sempre la stessa semantica (primary = azioni dominanti, secondary = highlights...)
 */
export const Colors = {
  light: {
    // Colori chiari per UI day/light
    text: "#2D1B1B", // Marrone molto scuro per testi - miglior contrasto (4.5:1)
    background: "#ffeec9", // Beige crema per sfondi
    tint: "#703537", // Marrone scuro per elementi attivi
    icon: "#718096", // Grigio medio
    tabIconDefault: "#A0AEC0", // Grigio chiaro
    tabIconSelected: "#703537", // Marrone scuro per elementi attivi
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
    // Palette dark: mantiene i richiami "pizza" ma più profondi/marroni
    text: "#F7FAFC", // Beige crema per testi
    background: "#1A202C", // Marrone molto scuro
    tint: "#F6AD55", // Arancione caldo
    icon: "#A0AEC0", // Grigio chiaro
    tabIconDefault: "#718096", // Grigio medio
    tabIconSelected: "#F6AD55", // Arancione caldo
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

/**
 * Fonts definisce la mappatura delle famiglie font usate nell'app su tutte le piattaforme (iOS, Android/Web) per coerenza tipografica.
 * Serve per evitare incoerenze nei componenti cross-platform.
 */
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
    // fallback predefinito Android
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    // Per la web app si usano le alternative tipiche sans-serif-web
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
