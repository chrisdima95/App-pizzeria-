/**
 * Esempi di utilizzo dei componenti personalizzati della pizzeria
 * Questo file mostra come utilizzare i vari componenti UI creati
 */

import {
    PizzaBadge,
    PizzaButton,
    PizzaCard,
    PizzaDivider,
    PizzaLoading,
    PizzaPrice,
    PizzaTitle,
} from '@/components/ui';
import { PizzaColors } from '@/constants/colors';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export function ComponentUsageExamples() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Esempi di Bottoni */}
      <PizzaTitle level={2} color="primary">
        Esempi di Bottoni
      </PizzaTitle>
      
      <View style={styles.section}>
        <PizzaButton
          title="Bottone Primario"
          onPress={() => {}}
          variant="primary"
          size="medium"
        />
        
        <PizzaButton
          title="Bottone Secondario"
          onPress={() => {}}
          variant="secondary"
          size="medium"
        />
        
        <PizzaButton
          title="Bottone Accent"
          onPress={() => {}}
          variant="accent"
          size="medium"
        />
        
        <PizzaButton
          title="Bottone Outline"
          onPress={() => {}}
          variant="outline"
          size="medium"
        />
        
        <PizzaButton
          title="Bottone Disabilitato"
          onPress={() => {}}
          variant="primary"
          size="medium"
          disabled
        />
      </View>

      <PizzaDivider color="primary" margin="large" />

      {/* Esempi di Card */}
      <PizzaTitle level={2} color="primary">
        Esempi di Card
      </PizzaTitle>
      
      <View style={styles.section}>
        <PizzaCard variant="default" padding="medium">
          <Text>Card Standard</Text>
        </PizzaCard>
        
        <PizzaCard variant="elevated" padding="large">
          <Text>Card con Elevazione</Text>
        </PizzaCard>
        
        <PizzaCard variant="outlined" padding="medium">
          <Text>Card con Bordo</Text>
        </PizzaCard>
      </View>

      <PizzaDivider color="primary" margin="large" />

      {/* Esempi di Badge */}
      <PizzaTitle level={2} color="primary">
        Esempi di Badge
      </PizzaTitle>
      
      <View style={styles.section}>
        <View style={styles.badgeRow}>
          <PizzaBadge text="Successo" variant="success" size="small" />
          <PizzaBadge text="Avviso" variant="warning" size="small" />
          <PizzaBadge text="Errore" variant="error" size="small" />
          <PizzaBadge text="Info" variant="info" size="small" />
        </View>
        
        <View style={styles.badgeRow}>
          <PizzaBadge text="Primario" variant="primary" size="medium" />
          <PizzaBadge text="Secondario" variant="secondary" size="medium" />
        </View>
      </View>

      <PizzaDivider color="primary" margin="large" />

      {/* Esempi di Titoli */}
      <PizzaTitle level={2} color="primary">
        Esempi di Titoli
      </PizzaTitle>
      
      <View style={styles.section}>
        <PizzaTitle level={1} color="primary">Titolo H1</PizzaTitle>
        <PizzaTitle level={2} color="secondary">Titolo H2</PizzaTitle>
        <PizzaTitle level={3} color="accent">Titolo H3</PizzaTitle>
        <PizzaTitle level={4} color="dark">Titolo H4</PizzaTitle>
        <PizzaTitle level={5} color="muted">Titolo H5</PizzaTitle>
        <PizzaTitle level={6} color="primary">Titolo H6</PizzaTitle>
      </View>

      <PizzaDivider color="primary" margin="large" />

      {/* Esempi di Prezzi */}
      <PizzaTitle level={2} color="primary">
        Esempi di Prezzi
      </PizzaTitle>
      
      <View style={styles.section}>
        <PizzaPrice amount={8.50} size="small" />
        <PizzaPrice amount={12.00} size="medium" />
        <PizzaPrice amount={15.50} size="large" />
        <PizzaPrice amount={25.00} currency="$" size="large" />
        <PizzaPrice amount={30.00} showCurrency={false} size="medium" />
      </View>

      <PizzaDivider color="primary" margin="large" />

      {/* Esempi di Loading */}
      <PizzaTitle level={2} color="primary">
        Esempi di Loading
      </PizzaTitle>
      
      <View style={styles.section}>
        <PizzaLoading size="small" color="primary" />
        <PizzaLoading size="medium" color="secondary" text="Caricamento..." />
        <PizzaLoading size="large" color="accent" text="Elaborazione in corso..." />
      </View>

      <PizzaDivider color="primary" margin="large" />

      {/* Esempio di Card Completa */}
      <PizzaTitle level={2} color="primary">
        Esempio di Card Completa
      </PizzaTitle>
      
      <PizzaCard variant="elevated" padding="large">
        <PizzaTitle level={3} color="primary">
          Pizza Margherita
        </PizzaTitle>
        
        <Text style={styles.description}>
          Deliziosa pizza con pomodoro, mozzarella e basilico fresco.
        </Text>
        
        <View style={styles.priceRow}>
          <PizzaPrice amount={8.50} size="large" />
          <PizzaBadge text="Disponibile" variant="success" size="small" />
        </View>
        
        <PizzaDivider color="light" margin="medium" />
        
        <PizzaButton
          title="Aggiungi al carrello"
          onPress={() => {}}
          variant="primary"
          size="large"
        />
      </PizzaCard>

      <PizzaDivider color="primary" margin="large" />

      {/* Esempio di Lista Ordini */}
      <PizzaTitle level={2} color="primary">
        Esempio di Lista Ordini
      </PizzaTitle>
      
      <View style={styles.section}>
        <PizzaCard variant="outlined" padding="medium">
          <View style={styles.orderHeader}>
            <PizzaTitle level={4} color="dark">
              Ordine #123
            </PizzaTitle>
            <PizzaBadge text="In preparazione" variant="warning" size="small" />
          </View>
          
          <Text style={styles.orderDetails}>
            Pizza Margherita x2, Pizza Diavola x1
          </Text>
          
          <View style={styles.orderFooter}>
            <PizzaPrice amount={25.50} size="medium" />
            <Text style={styles.orderDate}>15 Gen 2024</Text>
          </View>
        </PizzaCard>
        
        <PizzaCard variant="outlined" padding="medium">
          <View style={styles.orderHeader}>
            <PizzaTitle level={4} color="dark">
              Ordine #124
            </PizzaTitle>
            <PizzaBadge text="Consegnato" variant="success" size="small" />
          </View>
          
          <Text style={styles.orderDetails}>
            Pizza Capricciosa x1, Pizza Quattro Formaggi x1
          </Text>
          
          <View style={styles.orderFooter}>
            <PizzaPrice amount={23.50} size="medium" />
            <Text style={styles.orderDate}>14 Gen 2024</Text>
          </View>
        </PizzaCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PizzaColors.gray[50],
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  description: {
    fontSize: 16,
    color: PizzaColors.gray[600],
    marginBottom: 12,
    lineHeight: 24,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderDetails: {
    fontSize: 14,
    color: PizzaColors.gray[600],
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 12,
    color: PizzaColors.gray[500],
  },
});

export default ComponentUsageExamples;
