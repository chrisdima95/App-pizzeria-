import { TabHeader } from "@/components/TabHeader";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { usePizzaModal } from "@/hooks/use-pizza-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActionSheetIOS,
    Alert,
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

// Funzioni per salvare/caricare la foto profilo
const saveProfileImage = async (uri: string | null, userId: string) => {
  try {
    if (uri) {
      await AsyncStorage.setItem(`profile_image_${userId}`, uri);
    } else {
      await AsyncStorage.removeItem(`profile_image_${userId}`);
    }
  } catch (error) {
    console.log("Errore nel salvare la foto profilo:", error);
  }
};

const loadProfileImage = async (userId: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(`profile_image_${userId}`);
  } catch (error) {
    console.log("Errore nel caricare la foto profilo:", error);
    return null;
  }
};

export default function ProfiloScreen() {
  const router = useRouter();
  const { user, logout, updateUser, isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { showModal, ModalComponent } = usePizzaModal();
  const cardBg = colors.card;
  const divider = colors.border;
  const logoutBg = colorScheme === "dark" ? colors.border : colors.background;
  const logoutBorder = colors.border;

  // Stati per i dati personali
  const [isEditing, setIsEditing] = useState(false);
  const [personalData, setPersonalData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    birthDate: user?.birthDate || "",
  });

  // Stati per la foto profilo
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  // Aggiorna i dati personali quando cambia l'utente
  React.useEffect(() => {
    setPersonalData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      birthDate: user?.birthDate || "",
    });
  }, [user]);

  // Carica la foto profilo salvata
  useEffect(() => {
    const loadSavedProfileImage = async () => {
      if (user?.id) {
        const savedImage = await loadProfileImage(user.id);
        setProfileImageUri(savedImage);
      } else {
        setProfileImageUri(null);
      }
    };
    loadSavedProfileImage();
  }, [user]);

  // Funzione per assicurare i permessi della fotocamera
  const ensureCameraPermission = useCallback(async () => {
    if (!cameraPermission || cameraPermission.granted) return true;
    const res = await requestCameraPermission();
    return !!res.granted;
  }, [cameraPermission, requestCameraPermission]);

  // Funzioni ausiliarie per le azioni
  const handleTakePhoto = useCallback(async () => {
    if (!user) return;
    try {
      const hasPermission = await ensureCameraPermission();
      if (!hasPermission) {
        Alert.alert(
          "Permesso fotocamera richiesto",
          "Per scattare foto è necessario concedere l'accesso alla fotocamera."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setProfileImageUri(result.assets[0].uri);
        await saveProfileImage(result.assets[0].uri, user.id);
      }
    } catch (error) {
      Alert.alert("Errore", "Impossibile scattare la foto");
    }
  }, [user, ensureCameraPermission]);

  const handleRemoveImage = useCallback(async () => {
    if (!user) return;
    Alert.alert(
      "Rimuovi immagine",
      "Sei sicuro di voler rimuovere la tua foto profilo?",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Rimuovi",
          onPress: async () => {
            setProfileImageUri(null);
            await saveProfileImage(null, user.id);
          },
        },
      ]
    );
  }, [user]);

  // Funzione per cambiare la foto profilo - usa ActionSheetIOS su iOS e Modal su Android
  const handleChangeProfileImage = useCallback(() => {
    if (!user) return;

    if (Platform.OS === "ios") {
      // Su iOS usa ActionSheetIOS che non ha limiti
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            "Annulla",
            "Scegli dalla galleria",
            "Scatta foto",
            "Rimuovi immagine",
          ],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 3,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) return; // Annulla

          if (buttonIndex === 1) {
            // Scegli dalla galleria
            try {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              if (!result.canceled && result.assets?.[0]?.uri) {
                setProfileImageUri(result.assets[0].uri);
                await saveProfileImage(result.assets[0].uri, user.id);
              }
            } catch (error) {
              Alert.alert("Errore", "Impossibile scegliere l'immagine");
            }
          } else if (buttonIndex === 2) {
            // Scatta foto
            handleTakePhoto();
          } else if (buttonIndex === 3) {
            // Rimuovi immagine
            handleRemoveImage();
          }
        }
      );
    } else {
      // Su Android, usa un modal personalizzato
      setShowImagePickerModal(true);
    }
  }, [user]);

  const handlePickFromGallery = useCallback(async () => {
    if (!user) return;
    setShowImagePickerModal(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setProfileImageUri(result.assets[0].uri);
        await saveProfileImage(result.assets[0].uri, user.id);
      }
    } catch (error) {
      Alert.alert("Errore", "Impossibile scegliere l'immagine");
    }
  }, [user]);

  const handleLogout = () => {
    showModal("Logout", "Sei sicuro di voler uscire?", [
      { text: "Annulla", style: "cancel" },
      { text: "Esci", style: "destructive", onPress: logout },
    ]);
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Salva i dati
      updateUser(personalData);
      setIsEditing(false);
      showModal(
        "Profilo aggiornato",
        "Le tue informazioni personali sono state salvate.",
        [{ text: "OK" }]
      );
    } else {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setPersonalData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      birthDate: user?.birthDate || "",
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setPersonalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatBirthDate = (text: string) => {
    // Rimuovi tutti i caratteri non numerici
    const numbersOnly = text.replace(/[^0-9]/g, "");

    // Limita a 8 cifre (GGMMAAAA)
    const limited = numbersOnly.slice(0, 8);

    // Validazione per giorni, mesi e anni
    if (limited.length >= 2) {
      const day = parseInt(limited.slice(0, 2));
      if (day > 31 || day < 1) {
        return limited.slice(0, 1); // Permetti solo la prima cifra valida
      }
    }

    if (limited.length >= 4) {
      const month = parseInt(limited.slice(2, 4));
      if (month > 12 || month < 1) {
        return limited.slice(0, 3); // Ferma alla terza cifra se mese invalido
      }
    }

    if (limited.length >= 8) {
      const year = parseInt(limited.slice(4, 8));
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        return limited.slice(0, 7); // Ferma alla settima cifra se anno invalido
      }
    }

    // Validazione giorni per mese specifico (quando abbiamo giorno, mese e anno completi)
    if (limited.length >= 8) {
      const day = parseInt(limited.slice(0, 2));
      const month = parseInt(limited.slice(2, 4));
      const year = parseInt(limited.slice(4, 8));

      const daysInMonth = new Date(year, month, 0).getDate();
      if (day > daysInMonth) {
        return limited.slice(0, 7); // Ferma alla settima cifra se giorno invalido per quel mese
      }
    }

    // Aggiungi gli slash automaticamente
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 4) {
      return `${limited.slice(0, 2)}/${limited.slice(2)}`;
    } else {
      return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(
        4
      )}`;
    }
  };

  const handleBirthDateChange = (value: string) => {
    const formatted = formatBirthDate(value);
    handleInputChange("birthDate", formatted);
  };

  const menuItems = [
    {
      id: "orders",
      title: "I miei ordini",
      icon: "bag",
      onPress: () => router.push("/ordini"),
    },
  ];

  const renderMenuItem = (item: (typeof menuItems)[0]) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.menuItem,
        { pointerEvents: "auto", borderBottomColor: divider },
      ]}
      onPress={item.onPress}
    >
      <View style={styles.menuItemContent}>
        <IconSymbol
          size={24}
          name={item.icon as any}
          color={colors.primary}
          style={styles.menuIcon}
        />
        <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
        <IconSymbol size={16} name="chevron.right" color={colors.icon} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <TabHeader title="Profilo" showMascotte={false} />

      {isAuthenticated ? (
        <>
          {/* User Info */}
          <View
            style={[
              styles.userInfo,
              { backgroundColor: cardBg, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={handleChangeProfileImage}
            >
              {profileImageUri ? (
                <Image
                  source={{ uri: profileImageUri }}
                  style={styles.avatarImage}
                />
              ) : (
                <IconSymbol
                  size={60}
                  name="person.circle.fill"
                  color={colors.primary}
                />
              )}
              <View
                style={[
                  styles.editIconBadge,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.background,
                  },
                ]}
              >
                <IconSymbol size={14} name="pencil" color="white" />
              </View>
            </TouchableOpacity>
            {Boolean(user?.name?.trim()) && (
              <ThemedText type="subtitle" style={styles.userName}>
                {user!.name}
              </ThemedText>
            )}
            <ThemedText style={[styles.userEmail, { color: colors.muted }]}>
              {user?.email || "email@example.com"}
            </ThemedText>
          </View>

          {/* Dati personali */}
          <View
            style={[
              styles.personalDataCard,
              { backgroundColor: cardBg, borderColor: colors.border },
            ]}
          >
            <View style={styles.personalDataHeader}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
                Dati personali
              </ThemedText>
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                onPress={handleEditToggle}
              >
                <ThemedText style={styles.editButtonText}>
                  {isEditing ? "Salva" : "Modifica"}
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.personalDataFields}>
              <View style={styles.fieldRow}>
                <View style={styles.fieldContainer}>
                  <ThemedText
                    style={[styles.fieldLabel, { color: colors.muted }]}
                  >
                    Nome
                  </ThemedText>
                  {isEditing ? (
                    <TextInput
                      style={[
                        styles.fieldInput,
                        {
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                      value={personalData.firstName}
                      onChangeText={(value) =>
                        handleInputChange("firstName", value)
                      }
                      placeholder="Inserisci il nome"
                      placeholderTextColor={colors.muted}
                    />
                  ) : (
                    <ThemedText
                      style={[styles.fieldValue, { color: colors.text }]}
                    >
                      {personalData.firstName || "Non specificato"}
                    </ThemedText>
                  )}
                </View>
                <View style={styles.fieldContainer}>
                  <ThemedText
                    style={[styles.fieldLabel, { color: colors.muted }]}
                  >
                    Cognome
                  </ThemedText>
                  {isEditing ? (
                    <TextInput
                      style={[
                        styles.fieldInput,
                        {
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                      value={personalData.lastName}
                      onChangeText={(value) =>
                        handleInputChange("lastName", value)
                      }
                      placeholder="Inserisci il cognome"
                      placeholderTextColor={colors.muted}
                    />
                  ) : (
                    <ThemedText
                      style={[styles.fieldValue, { color: colors.text }]}
                    >
                      {personalData.lastName || "Non specificato"}
                    </ThemedText>
                  )}
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText
                  style={[styles.fieldLabel, { color: colors.muted }]}
                >
                  Email
                </ThemedText>
                {isEditing ? (
                  <TextInput
                    style={[
                      styles.fieldInput,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    value={personalData.email}
                    onChangeText={(value) => handleInputChange("email", value)}
                    placeholder="Inserisci l'email"
                    placeholderTextColor={colors.muted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                ) : (
                  <ThemedText
                    style={[styles.fieldValue, { color: colors.text }]}
                  >
                    {personalData.email || "Non specificato"}
                  </ThemedText>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText
                  style={[styles.fieldLabel, { color: colors.muted }]}
                >
                  Data di nascita
                </ThemedText>
                {isEditing ? (
                  <TextInput
                    style={[
                      styles.fieldInput,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    value={personalData.birthDate}
                    onChangeText={handleBirthDateChange}
                    placeholder="GG/MM/AAAA"
                    placeholderTextColor={colors.muted}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                ) : (
                  <ThemedText
                    style={[styles.fieldValue, { color: colors.text }]}
                  >
                    {personalData.birthDate || "Non specificato"}
                  </ThemedText>
                )}
              </View>

              {isEditing && (
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={[
                      styles.cancelButton,
                      { backgroundColor: colors.border },
                    ]}
                    onPress={handleCancelEdit}
                  >
                    <ThemedText
                      style={[styles.cancelButtonText, { color: colors.text }]}
                    >
                      Annulla
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Menu Items */}
          <View
            style={[
              styles.menu,
              { backgroundColor: cardBg, borderColor: colors.border },
            ]}
          >
            {menuItems.map(renderMenuItem)}
          </View>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={[
                styles.logoutButton,
                {
                  pointerEvents: "auto",
                  backgroundColor: "white",
                  borderColor: logoutBorder,
                },
              ]}
              onPress={handleLogout}
            >
              <IconSymbol size={20} name="power" color={colors.primary} />
              <ThemedText
                style={[styles.logoutText, { color: colors.primary }]}
              >
                Logout
              </ThemedText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* Guest User Info */}
          <View
            style={[
              styles.userInfo,
              { backgroundColor: cardBg, borderColor: colors.border },
            ]}
          >
            <View style={styles.avatar}>
              <IconSymbol size={60} name="person.circle" color={colors.muted} />
            </View>
            <ThemedText type="subtitle" style={styles.userName}>
              Ospite
            </ThemedText>
            <ThemedText style={[styles.userEmail, { color: colors.muted }]}>
              Accedi per personalizzare il tuo profilo
            </ThemedText>
          </View>

          {/* Login Button */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={[
                styles.logoutButton,
                {
                  pointerEvents: "auto",
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={handleLogin}
            >
              <IconSymbol size={20} name="person.badge.plus" color="white" />
              <ThemedText style={[styles.logoutText, { color: "white" }]}>
                Accedi
              </ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Modal per selezionare la foto profilo su Android */}
      <Modal
        visible={showImagePickerModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowImagePickerModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowImagePickerModal(false)}
          />
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {/* Header con Mascotte e Titolo */}
            <View style={styles.modalHeader}>
              <View style={styles.modalMascotteContainer}>
                <Image
                  source={require("@/assets/images/Mascotte.png")}
                  style={styles.modalMascotte}
                  resizeMode="contain"
                />
              </View>
              <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
                Cambia foto profilo
              </ThemedText>
            </View>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handlePickFromGallery}
            >
              <ThemedText style={styles.modalButtonText}>
                Scegli dalla galleria
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleTakePhoto}
            >
              <ThemedText style={styles.modalButtonText}>
                Scatta foto
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#E53E3E" }]}
              onPress={handleRemoveImage}
            >
              <ThemedText style={styles.modalButtonText}>
                Rimuovi immagine
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.border }]}
              onPress={() => setShowImagePickerModal(false)}
            >
              <ThemedText
                style={[styles.modalButtonText, { color: colors.text }]}
              >
                Annulla
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ModalComponent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: { paddingBottom: 40 },
  userInfo: {
    alignItems: "center",
    padding: 30,
    margin: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  avatar: { marginBottom: 16 },
  avatarContainer: {
    marginBottom: 16,
    position: "relative",
    alignSelf: "center",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#E53E3E",
  },
  editIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  personalDataCard: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  personalDataHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  editButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  personalDataFields: {
    gap: 16,
  },
  fieldRow: {
    flexDirection: "row",
    gap: 12,
  },
  fieldContainer: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  fieldInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  fieldValue: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 1,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  menu: {
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  menuItem: { borderBottomWidth: 1 },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
  },
  menuIcon: { marginRight: 16 },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  logoutContainer: { padding: 20 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    gap: 10,
    elevation: 4,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
  },
  modalMascotteContainer: {
    width: 80,
    height: 80,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalMascotte: {
    width: 70,
    height: 70,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  modalButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
