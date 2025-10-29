import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePizzaModal } from "@/hooks/use-pizza-modal";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function ChefScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    chefLogin,
    isChefAuthenticated,
    isLoading: authLoading,
    chef,
    isAuthenticated,
    user,
  } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { showModal, ModalComponent } = usePizzaModal();

  // Redirect solo se già autenticato come chef
  useEffect(() => {
    if (!authLoading && isChefAuthenticated && chef) {
      // Solo se il chef è già autenticato, vai alla pagina degli ordini chef
      router.replace("/chef-orders");
    }
  }, [isChefAuthenticated, authLoading, chef]);

  // Mostra loading se l'auth è in caricamento
  if (authLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>
          Verifica autenticazione...
        </ThemedText>
      </ThemedView>
    );
  }

  // Non mostrare nulla solo se già autenticato come chef (il redirect avverrà nell'useEffect)
  if (isChefAuthenticated && chef) {
    return null;
  }

  const handleChefLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showModal("Errore", "Inserisci email e password");
      return;
    }

    // Controlla se l'utente è già loggato come cliente
    if (isAuthenticated && user && !user.isChef) {
      showModal(
        "Sessione Attiva",
        'Sei attualmente loggato come cliente. Devi effettuare il logout dalla pagina "Profilo" per poter accedere come Chef.',
        [
          { text: "Annulla", style: "cancel" },
          {
            text: "Vai al Profilo",
            onPress: () => {
              // Pulisce i campi password per evitare l'alert "Vuoi salvare password"
              setEmail("");
              setPassword("");
              // Piccolo delay per assicurarsi che i campi siano puliti prima del redirect
              setTimeout(() => {
                router.replace("/(tabs)/profilo");
              }, 100);
            },
          },
        ]
      );
      return;
    }

    setIsLoading(true);

    try {
      const success = await chefLogin(email, password);
      if (!success) {
        showModal("Errore", "Credenziali Chef non valide");
      }
      // Il redirect viene gestito automaticamente dal chefLogin
    } catch {
      showModal("Errore", "Si è verificato un errore durante il login Chef");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.header}>
          <ThemedText
            type="title"
            style={[styles.title, { color: colors.text }]}
          >
            Chef
          </ThemedText>
          <ThemedText
            type="subtitle"
            style={[styles.subtitle, { color: colors.muted }]}
          >
            Accedi per gestire gli ordini
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Email Chef"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Password Chef"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="off"
            textContentType="none"
          />

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.primary },
              isLoading && styles.actionButtonDisabled,
              { pointerEvents: isLoading ? "none" : "auto" },
            ]}
            onPress={handleChefLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <ThemedText
                style={styles.actionButtonText}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.8}
              >
                Accedi come Chef
              </ThemedText>
            )}
          </TouchableOpacity>

          <ThemedView style={styles.credentialsInfo}>
            <ThemedText
              style={[styles.credentialsText, { color: colors.muted }]}
            >
              Credenziali di test:
            </ThemedText>
            <ThemedText
              style={[
                styles.credentialsText,
                styles.clickableCredential,
                { color: colors.primary },
              ]}
            >
              Email: chef@gmail.com
            </ThemedText>
            <ThemedText
              style={[
                styles.credentialsText,
                styles.clickableCredential,
                { color: colors.primary },
              ]}
            >
              Password: chef
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
      <ModalComponent />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    minHeight: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  input: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButton: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
    width: "100%",
    shadowColor: "#E53E3E",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  credentialsInfo: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  credentialsText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 4,
  },
  clickableCredential: {
    textDecorationLine: "underline",
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  warningContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.3)",
  },
  warningText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});
