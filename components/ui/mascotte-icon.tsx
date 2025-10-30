import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

interface MascotteIconProps {
  size?: number;
  color?: string;
  style?: StyleProp<ImageStyle>;
}

// Componente per mostrare la mascotte con dimensione e colore personalizzabili
export function MascotteIcon({ size = 24, color, style }: MascotteIconProps) {
  return (
    <Image
      source={require("@/assets/images/Mascotte.png")}
      style={[
        {
          width: size,
          height: size,
          tintColor: color, // Applica il colore come "tint" solo su img monocromatiche (supportato su iOS)
        },
        style,
      ]}
      resizeMode="contain"
    />
  );
}
