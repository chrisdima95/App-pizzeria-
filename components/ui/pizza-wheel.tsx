import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { usePizzaModal } from "@/hooks/use-pizza-modal";
import { useWheelCooldown } from "@/hooks/use-wheel-cooldown";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { type Offer } from "@/types/offer";

// Import immagine con require per compatibilità Android
// (gli import default di asset possono dare problemi con Metro su alcune piattaforme)
const RuotaImage = require("@/assets/images/ruota.png");

const { width: screenWidth } = Dimensions.get("window");
const WHEEL_SIZE = Math.min(screenWidth * 1.0, 600);

interface PizzaWheelProps {
  offers: Offer[];
  onOfferSelected: (offer: Offer) => void;
  disabled?: boolean;
  redeemedOffers?: string[];
}

export function PizzaWheel({
  offers,
  onOfferSelected,
  disabled = false,
  redeemedOffers = [],
}: PizzaWheelProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { showModal, ModalComponent } = usePizzaModal();
  const { handleSpinAttempt, CooldownElement } = useWheelCooldown();

  const [isSpinning, setIsSpinning] = useState(false);

  // Inizializza valore animato per la rotazione della ruota
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Funzione di reset dello stato della ruota dopo una giocata
  const resetWheelState = () => {
    setIsSpinning(false);
    spinValue.setValue(0);
  };

  // Funzione che avvia l'animazione e la logica di scelta dell'offerta casuale
  const spinWheel = () => {
    if (isSpinning || disabled) return;

    if (!handleSpinAttempt()) {
      return;
    }

    setIsSpinning(true);

    // Piccola animazione "mini-zoom" iniziale
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Calcola quante rotazioni fare e l'angolo di stop casuale
    const randomSpins = 5 + Math.random() * 3;
    const randomAngle = Math.random() * 360;
    const totalRotation = randomSpins * 360 + randomAngle;

    Animated.timing(spinValue, {
      toValue: totalRotation,
      duration: 5000,
      useNativeDriver: true,
      easing: (t) => {
        return 1 - Math.pow(1 - t, 3);
      },
    }).start(() => {
      // Logica per determinare quale fetta viene selezionata
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      const sliceAngle = 360 / offers.length;
      const selectedIndex = Math.floor(normalizedAngle / sliceAngle);

      const offer = offers[selectedIndex];
      setIsSpinning(false);

      setTimeout(() => {
        showOfferResult(offer);
      }, 1000);
    });
  };

  // Funzione che mostra la modale al termine dell'animazione (offerta vinta)
  const showOfferResult = (offer: Offer) => {
    const message = `Offerta selezionata: ${
      offer.name
    }\n\nPrezzo scontato: €${offer.price.toFixed(2)}${
      offer.originalPrice
        ? ` (risparmi €${(offer.originalPrice - offer.price).toFixed(2)})`
        : ""
    }\n\n${offer.description}`;

    showModal("Offerta Speciale!", message, [
      {
        text: "Annulla",
        style: "cancel",
        onPress: resetWheelState,
      },
      {
        text: "Riscatta",
        onPress: () => {
          resetWheelState();
          onOfferSelected(offer);
        },
        style: "default",
      },
    ]);
  };

  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.wheelContainer}>
        <View style={[styles.arrow, { borderBottomColor: colors.primary }]} />

        <Animated.View
          style={{
            transform: [{ rotate: spinInterpolate }, { scale: scaleValue }],
          }}
        >
          <Image
            source={RuotaImage}
            style={styles.wheelImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[
          styles.spinButton,
          {
            backgroundColor: isSpinning ? colors.border : colors.primary,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        onPress={spinWheel}
        disabled={isSpinning || disabled}
        activeOpacity={0.8}
      >
        <ThemedText
          style={[
            styles.spinButtonText,
            {
              color: isSpinning ? colors.text : "white",
            },
          ]}
        >
          {isSpinning ? "Girando..." : "Gira la ruota!"}
        </ThemedText>
      </TouchableOpacity>

      <ModalComponent />
      {CooldownElement}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  wheelContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -20,
    marginTop: 20,
  },
  wheelImage: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
  },
  arrow: {
    position: "absolute",
    top: 50,
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 30,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    zIndex: 10,
    transform: [{ rotate: "180deg" }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  spinButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: "#703537",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  spinButtonText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
