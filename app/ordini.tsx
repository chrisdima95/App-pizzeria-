import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import { usePizzaColors } from '@/hooks/use-pizza-theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

interface OrderGroup {
  id: string;
  orders: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  }>;
  date: string;
  total: number;
}

const getStatusText = (status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered') => {
  switch (status) {
    case 'pending': return 'In attesa';
    case 'confirmed': return 'Confermato';
    case 'preparing': return 'In preparazione';
    case 'ready': return 'Pronto';
    case 'delivered': return 'Consegnato';
    default: return 'Sconosciuto';
  }
};

const getStatusColor = (status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered') => {
  switch (status) {
    case 'pending': return '#FF9500';
    case 'confirmed': return '#007AFF';
    case 'preparing': return '#FF3B30';
    case 'ready': return '#34C759';
    case 'delivered': return '#8E8E93';
    default: return '#8E8E93';
  }
};

export default function OrdiniScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = usePizzaColors();
  const { user, isAuthenticated } = useAuth();
  const { completedOrders } = useOrder();
  const isDark = colorScheme === 'dark';

  // Trasforma completedOrders in OrderGroup per la visualizzazione
  const orderGroups: OrderGroup[] = completedOrders.map((orderGroup, index) => {
    const total = orderGroup.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
      id: `group_${index}`,
      orders: orderGroup,
      date: new Date().toLocaleDateString('it-IT'),
      total
    };
  });

  // Se non autenticato, mostra un messaggio
  if (!isAuthenticated || !user) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.authRequiredContainer}>
          <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
            📋 I tuoi ordini
          </ThemedText>
          <View style={[styles.authRequiredCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ThemedText style={[styles.authRequiredText, { color: colors.textSecondary }]}>
              Devi essere autenticato per vedere i tuoi ordini
            </ThemedText>
            <ThemedText style={[styles.authRequiredSubtext, { color: colors.textSecondary }]}>
              Accedi o registrati per visualizzare la cronologia degli ordini
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    );
  }

  const renderOrderGroup = ({ item }: { item: OrderGroup }) => (
    <ThemedView style={[
      styles.orderCard, 
      { 
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: colors.primary
      }
    ]}>
      <ThemedView style={styles.orderContent}>
        <ThemedText type="subtitle" style={[styles.orderDate, { color: colors.text }]}>
          Ordine del {item.date}
        </ThemedText>
        <ThemedText style={[styles.orderTotal, { color: colors.primary }]}>
          Totale: €{item.total.toFixed(2)}
        </ThemedText>
        
        {item.orders.map((order) => (
          <View key={order.id} style={styles.orderItem}>
            <ThemedText style={[styles.orderName, { color: colors.text }]}>
              {order.name} x{order.quantity}
            </ThemedText>
            <ThemedText style={[styles.orderPrice, { color: colors.primary }]}>
              €{(order.price * order.quantity).toFixed(2)}
            </ThemedText>
          </View>
        ))}
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol size={24} name="chevron.left" color={colors.primary} />
        </TouchableOpacity>
        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
          📋 I tuoi ordini
        </ThemedText>
        <TouchableOpacity 
          style={[styles.newOrderButton, { 
            backgroundColor: colors.surface,
            borderColor: colors.border 
          }]}
          onPress={() => router.push('/(tabs)/')}
        >
          <IconSymbol size={20} name="plus" color={colors.primary} />
          <ThemedText style={[styles.newOrderText, { color: colors.primary }]}>Nuovo ordine</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Orders List */}
      {orderGroups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
            Non hai ancora effettuato ordini
          </ThemedText>
          <ThemedText style={[styles.emptySubtext, { color: colors.textSecondary }]}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  newOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  newOrderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  ordersList: {
    padding: 20,
    gap: 16,
  },
  orderCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  orderContent: {
    gap: 6,
  },
  orderName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderQuantity: {
    fontSize: 14,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  orderPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  authRequiredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  authRequiredCard: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: 400,
  },
  authRequiredText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  authRequiredSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
