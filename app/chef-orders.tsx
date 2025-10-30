import { TabHeader } from '@/components/TabHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PizzaPrice } from '@/components/ui/pizza-price';
import { PizzaColors } from '@/constants/colors';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { OrderItem, useOrder } from '@/contexts/OrderContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePizzaModal } from '@/hooks/use-pizza-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, TouchableOpacity, useColorScheme as useRNColorScheme, View } from 'react-native';

type FilterType = 'pending' | 'completed';

export default function ChefOrdersScreen() {
  const [allOrders, setAllOrders] = useState<OrderItem[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('pending');
  const { chef, chefLogout, isChefAuthenticated } = useAuth();
  const { getAllOrders } = useOrder();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const rnColorScheme = useRNColorScheme();
  const { showModal, ModalComponent } = usePizzaModal();

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

  const loadOrders = useCallback(async () => {
    try {
      const orders = await getAllOrders();
      setAllOrders(orders);
    } catch (error) {
      console.error('Errore nel caricamento ordini:', error);
      Alert.alert('Errore', 'Impossibile caricare gli ordini');
    } finally {
      setIsLoading(false);
    }
  }, [getAllOrders]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    if (chef) {
      loadOrders();
    }
  }, [chef, loadOrders]);

  const handleLogout = () => {
    showModal('Logout', 'Sei sicuro di voler uscire?', [
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
    ]);
  };

  // Filtra gli ordini a seconda dello stato richiesto dal filtro (pending/completed)
  const getFilteredOrders = () => {
    return allOrders.filter(order => {
      // Un ordine è 'pending' se almeno un item è pending, 'completed' se tutti completati
      const hasPendingItems = order.some(item => item.status === 'pending');
      if (selectedFilter === 'pending') {
        return hasPendingItems;
      } else {
        return !hasPendingItems;
      }
    });
  };

  // Funzione per marcare tutti gli item di un ordine come completi (stato 'completed') e salvataggio su AsyncStorage
  const completeOrder = (orderIndex: number) => {
    setAllOrders(prev => {
      const updated = [...prev];
      updated[orderIndex] = updated[orderIndex].map(item => ({
        ...item,
        status: 'completed' as const
      }));
      // Salva lo stato dell'ordine aggiornato globalmente (accessibile da altri chef)
      try {
        const globalOrdersKey = 'globalOrders';
        AsyncStorage.setItem(globalOrdersKey, JSON.stringify(updated));
      } catch (error) {
        console.error('Errore nel salvataggio stato ordine:', error);
      }
      return updated;
    });
  };

  // Funzione per riportare un ordine da 'completed' a 'pending' (utile per test/reset demo)
  const markOrderAsPending = (orderIndex: number) => {
    setAllOrders(prev => {
      const updated = [...prev];
      updated[orderIndex] = updated[orderIndex].map(item => ({
        ...item,
        status: 'pending' as const
      }));
      try {
        const globalOrdersKey = 'globalOrders';
        AsyncStorage.setItem(globalOrdersKey, JSON.stringify(updated));
      } catch (error) {
        console.error('Errore nel salvataggio stato ordine:', error);
      }
      return updated;
    });
  };

  const renderOrderItem = ({ item, index: itemIndex }: { item: OrderItem; index: number }) => {
    const safePrice = item.price || 0;
    const safeQuantity = item.quantity || 0;
    const isPending = item.status === 'pending';
    
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

        {isPending && (
          <View style={styles.statusSection}>
            <ThemedText style={[styles.statusLabel, { color: colors.muted }]}>
              Stato: In Attesa
            </ThemedText>
          </View>
        )}
        {!isPending && (
          <View style={styles.statusSection}>
            <ThemedText style={[styles.statusLabel, { color: PizzaColors.success }]}>
              Stato: Completato
            </ThemedText>
          </View>
        )}
      </View>
    );
  };

  // Per ogni ordine mostriamo lista dettagliata, cliente, quantità, stato, ecc. e pulsanti azione
  const renderOrder = ({ item: order, index: orderIndex }: { item: OrderItem[]; index: number }) => {
    const userEmail = order[0]?.userEmail || 'Email non disponibile';
    const totalAmount = order.reduce((sum, item) => {
      const safePrice = item.price || 0;
      const safeQuantity = item.quantity || 0;
      return sum + (safePrice * safeQuantity);
    }, 0);

    // Verifica se l'ordine ha item in attesa o completati
    const hasPendingItems = order.some(item => item.status === 'pending');
    const isCompleted = !hasPendingItems;
    
    // Trova l'indice dell'ordine nell'array originale (non filtrato)
    // Usa un metodo più robusto: confronta l'email utente e il totale per trovare l'ordine corrispondente
    const originalOrderIndex = allOrders.findIndex(o => 
      o.length > 0 && 
      o[0]?.userEmail === order[0]?.userEmail &&
      o.length === order.length &&
      JSON.stringify(o.map(i => ({ id: i.id, quantity: i.quantity }))) === JSON.stringify(order.map(i => ({ id: i.id, quantity: i.quantity })))
    );
    
    // safeOrderIndex ottiene la posizione reale nell'array originale (per eventuali azioni di update)
    const safeOrderIndex = originalOrderIndex >= 0 ? originalOrderIndex : allOrders.findIndex(o => o === order);

    return (
      <View style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.orderHeader}>
          <ThemedText style={[styles.orderNumber, { color: colors.text }]}>
            Ordine #{safeOrderIndex + 1}
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
          renderItem={({ item, index }) => renderOrderItem({ item, index })}
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

        {/* Pulsante per completare l'ordine - mostra solo se l'ordine ha item in attesa */}
        {hasPendingItems && selectedFilter === 'pending' && (
          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: colors.primary }]}
            onPress={() => completeOrder(safeOrderIndex)}
          >
            <ThemedText style={styles.completeButtonText}>
              Segna come completato
            </ThemedText>
          </TouchableOpacity>
        )}

        {/* Pulsante per riportare a "in attesa" - mostra solo per ordini completati */}
        {isCompleted && selectedFilter === 'completed' && (
          <TouchableOpacity
            style={[styles.pendingButton, { backgroundColor: PizzaColors.warning }]}
            onPress={() => markOrderAsPending(safeOrderIndex)}
          >
            <ThemedText style={styles.pendingButtonText}>
              Contrassegna come in attesa
            </ThemedText>
          </TouchableOpacity>
        )}
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

  const filteredOrders = getFilteredOrders();

  const filters: { key: FilterType; label: string }[] = [
    { key: 'pending', label: 'In attesa' },
    { key: 'completed', label: 'Completati' },
  ];

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

      {/* Barra di filtri */}
      <View style={styles.filterBar}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  selectedFilter === filter.key 
                    ? colors.primary 
                    : rnColorScheme === 'dark' 
                      ? colors.background 
                      : 'white',
                borderColor:
                  selectedFilter === filter.key
                    ? colors.primary
                    : colors.border,
              },
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <ThemedText
              style={[
                styles.filterLabel,
                {
                  color:
                    selectedFilter === filter.key 
                      ? 'white' 
                      : colors.text,
                  fontWeight: selectedFilter === filter.key ? '600' : '400',
                },
              ]}
            >
              {filter.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
              {selectedFilter === 'pending' 
                ? 'Nessun ordine in attesa' 
                : 'Nessun ordine completato'}
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: colors.muted }]}>
              {selectedFilter === 'pending'
                ? 'Gli ordini dei clienti appariranno qui quando effettueranno i loro acquisti'
                : 'Non ci sono ancora ordini completati'}
            </ThemedText>
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
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
      <ModalComponent />
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
  filterBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...PizzaColors.shadows.small,
  },
  filterLabel: {
    fontSize: 16,
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
  completeButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...PizzaColors.shadows.medium,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  pendingButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...PizzaColors.shadows.medium,
  },
  pendingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
