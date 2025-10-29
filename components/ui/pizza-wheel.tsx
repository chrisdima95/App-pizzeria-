import RuotaImage from "@/assets/images/Ruota.png";
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
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { type Offer } from "./offer-carousel";

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
  const [isManualSpinning, setIsManualSpinning] = useState(false);

  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const gestureRef = useRef(null);
  const manualRotation = useRef(0);
  const lastAngle = useRef(0);
  const lastPosition = useRef({ x: 0, y: 0 });
  const gestureVelocity = useRef({ x: 0, y: 0 });
  const initialPosition = useRef({ x: 0, y: 0 });
  const isCircularGesture = useRef(false);

  const calculateAngle = (x: number, y: number) => {
    const centerX = WHEEL_SIZE / 2;
    const centerY = WHEEL_SIZE / 2;
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
    return angle < 0 ? angle + 360 : angle;
  };

  const isGestureCircular = (x: number, y: number) => {
    const centerX = WHEEL_SIZE / 2;
    const centerY = WHEEL_SIZE / 2;
    
    const distanceFromCenter = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    
    if (distanceFromCenter > WHEEL_SIZE / 2) {
      return false;
    }
    
    const deltaX = x - initialPosition.current.x;
    const deltaY = y - initialPosition.current.y;
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (totalMovement < 20) {
      return false;
    }
    
    const angleToCenter = Math.atan2(y - centerY, x - centerX);
    const angleToInitial = Math.atan2(initialPosition.current.y - centerY, initialPosition.current.x - centerX);
    const angleDifference = Math.abs(angleToCenter - angleToInitial);
    
    return angleDifference > 0.3;
  };

  const resetWheelState = () => {
    setIsSpinning(false);
    setIsManualSpinning(false);
    manualRotation.current = 0;
    lastPosition.current = { x: 0, y: 0 };
    gestureVelocity.current = { x: 0, y: 0 };
    initialPosition.current = { x: 0, y: 0 };
    isCircularGesture.current = false;
    spinValue.setValue(0);
  };

  const spinWheel = () => {
    if (isSpinning || disabled) return;

    if (!handleSpinAttempt()) {
      return;
    }

    setIsSpinning(true);

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

  const startManualSpin = (x: number, y: number) => {
    if (isSpinning || disabled) return;

    if (!handleSpinAttempt()) {
      return;
    }

    setIsManualSpinning(true);
    lastAngle.current = calculateAngle(x, y);
    manualRotation.current = 0;
    lastPosition.current = { x, y };
    initialPosition.current = { x, y };
    gestureVelocity.current = { x: 0, y: 0 };
    isCircularGesture.current = false;
  };

  const continueManualSpin = (x: number, y: number) => {
    if (!isManualSpinning) return;

    if (!isCircularGesture.current) {
      isCircularGesture.current = isGestureCircular(x, y);
      
      if (!isCircularGesture.current) {
        setIsManualSpinning(false);
        return;
      }
    }

    const centerX = WHEEL_SIZE / 2;
    const centerY = WHEEL_SIZE / 2;
    
    const deltaX = x - lastPosition.current.x;
    const deltaY = y - lastPosition.current.y;
    gestureVelocity.current = { x: deltaX, y: deltaY };
    
    const lastAngle = Math.atan2(
      lastPosition.current.y - centerY, 
      lastPosition.current.x - centerX
    );
    const currentAngle = Math.atan2(y - centerY, x - centerX);
    
    let angleDelta = currentAngle - lastAngle;
    
    if (angleDelta > Math.PI) {
      angleDelta -= 2 * Math.PI;
    } else if (angleDelta < -Math.PI) {
      angleDelta += 2 * Math.PI;
    }
    
    const rotationDelta = angleDelta * (180 / Math.PI);
    manualRotation.current += rotationDelta;
    
    lastPosition.current = { x, y };
    
    spinValue.setValue(manualRotation.current);
  };

  const endManualSpin = () => {
    if (!isManualSpinning) return;

    setIsManualSpinning(false);
    setIsSpinning(true);

    const totalVelocity = Math.sqrt(
      Math.pow(gestureVelocity.current.x, 2) + 
      Math.pow(gestureVelocity.current.y, 2)
    );
    
    const velocityMultiplier = Math.max(0.3, Math.min(2, totalVelocity / 30));
    const additionalSpins = Math.max(0.5, Math.min(4, velocityMultiplier * 1.5));
    
    let finalDirection = 1;
    if (Math.abs(gestureVelocity.current.x) > Math.abs(gestureVelocity.current.y)) {
      finalDirection = gestureVelocity.current.x > 0 ? 1 : -1;
    } else {
      finalDirection = gestureVelocity.current.y > 0 ? 1 : -1;
    }
    
    const finalRotation = manualRotation.current + (additionalSpins * 360 * finalDirection);

    Animated.timing(spinValue, {
      toValue: finalRotation,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      const normalizedAngle = (360 - (finalRotation % 360)) % 360;
      const sliceAngle = 360 / offers.length;
      const selectedIndex = Math.floor(normalizedAngle / sliceAngle);

      const offer = offers[selectedIndex];
      setIsSpinning(false);

      setTimeout(() => {
        showOfferResult(offer);
      }, 1000);
    });
  };

  const onGestureEvent = (event: any) => {
    const { x, y } = event.nativeEvent;
    
    if (isManualSpinning) {
      continueManualSpin(x, y);
    }
  };

  const onHandlerStateChange = (event: any) => {
    const { state, x, y } = event.nativeEvent;
    
    const centerX = WHEEL_SIZE / 2;
    const centerY = WHEEL_SIZE / 2;
    const radius = WHEEL_SIZE / 2;
    
    const distanceFromCenter = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    
    if (distanceFromCenter <= radius) {
      switch (state) {
        case State.BEGAN:
          startManualSpin(x, y);
          break;
        case State.END:
        case State.CANCELLED:
          if (isCircularGesture.current) {
            endManualSpin();
          } else {
            setIsManualSpinning(false);
            resetWheelState();
          }
          break;
      }
    }
  };

  const showOfferResult = (offer: Offer) => {
    const message = `Offerta selezionata: ${offer.name}\n\nPrezzo scontato: €${offer.price.toFixed(2)}${
      offer.originalPrice ? ` (risparmi €${(offer.originalPrice - offer.price).toFixed(2)})` : ""
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
          <PanGestureHandler
            ref={gestureRef}
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
            enabled={!isSpinning && !disabled}
            shouldCancelWhenOutside={false}
            activeOffsetX={[-10, 10]}
            activeOffsetY={[-10, 10]}
            failOffsetX={[-50, 50]}
            failOffsetY={[-50, 50]}
          >
            <Animated.View style={styles.gestureContainer}>
              <Image
                source={RuotaImage}
                style={styles.wheelImage}
                resizeMode="contain"
              />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[
          styles.spinButton,
          {
            backgroundColor: (isSpinning || isManualSpinning) ? colors.border : colors.primary,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        onPress={spinWheel}
        disabled={isSpinning || isManualSpinning || disabled}
        activeOpacity={0.8}
      >
        <ThemedText
          style={[
            styles.spinButtonText,
            {
              color: (isManualSpinning || isSpinning) ? colors.text : "white",
            },
          ]}
        >
          {isManualSpinning ? "Girando..." : isSpinning ? "Girando..." : "Gira la ruota!"}
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
  gestureContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    overflow: 'hidden',
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
