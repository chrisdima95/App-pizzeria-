import { PizzaThemes, Theme, ThemeName } from '@/constants/themes';
import { useColorScheme } from 'react-native';

/**
 * Hook personalizzato per utilizzare i temi della pizzeria
 * Restituisce il tema corrente basato sul color scheme del sistema
 */
export function usePizzaTheme(themeName?: ThemeName): Theme {
  const systemColorScheme = useColorScheme();
  
  // Se è specificato un tema, usalo
  if (themeName) {
    return PizzaThemes[themeName];
  }
  
  // Altrimenti usa il tema basato sul color scheme del sistema
  const themeKey = systemColorScheme === 'dark' ? 'dark' : 'light';
  return PizzaThemes[themeKey];
}

/**
 * Hook per ottenere i colori del tema corrente
 */
export function usePizzaColors() {
  const theme = usePizzaTheme();
  return theme.colors;
}

/**
 * Hook per ottenere la tipografia del tema corrente
 */
export function usePizzaTypography() {
  const theme = usePizzaTheme();
  return theme.typography;
}

/**
 * Hook per ottenere lo spacing del tema corrente
 */
export function usePizzaSpacing() {
  const theme = usePizzaTheme();
  return theme.spacing;
}

/**
 * Hook per ottenere i border radius del tema corrente
 */
export function usePizzaBorderRadius() {
  const theme = usePizzaTheme();
  return theme.borderRadius;
}

/**
 * Hook per ottenere le ombre del tema corrente
 */
export function usePizzaShadows() {
  const theme = usePizzaTheme();
  return theme.shadows;
}

export default usePizzaTheme;
