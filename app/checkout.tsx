import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useOrder } from "@/contexts/OrderContext";
import { usePizzaModal } from "@/hooks/use-pizza-modal";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

// Array delle pizze per ottenere le immagini
const pizzas = [
  { id: "1", name: "Pizza Margherita", image: "🍕" },
  { id: "2", name: "Pizza Quattro Stagioni", image: "🍕" },
  { id: "3", name: "Pizza Diavola", image: "🍕" },
  { id: "4", name: "Pizza Capricciosa", image: "🍕" },
  { id: "5", name: "Pizza Marinara", image: "🍕" },
  { id: "6", name: "Pizza Bufala", image: "🍕" },
  { id: "7", name: "Pizza Prosciutto e Funghi", image: "🍕" },
  { id: "8", name: "Pizza Quattro Formaggi", image: "🍕" },
  { id: "9", name: "Pizza Ortolana", image: "🍕" },
  { id: "10", name: "Pizza Bresaola e Rucola", image: "🍕" },
  { id: "11", name: "Pizza Tonno e Cipolle", image: "🍕" },
  { id: "12", name: "Pizza Salsiccia e Friarielli", image: "🍕" },
  { id: "13", name: "Pizza Patate e Salsiccia", image: "🍕" },
  { id: "14", name: "Pizza Parma e Rucola", image: "🍕" },
  { id: "15", name: "Pizza Tartufo e Porcini", image: "🍕" },
  { id: "16", name: "Pizza Gamberi e Zucchine", image: "🍕" },
  { id: "17", name: "Pizza Speck e Asiago", image: "🍕" },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { orders, confirmOrder, updateQuantity, removeFromOrder, clearOrder } =
    useOrder();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { showModal, ModalComponent } = usePizzaModal();

  // Calcola il totale dell'ordine
  const totalPrice = orders.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Funzione per ottenere l'immagine della pizza
  const getPizzaImage = (pizzaId: string) => {
    const pizza = pizzas.find((p) => p.id === pizzaId);
    return pizza ? pizza.image : "🍕";
  };

  const handleConfirmOrder = () => {
    if (!orders || orders.length === 0) {
      showModal("Carrello vuoto", "Non ci sono pizze da ordinare.");
      return;
    }

    const goToOrders = async () => {
      await confirmOrder();
      router.dismiss();
      router.push("/ordini");
    };

    if (Platform.OS === "web") {
      goToOrders();
      return;
    }

    showModal(
      "Ordine confermato",
      "Il tuo ordine è stato confermato con successo!",
      [
        {
          text: "OK",
          onPress: goToOrders,
        },
      ]
    );
  };

  const handleClearCart = () => {
    if (orders.length === 0) {
      showModal("Carrello vuoto", "Il carrello è già vuoto.");
      return;
    }

    showModal(
      "Svuota carrello",
      "Sei sicuro di voler svuotare il carrello? Questa azione non può essere annullata.",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Svuota",
          style: "destructive",
          onPress: () => clearOrder(),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Carrello
        </ThemedText>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: colors.border }]}
          onPress={() => router.dismiss()}
        >
          <IconSymbol size={20} name="xmark" color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {orders.length === 0 ? (
          <View
            style={[
              styles.emptyCart,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <ThemedText style={[styles.emptyCartText, { color: colors.muted }]}>
              Il tuo carrello è vuoto.
            </ThemedText>
            <ThemedText
              style={[styles.emptyCartSubtext, { color: colors.muted }]}
            >
              Aggiungi alcune pizze per iniziare!
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Swipeable
                renderRightActions={() => (
                  <View style={styles.transparentAction} />
                )}
                overshootRight={true}
                onSwipeableWillOpen={() => removeFromOrder(item.id)}
                friction={0.3}
                rightThreshold={0}
                enableTrackpadTwoFingerGesture={true}
              >
                <View
                  style={[
                    styles.orderItem,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.itemInfo}>
                    <ThemedText
                      style={[styles.itemName, { color: colors.text }]}
                    >
                      {item.name}
                    </ThemedText>
                    {item.notes && item.notes.trim() && (
                      <ThemedText
                        style={[styles.itemNotes, { color: colors.muted }]}
                      >
                        📝 {item.notes}
                      </ThemedText>
                    )}
                    <ThemedText
                      style={[styles.itemPrice, { color: colors.primary }]}
                    >
                      €{item.price.toFixed(2)} × {item.quantity} = €{(item.price * item.quantity).toFixed(2)}
                    </ThemedText>
                  </View>

                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        { backgroundColor: colors.secondary },
                      ]}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <IconSymbol size={16} name="minus" color="white" />
                    </TouchableOpacity>

                    <Text
                      style={[styles.quantityText, { color: colors.text }]}
                      numberOfLines={1}
                      ellipsizeMode="clip"
                    >
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        { backgroundColor: colors.secondary },
                      ]}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <IconSymbol size={16} name="plus" color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.removeButton,
                        { backgroundColor: colors.error },
                      ]}
                      onPress={() => removeFromOrder(item.id)}
                    >
                      <IconSymbol size={16} name="trash" color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Swipeable>
            )}
            style={{ width: "100%" }}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          />
        )}
      </View>

      {orders.length > 0 && (
        <>
          {/* Barra di riepilogo del totale */}
          <View style={[styles.totalSummary, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ThemedText style={[styles.totalLabel, { color: colors.text }]}>
              Totale ordine:
            </ThemedText>
            <ThemedText style={[styles.totalAmount, { color: colors.primary }]}>
              €{totalPrice.toFixed(2)}
            </ThemedText>
          </View>

          {/* Pulsante Svuota carrello (filled con sfondo rosso chiaro) */}
          <TouchableOpacity
            style={[
              styles.clearButton,
              { backgroundColor: colors.error + '15', borderColor: colors.error },
            ]}
            onPress={handleClearCart}
          >
            <ThemedText style={[styles.clearButtonText, { color: colors.error }]}>
              Svuota carrello
            </ThemedText>
          </TouchableOpacity>

          {/* Pulsante Conferma ordine */}
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: colors.primary }]}
            onPress={handleConfirmOrder}
          >
            <ThemedText style={styles.confirmButtonText}>
              Conferma ordine
            </ThemedText>
          </TouchableOpacity>
        </>
      )}
      <ModalComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  emptyCart: {
    alignItems: "center",
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 14,
  },
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 0,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 80,
  },
  pizzaImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pizzaEmoji: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemNotes: {
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: 140,
    height: 40,
    paddingHorizontal: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 40,
    maxWidth: 50,
    textAlign: "center",
    flexShrink: 0,
    lineHeight: 20,
    includeFontPadding: false,
    textAlignVertical: "center",
    backgroundColor: "transparent",
    marginHorizontal: 4,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  transparentAction: {
    backgroundColor: 'transparent',
    width: 200,
    height: '100%',
  },
  totalSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#703537",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  confirmButton: {
    padding: 20,
    borderRadius: 16,
    marginTop: 16,
    width: "100%",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#703537",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  clearButton: {
    padding: 18,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 8,
    width: "100%",
    alignItems: "center",
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 50,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
