import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

interface MascotteIconProps {
  size?: number;
  color?: string;
  style?: StyleProp<ImageStyle>;
}

export function MascotteIcon({ size = 24, color, style }: MascotteIconProps) {
  return (
    <Image
      source={require("@/assets/images/Mascotte.png")}
      style={[
        {
          width: size,
          height: size,
          tintColor: color, // Applica il colore come tint
        },
        style,
      ]}
      resizeMode="contain"
    />
  );
}
