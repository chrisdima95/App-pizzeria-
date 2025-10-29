import { ChefRecommendation } from "@/components/ChefRecommendation";
import { TabHeader } from "@/components/TabHeader";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useOrder } from "@/contexts/OrderContext";
import pizzasData from "@/data/pizzas.json";
import { useTransitionAnimations } from "@/hooks/use-transition-animations";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

interface Pizza {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  ingredients: string[];
  fullDescription: string;
  category: "rosse" | "bianche" | "speciali";
  nutrition: {
    calories: string;
    carbs: string;
    protein: string;
    fat: string;
  };
}

const pizzas: Pizza[] = pizzasData as Pizza[];

type PizzaCategory = "rosse" | "bianche" | "speciali";

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const cardBg = colors.card;
  const accentBg = colorScheme === "dark" ? colors.border : colors.background;

  const { orders, addToOrder, updateQuantity, removeFromOrder } = useOrder();

  // Calcola il totale degli articoli nel carrello
  const totalItems = orders.reduce((total, item) => total + item.quantity, 0);

  const [selectedCategory, setSelectedCategory] =
    useState<PizzaCategory>("rosse");

  // Hook per le animazioni di transizione (senza mascotte)
  const {
    startAnimations,
    backgroundAnimatedStyle,
  } = useTransitionAnimations();

  // Avvia le animazioni quando il componente viene montato
  useEffect(() => {
    // Piccolo delay per permettere alla transizione di completarsi
    const timer = setTimeout(() => {
      startAnimations();
    }, 100);

    return () => clearTimeout(timer);
  }, [startAnimations]);

  // Pizza consigliata dinamica - cambia casualmente ad ogni avvio dell'app
  const getChefRecommendation = () => {
    // Genera un numero casuale per ogni avvio dell'app
    const randomIndex = Math.floor(Math.random() * pizzas.length);

    return pizzas[randomIndex];
  };

  const chefRecommendation = getChefRecommendation();

  const categories: { key: PizzaCategory; label: string }[] = [
    { key: "rosse", label: "Rosse" },
    { key: "bianche", label: "Bianche" },
    { key: "speciali", label: "Speciali" },
  ];

  const filteredPizzas = pizzas.filter(
    (pizza) => pizza.category === selectedCategory
  );

  const getPizzaQuantity = (pizzaId: string) => {
    // Mostra solo la quantità delle pizze NORMALI (base, senza modifiche)
    const baseOrder = orders.find((order) => order.id === pizzaId);
    return baseOrder ? baseOrder.quantity : 0;
  };

  const handleAddPizza = (pizza: Pizza) => {
    // Dal menu si aggiunge sempre la versione BASE senza personalizzazioni
    // Usa solo il pizza.id (non gli ID univoci della pagina dettagli)
    const existingOrder = orders.find((order) => order.id === pizza.id);

    if (existingOrder) {
      // Se esiste già una pizza base identica, aumenta la quantità
      updateQuantity(existingOrder.id, existingOrder.quantity + 1);
    } else {
      // Se non esiste, aggiungi un nuovo ordine con ID base
      addToOrder({
        id: pizza.id,
        name: pizza.name,
        price: parseFloat(pizza.price),
        quantity: 1,
      });
    }
  };

  const handleUpdateQuantity = (pizzaId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(pizzaId);
    } else {
      // Trova l'ordine con questo ID esatto
      const existingOrder = orders.find((order) => order.id === pizzaId);
      if (existingOrder) {
        updateQuantity(existingOrder.id, quantity);
      }
    }
  };

  const handlePizzaPress = (pizza: Pizza) => {
    router.push({
      pathname: "/pizza-details",
      params: {
        id: pizza.id,
        name: pizza.name,
        price: pizza.price,
        description: pizza.description,
        fullDescription: pizza.fullDescription,
        ingredients: JSON.stringify(pizza.ingredients),
        nutrition: JSON.stringify(pizza.nutrition),
        image: pizza.image,
      },
    });
  };

  const handleCartPress = () => {
    router.push("/checkout");
  };

  const renderPizzaItem = ({ item, index }: { item: Pizza; index: number }) => {
    const quantity = getPizzaQuantity(item.id);
    // Limita l'indice a 4 (0-4) per evitare errori con le animazioni
    // Animazioni per-card non utilizzate al momento

    return (
      <Animated.View
        style={[
          styles.pizzaCard,
          {
            backgroundColor: cardBg,
            borderColor: colors.border,
            pointerEvents: "auto",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.pizzaMainContent}
          onPress={() => handlePizzaPress(item)}
        >
          <View style={[styles.pizzaImage, { backgroundColor: accentBg }]}>
            {item.image.startsWith("http") ? (
              <Image
                source={{ uri: item.image }}
                style={styles.pizzaImageReal}
                resizeMode="cover"
              />
            ) : (
              <ThemedText style={styles.pizzaEmoji}>{item.image}</ThemedText>
            )}
          </View>
          <View style={styles.pizzaInfo}>
            {/* Titolo su riga intera */}
            <ThemedText
              type="subtitle"
              style={styles.pizzaName}
              numberOfLines={2}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.8}
              allowFontScaling={true}
              textBreakStrategy="simple"
            >
              {item.name}
            </ThemedText>

            {/* Prezzo e controlli quantità sotto */}
            <View style={styles.priceAndControls}>
              <ThemedText style={[styles.pizzaPrice, { color: colors.error }]}>
                €{item.price}
              </ThemedText>

              {/* Controlli di quantità */}
              <View style={styles.quantityControls}>
                {quantity === 0 ? (
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() => handleAddPizza(item)}
                  >
                    <ThemedText style={styles.addButtonText}>
                      + Aggiungi
                    </ThemedText>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.quantityRow}>
                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        {
                          backgroundColor: colors.secondary,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() =>
                        handleUpdateQuantity(item.id, quantity - 1)
                      }
                    >
                      <IconSymbol size={16} name="minus" color="white" />
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
                      <ThemedText
                        style={[styles.quantityText, { color: colors.text }]}
                      >
                        {quantity}
                      </ThemedText>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        { backgroundColor: colors.secondary },
                      ]}
                      onPress={() =>
                        handleUpdateQuantity(item.id, quantity + 1)
                      }
                    >
                      <IconSymbol size={16} name="plus" color="white" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.background },
        backgroundAnimatedStyle,
      ]}
    >
      <TabHeader />

      {/* Barra di selezione categorie animata */}
      <Animated.View style={[styles.categoryBar]}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryButton,
              {
                backgroundColor:
                  selectedCategory === category.key 
                    ? colors.primary 
                    : colorScheme === "dark" 
                      ? colors.background 
                      : "white",
                borderColor:
                  selectedCategory === category.key
                    ? colors.primary
                    : colors.border,
              },
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <ThemedText
              style={[
                styles.categoryLabel,
                {
                  color:
                    selectedCategory === category.key 
                      ? "white" 
                      : colorScheme === "dark" 
                        ? colors.text 
                        : colors.text,
                  fontWeight: selectedCategory === category.key ? "600" : "400",
                },
              ]}
            >
              {category.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Specialità dello Chef */}
      <ChefRecommendation pizza={chefRecommendation} />

      <FlatList
        data={filteredPizzas}
        renderItem={renderPizzaItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.pizzasList}
        showsVerticalScrollIndicator={false}
      />

      {/* Pulsante carrello flottante animato */}
      {totalItems > 0 && (
        <Animated.View>
          <TouchableOpacity
            style={[
              styles.floatingCartButton,
              { backgroundColor: colors.secondary },
            ]}
            onPress={handleCartPress}
            activeOpacity={0.8}
          >
            <IconSymbol size={24} name="cart.fill" color="white" />
            <View style={[styles.cartBadge, { backgroundColor: colors.secondary }]}>
              <ThemedText style={styles.cartBadgeText}>
                {totalItems > 99 ? "99+" : totalItems}
              </ThemedText>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pizzasList: {
    padding: 20,
    // Su iOS i margini negativi causano che la prima card venga tagliata sotto i pulsanti
    // Evitiamo il marginTop negativo solo su iOS
    marginTop: Platform.OS === "ios" ? 0 : -14,
  },
  pizzaCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0px 4px 8px rgba(229, 62, 62, 0.1)",
    elevation: 4,
    borderWidth: 1,
    // Evitiamo l'offset negativo della prima card su iOS
    marginTop: Platform.OS === "ios" ? 0 : -5,
  },
  pizzaMainContent: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 100,
  },
  pizzaImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  pizzaEmoji: {
    fontSize: 30,
  },
  pizzaImageReal: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  pizzaInfo: {
    flex: 1,
  },
  pizzaName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    minHeight: 40,
  },
  pizzaPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chevron: {
    marginLeft: 10,
  },
  categoryBar: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
  },
  categoryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 2,
  },
  categoryLabel: {
    fontSize: 16.9,
    textAlign: "center",
  },
  priceAndControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -15,
  },
  quantityControls: {
    alignItems: "flex-end",
  },
  addButton: {
    height: 32,
    paddingVertical: 0,
    paddingHorizontal: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    elevation: 1,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  quantityDisplay: {
    minWidth: 40,
    minHeight: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalQuantityText: {
    fontSize: 9,
    fontStyle: "italic",
    marginTop: 1,
  },
  floatingCartButton: {
    position: "absolute",
    bottom: 0, // Posizionato più in basso, vicino alla tab bar
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1002,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 12,
    includeFontPadding: false,
  },
});
