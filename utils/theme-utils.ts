/**
 * Utilità per la gestione dei temi
 * Funzioni helper per lavorare con i temi e i colori
 */

import { PizzaColors } from '@/constants/colors';
import { PizzaThemes, Theme, ThemeName } from '@/constants/themes';
import { useColorScheme } from 'react-native';

/**
 * Ottiene il tema corrente basato sul color scheme del sistema
 */
export function getCurrentTheme(themeName?: ThemeName): Theme {
  const systemColorScheme = useColorScheme();
  
  if (themeName) {
    return PizzaThemes[themeName];
  }
  
  const themeKey = systemColorScheme === 'dark' ? 'dark' : 'light';
  return PizzaThemes[themeKey];
}

/**
 * Ottiene i colori del tema corrente
 */
export function getCurrentColors(themeName?: ThemeName) {
  const theme = getCurrentTheme(themeName);
  return theme.colors;
}

/**
 * Ottiene la tipografia del tema corrente
 */
export function getCurrentTypography(themeName?: ThemeName) {
  const theme = getCurrentTheme(themeName);
  return theme.typography;
}

/**
 * Ottiene lo spacing del tema corrente
 */
export function getCurrentSpacing(themeName?: ThemeName) {
  const theme = getCurrentTheme(themeName);
  return theme.spacing;
}

/**
 * Ottiene i border radius del tema corrente
 */
export function getCurrentBorderRadius(themeName?: ThemeName) {
  const theme = getCurrentTheme(themeName);
  return theme.borderRadius;
}

/**
 * Ottiene le ombre del tema corrente
 */
export function getCurrentShadows(themeName?: ThemeName) {
  const theme = getCurrentTheme(themeName);
  return theme.shadows;
}

/**
 * Crea stili per un componente basati sul tema corrente
 */
export function createThemedStyles<T extends Record<string, any>>(
  styleCreator: (theme: Theme) => T,
  themeName?: ThemeName
): T {
  const theme = getCurrentTheme(themeName);
  return styleCreator(theme);
}

/**
 * Crea stili condizionali basati sul tema
 */
export function createConditionalStyles<T extends Record<string, any>>(
  styleCreator: (theme: Theme, isDark: boolean) => T,
  themeName?: ThemeName
): T {
  const theme = getCurrentTheme(themeName);
  const isDark = themeName === 'dark' || (!themeName && theme === PizzaThemes.dark);
  return styleCreator(theme, isDark);
}

/**
 * Crea stili responsive basati sul tema
 */
export function createResponsiveStyles<T extends Record<string, any>>(
  styleCreator: (theme: Theme, screenWidth: number) => T,
  screenWidth: number,
  themeName?: ThemeName
): T {
  const theme = getCurrentTheme(themeName);
  return styleCreator(theme, screenWidth);
}

/**
 * Crea stili per i bottoni basati sul tema
 */
export function createButtonStyles(themeName?: ThemeName) {
  const colors = getCurrentColors(themeName);
  const spacing = getCurrentSpacing(themeName);
  const borderRadius = getCurrentBorderRadius(themeName);
  const shadows = getCurrentShadows(themeName);
  
  return {
    primary: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      ...shadows.sm,
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      ...shadows.sm,
    },
    accent: {
      backgroundColor: colors.accent,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      ...shadows.sm,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
  };
}

/**
 * Crea stili per le card basati sul tema
 */
export function createCardStyles(themeName?: ThemeName) {
  const colors = getCurrentColors(themeName);
  const spacing = getCurrentSpacing(themeName);
  const borderRadius = getCurrentBorderRadius(themeName);
  const shadows = getCurrentShadows(themeName);
  
  return {
    default: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      ...shadows.sm,
    },
    elevated: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      ...shadows.md,
    },
    outlined: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
  };
}

/**
 * Crea stili per i testi basati sul tema
 */
export function createTextStyles(themeName?: ThemeName) {
  const colors = getCurrentColors(themeName);
  const typography = getCurrentTypography(themeName);
  
  return {
    h1: {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      color: colors.text,
    },
    h2: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      color: colors.text,
    },
    h3: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      color: colors.text,
    },
    h4: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      color: colors.text,
    },
    h5: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      color: colors.text,
    },
    h6: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      color: colors.text,
    },
    body: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      color: colors.text,
    },
    caption: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      color: colors.textSecondary,
    },
    small: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      color: colors.textSecondary,
    },
  };
}

/**
 * Crea stili per i layout basati sul tema
 */
export function createLayoutStyles(themeName?: ThemeName) {
  const colors = getCurrentColors(themeName);
  const spacing = getCurrentSpacing(themeName);
  
  return {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: spacing.md,
    },
    row: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    column: {
      flexDirection: 'column' as const,
    },
    center: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    spaceBetween: {
      justifyContent: 'space-between' as const,
    },
    spaceAround: {
      justifyContent: 'space-around' as const,
    },
    spaceEvenly: {
      justifyContent: 'space-evenly' as const,
    },
  };
}

/**
 * Crea stili per i form basati sul tema
 */
export function createFormStyles(themeName?: ThemeName) {
  const colors = getCurrentColors(themeName);
  const spacing = getCurrentSpacing(themeName);
  const borderRadius = getCurrentBorderRadius(themeName);
  const typography = getCurrentTypography(themeName);
  
  return {
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      padding: spacing.sm,
      fontSize: typography.fontSize.base,
      backgroundColor: colors.surface,
      color: colors.text,
    },
    inputFocused: {
      borderColor: colors.primary,
      ...PizzaColors.shadows.small,
    },
    inputError: {
      borderColor: colors.error,
    },
    label: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    error: {
      fontSize: typography.fontSize.xs,
      color: colors.error,
      marginTop: spacing.xs,
    },
  };
}

/**
 * Crea stili per le liste basati sul tema
 */
export function createListStyles(themeName?: ThemeName) {
  const colors = getCurrentColors(themeName);
  const spacing = getCurrentSpacing(themeName);
  const borderRadius = getCurrentBorderRadius(themeName);
  const shadows = getCurrentShadows(themeName);
  
  return {
    list: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      ...shadows.sm,
    },
    listItem: {
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    listItemLast: {
      borderBottomWidth: 0,
    },
    listHeader: {
      padding: spacing.md,
      backgroundColor: colors.background,
      borderTopLeftRadius: borderRadius.lg,
      borderTopRightRadius: borderRadius.lg,
    },
    listFooter: {
      padding: spacing.md,
      backgroundColor: colors.background,
      borderBottomLeftRadius: borderRadius.lg,
      borderBottomRightRadius: borderRadius.lg,
    },
  };
}

export default {
  getCurrentTheme,
  getCurrentColors,
  getCurrentTypography,
  getCurrentSpacing,
  getCurrentBorderRadius,
  getCurrentShadows,
  createThemedStyles,
  createConditionalStyles,
  createResponsiveStyles,
  createButtonStyles,
  createCardStyles,
  createTextStyles,
  createLayoutStyles,
  createFormStyles,
  createListStyles,
};
