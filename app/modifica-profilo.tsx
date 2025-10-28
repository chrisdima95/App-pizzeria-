import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';

export default function ModificaProfiloScreen() {
  const [nome, setNome] = useState('');
  const [modificato, setModificato] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!modificato) return;

      // Blocca l'evento di uscita

      Alert.alert(
        'Modifiche non salvate',
        'Sei sicuro di voler uscire? Le modifiche andranno perse.',
        [
          { text: 'Annulla', style: 'cancel', onPress: () => {} },
          {
            text: 'Esci senza salvare',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, modificato]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Inserisci nome"
        value={nome}
        onChangeText={(text) => {
          setNome(text);
          setModificato(true);
        }}
      />
      <Button
        title="Salva"
        onPress={() => {
          Alert.alert('Salvato!', 'Le modifiche sono state salvate.');
          setModificato(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
});


