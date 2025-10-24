import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  surname: string;
  firstName?: string;
  lastName?: string;
  email: string;
  birthDate?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, surname: string, email: string, password: string, address?: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const [userData, authToken] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('authToken')
      ]);

      // Considera autenticato solo se presenti sia user che token
      if (userData && authToken) {
        const parsedUser = JSON.parse(userData);
        // Normalizza: rimuovi vecchio nome di default "Mario Rossi"
        if (parsedUser?.name === 'Mario Rossi') {
          parsedUser.name = '';
          parsedUser.surname = '';
          await AsyncStorage.setItem('user', JSON.stringify(parsedUser));
        }
        setUser(parsedUser);
      } else {
        // Pulisce eventuali dati utente orfani (es. sul web da sessioni precedenti)
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('authToken');
        setUser(null);
      }
    } catch (error) {
      console.error('Errore nel controllo dello stato di autenticazione:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simula autenticazione - in un'app reale qui faresti una chiamata API
      if (email && password) {
        const mockUser: User = {
          id: '1',
          name: '',
          surname: '',
          email: email
        };
        
        // Salva utente e un semplice token mock per validare la sessione
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        await AsyncStorage.setItem('authToken', 'mock-token');
        setUser(mockUser);
        
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
          address: address?.trim()
        };
        
        // Salva utente e un semplice token mock per validare la sessione
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        await AsyncStorage.setItem('authToken', 'mock-token');
        setUser(mockUser);
        
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
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      
      // Reset dello stack di navigazione e vai direttamente alle tab
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    updateUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
