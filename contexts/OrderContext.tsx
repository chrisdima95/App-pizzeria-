import { getAllOffers } from "@/data/offers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

// Aggiungiamo il campo status e userEmail
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: "pending" | "completed"; // Stati ordine: in attesa o completato
  notes?: string; // Note speciali per l'ordine
  userEmail?: string; // Email dell'utente che ha effettuato l'ordine
}

interface OrderContextType {
  orders: OrderItem[];
  completedOrders: OrderItem[][]; // lista degli ordini confermati (ogni elemento è uno "snapshot" del carrello)
  redeemedOffers: string[]; // lista degli ID delle offerte riscattate
  lastWheelSpinTimestamp: number | null; // timestamp dell'ultimo utilizzo della ruota
  hasOfferInCart: boolean; // true se il carrello contiene già un'offerta dalla ruota
  setOrders: React.Dispatch<React.SetStateAction<OrderItem[]>>; // per gestione diretta degli ordini
  addToOrder: (item: Omit<OrderItem, "status">) => void; // non serve specificare lo status quando si aggiunge
  updateQuantity: (id: string, quantity: number) => void; // aggiorna la quantità di un ordine
  removeFromOrder: (id: string) => void; // rimuove completamente un ordine
  clearOrder: () => void;
  confirmOrder: () => Promise<void>;
  confirmOrderAsGuest: () => Promise<void>; // conferma ordine come ospite (non loggato)
  resetWheelCooldown: () => void; // resetta il countdown della ruota
  getAllOrders: () => Promise<OrderItem[][]>; // ottiene tutti gli ordini di tutti gli utenti
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [completedOrders, setCompletedOrders] = useState<OrderItem[][]>([]);
  const [redeemedOffers, setRedeemedOffers] = useState<string[]>([]);
  const [lastWheelSpinTimestamp, setLastWheelSpinTimestamp] = useState<number | null>(null);
  const { user, isAuthenticated, registerResetCallback, registerLogoutCallback } = useAuth();
  // Insieme degli ID di tutte le offerte disponibili (ruota)
  const offerIdSet = new Set<string>(getAllOffers().map((o) => o.id));

  // Funzione per ottenere le chiavi specifiche per l'utente
  const getUserStorageKeys = (userId: string) => ({
    orders: `orders_${userId}`,
    ordersHistory: `ordersHistory_${userId}`,
    redeemedOffers: `redeemedOffers_${userId}`,
    lastWheelSpinTimestamp: `lastWheelSpin_${userId}`,
  });

  // Carica ordini e storico all'avvio o quando cambia l'utente
  useEffect(() => {
    const loadPersistedOrders = async () => {
      if (!isAuthenticated || !user) {
        // Se non autenticato, svuota tutto
        setOrders([]);
        setCompletedOrders([]);
        setRedeemedOffers([]);
        setLastWheelSpinTimestamp(null);
        return;
      }

      try {
        const {
          orders: ordersKey,
          ordersHistory: historyKey,
          redeemedOffers: offersKey,
          lastWheelSpinTimestamp: wheelKey,
        } = getUserStorageKeys(user.id);
        const [ordersJson, historyJson, offersJson, wheelJson] = await Promise.all([
          AsyncStorage.getItem(ordersKey),
          AsyncStorage.getItem(historyKey),
          AsyncStorage.getItem(offersKey),
          AsyncStorage.getItem(wheelKey),
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

        if (wheelJson) {
          const parsedTimestamp = Number(wheelJson);
          if (!isNaN(parsedTimestamp)) {
            setLastWheelSpinTimestamp(parsedTimestamp);
          }
        } else {
          setLastWheelSpinTimestamp(null);
        }
        
        // IMPORTANTE: Reset del countdown dopo aver caricato i dati del nuovo utente
        // Questo garantisce che ogni nuovo login/registrazione resetti il countdown
        setLastWheelSpinTimestamp(null);
      } catch (e) {
        console.error("Errore nel caricamento ordini da AsyncStorage", e);
        setOrders([]);
        setCompletedOrders([]);
        setRedeemedOffers([]);
        setLastWheelSpinTimestamp(null);
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
        console.error("Errore nel salvataggio ordini su AsyncStorage", e);
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
        console.error(
          "Errore nel salvataggio storico ordini su AsyncStorage",
          e
        );
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
        console.error(
          "Errore nel salvataggio offerte riscattate su AsyncStorage",
          e
        );
      }
    };
    persistRedeemedOffers();
  }, [redeemedOffers, user, isAuthenticated]);

  // Salva timestamp ultimo utilizzo ruota su storage a ogni modifica
  useEffect(() => {
    const persistWheelTimestamp = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const { lastWheelSpinTimestamp: wheelKey } = getUserStorageKeys(user.id);
        if (lastWheelSpinTimestamp !== null) {
          await AsyncStorage.setItem(wheelKey, lastWheelSpinTimestamp.toString());
        } else {
          await AsyncStorage.removeItem(wheelKey);
        }
      } catch (e) {
        console.error(
          "Errore nel salvataggio timestamp ruota su AsyncStorage",
          e
        );
      }
    };
    persistWheelTimestamp();
  }, [lastWheelSpinTimestamp, user, isAuthenticated]);

