import { ChefRecommendation } from '@/components/ChefRecommendation';
import { TabHeader } from '@/components/TabHeader';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useOrder } from '@/contexts/OrderContext';
import { useTransitionAnimations } from '@/hooks/use-transition-animations';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated from 'react-native-reanimated';

interface Pizza {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  ingredients: string[];
  fullDescription: string;
  category: 'rosse' | 'bianche' | 'speciali';
  nutrition: {
    calories: string;
    carbs: string;
    protein: string;
    fat: string;
  };
}

const pizzas: Pizza[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    price: '8.50',
    description: 'Pomodoro, mozzarella, basilico',
    image: '🍕',
    ingredients: ['Pomodoro San Marzano', 'Mozzarella di bufala', 'Basilico fresco', 'Olio extravergine d\'oliva', 'Sale marino'],
    fullDescription: 'Una deliziosa pizza con pomodoro, mozzarella fresca e basilico. Ingredienti selezionati e preparata nel forno a legna per una cottura perfetta.',
    category: 'rosse',
    nutrition: {
      calories: '250 kcal',
      carbs: '30g',
      protein: '12g',
      fat: '8g'
    }
  },
  {
    id: '2',
    name: 'Pizza Quattro Stagioni',
    price: '12.00',
    description: 'Prosciutto, funghi, carciofi, olive',
    image: '🍕',
    ingredients: ['Pomodoro', 'Mozzarella', 'Prosciutto cotto', 'Funghi porcini', 'Carciofi', 'Olive nere', 'Olio EVO'],
    fullDescription: 'La classica quattro stagioni con i migliori ingredienti stagionali. Una combinazione perfetta di sapori che rappresenta tutte le stagioni.',
    category: 'rosse',
    nutrition: {
      calories: '280 kcal',
      carbs: '32g',
      protein: '15g',
      fat: '10g'
    }
  },
  {
    id: '3',
    name: 'Pizza Diavola',
    price: '10.50',
    description: 'Pomodoro, mozzarella, salame piccante',
    image: '🍕',
    ingredients: ['Pomodoro', 'Mozzarella', 'Salame piccante', 'Peperoncino', 'Olio piccante', 'Basilico'],
    fullDescription: 'Per i palati più audaci! Una pizza dal sapore intenso con salame piccante e peperoncino. Ideale per chi ama i sapori forti.',
    category: 'rosse',
    nutrition: {
      calories: '270 kcal',
      carbs: '29g',
      protein: '14g',
      fat: '11g'
    }
  },
  {
    id: '4',
    name: 'Pizza Capricciosa',
    price: '11.00',
    description: 'Prosciutto, funghi, carciofi, olive nere',
    image: '🍕',
    ingredients: ['Pomodoro', 'Mozzarella', 'Prosciutto cotto', 'Funghi champignon', 'Carciofi sott\'olio', 'Olive nere', 'Capperi'],
    fullDescription: 'Una pizza ricca e gustosa con una varietà di ingredienti pregiati. Ogni morso è una sorpresa di sapori mediterranei.',
    category: 'rosse',
    nutrition: {
      calories: '290 kcal',
      carbs: '31g',
      protein: '16g',
      fat: '12g'
    }
  },
  {
    id: '5',
    name: 'Pizza Marinara',
    price: '7.50',
    description: 'Pomodoro, aglio, origano, olio',
    image: '🍕',
    ingredients: ['Pomodoro San Marzano', 'Aglio fresco', 'Origano', 'Olio extravergine d\'oliva', 'Sale marino'],
    fullDescription: 'La pizza più antica di Napoli! Solo pomodoro, aglio, origano e olio. Semplice ma dal sapore autentico e inconfondibile.',
    category: 'rosse',
    nutrition: {
      calories: '220 kcal',
      carbs: '28g',
      protein: '8g',
      fat: '6g'
    }
  },
  {
    id: '6',
    name: 'Pizza Bufala',
    price: '13.50',
    description: 'Pomodoro, mozzarella di bufala, basilico',
    image: '🍕',
    ingredients: ['Pomodoro San Marzano', 'Mozzarella di bufala DOP', 'Basilico fresco', 'Olio extravergine d\'oliva', 'Sale marino'],
    fullDescription: 'La regina delle pizze! Mozzarella di bufala cremosa e delicata su base di pomodoro San Marzano. Un\'esperienza di gusto unica.',
    category: 'rosse',
    nutrition: {
      calories: '280 kcal',
      carbs: '30g',
      protein: '15g',
      fat: '12g'
    }
  },
  {
    id: '7',
    name: 'Pizza Prosciutto e Funghi',
    price: '11.50',
    description: 'Pomodoro, mozzarella, prosciutto, funghi',
    image: '🍕',
    ingredients: ['Pomodoro', 'Mozzarella', 'Prosciutto cotto di qualità', 'Funghi champignon', 'Olio EVO', 'Basilico'],
    fullDescription: 'Un classico intramontabile! Prosciutto cotto di qualità e funghi freschi su una base di pomodoro e mozzarella.',
    category: 'rosse',
    nutrition: {
      calories: '275 kcal',
      carbs: '30g',
      protein: '16g',
      fat: '11g'
    }
  },
  {
    id: '8',
    name: 'Pizza Quattro Formaggi',
    price: '12.50',
    description: 'Mozzarella, gorgonzola, parmigiano, fontina',
    image: '🍕',
    ingredients: ['Mozzarella', 'Gorgonzola DOP', 'Parmigiano Reggiano', 'Fontina', 'Olio extravergine d\'oliva'],
    fullDescription: 'Per gli amanti del formaggio! Una combinazione perfetta di quattro formaggi pregiati che si fondono in un sapore unico.',
    category: 'bianche',
    nutrition: {
      calories: '320 kcal',
      carbs: '28g',
      protein: '18g',
      fat: '16g'
    }
  },
  {
    id: '9',
    name: 'Pizza Ortolana',
    price: '10.00',
    description: 'Pomodoro, mozzarella, melanzane, zucchine, peperoni',
    image: '🍕',
    ingredients: ['Pomodoro', 'Mozzarella', 'Melanzane', 'Zucchine', 'Peperoni', 'Basilico', 'Olio EVO'],
    fullDescription: 'La pizza vegetariana per eccellenza! Verdure fresche di stagione grigliate su una base di pomodoro e mozzarella.',
    category: 'rosse',
    nutrition: {
      calories: '240 kcal',
      carbs: '32g',
      protein: '12g',
      fat: '8g'
    }
  },
  {
    id: '10',
    name: 'Pizza Bresaola e Rucola',
    price: '14.00',
    description: 'Mozzarella, bresaola, rucola, pomodorini, grana',
    image: '🍕',
    ingredients: ['Mozzarella', 'Bresaola della Valtellina', 'Rucola fresca', 'Pomodorini', 'Grana Padano', 'Olio EVO'],
    fullDescription: 'Una pizza gourmet! Bresaola della Valtellina, rucola fresca e pomodorini su base di mozzarella. Perfetta per un pranzo raffinato.',
    category: 'bianche',
    nutrition: {
      calories: '290 kcal',
      carbs: '28g',
      protein: '20g',
      fat: '12g'
    }
  },
  {
    id: '11',
    name: 'Pizza Tonno e Cipolle',
    price: '11.00',
    description: 'Pomodoro, mozzarella, tonno, cipolle, olive',
    image: '🍕',
    ingredients: ['Pomodoro', 'Mozzarella', 'Tonno sott\'olio', 'Cipolle rosse', 'Olive nere', 'Olio EVO'],
    fullDescription: 'Un sapore di mare! Tonno sott\'olio e cipolle rosse caramellate su base di pomodoro e mozzarella. Un classico che non passa mai di moda.',
    category: 'rosse',
    nutrition: {
      calories: '285 kcal',
      carbs: '31g',
      protein: '18g',
      fat: '10g'
    }
  },
  {
    id: '12',
    name: 'Pizza Salsiccia e Friarielli',
    price: '13.00',
    description: 'Mozzarella, salsiccia, friarielli, peperoncino',
    image: '🍕',
    ingredients: ['Mozzarella', 'Salsiccia di maiale', 'Friarielli (broccoli di rapa)', 'Peperoncino', 'Aglio', 'Olio EVO'],
    fullDescription: 'Sapore napoletano autentico! Salsiccia di maiale e friarielli (broccoli di rapa) con un tocco di peperoncino. Una tradizione che conquista.',
    category: 'bianche',
    nutrition: {
      calories: '310 kcal',
      carbs: '29g',
      protein: '17g',
      fat: '14g'
    }
  },
  {
    id: '13',
    name: 'Pizza Patate e Salsiccia',
    price: '10.50',
    description: 'Mozzarella, patate, salsiccia, rosmarino',
    image: '🍕',
    ingredients: ['Mozzarella', 'Patate a fette', 'Salsiccia di maiale', 'Rosmarino', 'Olio extravergine d\'oliva', 'Sale'],
    fullDescription: 'Comfort food italiano! Patate a fette e salsiccia con rosmarino su base di mozzarella. Un piatto che scalda il cuore.',
    category: 'bianche',
    nutrition: {
      calories: '295 kcal',
      carbs: '35g',
      protein: '15g',
      fat: '11g'
    }
  },
  {
    id: '14',
    name: 'Pizza Parma e Rucola',
    price: '15.50',
    description: 'Mozzarella, prosciutto di Parma, rucola, pomodorini',
    image: '🍕',
    ingredients: ['Mozzarella', 'Prosciutto di Parma DOP', 'Rucola fresca', 'Pomodorini', 'Grana Padano', 'Olio EVO'],
    fullDescription: 'L\'eccellenza italiana! Prosciutto di Parma DOP e rucola fresca con pomodorini. Una pizza che celebra i migliori prodotti del territorio.',
    category: 'bianche',
    nutrition: {
      calories: '300 kcal',
      carbs: '28g',
      protein: '22g',
      fat: '13g'
    }
  },
  {
    id: '15',
    name: 'Pizza Tartufo e Porcini',
    price: '18.00',
    description: 'Mozzarella, tartufo nero, funghi porcini, rucola',
    image: '🍕',
    ingredients: ['Mozzarella', 'Tartufo nero', 'Funghi porcini', 'Rucola fresca', 'Olio al tartufo', 'Parmigiano'],
    fullDescription: 'Una pizza gourmet di lusso! Tartufo nero e funghi porcini su base di mozzarella. Un\'esperienza culinaria unica per i palati più raffinati.',
    category: 'speciali',
    nutrition: {
      calories: '320 kcal',
      carbs: '26g',
      protein: '18g',
      fat: '18g'
    }
  },
  {
    id: '16',
    name: 'Pizza Gamberi e Zucchine',
    price: '16.50',
    description: 'Mozzarella, gamberi, zucchine, pomodorini',
    image: '🍕',
    ingredients: ['Mozzarella', 'Gamberi freschi', 'Zucchine', 'Pomodorini', 'Aglio', 'Prezzemolo', 'Olio EVO'],
    fullDescription: 'Sapore di mare fresco! Gamberi e zucchine su base di mozzarella. Una pizza estiva perfetta per chi ama i sapori delicati del mare.',
    category: 'speciali',
    nutrition: {
      calories: '280 kcal',
      carbs: '24g',
      protein: '22g',
      fat: '12g'
    }
  },
  {
    id: '17',
    name: 'Pizza Speck e Asiago',
    price: '14.50',
    description: 'Mozzarella, speck, asiago, rucola',
    image: '🍕',
    ingredients: ['Mozzarella', 'Speck dell\'Alto Adige', 'Asiago DOP', 'Rucola fresca', 'Olio EVO', 'Peperoncino'],
    fullDescription: 'Sapori montani! Speck dell\'Alto Adige e Asiago DOP su base di mozzarella. Una combinazione perfetta tra dolcezza e intensità.',
    category: 'speciali',
    nutrition: {
      calories: '310 kcal',
      carbs: '26g',
      protein: '20g',
      fat: '16g'
    }
  }
];

