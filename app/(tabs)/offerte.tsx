import { TabHeader } from "@/components/TabHeader";
import { ThemedText } from "@/components/themed-text";
import { PizzaWheel } from "@/components/ui";
import { type Offer } from "@/types/offer";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getAllOffers } from "@/data/offers";
import { usePizzaModal } from "@/hooks/use-pizza-modal";
import { useRouter } from "expo-router";
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

  // Funzione che viene chiamata quando un'offerta viene selezionata dalla ruota
  const handleSelectOffer = (offer: Offer) => {
    // Utente non autenticato: obbliga a registrarsi per riscattare offerta
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

    // Se c'è già un'offerta nel carrello, impedisce di aggiungerne altre
    const offerIdSet = new Set(getAllOffers().map(o => o.id));
    const hasOfferInCart = orders.some(o => offerIdSet.has(o.id));
    if (hasOfferInCart) {
      showModal(
        "Offerta già nel carrello",
        "Puoi riscattare una sola offerta alla volta. Conferma l'ordine per poter rigirare la ruota.",
      );
      return;
    }

    // Offerta già riscattata in passato: blocca doppio riscatto
    if (redeemedOffers.includes(offer.id)) {
      showModal(
        "Offerta già riscattata",
        "Questa offerta è già stata riscattata e non può essere utilizzata nuovamente."
      );
      return;
    }

    // Se tutto ok, aggiunge offerta al carrello e fa partire checkout
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
      <TabHeader title="Offerte Esclusive" showMascotte={false} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces={true}
        alwaysBounceVertical={false}
      >
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="title" style={styles.heroTitle}>
            La tua fortuna ti aspetta
          </ThemedText>
          <ThemedText style={[styles.heroSubtitle, { color: colors.muted }]}>
            Un giro di ruota e potresti vincere un&apos;offerta incredibile
          </ThemedText>
          <View style={[styles.highlightBox, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
            <ThemedText style={[styles.highlightText, { color: colors.primary }]}>
              Ogni offerta può essere riscattata una sola volta
            </ThemedText>
          </View>
        </View>

        {/* Ruota della fortuna */}
        <View style={styles.wheelSection}>
          <PizzaWheel
            offers={allOffers}
            onOfferSelected={handleSelectOffer}
            redeemedOffers={redeemedOffers}
          />
        </View>

        {/* Call to Action */}
        <View style={[styles.ctaSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText style={[styles.ctaTitle, { color: colors.primary }]}>
            Pronto a vincere?
          </ThemedText>
          <ThemedText style={[styles.ctaText, { color: colors.muted }]}>
            Premi il pulsante per iniziare il gioco. La fortuna è dalla tua parte!
          </ThemedText>
        </View>

        {/* Footer con informazioni */}
        <View style={[styles.footer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText style={[styles.footerTitle, { color: colors.primary }]}>
            Come Funziona
          </ThemedText>
          <ThemedText style={[styles.footerText, { color: colors.muted }]}>
            • Premi &quot;Gira la ruota!&quot; per iniziare{'\n'}
            • La ruota gira per esattamente 5 secondi{'\n'}
            • Ogni offerta può essere riscattata una sola volta{'\n'}
            • Registrati per riscattare le offerte vinte{'\n'}
            • Buona fortuna!
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
  heroSection: {
    marginTop: 16,
    marginBottom: 24,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: "500",
  },
  highlightBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  highlightText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  wheelSection: {
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(112, 53, 55, 0.08)',
    borderRadius: 24,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  ctaSection: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  ctaText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
  },
  footer: {
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
    lineHeight: 22,
  },
});
