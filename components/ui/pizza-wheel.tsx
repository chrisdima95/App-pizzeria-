import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { usePizzaModal } from "@/hooks/use-pizza-modal";
import { useWheelCooldown } from "@/hooks/use-wheel-cooldown";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { Offer } from "./offer-carousel";

const { width: screenWidth } = Dimensions.get("window");
const WHEEL_SIZE = Math.min(screenWidth * 1.0, 600); // Aumentato del 100% (da 0.8 a 1.6)

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
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showResult, setShowResult] = useState(false);

  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const spinWheel = () => {
    if (isSpinning || disabled) return;

    // Controlla il cooldown prima di permettere la rotazione
    if (!handleSpinAttempt()) {
      return;
    }

    setIsSpinning(true);
    setShowResult(false);
    setSelectedOffer(null);

    // Animazione di scala per feedback tattile
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

    // Calcola rotazione casuale (almeno 5 giri completi + angolo casuale)
    const randomSpins = 5 + Math.random() * 3; // 5-8 giri
    const randomAngle = Math.random() * 360;
    const totalRotation = randomSpins * 360 + randomAngle;

    // Animazione di rotazione fluida
    const fastDuration = 3000; // 3 secondi di velocità elevata
    const slowDuration = 5000; // 5 secondi di rallentamento graduale

    // Prima fase: velocità elevata
    Animated.timing(spinValue, {
      toValue: totalRotation * 0.8, // 80% della rotazione in velocità elevata
      duration: fastDuration,
      useNativeDriver: true,
    }).start(() => {
      // Seconda fase: rallentamento graduale
      Animated.timing(spinValue, {
        toValue: totalRotation,
        duration: slowDuration,
        useNativeDriver: true,
      }).start(() => {
        // Calcola quale offerta è stata selezionata (puntatore in alto a 0°)
        const normalizedAngle = (360 - (totalRotation % 360)) % 360;
        const sliceAngle = 360 / offers.length;
        const selectedIndex = Math.floor(normalizedAngle / sliceAngle);

        const offer = offers[selectedIndex];
        setSelectedOffer(offer);
        setIsSpinning(false);

        // Mostra il risultato dopo un breve delay
        setTimeout(() => {
          setShowResult(true);
          showOfferResult(offer);
        }, 1000);
      });
    });
  };

  const showOfferResult = (offer: Offer) => {
    const message = `Hai vinto: ${offer.name}\n\nPrezzo: €${offer.price.toFixed(2)}${
      offer.originalPrice ? ` (era €${offer.originalPrice.toFixed(2)})` : ""
    }\n\n${offer.description}`;

    showModal("🎉 Congratulazioni!", message, [
      {
        text: "Annulla",
        style: "cancel",
      },
      {
        text: "Riscatta",
        onPress: () => onOfferSelected(offer),
        style: "default",
      },
    ]);
  };

  // Rimosso il pulsante "Gira di nuovo": il reset manuale non è più previsto

  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.wheelContainer}>
        {/* Freccia indicatrice in alto */}
        <View style={[styles.arrow, { borderBottomColor: colors.primary }]} />

        {/* Ruota con immagine */}
        <Animated.View
          style={{
            transform: [{ rotate: spinInterpolate }, { scale: scaleValue }],
          }}
        >
          <Image
            source={require("@/assets/images/Ruota.png")}
            style={styles.wheelImage}
            resizeMode="contain"
          />
        </Animated.View>

      </View>

      {/* Pulsante per girare */}
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
          {isSpinning ? "Girando..." : "Gira la Ruota!"}
        </ThemedText>
      </TouchableOpacity>

      {/* Risultato */}
      {showResult && selectedOffer && (
        <View
          style={[
            styles.resultContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <ThemedText style={[styles.resultTitle, { color: colors.primary }]}>
            🎉 Hai vinto!
          </ThemedText>
          <ThemedText style={[styles.resultOffer, { color: colors.text }]}>
            {selectedOffer.name}
          </ThemedText>
          <ThemedText style={[styles.resultPrice, { color: colors.primary }]}>
            €{selectedOffer.price.toFixed(2)}
          </ThemedText>
        </View>
      )}

      {/* Modal personalizzato */}
      <ModalComponent />
      
      {/* Modal cooldown (stabile) */}
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
    marginBottom: -50,
    marginTop: 20, // Aggiustato margine superiore dopo rimozione titolo
  },
  wheelImage: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
  },
  arrow: {
    position: "absolute",
    top: 65, // Avvicinato alla pizza (era -6)
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    zIndex: 10,
    transform: [{ rotate: "180deg" }],
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
  resultContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    minWidth: 250,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  resultOffer: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  resultPrice: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
  },
});
