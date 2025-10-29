import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePizzaModal } from '@/hooks/use-pizza-modal';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [isLoginMode, setIsLoginMode] = useState(mode !== 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [surnameError, setSurnameError] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, isAuthenticated, isLoading: authLoading, isChefAuthenticated, chef } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { showModal, ModalComponent } = usePizzaModal();

  // Redirect se già autenticato
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, authLoading]);

  // Mostra loading se l'auth è in caricamento
  if (authLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>
          Verifica autenticazione...
        </ThemedText>
      </ThemedView>
    );
  }

  // Non mostrare nulla se già autenticato (il redirect avverrà nell'useEffect)
  if (isAuthenticated) {
    return null;
  }

  const validateForm = () => {
    let isValid = true;
    
    // Reset errori
    setEmailError('');
    setPasswordError('');
    setNameError('');
    setSurnameError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();
    const trimmedSurname = surname.trim();

    // Validazione email (richiesta + formato semplice)
    if (!trimmedEmail) {
      setEmailError('Inserisci la tua email');
      isValid = false;
    } else if (!/^\S+@\S+\.[\w-]+$/.test(trimmedEmail)) {
      setEmailError("Inserisci un'email valida (deve contenere @ e dominio)");
      isValid = false;
    }

    // Validazione password (richiesta)
    if (!trimmedPassword) {
      setPasswordError('Inserisci la password');
      isValid = false;
    }

    // Validazione per registrazione
    if (!isLoginMode) {
      if (!trimmedName) {
        setNameError('Inserisci il tuo nome');
        isValid = false;
      }
      
      if (!trimmedSurname) {
        setSurnameError('Inserisci il tuo cognome');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleLogin = async () => {
    setHasSubmitted(true);

    if (!validateForm()) {
      return;
    }
    
    // Controlla se il Chef è già loggato
    if (isChefAuthenticated && chef) {
      showModal(
        'Sessione Chef Attiva',
        'Sei attualmente loggato come Chef. Devi effettuare il logout dalla pagina "Chef" per poter accedere come cliente.',
        [
          { text: 'Annulla', style: 'cancel' },
          { 
            text: 'Vai al Chef', 
            onPress: () => {
              // Pulisce i campi password per evitare l'alert "Vuoi salvare password"
              setEmail('');
              setPassword('');
              // Piccolo delay per assicurarsi che i campi siano puliti prima del redirect
              setTimeout(() => {
                router.replace('/(tabs)/chef');
              }, 100);
            }
          }
        ]
      );
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (!success) {
        showModal('Errore', 'Credenziali non valide');
      }
    } catch (error) {
      showModal('Errore', 'Si è verificato un errore durante il login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setHasSubmitted(true);

    if (!validateForm()) {
      return;
    }
    
    // Controlla se il Chef è già loggato
    if (isChefAuthenticated && chef) {
      showModal(
        'Sessione Chef Attiva',
        'Sei attualmente loggato come Chef. Devi effettuare il logout dalla pagina "Chef" per poter registrarti come cliente.',
        [
          { text: 'Annulla', style: 'cancel' },
          { 
            text: 'Vai al Chef', 
            onPress: () => {
              // Pulisce i campi password per evitare l'alert "Vuoi salvare password"
              setEmail('');
              setPassword('');
              // Piccolo delay per assicurarsi che i campi siano puliti prima del redirect
              setTimeout(() => {
                router.replace('/(tabs)/chef');
              }, 100);
            }
          }
        ]
      );
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await register(name, surname, email, password);
      if (!success) {
        showModal('Errore', 'Si è verificato un errore durante la registrazione');
      }
    } catch (error) {
      showModal('Errore', 'Si è verificato un errore durante la registrazione');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setHasSubmitted(false);
    // Reset form
    setEmail('');
    setPassword('');
    setName('');
    setSurname('');
    setEmailError('');
    setPasswordError('');
    setNameError('');
    setSurnameError('');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
            Benvenuto!
          </ThemedText>
          <ThemedText type="subtitle" style={[styles.subtitle, { color: colors.muted }]}>
            {isLoginMode ? 'Accedi per continuare' : 'Registrati per iniziare'}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          {!isLoginMode && (
            <>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.card, 
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                placeholder="Nome"
                placeholderTextColor={colors.muted}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (hasSubmitted) {
                    if (!text.trim()) {
                      setNameError('Inserisci il tuo nome');
                    } else {
                      setNameError('');
                    }
                  }
                }}
                autoCapitalize="words"
                autoCorrect={false}
              />
              {hasSubmitted && nameError ? (
                <ThemedText style={[styles.errorText, { color: colors.error }]}>{nameError}</ThemedText>
              ) : null}

              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.card, 
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                placeholder="Cognome"
                placeholderTextColor={colors.muted}
                value={surname}
                onChangeText={(text) => {
                  setSurname(text);
                  if (hasSubmitted) {
                    if (!text.trim()) {
                      setSurnameError('Inserisci il tuo cognome');
                    } else {
                      setSurnameError('');
                    }
                  }
                }}
                autoCapitalize="words"
                autoCorrect={false}
              />
              {hasSubmitted && surnameError ? (
                <ThemedText style={[styles.errorText, { color: colors.error }]}>{surnameError}</ThemedText>
              ) : null}
            </>
          )}

          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.card, 
              borderColor: colors.border,
              color: colors.text 
            }]}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (hasSubmitted) {
                const t = text.trim();
                if (!t) {
                  setEmailError('Inserisci la tua email');
                } else if (!/^\S+@\S+\.[\w-]+$/.test(t)) {
                  setEmailError("Inserisci un'email valida (deve contenere @ e dominio)");
                } else {
                  setEmailError('');
                }
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {hasSubmitted && emailError ? (
            <ThemedText style={[styles.errorText, { color: colors.error }]}>{emailError}</ThemedText>
          ) : null}
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.card, 
              borderColor: colors.border,
              color: colors.text 
            }]}
            placeholder="Password"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (hasSubmitted) {
                if (!text.trim()) {
                  setPasswordError('Inserisci la password');
                } else {
                  setPasswordError('');
                }
              }
            }}
            secureTextEntry
            autoComplete="off"
            textContentType="none"
          />
          {hasSubmitted && passwordError ? (
            <ThemedText style={[styles.errorText, { color: colors.error }]}>{passwordError}</ThemedText>
          ) : null}

          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { backgroundColor: colors.primary },
              isLoading && styles.actionButtonDisabled,
              { pointerEvents: isLoading ? 'none' : 'auto' }
            ]} 
            onPress={isLoginMode ? handleLogin : handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <ThemedText style={styles.actionButtonText}>
                {isLoginMode ? 'Accedi' : 'Registrati'}
              </ThemedText>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={toggleMode}
            disabled={isLoading}
          >
            <ThemedText style={[styles.toggleButtonText, { color: colors.primary }]}>
              {isLoginMode 
                ? 'Non hai un account? Registrati' 
                : 'Hai già un account? Accedi'
              }
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
      <ModalComponent />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#E53E3E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    marginTop: -8,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
});
