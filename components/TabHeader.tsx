import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image, StyleSheet, View } from "react-native";

interface TabHeaderProps {
  title?: string;
  subtitle?: string;
  showMascotte?: boolean;
}

export function TabHeader({
  title,
  subtitle,
  showMascotte = true,
}: TabHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Se showMascotte è true, mostrare la mascotte come logo in alto */}
      {showMascotte && (
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/MascotteLogo.png")}
            style={styles.mascotteLogo}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Mostra le intestazioni solo se i testi sono passati via prop */}
      {(title || subtitle) && (
        <View style={styles.textContainer}>
          {/* Titolo principale */}
          {title && (
            <ThemedText
              type="title"
              style={[styles.title, { color: colors.text }]}
            >
              {title}
            </ThemedText>
          )}
          {/* Sottotitolo sotto al titolo */}
          {subtitle && (
            <ThemedText style={[styles.subtitle, { color: colors.muted }]}>
              {subtitle}
            </ThemedText>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 16,
  },
  mascotteLogo: {
    width: 200,
    height: 200,
    marginTop: -40,
    marginBottom: -40,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
});
