import NuovoIndirizzoModal from '@/app/(modals)/nuovo-indirizzo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function ModalScreen() {
  const { screen } = useLocalSearchParams<{ screen?: string }>();
  const router = useRouter();

  const handleClose = () => router.back();

  let Content = null;

  switch (screen) {
    case 'nuovo-indirizzo':
      Content = <NuovoIndirizzoModal />;
      break;
    default:
      Content = (
        <ThemedView style={styles.centered}>
          <ThemedText type="subtitle">Nessun contenuto disponibile</ThemedText>
        </ThemedView>
      );
      break;
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header modale */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <IconSymbol name="xmark" size={22} color="#007AFF" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          {screen === 'nuovo-indirizzo' ? 'Nuovo indirizzo' : 'Modale'}
        </ThemedText>
      </ThemedView>

      {/* Contenuto dinamico */}
      <ThemedView style={styles.content}>{Content}</ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    marginRight: 12,
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
