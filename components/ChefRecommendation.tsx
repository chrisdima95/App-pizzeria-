import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface Pizza {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  ingredients: string[];
  fullDescription: string;
  category: "rosse" | "bianche" | "speciali";
  nutrition: {
    calories: string;
    carbs: string;
    protein: string;
    fat: string;
  };
}

interface ChefRecommendationProps {
  pizza: Pizza;
}

export function ChefRecommendation({
  pizza,
}: ChefRecommendationProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Animazioni per la comparsa della mascotte e del testo
  const [mascotteOpacity] = useState(new Animated.Value(0));
  const [mascotteScale] = useState(new Animated.Value(0.5));
  const [textOpacity] = useState(new Animated.Value(0));
  const [textTranslateX] = useState(new Animated.Value(-50));

  // Testo che verrà mostrato con effetto macchina da scrivere
  const [displayedText, setDisplayedText] = useState("");
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Testo completo che verrà visualizzato
  const fullText = `Il nostro chef consiglia: ${pizza.name} - ${pizza.description}`;

  // Animazione del testo carattere per carattere
  const animateText = useCallback(() => {
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    let currentIndex = 0;
    const textInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(textInterval);
        setIsTextComplete(true);
      }
    }, 50); // Velocità di scrittura: 50ms per carattere
  }, [fullText, textOpacity, textTranslateX]);

  // Effetto che lancia l'animazione della mascotte e successivamente quella del testo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);

      // Animazione mascotte
      Animated.parallel([
        Animated.timing(mascotteOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(mascotteScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Dopo mascotte, parte animazione del testo
        setTimeout(() => {
          animateText();
        }, 500);
      });
    }, 2500); // Delay per sincronizzazione con animazioni precedenti

    return () => clearTimeout(timer);
  }, [animateText, mascotteOpacity, mascotteScale]);

  

  const handleClose = () => {
    setIsVisible(false);
  };

  const handlePress = () => {
    if (!isTextComplete) return;

    router.push({
      pathname: "/pizza-details",
      params: {
        id: pizza.id,
        name: pizza.name,
        price: pizza.price,
        description: pizza.description,
        fullDescription: pizza.fullDescription,
        ingredients: JSON.stringify(pizza.ingredients),
        nutrition: JSON.stringify(pizza.nutrition),
        image: pizza.image,
      },
    });
  };

  if (!isAnimating || !isVisible) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: mascotteOpacity,
            transform: [{ scale: mascotteScale }],
          },
        ]}
      >
        <Image
          source={require("@/assets/images/Mascotte.png")}
          style={styles.mascotteImage}
          resizeMode="cover"
        />

        <Animated.View
          style={[
            styles.textContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.primary,
              opacity: textOpacity,
              transform: [{ translateX: textTranslateX }],
            },
          ]}
        >
          {/* Pulsante di chiusura */}
          <TouchableOpacity
            style={[
              styles.closeButton,
              {
                backgroundColor: colors.background,
                borderColor: colors.primary,
                opacity: isTextComplete ? 1 : 0,
              },
            ]}
            onPress={handleClose}
            activeOpacity={0.7}
            disabled={!isTextComplete}
          >
            <ThemedText
              style={[styles.closeButtonText, { color: colors.text }]}
            >
              ×
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              {
                opacity: isTextComplete ? 1 : 0.7,
              },
            ]}
            onPress={handlePress}
            disabled={!isTextComplete}
            activeOpacity={0.8}
          >
            <ThemedText
              style={[styles.recommendationText, { color: colors.text }]}
            >
              {displayedText}
              {!isTextComplete && (
                <ThemedText style={[styles.cursor, { color: colors.primary }]}>
                  |
                </ThemedText>
              )}
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30, // Spostato un po' più sopra per dare più spazio
    left: 30, // Spostato a destra
    zIndex: 1000, // Container del modale
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "flex-end", // Allinea in basso per sovrapposizione
    position: "relative",
  },
  mascotteImage: {
    width: 120, // Ingrandita del 50%
    height: 120,
    borderRadius: 60,
    // Posizionamento per essere attaccato ai bordi della modale
    position: "absolute",
    left: -20, // Sporge dalla modale verso sinistra
    bottom: -8, // Sporge dalla modale verso il basso
    zIndex: 10, // Sopra la modale
    // Ritaglio per mostrare solo la parte dello chef
    marginTop: -8, // Sposta verso l'alto per mostrare la parte superiore
    marginLeft: -8, // Centra meglio l'immagine
  },
  textContainer: {
    maxWidth: screenWidth * 0.7, // Aumentato per bilanciare con la posizione
    marginLeft: 60, // Spazio per la mascotte più grande
    borderRadius: 20,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingLeft: 20, // Padding sinistro aumentato per spostare il testo verso destra
    paddingVertical: 12,
    paddingRight: 40, // Spazio extra per il pulsante di chiusura
    // Ombra per la modale
    elevation: 4,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: "relative", // Per posizionare il pulsante di chiusura
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 1002, // Sopra tutto
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 16,
  },
  textBubble: {
    // Rimuovi gli stili duplicati, ora sono nel textContainer
  },
  recommendationText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    flexWrap: "wrap", // Permette al testo di andare a capo
    flex: 1, // Occupa tutto lo spazio disponibile
  },
  cursor: {
    fontWeight: "bold",
  },
});
