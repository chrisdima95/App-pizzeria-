import { TabHeader } from '@/components/TabHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PizzaPrice } from '@/components/ui/pizza-price';
import { PizzaColors } from '@/constants/colors';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { OrderItem, useOrder } from '@/contexts/OrderContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ChefOrdersScreen() {
  const [allOrders, setAllOrders] = useState<OrderItem[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { chef, chefLogout, isChefAuthenticated } = useAuth();
  const { getAllOrders } = useOrder();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Verifica che l'utente sia un chef (ma non mostrare modale durante logout)
  useEffect(() => {
    if (!isChefAuthenticated || !chef) {
      if (!isLoggingOut) {
        Alert.alert('Accesso Negato', 'Solo i Chef possono accedere a questa pagina');
      }
      router.replace('/(tabs)/chef');
      return;
    }
  }, [isChefAuthenticated, chef, isLoggingOut]);

  const loadOrders = async () => {
    try {
      const orders = await getAllOrders();
      setAllOrders(orders);
    } catch (error) {
      console.error('Errore nel caricamento ordini:', error);
      Alert.alert('Errore', 'Impossibile caricare gli ordini');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    if (chef) {
      loadOrders();
    }
  }, [chef]);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Sei sicuro di voler uscire?',
      [
        { text: 'Annulla', style: 'cancel' },
        { 
          text: 'Esci', 
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            await chefLogout();
            router.replace('/(tabs)/chef');
          }
        }
      ]
    );
  };

  const updateOrderStatus = (orderIndex: number, itemIndex: number, newStatus: OrderItem['status']) => {
    setAllOrders(prev => {
      const updated = [...prev];
      updated[orderIndex] = [...updated[orderIndex]];
      updated[orderIndex][itemIndex] = {
        ...updated[orderIndex][itemIndex],
        status: newStatus
      };
      
      // Salva anche negli ordini globali
      try {
        const globalOrdersKey = 'globalOrders';
        AsyncStorage.setItem(globalOrdersKey, JSON.stringify(updated));
      } catch (error) {
        console.error('Errore nel salvataggio stato ordine:', error);
      }
      
      return updated;
    });
  };

  const getStatusColor = (status: OrderItem['status']) => {
    switch (status) {
      case 'pending': return PizzaColors.warning;
      case 'preparing': return PizzaColors.info;
      case 'ready': return PizzaColors.success;
      case 'delivered': return PizzaColors.gray[500];
      default: return colors.text;
    }
  };

  const getStatusText = (status: OrderItem['status']) => {
    switch (status) {
      case 'pending': return 'In Attesa';
      case 'preparing': return 'In Preparazione';
      case 'ready': return 'Pronto';
      case 'delivered': return 'Consegnato';
      default: return status;
    }
  };

  const renderOrderItem = ({ item, index: itemIndex, orderIndex }: { item: OrderItem; index: number; orderIndex: number }) => {
    const safePrice = item.price || 0;
    const safeQuantity = item.quantity || 0;
    
    return (
      <View style={[styles.orderItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.itemMainContent}>
          <View style={styles.itemInfo}>
            <ThemedText style={[styles.itemName, { color: colors.text }]}>
              {item.name || 'Nome non disponibile'}
            </ThemedText>
            <View style={styles.itemDetails}>
              <ThemedText style={[styles.itemQuantity, { color: colors.muted }]}>
                Quantità: {safeQuantity}
              </ThemedText>
              <PizzaPrice price={safePrice * safeQuantity} size="medium" />
            </View>
          </View>
        </View>

        <View style={styles.statusSection}>
          <ThemedText style={[styles.statusLabel, { color: colors.muted }]}>Stato:</ThemedText>
          <View style={styles.statusButtons}>
            {(['pending', 'preparing', 'ready', 'delivered'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  { 
                    backgroundColor: item.status === status ? getStatusColor(status) : 'transparent',
                    borderColor: getStatusColor(status)
                  }
                ]}
                onPress={() => updateOrderStatus(orderIndex, itemIndex, status)}
              >
                <ThemedText 
                  style={[
                    styles.statusButtonText, 
                    { 
                      color: item.status === status ? 'white' : getStatusColor(status)
                    }
                  ]}
                >
                  {getStatusText(status)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderOrder = ({ item: order, index: orderIndex }: { item: OrderItem[]; index: number }) => {
    const userEmail = order[0]?.userEmail || 'Email non disponibile';
    const totalAmount = order.reduce((sum, item) => {
      const safePrice = item.price || 0;
      const safeQuantity = item.quantity || 0;
      return sum + (safePrice * safeQuantity);
    }, 0);

    return (
      <View style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.orderHeader}>
          <ThemedText style={[styles.orderNumber, { color: colors.text }]}>
            Ordine #{orderIndex + 1}
          </ThemedText>
          <View style={styles.clientSection}>
            <ThemedText style={[styles.clientLabel, { color: colors.muted }]}>
              Cliente:
            </ThemedText>
            <ThemedText style={[styles.clientEmail, { color: colors.primary }]}>
              {userEmail}
            </ThemedText>
          </View>
        </View>
        
        <FlatList
          data={order}
          renderItem={({ item, index }) => renderOrderItem({ item, index, orderIndex })}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        />
        
        <View style={styles.orderFooter}>
          <ThemedText style={[styles.totalLabel, { color: colors.text }]}>
            Totale Ordine:
          </ThemedText>
          <PizzaPrice price={totalAmount} size="large" />
        </View>
      </View>
    );
  };

  if (!chef || isLoggingOut) {
    return null;
  }

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={[styles.loadingText, { color: colors.text }]}>
          Caricamento ordini...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <TabHeader 
        title="Gestione Ordini" 
        subtitle="Gestisci gli ordini dei clienti"
        showMascotte={false}
      />
      
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleLogout}
        >
          <ThemedText style={[styles.logoutButtonText, { color: colors.text }]}>
            Logout
          </ThemedText>
        </TouchableOpacity>
      </View>

      {allOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
              Nessun ordine disponibile
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: colors.muted }]}>
              Gli ordini dei clienti appariranno qui quando effettueranno i loro acquisti
            </ThemedText>
          </View>
        </View>
      ) : (
        <FlatList
          data={allOrders}
          renderItem={renderOrder}
          keyExtractor={(_, index) => `order-${index}`}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.orderSeparator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: PizzaColors.gray[600],
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    ...PizzaColors.shadows.small,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 16,
    borderWidth: 1,
    ...PizzaColors.shadows.medium,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  orderSeparator: {
    height: 20,
  },
  orderCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    ...PizzaColors.shadows.medium,
  },
  orderHeader: {
    marginBottom: 20,
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  clientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clientLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  clientEmail: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: PizzaColors.gray[200],
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemSeparator: {
    height: 16,
  },
  orderItem: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    ...PizzaColors.shadows.small,
  },
  itemMainContent: {
    marginBottom: 16,
  },
  itemInfo: {
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 15,
    fontWeight: '500',
  },
  statusSection: {
    marginTop: 0,
  },
  statusLabel: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '600',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    minWidth: 100,
    alignItems: 'center',
    ...PizzaColors.shadows.small,
  },
  statusButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});