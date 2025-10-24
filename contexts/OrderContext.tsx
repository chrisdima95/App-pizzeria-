import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

// Aggiungiamo il campo status
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered'; // status possibile
}

interface OrderContextType {
  orders: OrderItem[];
  completedOrders: OrderItem[][]; // lista di ordini confermati (ogni elemento è uno "snapshot" del carrello)
  redeemedOffers: string[]; // lista degli ID delle offerte riscattate
  addToOrder: (item: Omit<OrderItem, 'status'>) => void; // non serve specificare lo status quando si aggiunge
  updateQuantity: (id: string, quantity: number) => void; // aggiorna la quantità di un ordine
  removeFromOrder: (id: string) => void; // rimuove completamente un ordine
  clearOrder: () => void;
  confirmOrder: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [completedOrders, setCompletedOrders] = useState<OrderItem[][]>([]);
  const [redeemedOffers, setRedeemedOffers] = useState<string[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Funzione per ottenere le chiavi specifiche per l'utente
  const getUserStorageKeys = (userId: string) => ({
    orders: `orders_${userId}`,
    ordersHistory: `ordersHistory_${userId}`,
    redeemedOffers: `redeemedOffers_${userId}`
  });

  // Carica ordini e storico all'avvio o quando cambia l'utente
  useEffect(() => {
    const loadPersistedOrders = async () => {
      if (!isAuthenticated || !user) {
        // Se non autenticato, svuota tutto
        setOrders([]);
        setCompletedOrders([]);
        setRedeemedOffers([]);
        return;
      }

      try {
        const { orders: ordersKey, ordersHistory: historyKey, redeemedOffers: offersKey } = getUserStorageKeys(user.id);
        const [ordersJson, historyJson, offersJson] = await Promise.all([
          AsyncStorage.getItem(ordersKey),
          AsyncStorage.getItem(historyKey),
          AsyncStorage.getItem(offersKey),
        ]);
        
        if (ordersJson) {
          const parsed: OrderItem[] = JSON.parse(ordersJson);
          if (Array.isArray(parsed)) {
            setOrders(parsed);
          }
        } else {
          setOrders([]);
        }
        
        if (historyJson) {
          const parsedHistory: OrderItem[][] = JSON.parse(historyJson);
          if (Array.isArray(parsedHistory)) {
            setCompletedOrders(parsedHistory);
          }
        } else {
          setCompletedOrders([]);
        }
        
        if (offersJson) {
          const parsedOffers: string[] = JSON.parse(offersJson);
          if (Array.isArray(parsedOffers)) {
            setRedeemedOffers(parsedOffers);
          }
        } else {
          setRedeemedOffers([]);
        }
      } catch (e) {
        console.error('Errore nel caricamento ordini da AsyncStorage', e);
        setOrders([]);
        setCompletedOrders([]);
        setRedeemedOffers([]);
      }
    };
    loadPersistedOrders();
  }, [user, isAuthenticated]);

  // Salva carrello su storage a ogni modifica
  useEffect(() => {
    const persistOrders = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        const { orders: ordersKey } = getUserStorageKeys(user.id);
        await AsyncStorage.setItem(ordersKey, JSON.stringify(orders));
      } catch (e) {
        console.error('Errore nel salvataggio ordini su AsyncStorage', e);
      }
    };
    persistOrders();
  }, [orders, user, isAuthenticated]);

  // Salva storico su storage a ogni modifica
  useEffect(() => {
    const persistHistory = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        const { ordersHistory: historyKey } = getUserStorageKeys(user.id);
        await AsyncStorage.setItem(historyKey, JSON.stringify(completedOrders));
      } catch (e) {
        console.error('Errore nel salvataggio storico ordini su AsyncStorage', e);
      }
    };
    persistHistory();
  }, [completedOrders, user, isAuthenticated]);

  // Salva offerte riscattate su storage a ogni modifica
  useEffect(() => {
    const persistRedeemedOffers = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        const { redeemedOffers: offersKey } = getUserStorageKeys(user.id);
        await AsyncStorage.setItem(offersKey, JSON.stringify(redeemedOffers));
      } catch (e) {
        console.error('Errore nel salvataggio offerte riscattate su AsyncStorage', e);
      }
    };
    persistRedeemedOffers();
  }, [redeemedOffers, user, isAuthenticated]);

  const addToOrder = (item: Omit<OrderItem, 'status'>) => {
    setOrders((prev) => {
      const existing = prev.find((o) => o.id === item.id);
      if (existing) {
        // Se esiste già, aumenta solo la quantità
        return prev.map((o) =>
          o.id === item.id
            ? { ...o, quantity: o.quantity + item.quantity }
            : o
        );
      }
      // Aggiunge il nuovo ordine con status 'pending'
      return [...prev, { ...item, status: 'pending' }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(id);
      return;
    }
    
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, quantity } : o
      )
    );
  };

  const removeFromOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const clearOrder = () => setOrders([]);

  const confirmOrder = async () => {
    if (!orders.length) return;
    
    // Identifica le offerte nell'ordine corrente
    const offerIds = ['o1', 'o2', 'o3', 'o4']; // ID delle offerte disponibili
    const offersInOrder = orders.filter(order => offerIds.includes(order.id));
    
    // Aggiunge le offerte riscattate alla lista
    if (offersInOrder.length > 0) {
      const newRedeemedOffers = offersInOrder.map(offer => offer.id);
      setRedeemedOffers(prev => [...new Set([...prev, ...newRedeemedOffers])]);
    }
    
    // aggiunge lo snapshot corrente degli ordini nello storico
    setCompletedOrders((prev) => [...prev, orders.map((o) => ({ ...o }))]);
    // svuota il carrello
    setOrders([]);
  };

  return (
    <OrderContext.Provider value={{ orders, completedOrders, redeemedOffers, addToOrder, updateQuantity, removeFromOrder, clearOrder, confirmOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
