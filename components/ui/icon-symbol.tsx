// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

/**
 * MAPPING associa i nomi icona usati (in stile SF Symbols) alle corrispondenti MaterialIcons usate su Android/web
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.up": "expand-less",
  "chevron.down": "expand-more",
  "tag.fill": "local-offer",
  "camera.fill": "camera-alt",
  "person.fill": "person",
  "person.circle": "account-circle",
  "person.circle.fill": "account-circle",
  "person.badge.plus": "person-add",
  minus: "remove",
  plus: "add",
  "cart.fill": "shopping-cart",
  "shopping-cart": "shopping-cart",
  bag: "shopping-bag",
  xmark: "close",
  trash: "delete",
  power: "power-settings-new",
  pencil: "edit",
} as const;

type IconSymbolName = keyof typeof MAPPING;

/**
 * IconSymbol seleziona la MaterialIcon corrispondente al nome passato
 * Serve per mantenere un design coerente tra iOS e Android/web
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