type PizzaCategory = 'rosse' | 'bianche' | 'speciali';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const cardBg = colors.card;
  const mutedText = colors.muted;
  const accentBg = colorScheme === 'dark' ? colors.border : colors.background;
  
  const { orders, addToOrder, updateQuantity, removeFromOrder } = useOrder();
  
  // Calcola il totale degli articoli nel carrello
  const totalItems = orders.reduce((total, item) => total + item.quantity, 0);
  
  const [selectedCategory, setSelectedCategory] = useState<PizzaCategory>('rosse');
  
  // Hook per le animazioni di transizione (senza mascotte)
  const {
    startAnimations,
    getCardAnimatedStyle,
    chefRecommendationAnimatedStyle,
    cartButtonAnimatedStyle,
    categoriesAnimatedStyle,
    backgroundAnimatedStyle,
  } = useTransitionAnimations();

  // Avvia le animazioni quando il componente viene montato
  useEffect(() => {
    // Piccolo delay per permettere alla transizione di completarsi
    const timer = setTimeout(() => {
      startAnimations();
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  
  // Pizza consigliata dinamica - cambia casualmente ad ogni avvio dell'app
  const getChefRecommendation = () => {
    // Genera un numero casuale per ogni avvio dell'app
    const randomIndex = Math.floor(Math.random() * pizzas.length);
    
    return pizzas[randomIndex];
  };
  
  const chefRecommendation = getChefRecommendation();
  
  const categories: { key: PizzaCategory; label: string; emoji: string }[] = [
    { key: 'rosse', label: 'Pizze Rosse', emoji: '🍅' },
    { key: 'bianche', label: 'Pizze Bianche', emoji: '🧀' },
    { key: 'speciali', label: 'Pizze Speciali', emoji: '⭐' }
  ];
  
  const filteredPizzas = pizzas.filter(pizza => pizza.category === selectedCategory);
  
  const getPizzaQuantity = (pizzaId: string) => {
    const orderItem = orders.find(order => order.id === pizzaId);
    return orderItem ? orderItem.quantity : 0;
  };
  
  const handleAddPizza = (pizza: Pizza) => {
    addToOrder({
      id: pizza.id,
      name: pizza.name,
      price: parseFloat(pizza.price),
      quantity: 1
    });
  };
  
  const handleUpdateQuantity = (pizzaId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(pizzaId);
    } else {
      updateQuantity(pizzaId, quantity);
    }
  };

  const handlePizzaPress = (pizza: Pizza) => {
    router.push({
      pathname: '/pizza-details',
      params: {
        id: pizza.id,
        name: pizza.name,
        price: pizza.price,
        description: pizza.description,
        fullDescription: pizza.fullDescription,
        ingredients: JSON.stringify(pizza.ingredients),
        nutrition: JSON.stringify(pizza.nutrition),
        image: pizza.image
      }
    });
  };

  const handleCartPress = () => {
    router.push('/checkout');
  };

  const renderPizzaItem = ({ item, index }: { item: Pizza; index: number }) => {
    const quantity = getPizzaQuantity(item.id);
    // Limita l'indice a 4 (0-4) per evitare errori con le animazioni
    const cardAnimatedStyle = getCardAnimatedStyle(Math.min(index, 4));
    
    return (
      <Animated.View style={[styles.pizzaCard, { 
        backgroundColor: cardBg, 
        borderColor: colors.border,
        pointerEvents: 'auto' 
      }, cardAnimatedStyle]}>
        <TouchableOpacity 
          style={styles.pizzaMainContent}
          onPress={() => handlePizzaPress(item)}
        >
          <View style={[styles.pizzaImage, { backgroundColor: accentBg }]}>
            <ThemedText style={styles.pizzaEmoji}>{item.image}</ThemedText>
          </View>
          <View style={styles.pizzaInfo}>
            <ThemedText type="subtitle" style={styles.pizzaName}>
              {item.name}
            </ThemedText>
            <ThemedText style={[styles.pizzaPrice, { color: colors.primary }]}>
              €{item.price}
            </ThemedText>
          </View>
          <IconSymbol 
            size={20} 
            name="chevron.right" 
            color={colors.icon}
            style={styles.chevron}
          />
        </TouchableOpacity>
        
        {/* Controlli di quantità */}
        <View style={styles.quantityControls}>
          {quantity === 0 ? (
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => handleAddPizza(item)}
            >
              <ThemedText style={styles.addButtonText}>+ Aggiungi</ThemedText>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={() => handleUpdateQuantity(item.id, quantity - 1)}
              >
                <IconSymbol size={16} name="minus" color={colors.text} />
              </TouchableOpacity>
              
              <View style={[styles.quantityDisplay, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <ThemedText style={[styles.quantityText, { color: colors.text }]}>
                  {quantity}
                </ThemedText>
              </View>
              
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: colors.primary }]}
                onPress={() => handleUpdateQuantity(item.id, quantity + 1)}
              >
                <IconSymbol size={16} name="plus" color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background }, backgroundAnimatedStyle]}>
      <TabHeader />

      {/* Barra di selezione categorie animata */}
      <Animated.View style={[styles.categoryBar, { backgroundColor: colors.card, borderColor: colors.border }, categoriesAnimatedStyle]}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryButton,
              {
                backgroundColor: selectedCategory === category.key ? colors.primary : 'transparent',
                borderColor: selectedCategory === category.key ? colors.primary : colors.border,
              }
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <ThemedText style={[
              styles.categoryEmoji,
              { color: selectedCategory === category.key ? 'white' : colors.text }
            ]}>
              {category.emoji}
            </ThemedText>
            <ThemedText style={[
              styles.categoryLabel,
              { 
                color: selectedCategory === category.key ? 'white' : colors.text,
                fontWeight: selectedCategory === category.key ? '600' : '400'
              }
            ]}>
              {category.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Specialità dello Chef */}
      <ChefRecommendation pizza={chefRecommendation} />

      <FlatList
        data={filteredPizzas}
        renderItem={renderPizzaItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.pizzasList}
        showsVerticalScrollIndicator={false}
      />

      {/* Pulsante carrello flottante animato */}
      <Animated.View style={cartButtonAnimatedStyle}>
        <TouchableOpacity
          style={[styles.floatingCartButton, { backgroundColor: colors.primary }]}
          onPress={handleCartPress}
          activeOpacity={0.8}
        >
          <IconSymbol size={24} name="cart.fill" color="white" />
          {totalItems > 0 && (
            <View style={[styles.cartBadge, { backgroundColor: colors.error }]}>
              <ThemedText style={styles.cartBadgeText}>
                {totalItems > 99 ? '99+' : totalItems}
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pizzasList: {
    padding: 20,
  },
  pizzaCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 4px 8px rgba(229, 62, 62, 0.1)',
    elevation: 4,
    borderWidth: 1,
  },
  pizzaMainContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pizzaImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pizzaEmoji: {
    fontSize: 30,
  },
  pizzaInfo: {
    flex: 1,
  },
  pizzaName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  pizzaPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chevron: {
    marginLeft: 10,
  },
  categoryBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 2,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  quantityControls: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  quantityDisplay: {
    minWidth: 40,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  floatingCartButton: {
    position: 'absolute',
    bottom: 30, // Posizionato più in basso, vicino alla tab bar
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
