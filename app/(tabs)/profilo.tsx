import { TabHeader } from '@/components/TabHeader';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function ProfiloScreen() {
  const router = useRouter();
  const { user, logout, updateUser, isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const cardBg = colors.card;
  const divider = colors.border;
  const logoutBg = colorScheme === 'dark' ? colors.border : colors.background;
  const logoutBorder = colors.border;

  // Stati per i dati personali
  const [isEditing, setIsEditing] = useState(false);
  const [personalData, setPersonalData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    birthDate: user?.birthDate || ''
  });

  // Aggiorna i dati personali quando cambia l'utente
  React.useEffect(() => {
    setPersonalData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      birthDate: user?.birthDate || ''
    });
  }, [user]);

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined' ? window.confirm('Sei sicuro di voler uscire?') : true;
      if (confirmed) {
        logout();
      }
      return;
    }

    Alert.alert('Logout', 'Sei sicuro di voler uscire?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Esci', style: 'destructive', onPress: logout }
    ]);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Salva i dati
      updateUser(personalData);
      setIsEditing(false);
      Alert.alert('Successo', 'Dati personali aggiornati!');
    } else {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setPersonalData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      birthDate: user?.birthDate || ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setPersonalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const menuItems = [
    {
      id: 'orders',
      title: 'I miei ordini',
      icon: 'bag',
      onPress: () => router.push('/ordini')
    }
  ];

  const renderMenuItem = (item: typeof menuItems[0]) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { pointerEvents: 'auto', borderBottomColor: divider }]}
      onPress={item.onPress}
    >
      <View style={styles.menuItemContent}>
        <IconSymbol size={24} name={item.icon as any} color={colors.primary} style={styles.menuIcon} />
        <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
        <IconSymbol size={16} name="chevron.right" color={colors.icon} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContent}>
      <TabHeader title="👤 Profilo" />

      {isAuthenticated ? (
        <>
          {/* User Info */}
          <View style={[styles.userInfo, { backgroundColor: cardBg, borderColor: colors.border }]}>
            <View style={styles.avatar}>
              <IconSymbol size={60} name="person.circle.fill" color={colors.primary} />
            </View>
            {Boolean(user?.name?.trim()) && (
              <ThemedText type="subtitle" style={styles.userName}>
                {user!.name}
              </ThemedText>
            )}
            <ThemedText style={[styles.userEmail, { color: colors.muted }]}>{user?.email || 'email@example.com'}</ThemedText>
          </View>

      {/* Dati personali */}
      <View style={[styles.personalDataCard, { backgroundColor: cardBg, borderColor: colors.border }]}>
        <View style={styles.personalDataHeader}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Dati personali</ThemedText>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={handleEditToggle}
          >
            <ThemedText style={styles.editButtonText}>
              {isEditing ? 'Salva' : 'Modifica'}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.personalDataFields}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldContainer}>
              <ThemedText style={[styles.fieldLabel, { color: colors.muted }]}>Nome</ThemedText>
              {isEditing ? (
                <TextInput
                  style={[styles.fieldInput, { 
                    backgroundColor: colors.background, 
                    borderColor: colors.border,
                    color: colors.text 
                  }]}
                  value={personalData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  placeholder="Inserisci il nome"
                  placeholderTextColor={colors.muted}
                />
              ) : (
                <ThemedText style={[styles.fieldValue, { color: colors.text }]}>
                  {personalData.firstName || 'Non specificato'}
                </ThemedText>
              )}
            </View>
            <View style={styles.fieldContainer}>
              <ThemedText style={[styles.fieldLabel, { color: colors.muted }]}>Cognome</ThemedText>
              {isEditing ? (
                <TextInput
                  style={[styles.fieldInput, { 
                    backgroundColor: colors.background, 
                    borderColor: colors.border,
                    color: colors.text 
                  }]}
                  value={personalData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  placeholder="Inserisci il cognome"
                  placeholderTextColor={colors.muted}
                />
              ) : (
                <ThemedText style={[styles.fieldValue, { color: colors.text }]}>
                  {personalData.lastName || 'Non specificato'}
                </ThemedText>
              )}
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <ThemedText style={[styles.fieldLabel, { color: colors.muted }]}>Email</ThemedText>
            {isEditing ? (
              <TextInput
                style={[styles.fieldInput, { 
                  backgroundColor: colors.background, 
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                value={personalData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Inserisci l'email"
                placeholderTextColor={colors.muted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <ThemedText style={[styles.fieldValue, { color: colors.text }]}>
                {personalData.email || 'Non specificato'}
              </ThemedText>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <ThemedText style={[styles.fieldLabel, { color: colors.muted }]}>Data di nascita</ThemedText>
            {isEditing ? (
              <TextInput
                style={[styles.fieldInput, { 
                  backgroundColor: colors.background, 
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                value={personalData.birthDate}
                onChangeText={(value) => handleInputChange('birthDate', value)}
                placeholder="GG/MM/AAAA"
                placeholderTextColor={colors.muted}
              />
            ) : (
              <ThemedText style={[styles.fieldValue, { color: colors.text }]}>
                {personalData.birthDate || 'Non specificato'}
              </ThemedText>
            )}
          </View>

          {isEditing && (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.border }]}
                onPress={handleCancelEdit}
              >
                <ThemedText style={[styles.cancelButtonText, { color: colors.text }]}>Annulla</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

          {/* Menu Items */}
          <View style={[styles.menu, { backgroundColor: cardBg, borderColor: colors.border }]}>{menuItems.map(renderMenuItem)}</View>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={[
                styles.logoutButton,
                {
                  pointerEvents: 'auto',
                  backgroundColor: logoutBg,
                  borderColor: logoutBorder
                }
              ]}
              onPress={handleLogout}
            >
              <IconSymbol size={20} name="power" color={colors.primary} />
              <ThemedText style={[styles.logoutText, { color: colors.primary }]}>Logout</ThemedText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* Guest User Info */}
          <View style={[styles.userInfo, { backgroundColor: cardBg, borderColor: colors.border }]}>
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
                  pointerEvents: 'auto',
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                }
              ]}
              onPress={handleLogin}
            >
              <IconSymbol size={20} name="person.badge.plus" color="white" />
              <ThemedText style={[styles.logoutText, { color: 'white' }]}>Accedi</ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scrollContent: { paddingBottom: 40 },
  userInfo: {
    alignItems: 'center',
    padding: 30,
    margin: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  avatar: { marginBottom: 16 },
  userName: { 
    fontSize: 22, 
    fontWeight: '700', 
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
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  personalDataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  personalDataFields: {
    gap: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldContainer: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    fontWeight: '500',
  },
  menu: { 
    margin: 20, 
    borderRadius: 20, 
    overflow: 'hidden', 
    elevation: 4,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  menuItem: { borderBottomWidth: 1 },
  menuItemContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 18 
  },
  menuIcon: { marginRight: 16 },
  menuTitle: { 
    flex: 1, 
    fontSize: 16, 
    fontWeight: '600',
  },
  logoutContainer: { padding: 20 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    gap: 10,
    elevation: 2,
  },
  logoutText: { 
    fontSize: 16, 
    fontWeight: '600' 
  }
});
