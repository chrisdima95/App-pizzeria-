import { TabHeader } from '@/components/TabHeader';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Image, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import condizionale per react-native-maps (solo su mobile)
let MapView: any = null;
let Marker: any = null;

// Funzione per ottenere le chiavi specifiche per l'utente
const getUserStorageKeys = (userId: string) => ({
  photos: `user_photos_${userId}`,
  pickedImage: `picked_image_${userId}`
});

// Funzione per caricare react-native-maps solo quando necessario
const loadMaps = async () => {
  if (Platform.OS === 'web') return null;
  
  try {
    // Prova a importare react-native-maps
    // Se fallisce, probabilmente siamo in Expo Go dove non è disponibile
    const Maps = await import('react-native-maps');
    return {
      MapView: Maps.default,
      Marker: Maps.Marker
    };
  } catch (error) {
    console.log('react-native-maps non disponibile (probabilmente in Expo Go):', error);
    return null;
  }
};

// Funzioni per la persistenza delle foto
const savePhotosToStorage = async (photos: Array<{ id: string; uri: string; timestamp: number }>, userId: string) => {
  try {
    const { photos: photosKey } = getUserStorageKeys(userId);
    await AsyncStorage.setItem(photosKey, JSON.stringify(photos));
  } catch (error) {
    console.log('Errore nel salvare le foto:', error);
  }
};

const loadPhotosFromStorage = async (userId: string): Promise<Array<{ id: string; uri: string; timestamp: number }>> => {
  try {
    const { photos: photosKey } = getUserStorageKeys(userId);
    const photosJson = await AsyncStorage.getItem(photosKey);
    return photosJson ? JSON.parse(photosJson) : [];
  } catch (error) {
    console.log('Errore nel caricare le foto:', error);
    return [];
  }
};

const savePickedImageToStorage = async (uri: string | null, userId: string) => {
  try {
    const { pickedImage: pickedImageKey } = getUserStorageKeys(userId);
    if (uri) {
      await AsyncStorage.setItem(pickedImageKey, uri);
    } else {
      await AsyncStorage.removeItem(pickedImageKey);
    }
  } catch (error) {
    console.log('Errore nel salvare l\'immagine scelta:', error);
  }
};

const loadPickedImageFromStorage = async (userId: string): Promise<string | null> => {
  try {
    const { pickedImage: pickedImageKey } = getUserStorageKeys(userId);
    return await AsyncStorage.getItem(pickedImageKey);
  } catch (error) {
    console.log('Errore nel caricare l\'immagine scelta:', error);
    return null;
  }
};

