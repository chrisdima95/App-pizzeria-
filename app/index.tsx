import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, Platform, StyleSheet } from "react-native";

export default function WelcomeScreen() {
  const { isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // useEffect per auto-redirect alla home delle tabs dopo 2 secondi
  useEffect(() => {
    // Attendi 2 secondi prima di navigare
    const timer = setTimeout(() => {
      if (!isLoading) {
        // Vai direttamente alle tabs senza richiedere l'accesso
        router.replace("/(tabs)");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Se l'autenticazione è ancora in caricamento mostra spinner di loading
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={[styles.loadingText, { color: colors.muted }]}>
          Caricamento...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Logo con bordo ottagonale e ombra */}
      <ThemedView style={styles.logoFrame}>
        <Image
          source={require("@/assets/images/MascotteLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </ThemedView>

      {/* Testo di benvenuto */}
      <ThemedText type="title" style={styles.welcomeText}>
        Benvenuto!
      </ThemedText>

      {/* Sottotitolo */}
      <ThemedText style={styles.subtitle}>La tua pizzeria preferita</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // Su iOS aggiungiamo padding top per evitare il taglio del testo
    paddingTop: Platform.OS === "ios" ? 60 : 20,
  },
  logoFrame: {
    // Riduciamo le dimensioni del logo su iOS per evitare sovrapposizioni
    width: Platform.OS === "ios" ? 280 : 320,
    height: Platform.OS === "ios" ? 280 : 320,
    marginBottom: Platform.OS === "ios" ? 0 : -20,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  welcomeText: {
    fontSize: Platform.OS === "ios" ? 32 : 36,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
});
