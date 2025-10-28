import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  surname: string;
  firstName?: string;
  lastName?: string;
  email: string;
  birthDate?: string;
  address?: string;
  isChef?: boolean; // Flag per identificare se l'utente è un chef
}

interface AuthContextType {
  user: User | null;
  chef: User | null; // Separato per gestire l'autenticazione Chef
  isLoading: boolean;
  isAuthenticated: boolean;
  isChefAuthenticated: boolean; // Nuovo flag per Chef
  login: (email: string, password: string) => Promise<boolean>;
  chefLogin: (email: string, password: string) => Promise<boolean>; // Nuovo metodo per login Chef
  register: (name: string, surname: string, email: string, password: string, address?: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  chefLogout: () => Promise<void>; // Nuovo metodo per logout Chef
  registerResetCallback: (callback: () => void) => void; // Funzione per registrare il callback di reset
  registerLogoutCallback: (callback: () => void) => void; // Funzione per registrare il callback di logout
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve essere utilizzato all\'interno di AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [chef, setChef] = useState<User | null>(null); // Stato separato per Chef
  const [isLoading, setIsLoading] = useState(true);
  const [resetWheelCooldownOnLogin, setResetWheelCooldownOnLogin] = useState<(() => void) | null>(null);
  const [logoutCallback, setLogoutCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const [userData, authToken, chefData, chefToken] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('chef'),
        AsyncStorage.getItem('chefToken')
      ]);

      // Controlla autenticazione utente normale
      if (userData && authToken) {
        const parsedUser = JSON.parse(userData);
        // Normalizza: rimuovi vecchio nome di default "Mario Rossi"
        if (parsedUser?.name === 'Mario Rossi') {
          parsedUser.name = '';
          parsedUser.surname = '';
          await AsyncStorage.setItem('user', JSON.stringify(parsedUser));
        }
        setUser(parsedUser);
        // Reset del countdown quando l'utente viene autenticato automaticamente
        if (resetWheelCooldownOnLogin) {
          resetWheelCooldownOnLogin();
        }
      } else {
        // Pulisce eventuali dati utente orfani (es. sul web da sessioni precedenti)
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('authToken');
        setUser(null);
      }

      // Controlla autenticazione Chef
      if (chefData && chefToken) {
        const parsedChef = JSON.parse(chefData);
        setChef(parsedChef);
      } else {
        await AsyncStorage.removeItem('chef');
        await AsyncStorage.removeItem('chefToken');
        setChef(null);
      }
    } catch (error) {
      console.error('Errore nel controllo dello stato di autenticazione:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simula autenticazione per utenti normali - in un'app reale qui faresti una chiamata API
      if (email && password) {
        const mockUser: User = {
          id: '1',
          name: '',
          surname: '',
          email: email,
          isChef: false
        };
        
        // Salva utente e un semplice token mock per validare la sessione
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        await AsyncStorage.setItem('authToken', 'mock-token');
        setUser(mockUser);
        
        // Reset del countdown quando l'utente fa login
        if (resetWheelCooldownOnLogin) {
          resetWheelCooldownOnLogin();
        }
        
        // Reset dello stack di navigazione
        router.replace('/(tabs)');
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Errore durante il login:', error);
      return false;
    }
  };

  const register = async (name: string, surname: string, email: string, password: string, address?: string): Promise<boolean> => {
    try {
      // Simula registrazione - in un'app reale qui faresti una chiamata API
      if (name && surname && email && password) {
        const mockUser: User = {
          id: Date.now().toString(), // ID univoco basato su timestamp
          name: name.trim(),
          surname: surname.trim(),
          email: email.trim(),
          address: address?.trim(),
          isChef: false
        };
        
        // Salva utente e un semplice token mock per validare la sessione
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        await AsyncStorage.setItem('authToken', 'mock-token');
        setUser(mockUser);
        
        // Reset del countdown quando l'utente si registra
        if (resetWheelCooldownOnLogin) {
          resetWheelCooldownOnLogin();
        }
        
        // Reset dello stack di navigazione
        router.replace('/(tabs)');
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      return false;
    }
  };

  const chefLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      // Controlla se sono le credenziali del Chef
      if (email === 'chef@gmail.com' && password === 'chef') {
        const chefUser: User = {
          id: 'chef-1',
          name: 'Chef',
          surname: 'Master',
          email: email,
          isChef: true
        };
        
        // Salva chef separatamente e token
        await AsyncStorage.setItem('chef', JSON.stringify(chefUser));
        await AsyncStorage.setItem('chefToken', 'chef-token');
        setChef(chefUser);
        
        // Reset del countdown quando il chef fa login
        if (resetWheelCooldownOnLogin) {
          resetWheelCooldownOnLogin();
        }
        
        // Redirect alla pagina degli ordini chef
        router.replace('/chef-orders');
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Errore durante il login Chef:', error);
      return false;
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (user) {
        const updatedUser = { ...user, ...userData };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dell\'utente:', error);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Chiama il callback di logout per pulire i dati dell'utente corrente
      if (logoutCallback) {
        logoutCallback();
      }
      
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      
      // Reset dello stack di navigazione e vai direttamente alle tab
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  const chefLogout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('chef');
      await AsyncStorage.removeItem('chefToken');
      setChef(null);
      
      // Reset dello stack di navigazione e vai alla pagina Chef
      router.replace('/(tabs)/chef');
    } catch (error) {
      console.error('Errore durante il logout Chef:', error);
    }
  };

  const registerResetCallback = useCallback((callback: () => void) => {
    setResetWheelCooldownOnLogin(() => callback);
  }, []);

  const registerLogoutCallback = useCallback((callback: () => void) => {
    setLogoutCallback(() => callback);
  }, []);

  const value: AuthContextType = {
    user,
    chef,
    isLoading,
    isAuthenticated: !!user,
    isChefAuthenticated: !!chef,
    login,
    chefLogin,
    register,
    updateUser,
    logout,
    chefLogout,
    registerResetCallback,
    registerLogoutCallback
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