  const addToOrder = (item: Omit<OrderItem, "status">) => {
    setOrders((prev) => {
      const existing = prev.find((o) => o.id === item.id);
      if (existing) {
        // Se esiste già, aumenta solo la quantità
        return prev.map((o) =>
          o.id === item.id ? { ...o, quantity: o.quantity + item.quantity } : o
        );
      }
      // Aggiunge il nuovo ordine con status 'pending'
      return [...prev, { ...item, status: "pending" }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(id);
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, quantity } : o))
    );
  };

  const removeFromOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const clearOrder = () => setOrders([]);

  const confirmOrder = async () => {
    if (!orders.length || !user) return;

    // Identifica le offerte nell'ordine corrente
    const offersInOrder = orders.filter((order) => offerIdSet.has(order.id));

    // Aggiunge le offerte riscattate alla lista e attiva il cooldown della ruota
    if (offersInOrder.length > 0) {
      const newRedeemedOffers = offersInOrder.map((offer) => offer.id);
      setRedeemedOffers((prev) => [
        ...new Set([...prev, ...newRedeemedOffers]),
      ]);
      
      // IMPORTANTE: Attiva il cooldown della ruota SOLO quando l'ordine viene confermato
      // Questo impedisce di rigirare la ruota dopo aver riscattato un'offerta
      setLastWheelSpinTimestamp(Date.now());
    }

    // Crea una copia degli ordini con l'email dell'utente
    const ordersWithUserEmail = orders.map((o) => ({ 
      ...o, 
      userEmail: user.email 
    }));

    // aggiunge lo snapshot corrente degli ordini nello storico
    setCompletedOrders((prev) => [...prev, ordersWithUserEmail]);
    
    // Salva anche negli ordini globali per il chef
    try {
      const globalOrdersKey = 'globalOrders';
      const existingGlobalOrders = await AsyncStorage.getItem(globalOrdersKey);
      const globalOrders: OrderItem[][] = existingGlobalOrders ? JSON.parse(existingGlobalOrders) : [];
      globalOrders.push(ordersWithUserEmail);
      await AsyncStorage.setItem(globalOrdersKey, JSON.stringify(globalOrders));
    } catch (error) {
      console.error('Errore nel salvataggio ordini globali:', error);
    }
    
    // svuota il carrello
    setOrders([]);
  };

  // Funzione per confermare ordini come ospite (non loggato)
  const confirmOrderAsGuest = async () => {
    if (!orders.length) return;

    // Crea una copia degli ordini con userEmail "Ospite"
    const ordersAsGuest = orders.map((o) => ({ 
      ...o, 
      userEmail: "Ospite" 
    }));

    // Salva negli ordini globali per il chef
    try {
      const globalOrdersKey = 'globalOrders';
      const existingGlobalOrders = await AsyncStorage.getItem(globalOrdersKey);
      const globalOrders: OrderItem[][] = existingGlobalOrders ? JSON.parse(existingGlobalOrders) : [];
      globalOrders.push(ordersAsGuest);
      await AsyncStorage.setItem(globalOrdersKey, JSON.stringify(globalOrders));
    } catch (error) {
      console.error('Errore nel salvataggio ordini ospiti:', error);
    }
    
    // svuota il carrello
    setOrders([]);
  };

  const resetWheelCooldown = () => {
    setLastWheelSpinTimestamp(null);
  };

  const getAllOrders = async (): Promise<OrderItem[][]> => {
    try {
      const globalOrdersKey = 'globalOrders';
      const globalOrdersJson = await AsyncStorage.getItem(globalOrdersKey);
      return globalOrdersJson ? JSON.parse(globalOrdersJson) : [];
    } catch (error) {
      console.error('Errore nel recupero ordini globali:', error);
      return [];
    }
  };

  // Registra il callback per il reset del countdown nel AuthContext
  useEffect(() => {
    registerResetCallback(() => {
      setLastWheelSpinTimestamp(null);
    });
  }, [registerResetCallback]); // Esegui quando cambia il registratore

  // Registra il callback per il logout per pulire completamente i dati
  useEffect(() => {
    registerLogoutCallback(() => {
      // Pulisce tutti i dati dell'utente corrente
      setOrders([]);
      setCompletedOrders([]);
      setRedeemedOffers([]);
      setLastWheelSpinTimestamp(null);
    });
  }, [registerLogoutCallback]); // Esegui quando cambia il registratore

  return (
    <OrderContext.Provider
      value={{
        orders,
        completedOrders,
        redeemedOffers,
        lastWheelSpinTimestamp,
        hasOfferInCart: orders.some((o) => offerIdSet.has(o.id)),
        setOrders,
        addToOrder,
        updateQuantity,
        removeFromOrder,
        clearOrder,
        confirmOrder,
        confirmOrderAsGuest,
        resetWheelCooldown,
        getAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
