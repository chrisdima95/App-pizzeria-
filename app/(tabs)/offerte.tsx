import { TabHeader } from "@/components/TabHeader";
import { ThemedText } from "@/components/themed-text";
import { PizzaWheel, type Offer } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getAllOffers } from "@/data/offers";
import { usePizzaModal } from "@/hooks/use-pizza-modal";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  useColorScheme,
  View
} from "react-native";
import { useOrder } from "../../contexts/OrderContext";

export default function OfferteScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const router = useRouter();
  const { addToOrder, redeemedOffers, orders } = useOrder();
  const { isAuthenticated } = useAuth();
  const { showModal, ModalComponent } = usePizzaModal();

  const handleSelectOffer = (offer: Offer) => {
    if (!isAuthenticated) {
      showModal(
        "Registrazione richiesta",
        "Per riscattare l'offerta bisogna essere registrati",
        [
          { text: "Annulla", style: "cancel" },
          {
            text: "Registrati",
            onPress: () => router.push("/login?mode=register"),
          },
        ]
      );
      return;
    }

    // Se nel carrello c'è già un'offerta, impedisci di aggiungerne un'altra
    const offerIdSet = new Set(getAllOffers().map(o => o.id));
    const hasOfferInCart = orders.some(o => offerIdSet.has(o.id));
    if (hasOfferInCart) {
      showModal(
        "Offerta già nel carrello",
        "Puoi riscattare una sola offerta alla volta. Conferma l'ordine per poter rigirare la ruota.",
      );
      return;
    }

    // Controlla se l'offerta è già stata riscattata
    if (redeemedOffers.includes(offer.id)) {
      showModal(
        "Offerta già riscattata",
        "Questa offerta è già stata riscattata e non può essere utilizzata nuovamente."
      );
      return;
    }

    addToOrder({
      id: offer.id,
      name: offer.name,
      price: offer.price,
      quantity: 1,
    });
    router.push("/checkout");
  };

  const allOffers = getAllOffers();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TabHeader title="Offerte Speciali" showMascotte={false} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.mainTitle}>
            Ruota della Fortuna Pizza
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.muted }]}>
            Gira la ruota e vinci un'offerta speciale!
          </ThemedText>
        </View>

        {/* Ruota della fortuna */}
        <View style={styles.wheelSection}>
          <PizzaWheel
            offers={allOffers}
            onOfferSelected={handleSelectOffer}
            redeemedOffers={redeemedOffers}
          />
        </View>

        {/* Footer con informazioni */}
        <View style={[styles.footer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText style={[styles.footerTitle, { color: colors.primary }]}>
            Come Funziona la Ruota
          </ThemedText>
          <ThemedText style={[styles.footerText, { color: colors.muted }]}>
            • Swipa sulla ruota o premi "Gira la Ruota!" per iniziare{'\n'}
            • La ruota gira velocemente per almeno 2 secondi{'\n'}
            • Ogni offerta può essere riscattata una sola volta{'\n'}
            • Registrati per riscattare le offerte vinte{'\n'}
            • Buona fortuna! 🍕
          </ThemedText>
        </View>
      </ScrollView>
      
      <ModalComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    paddingTop: 8,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  wheelSection: {
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(112, 53, 55, 0.05)',
    borderRadius: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
});
