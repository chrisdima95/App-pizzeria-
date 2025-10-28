import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet } from "react-native";

export default function WelcomeScreen() {
  const { isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

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

  // Mostra loading se l'auth è in caricamento
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
    backgroundColor: "#ffeec9",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoFrame: {
    width: 320,
    height: 320,
    marginBottom: -20,
    backgroundColor: "#ffeec9",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#5C4033",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#5C4033",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
});
