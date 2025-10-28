import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useOrder } from "@/contexts/OrderContext";
import { usePizzaModal } from "@/hooks/use-pizza-modal";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

// Interfaccia per le personalizzazioni
interface Customization {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

export default function PizzaDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addToOrder, orders, updateQuantity, setOrders } = useOrder();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { showModal, ModalComponent } = usePizzaModal();

  const pizzaId = (params.id as string) || "1";
  const pizzaName = (params.name as string) || "Pizza Margherita";
  const pizzaPrice = parseFloat(params.price as string) || 8.5;
  const pizzaFullDescription =
    (params.fullDescription as string) ||
    "Deliziosa pizza con pomodoro, mozzarella e basilico.";
  const pizzaImage = (params.image as string) || "🍕";

  // Stati per la gestione avanzata
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<Customization[]>([
    {
      id: "extra_mozzarella",
      name: "Mozzarella di bufala",
      price: 2.0,
      selected: false,
    },
    {
      id: "double_tomato",
      name: "Doppio pomodoro",
      price: 1.5,
      selected: false,
    },
    { id: "extra_basil", name: "Basilico extra", price: 0.5, selected: false },
    { id: "no_basil", name: "Senza basilico", price: 0, selected: false },
    {
      id: "extra_cheese",
      name: "Formaggio extra",
      price: 1.0,
      selected: false,
    },
    { id: "gluten_free", name: "Gluten Free", price: 2.0, selected: false },
    { id: "lactose_free", name: "Lactose Free", price: 1.5, selected: false },
  ]);
  const [specialNotes, setSpecialNotes] = useState("");
  const [isInCart, setIsInCart] = useState(false);
  const [showCustomizations, setShowCustomizations] = useState(false);
  const [animationValue] = useState(new Animated.Value(1));

  // Calcola il prezzo totale
  const basePrice = pizzaPrice;
  const customizationPrice = customizations
    .filter((c) => c.selected)
    .reduce((sum, c) => sum + c.price, 0);
  const totalPrice = (basePrice + customizationPrice) * quantity;

  // Non serve resettare perché ogni aggiunta crea un record separato con timestamp

  // Funzioni di gestione
  const setLocalQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const toggleCustomization = (id: string) => {
    setCustomizations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const handleAddToOrder = () => {
    // Animazione di aggiunta
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Crea il nome personalizzato
    const selectedCustomizations = customizations.filter((c) => c.selected);
    const customizationText =
      selectedCustomizations.length > 0
        ? ` (${selectedCustomizations.map((c) => c.name).join(", ")})`
        : "";

    const customPizzaName = `${pizzaName}${customizationText}`;

    // Crea un ID basato su pizza, personalizzazioni e note
    const customizationIds = selectedCustomizations.map((c) => c.id).join(",");
    const notesHash =
      specialNotes.trim().length > 0
        ? `_${specialNotes.trim().replace(/\s+/g, "_")}`
        : "";

    // Crea SEMPRE un ID univoco includendo un timestamp
    // Questo garantisce che ogni aggiunta dalla pagina dettagli crei un record SEPARATO
    const timestamp = Date.now();
    const itemId = `${pizzaId}_${customizationIds}${notesHash}_${timestamp}`;

    // Crea SEMPRE un nuovo record usando setOrders direttamente
    // Questo garantisce che non ci sia conflitto con ordini esistenti
    setOrders((prev) => [
      ...prev,
      {
        id: itemId,
        name: customPizzaName,
        price: basePrice + customizationPrice,
        quantity: quantity,
        notes: specialNotes,
        status: "pending" as const,
      },
    ]);
    setIsInCart(true);

    // Notifica pizza aggiunta
    showModal(
      "🍕 Pizza aggiunta!",
      `${customPizzaName} è stata aggiunta al carrello!`,
      [
        { text: "Continua a ordinare" },
        {
          text: "Vai al carrello",
          onPress: () => router.push("/checkout"),
        },
      ]
    );
  };

  const handleGoToCart = () => {
    router.push("/checkout");
  };

  const toggleCustomizations = () => {
    setShowCustomizations(!showCustomizations);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con immagine */}
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: animationValue }] }}>
            {pizzaImage.startsWith("http") ? (
              <Image
                source={{ uri: pizzaImage }}
                style={styles.pizzaImageReal}
                resizeMode="cover"
              />
            ) : (
              <ThemedText style={styles.pizzaEmoji}>{pizzaImage}</ThemedText>
            )}
          </Animated.View>
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => router.back()}
          >
            <IconSymbol size={24} name="chevron.left" color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Dettagli pizza */}
        <View
          style={[
            styles.detailsContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <ThemedText type="title" style={styles.pizzaName}>
            {pizzaName}
          </ThemedText>
          <ThemedText
            type="subtitle"
            style={[styles.price, { color: colors.primary }]}
          >
            €{basePrice.toFixed(2)}
          </ThemedText>
          <ThemedText style={[styles.description, { color: colors.muted }]}>
            {pizzaFullDescription}
          </ThemedText>
        </View>

        {/* Sezione quantità */}
        <View
          style={[
            styles.quantitySection,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Quantità
          </ThemedText>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: "#ffeec9" }]}
              onPress={() => {
                const newQuantity = quantity - 1;
                setLocalQuantity(newQuantity);
              }}
              disabled={quantity <= 1}
            >
              <IconSymbol size={20} name="minus" color={colors.text} />
            </TouchableOpacity>

            <View
              style={[
                styles.quantityDisplay,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <ThemedText style={[styles.quantityText, { color: colors.text }]}>
                {quantity}
              </ThemedText>
            </View>

            <TouchableOpacity
              style={[
                styles.quantityButton,
                { backgroundColor: colors.secondary },
              ]}
              onPress={() => {
                const newQuantity = quantity + 1;
                setLocalQuantity(newQuantity);
              }}
              disabled={quantity >= 10}
            >
              <IconSymbol size={20} name="plus" color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sezione personalizzazioni */}
        <View
          style={[
            styles.customizationSection,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={styles.customizationHeader}
            onPress={toggleCustomizations}
          >
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
              Personalizzazioni
            </ThemedText>
            <IconSymbol
              size={20}
              name={showCustomizations ? "chevron.up" : "chevron.down"}
              color={colors.primary}
            />
          </TouchableOpacity>

          {showCustomizations && (
            <View style={styles.customizationList}>
              {customizations.map((customization) => (
                <TouchableOpacity
                  key={customization.id}
                  style={styles.customizationItem}
                  onPress={() => toggleCustomization(customization.id)}
                >
                  <View style={styles.customizationInfo}>
                    <ThemedText
                      style={[styles.customizationName, { color: colors.text }]}
                    >
                      {customization.name}
                    </ThemedText>
                    {customization.price > 0 && (
                      <ThemedText
                        style={[
                          styles.customizationPrice,
                          { color: colors.primary },
                        ]}
                      >
                        +€{customization.price.toFixed(2)}
                      </ThemedText>
                    )}
                  </View>
                  <Switch
                    value={customization.selected}
                    onValueChange={() => toggleCustomization(customization.id)}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={customization.selected ? "white" : colors.muted}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Note speciali */}
        <View
          style={[
            styles.notesSection,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Note speciali
          </ThemedText>
          <TextInput
            style={[
              styles.notesInput,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Aggiungi note speciali per la tua pizza..."
            placeholderTextColor={colors.muted}
            value={specialNotes}
            onChangeText={setSpecialNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Riepilogo ordine */}
        <View
          style={[
            styles.summarySection,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Riepilogo
          </ThemedText>
          <View style={styles.summaryItem}>
            <ThemedText style={[styles.summaryLabel, { color: colors.muted }]}>
              {pizzaName} x{quantity}
            </ThemedText>
            <ThemedText style={[styles.summaryPrice, { color: colors.text }]}>
              €{((basePrice + customizationPrice) * quantity).toFixed(2)}
            </ThemedText>
          </View>

          {customizations.filter((c) => c.selected).length > 0 && (
            <View style={styles.customizationSummary}>
              {customizations
                .filter((c) => c.selected)
                .map((customization) => (
                  <View key={customization.id} style={styles.summaryItem}>
                    <ThemedText
                      style={[styles.summaryLabel, { color: colors.muted }]}
                    >
                      + {customization.name}
                    </ThemedText>
                    <ThemedText
                      style={[styles.summaryPrice, { color: colors.text }]}
                    >
                      +€{(customization.price * quantity).toFixed(2)}
                    </ThemedText>
                  </View>
                ))}
            </View>
          )}

          <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
            <ThemedText style={[styles.totalLabel, { color: colors.text }]}>
              Totale
            </ThemedText>
            <ThemedText style={[styles.totalPrice, { color: colors.primary }]}>
              €{totalPrice.toFixed(2)}
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Pulsanti di azione fissi */}
      <View
        style={[
          styles.actionContainer,
          { backgroundColor: colors.card, borderTopColor: colors.border },
        ]}
      >
        {isInCart ? (
          <View style={styles.cartActions}>
            <TouchableOpacity
              style={[styles.cartButton, { backgroundColor: colors.secondary }]}
              onPress={handleGoToCart}
            >
              <IconSymbol size={20} name="cart.fill" color="white" />
              <ThemedText style={styles.cartButtonText}>
                Vai al carrello
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={handleAddToOrder}
            >
              <IconSymbol size={20} name="plus" color="white" />
              <ThemedText
                style={[
                  styles.addButtonText,
                  { backgroundColor: colors.primary },
                ]}
              >
                Aggiungi altro
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.orderButton, { backgroundColor: colors.primary }]}
            onPress={handleAddToOrder}
          >
            <IconSymbol size={20} name="plus" color="white" />
            <ThemedText style={styles.orderButtonText}>
              Aggiungi all'ordine - €{totalPrice.toFixed(2)}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
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
  imageContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  pizzaEmoji: {
    fontSize: 180,
    opacity: 1,
    textAlign: "center",
  },
  pizzaImageReal: {
    width: 318,
    height: 190,
    borderRadius: 30,
    marginTop: 110,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    borderRadius: 25,
    padding: 12,
    elevation: 4,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
  },
  detailsContainer: {
    padding: 24,
    margin: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  pizzaName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
  },

  // Sezioni
  quantitySection: {
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
  },
  customizationSection: {
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
  },
  notesSection: {
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
  },
  summarySection: {
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 100, // Spazio per i pulsanti fissi
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
  },

  // Titoli sezioni
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },

  // Controlli quantità
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  quantityDisplay: {
    width: 60,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  // Personalizzazioni
  customizationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customizationList: {
    marginTop: 16,
  },
  customizationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  customizationInfo: {
    flex: 1,
  },
  customizationName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  customizationPrice: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Note speciali
  notesInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 80,
  },

  // Riepilogo
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  customizationSummary: {
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 16,
    flex: 1,
  },
  summaryPrice: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    marginTop: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
  },

  // Pulsanti di azione
  actionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  orderButton: {
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    elevation: 3,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  orderButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cartActions: {
    flexDirection: "row",
    gap: 12,
  },
  cartButton: {
    flex: 1,
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 3,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cartButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    flex: 1,
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 3,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
