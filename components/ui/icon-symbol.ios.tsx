import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * MAPPING associa nomi simbolici (SF Symbols) alle Material Icons per uniformare l'esperienza tra iOS e altre piattaforme
 */
const MAPPING = {
  // ... existing code ...
};

/**
 * IconSymbol mostra una icona coerente tra iOS, Android e Web, selezionando il nome corretto a seconda della piattaforma
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
