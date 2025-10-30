// Re-export puro per la maggioranza dei casi (compatibilità 'react-native')
export { useColorScheme as useRNColorScheme } from 'react-native';

import { useEffect, useState } from 'react';
import { useColorScheme as _useColorScheme } from 'react-native';
/**
 * Hook personalizzato SSR-safe per determinare il colorScheme corrente (light/dark).
 * Serve ad evitare bug in fase di statica SSR Web dove react-native non è ancora "hydrated".
 * USARE useCustomColorScheme su componenti che necessitano compatibilità SSR, altrimenti usare useRNColorScheme.
 */
export function useCustomColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);
  const colorScheme = _useColorScheme();
  if (hasHydrated) {
    return colorScheme;
  }
  return 'light';
}