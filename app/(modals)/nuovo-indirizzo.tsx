import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function NuovoIndirizzoModal() {
  const [via, setVia] = useState('');
  const [citta, setCitta] = useState('');
  const [cap, setCap] = useState('');

  const salvaIndirizzo = () => {
    if (!via || !citta || !cap) {
      Alert.alert('Errore', 'Tutti i campi sono obbligatori.');
      return;
    }
    Alert.alert('Successo', 'Indirizzo salvato correttamente!');
    setVia('');
    setCitta('');
    setCap('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Aggiungi nuovo indirizzo
        </ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Via e numero civico"
          value={via}
          onChangeText={setVia}
        />
        <TextInput
          style={styles.input}
          placeholder="Città"
          value={citta}
          onChangeText={setCitta}
        />
        <TextInput
          style={styles.input}
          placeholder="CAP"
          value={cap}
          onChangeText={setCap}
          keyboardType="numeric"
        />

        <Button title="Salva indirizzo" onPress={salvaIndirizzo} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
});
