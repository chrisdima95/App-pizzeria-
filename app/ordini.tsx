import { TabHeader } from "@/components/TabHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useOrder } from "@/contexts/OrderContext";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface OrderGroup {
  id: string;
  orders: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    status: "pending" | "confirmed" | "preparing" | "ready" | "delivered";
  }[];
  date: string;
  total: number;
}


export default function OrdiniScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user, isAuthenticated } = useAuth();
  const { completedOrders } = useOrder();

  // Trasforma completedOrders in OrderGroup per la visualizzazione
  const orderGroups: OrderGroup[] = completedOrders.map((orderGroup, index) => {
    const total = orderGroup.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return {
      id: `group_${index}`,
      orders: orderGroup,
      date: new Date().toLocaleDateString("it-IT"),
      total,
    };
  });

  // Se non autenticato, mostra un messaggio
  if (!isAuthenticated || !user) {
    return (
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.authRequiredContainer}>
          <ThemedText
            type="title"
            style={[styles.title, { color: colors.text }]}
          >
            📋 I tuoi ordini
          </ThemedText>
          <View
            style={[
              styles.authRequiredCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <ThemedText
              style={[styles.authRequiredText, { color: colors.muted }]}
            >
              Devi essere autenticato per vedere i tuoi ordini
            </ThemedText>
            <ThemedText
              style={[
                styles.authRequiredSubtext,
                { color: colors.muted },
              ]}
            >
              Accedi o registrati per visualizzare la cronologia degli ordini
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    );
  }

  const renderOrderGroup = ({ item }: { item: OrderGroup }) => (
    <View
      style={[
        styles.orderCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.primary,
        },
      ]}
    >
      <View style={styles.orderContent}>
        <ThemedText
          type="subtitle"
          style={[styles.orderDate, { color: colors.text }]}
        >
          Ordine del {item.date}
        </ThemedText>

        <View style={styles.orderItemsContainer}>
          {item.orders.map((order) => (
            <View key={order.id} style={styles.orderItem}>
              <View style={styles.orderItemLeft}>
                <ThemedText 
                  style={[styles.orderName, { color: colors.text }]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {order.name} x{order.quantity}
                </ThemedText>
              </View>
              <View style={styles.orderItemRight}>
                <ThemedText style={[styles.orderPrice, { color: colors.primary }]}>
                  €{(order.price * order.quantity).toFixed(2)}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totalContainer}>
          <ThemedText style={[styles.orderTotal, { color: colors.primary }]}>
            Totale: €{item.total.toFixed(2)}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <TabHeader title="I tuoi ordini" showMascotte={false} />

      {/* Pulsante Nuovo Ordine */}
      <View style={styles.newOrderContainer}>
        <TouchableOpacity
          style={[
            styles.newOrderButton,
            {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => router.push("/(tabs)")}
        >
          <IconSymbol size={18} name="plus" color="white" />
          <ThemedText
            style={[styles.newOrderText, { color: "white" }]}
          >
            Nuovo ordine
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      {orderGroups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText
            style={[styles.emptyText, { color: colors.muted }]}
          >
            Non hai ancora effettuato ordini
          </ThemedText>
          <ThemedText
            style={[styles.emptySubtext, { color: colors.muted }]}
          >
            Vai al menu per iniziare a ordinare!
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={orderGroups}
          renderItem={renderOrderGroup}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  newOrderContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: "flex-end",
  },
  newOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  newOrderText: {
    fontSize: 14,
    fontWeight: "600",
  },
  ordersList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  orderCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  orderContent: {
    gap: 12,
  },
  orderDate: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  totalContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    alignItems: "flex-end",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  orderItemsContainer: {
    gap: 8,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
  },
  orderItemLeft: {
    flex: 1,
    marginRight: 12,
  },
  orderItemRight: {
    minWidth: 80,
    alignItems: "flex-end",
  },
  orderName: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  authRequiredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  authRequiredCard: {
    alignItems: "center",
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: 400,
  },
  authRequiredText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  authRequiredSubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