export default function MediaScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, isAuthenticated } = useAuth();

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const [photos, setPhotos] = useState<Array<{ id: string; uri: string; timestamp: number }>>([]);

  const [pickedUri, setPickedUri] = useState<string | null>(null);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [mapRegion, setMapRegion] = useState<any>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsComponents, setMapsComponents] = useState<{MapView: any, Marker: any} | null>(null);

  useEffect(() => {
    // Carica le foto salvate all'avvio o quando cambia l'utente
    const loadSavedData = async () => {
      if (!isAuthenticated || !user) {
        // Se non autenticato, svuota tutto
        setPhotos([]);
        setPickedUri(null);
        return;
      }

      try {
        const savedPhotos = await loadPhotosFromStorage(user.id);
        const savedPickedImage = await loadPickedImageFromStorage(user.id);
        
        setPhotos(savedPhotos);
        setPickedUri(savedPickedImage);
      } catch (error) {
        console.log('Errore nel caricare i dati salvati:', error);
        setPhotos([]);
        setPickedUri(null);
      }
    };

    // Pre-richiede solo i permessi della galleria per miglior UX
    const requestPermissions = async () => {
      try {
        // Richiede permessi galleria
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        // I permessi della fotocamera e geolocalizzazione vengono richiesti solo quando necessario
      } catch (error) {
        console.log('Errore nel richiedere i permessi:', error);
      }
    };
    
    loadSavedData();
    requestPermissions();
  }, [user, isAuthenticated]);

  // Carica react-native-maps solo quando necessario (solo su mobile)
  useEffect(() => {
    if (Platform.OS !== 'web' && !mapsLoaded) {
      loadMaps().then((components) => {
        if (components) {
          setMapsComponents(components);
          setMapsLoaded(true);
        }
      });
    } else if (Platform.OS === 'web') {
      setMapsLoaded(true); // Su web non carichiamo le mappe
    }
  }, [mapsLoaded]);

  const ensureCameraPermission = useCallback(async () => {
    if (!cameraPermission || cameraPermission.granted) return true;
    const res = await requestCameraPermission();
    return !!res.granted;
  }, [cameraPermission, requestCameraPermission]);

  const handleOpenCamera = useCallback(async () => {
    try {
      const ok = await ensureCameraPermission();
      if (ok) {
        setIsCameraOpen(true);
      } else {
        Alert.alert(
          'Permesso fotocamera richiesto', 
          'Per scattare foto è necessario concedere l\'accesso alla fotocamera. Vai nelle Impostazioni per abilitare il permesso.',
          [
            { text: 'Annulla', style: 'cancel' },
            { text: 'Impostazioni', onPress: () => {
              // Su iOS, questo aprirà le impostazioni dell'app
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              }
            }}
          ]
        );
      }
    } catch (error) {
      Alert.alert('Errore', 'Impossibile accedere alla fotocamera.');
    }
  }, [ensureCameraPermission]);

  const handleTakePhoto = useCallback(async () => {
    if (!isAuthenticated || !user) {
      Alert.alert('Errore', 'Devi essere autenticato per scattare foto');
      return;
    }

    try {
      if (!cameraRef.current) {
        Alert.alert('Errore', 'Fotocamera non disponibile');
        return;
      }
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      if (result?.uri) {
        const newPhoto = {
          id: Date.now().toString(),
          uri: result.uri,
          timestamp: Date.now()
        };
        const updatedPhotos = [...photos, newPhoto];
        setPhotos(updatedPhotos);
        await savePhotosToStorage(updatedPhotos, user.id);
        setIsCameraOpen(false);
        Alert.alert('Successo', 'Foto scattata e salvata con successo!');
      }
    } catch (error) {
      Alert.alert('Errore', 'Impossibile scattare la foto: ' + (error as Error).message);
    }
  }, [photos, user, isAuthenticated]);

  const handleDeletePhoto = useCallback(async (photoId: string) => {
    if (!isAuthenticated || !user) return;

    Alert.alert(
      'Cancella foto',
      'Sei sicuro di voler cancellare questa foto?',
      [
        { text: 'Annulla', style: 'cancel' },
        { 
          text: 'Cancella', 
          style: 'destructive',
          onPress: async () => {
            const updatedPhotos = photos.filter(photo => photo.id !== photoId);
            setPhotos(updatedPhotos);
            await savePhotosToStorage(updatedPhotos, user.id);
          }
        }
      ]
    );
  }, [photos, user, isAuthenticated]);

  const handleDeleteAllPhotos = useCallback(() => {
    if (photos.length === 0 || !isAuthenticated || !user) return;
    
    Alert.alert(
      'Cancella tutte le foto',
      `Sei sicuro di voler cancellare tutte le ${photos.length} foto?`,
      [
        { text: 'Annulla', style: 'cancel' },
        { 
          text: 'Cancella tutte', 
          style: 'destructive',
          onPress: async () => {
            setPhotos([]);
            await savePhotosToStorage([], user.id);
          }
        }
      ]
    );
  }, [photos.length, user, isAuthenticated]);

  const handleDeletePickedImage = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    Alert.alert(
      'Cancella immagine',
      'Sei sicuro di voler cancellare questa immagine?',
      [
        { text: 'Annulla', style: 'cancel' },
        { 
          text: 'Cancella', 
          style: 'destructive',
          onPress: async () => {
            setPickedUri(null);
            await savePickedImageToStorage(null, user.id);
          }
        }
      ]
    );
  }, [user, isAuthenticated]);

  const handlePickImage = useCallback(async () => {
    if (!isAuthenticated || !user) {
      Alert.alert('Errore', 'Devi essere autenticato per scegliere immagini');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      setPickedUri(res.assets[0].uri);
      await savePickedImageToStorage(res.assets[0].uri, user.id);
    }
  }, [user, isAuthenticated]);

  const handleGetLocation = useCallback(async () => {
    try {
      // Prima controlla se i permessi sono già stati concessi
      let { status } = await Location.getForegroundPermissionsAsync();
      
      // Se non sono stati concessi, richiedili
      if (status !== 'granted') {
        const result = await Location.requestForegroundPermissionsAsync();
        status = result.status;
      }
      
      if (status !== 'granted') {
        Alert.alert(
          'Permesso geolocalizzazione richiesto', 
          'Per ottenere la posizione è necessario concedere l\'accesso alla geolocalizzazione. Clicca "Riprova" per richiedere nuovamente il permesso.',
          [
            { text: 'Annulla', style: 'cancel' },
            { 
              text: 'Riprova', 
              onPress: () => {
                // Richiede nuovamente i permessi
                Location.requestForegroundPermissionsAsync().then((result) => {
                  if (result.status === 'granted') {
                    handleGetLocation(); // Richiama la funzione se il permesso viene concesso
                  } else {
                    Alert.alert(
                      'Permesso negato',
                      'Il permesso per la geolocalizzazione è stato negato. Per abilitarlo, vai nelle Impostazioni di sistema > Privacy e sicurezza > Servizi di localizzazione e abilita l\'accesso per Expo Go.',
                      [
                        { text: 'OK' },
                        { 
                          text: 'Impostazioni', 
                          onPress: () => {
                            if (Platform.OS === 'ios') {
                              Linking.openURL('app-settings:');
                            } else {
                              Linking.openURL('settings:');
                            }
                          }
                        }
                      ]
                    );
                  }
                });
              }
            }
          ]
        );
        return;
      }
      
      Alert.alert('Info', 'Ottenendo la posizione...');
      
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation(loc);
      setMapRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
      // Carica le mappe se non sono ancora state caricate (solo su mobile)
      if (Platform.OS !== 'web' && !mapsLoaded) {
        loadMaps().then((components) => {
          if (components) {
            setMapsComponents(components);
            setMapsLoaded(true);
          }
        });
      }
      
      Alert.alert('Successo', `Posizione ottenuta: ${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`);
    } catch (error) {
      Alert.alert('Errore', 'Impossibile ottenere la posizione: ' + (error as Error).message);
    }
  }, []);

  // Se non autenticato, mostra un messaggio
  if (!isAuthenticated || !user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TabHeader title="📸 Media e Posizione" />
        <View style={styles.authRequiredContainer}>
          <View style={[styles.authRequiredCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ThemedText style={[styles.authRequiredText, { color: colors.muted }]}>
              Devi essere autenticato per accedere alle tue foto e media
            </ThemedText>
            <ThemedText style={[styles.authRequiredSubtext, { color: colors.muted }]}>
              Accedi o registrati per iniziare a scattare foto e salvare immagini
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TabHeader title="📸 Media e Posizione" />
      <ScrollView contentContainerStyle={styles.content}>

        {/* Azioni */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={handleOpenCamera}>
            <Text style={styles.actionText}>Scatta foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.secondary }]} onPress={handlePickImage}>
            <Text style={styles.actionText}>Scegli dalla galleria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.accent }]} onPress={handleGetLocation}>
            <Text style={styles.actionText}>Ottieni posizione</Text>
          </TouchableOpacity>
        </View>

        {/* Camera overlay */}
        {isCameraOpen && (
          <View style={styles.cameraContainer}>
            <CameraView ref={cameraRef} style={styles.camera} facing="back" />
            <View style={styles.cameraControls}>
              <TouchableOpacity style={[styles.captureBtn, { borderColor: 'white' }]} onPress={handleTakePhoto} />
              <TouchableOpacity onPress={() => setIsCameraOpen(false)}>
                <Text style={styles.cancelText}>Chiudi</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Foto scattate */}
        {photos.length > 0 && (
          <View style={[styles.previewBlock, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.previewHeader}>
              <ThemedText type="subtitle" style={styles.blockTitle}>
                Foto scattate ({photos.length})
              </ThemedText>
              <TouchableOpacity 
                style={[styles.deleteBtn, { backgroundColor: colors.primary }]} 
                onPress={handleDeleteAllPhotos}
              >
                <IconSymbol size={16} name="trash" color="white" />
                <Text style={styles.deleteBtnText}>Cancella tutte</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={photos}
              renderItem={({ item }) => (
                <View style={[styles.photoItem, { backgroundColor: colors.background }]}>
                  <Image source={{ uri: item.uri }} style={styles.photoImage} resizeMode="cover" />
                  <View style={styles.photoInfo}>
                    <ThemedText style={[styles.photoDate, { color: colors.muted }]}>
                      {new Date(item.timestamp).toLocaleString('it-IT')}
                    </ThemedText>
                    <TouchableOpacity 
                      style={[styles.deleteSingleBtn, { backgroundColor: colors.primary }]} 
                      onPress={() => handleDeletePhoto(item.id)}
                    >
                      <IconSymbol size={14} name="trash" color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosList}
            />
          </View>
        )}

        {/* Anteprima immagine scelta */}
        {pickedUri && (
          <View style={[styles.previewBlock, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.previewHeader}>
              <ThemedText type="subtitle" style={styles.blockTitle}>Immagine dalla galleria</ThemedText>
              <TouchableOpacity 
                style={[styles.deleteBtn, { backgroundColor: colors.primary }]} 
                onPress={handleDeletePickedImage}
              >
                <IconSymbol size={16} name="trash" color="white" />
                <Text style={styles.deleteBtnText}>Cancella</Text>
              </TouchableOpacity>
            </View>
            <Image source={{ uri: pickedUri }} style={styles.image} resizeMode="cover" />
          </View>
        )}

        {/* Mappa con posizione */}
        {mapRegion && Platform.OS !== 'web' && mapsLoaded && mapsComponents && (
          <View style={[styles.previewBlock, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ThemedText type="subtitle" style={styles.blockTitle}>La tua posizione</ThemedText>
            <mapsComponents.MapView style={styles.map} region={mapRegion}>
              {location && mapsComponents.Marker && (
                <mapsComponents.Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} title="Tu sei qui" />
              )}
            </mapsComponents.MapView>
          </View>
        )}
        
        {/* Fallback per web o quando le mappe non sono disponibili - mostra solo le coordinate */}
        {mapRegion && (Platform.OS === 'web' || !mapsComponents) && (
          <View style={[styles.previewBlock, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ThemedText type="subtitle" style={styles.blockTitle}>La tua posizione</ThemedText>
            <View style={[styles.coordinatesContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <ThemedText style={styles.coordinatesText}>
                Latitudine: {location?.coords.latitude.toFixed(6)}
              </ThemedText>
              <ThemedText style={styles.coordinatesText}>
                Longitudine: {location?.coords.longitude.toFixed(6)}
              </ThemedText>
              <ThemedText style={[styles.coordinatesNote, { color: colors.muted }]}>
                {Platform.OS === 'web' 
                  ? 'La mappa non è disponibile su web. Usa un dispositivo mobile per vedere la mappa.'
                  : 'La mappa non è disponibile in Expo Go. Per vedere la mappa, compila l\'app con EAS Build.'
                }
              </ThemedText>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  content: { 
    padding: 16, 
    gap: 20,
  },
  actionsRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12 
  },
  actionBtn: { 
    paddingVertical: 14, 
    paddingHorizontal: 16, 
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionText: { 
    color: 'white', 
    fontWeight: '600',
    fontSize: 14,
  },
  cameraContainer: { 
    position: 'relative', 
    width: '100%', 
    height: 360, 
    borderRadius: 16, 
    overflow: 'hidden',
    elevation: 3,
  },
  camera: { width: '100%', height: '100%' },
  cameraControls: { 
    position: 'absolute', 
    bottom: 20, 
    width: '100%', 
    alignItems: 'center', 
    gap: 12 
  },
  captureBtn: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    borderWidth: 4, 
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'white',
  },
  cancelText: { 
    color: 'white', 
    marginTop: 6, 
    fontWeight: '600',
    fontSize: 16,
  },
  previewBlock: { 
    gap: 12,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
  },
  previewHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  blockTitle: { 
    fontWeight: '700',
    fontSize: 18,
  },
  deleteBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 10, 
    gap: 6,
    elevation: 1,
  },
  deleteBtnText: { 
    color: 'white', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  photosList: { gap: 12 },
  photoItem: { 
    width: 200, 
    marginRight: 12, 
    borderRadius: 16, 
    overflow: 'hidden',
    elevation: 2,
  },
  photoImage: { 
    width: '100%', 
    height: 150, 
    borderRadius: 16 
  },
  photoInfo: { 
    padding: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  photoDate: { 
    fontSize: 12, 
    flex: 1 
  },
  deleteSingleBtn: { 
    padding: 8, 
    borderRadius: 8, 
    marginLeft: 8 
  },
  coordinatesContainer: {
    padding: 20,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
  },
  coordinatesText: {
    fontSize: 16,
    fontWeight: '600',
  },
  coordinatesNote: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8
  },
  image: { 
    width: '100%', 
    height: 240, 
    borderRadius: 16 
  },
  map: { 
    width: '100%', 
    height: 260, 
    borderRadius: 16 
  },
  authRequiredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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


