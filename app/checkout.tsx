import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useOrder } from '@/contexts/OrderContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Platform, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

// Array delle pizze per ottenere le immagini
const pizzas = [
  { id: '1', name: 'Pizza Margherita', image: '🍕' },
  { id: '2', name: 'Pizza Quattro Stagioni', image: '🍕' },
  { id: '3', name: 'Pizza Diavola', image: '🍕' },
  { id: '4', name: 'Pizza Capricciosa', image: '🍕' },
  { id: '5', name: 'Pizza Marinara', image: '🍕' },
  { id: '6', name: 'Pizza Bufala', image: '🍕' },
  { id: '7', name: 'Pizza Prosciutto e Funghi', image: '🍕' },
  { id: '8', name: 'Pizza Quattro Formaggi', image: '🍕' },
  { id: '9', name: 'Pizza Ortolana', image: '🍕' },
  { id: '10', name: 'Pizza Bresaola e Rucola', image: '🍕' },
  { id: '11', name: 'Pizza Tonno e Cipolle', image: '🍕' },
  { id: '12', name: 'Pizza Salsiccia e Friarielli', image: '🍕' },
  { id: '13', name: 'Pizza Patate e Salsiccia', image: '🍕' },
  { id: '14', name: 'Pizza Parma e Rucola', image: '🍕' },
  { id: '15', name: 'Pizza Tartufo e Porcini', image: '🍕' },
  { id: '16', name: 'Pizza Gamberi e Zucchine', image: '🍕' },
  { id: '17', name: 'Pizza Speck e Asiago', image: '🍕' },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { orders, confirmOrder, updateQuantity, removeFromOrder, clearOrder } = useOrder();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Calcola il totale dell'ordine
  const totalPrice = orders.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Funzione per ottenere l'immagine della pizza
  const getPizzaImage = (pizzaId: string) => {
    const pizza = pizzas.find(p => p.id === pizzaId);
    return pizza ? pizza.image : '🍕';
  };

  const handleConfirmOrder = () => {
    if (!orders || orders.length === 0) {
      Alert.alert('Carrello vuoto', 'Non ci sono pizze da ordinare.');
      return;
    }

    const goToOrders = () => {
      router.dismiss();
      router.push('/ordini');
    };

    if (Platform.OS === 'web') {
      window.alert('Ordine confermato');
      confirmOrder().then(goToOrders);
      return;
    }

    Alert.alert('Ordine confermato', undefined, [
      {
        text: 'OK',
        onPress: async () => {
          await confirmOrder();
          goToOrders();
        },
      },
    ], { cancelable: false });
  };

  const handleClearCart = () => {
    if (orders.length === 0) {
      Alert.alert('Carrello vuoto', 'Il carrello è già vuoto.');
      return;
    }

    Alert.alert(
      'Svuota carrello',
      'Sei sicuro di voler svuotare il carrello? Questa azione non può essere annullata.',
      [
        { text: 'Annulla', style: 'cancel' },
        { 
          text: 'Svuota', 
          style: 'destructive',
          onPress: () => clearOrder()
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>🛒 Carrello</ThemedText>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: colors.border }]}
          onPress={() => router.dismiss()}
        >
          <IconSymbol size={20} name="xmark" color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {orders.length === 0 ? (
          <View style={[styles.emptyCart, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ThemedText style={[styles.emptyCartText, { color: colors.muted }]}>Il tuo carrello è vuoto.</ThemedText>
            <ThemedText style={[styles.emptyCartSubtext, { color: colors.muted }]}>Aggiungi alcune pizze per iniziare!</ThemedText>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.orderItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.pizzaImage, { backgroundColor: colors.background }]}>
                  <ThemedText style={styles.pizzaEmoji}>{getPizzaImage(item.id)}</ThemedText>
                </View>
                
                <View style={styles.itemInfo}>
                  <ThemedText style={[styles.itemName, { color: colors.text }]}>
                    {item.name}
                  </ThemedText>
                  <ThemedText style={[styles.itemPrice, { color: colors.primary }]}>
                    €{(item.price * item.quantity).toFixed(2)}
                  </ThemedText>
                </View>
                
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={[styles.quantityButton, { backgroundColor: colors.border }]}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <IconSymbol size={16} name="minus" color={colors.text} />
                  </TouchableOpacity>
                  
                  <ThemedText style={[styles.quantityText, { color: colors.text }]}>
                    {item.quantity}
                  </ThemedText>
                  
                  <TouchableOpacity
                    style={[styles.quantityButton, { backgroundColor: colors.primary }]}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <IconSymbol size={16} name="plus" color="white" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.removeButton, { backgroundColor: colors.error }]}
                    onPress={() => removeFromOrder(item.id)}
                  >
                    <IconSymbol size={16} name="trash" color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          />
        )}
      </View>

      {orders.length > 0 && (
        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: colors.error, borderColor: colors.error }]}
          onPress={handleClearCart}
        >
          <ThemedText style={styles.clearButtonText}>
            Svuota carrello
          </ThemedText>
        </TouchableOpacity>
      )}

      {orders.length > 0 && (
        <TouchableOpacity
          style={[styles.confirmButton, { backgroundColor: colors.primary }]}
          onPress={handleConfirmOrder}
        >
          <ThemedText style={styles.confirmButtonText}>
            Conferma ordine - €{totalPrice.toFixed(2)}
          </ThemedText>
        </TouchableOpacity>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  emptyCart: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 14,
  },
  orderItem: { 
    padding: 16, 
    borderBottomWidth: 1, 
    width: '100%',
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 0,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pizzaImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pizzaEmoji: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  confirmButton: {
    padding: 18,
    borderRadius: 16,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  confirmButtonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  clearButton: {
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});


