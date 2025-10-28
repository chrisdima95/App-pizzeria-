import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { Offer } from './offer-carousel';

const { width: screenWidth } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(screenWidth * 0.86, 340);

interface PizzaWheelProps {
  offers: Offer[];
  onOfferSelected: (offer: Offer) => void;
  disabled?: boolean;
  redeemedOffers?: string[];
}

export function PizzaWheel({ offers, onOfferSelected, disabled = false, redeemedOffers = [] }: PizzaWheelProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isContinuousSpinning, setIsContinuousSpinning] = useState(true);
  
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const continuousSpinValue = useRef(new Animated.Value(0)).current;
  
  // Animazione continua di rotazione lenta
  useEffect(() => {
    if (isContinuousSpinning && !isSpinning) {
      const continuousAnimation = Animated.loop(
        Animated.timing(continuousSpinValue, {
          toValue: 360,
          duration: 8000, // 8 secondi per un giro completo
          useNativeDriver: true,
        })
      );
      continuousAnimation.start();
      
      return () => continuousAnimation.stop();
    }
  }, [isContinuousSpinning, isSpinning]);

  // Geometria ruota
  const radius = WHEEL_SIZE / 2;
  const innerRadius = radius * 0.18; // foro centrale
  const sliceAngle = 360 / offers.length;

  const degToRad = (deg: number) => (Math.PI / 180) * deg;

  const polarToCartesian = (r: number, angle: number) => {
    const a = degToRad(angle - 90);
    return { x: radius + r * Math.cos(a), y: radius + r * Math.sin(a) };
  };

  const describeSlice = (startDeg: number, endDeg: number) => {
    const outerStart = polarToCartesian(radius, endDeg);
    const outerEnd = polarToCartesian(radius, startDeg);
    const innerStart = polarToCartesian(innerRadius, startDeg);
    const innerEnd = polarToCartesian(innerRadius, endDeg);
    const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
    // Anello: arco esterno + arco interno inverso
    return [
      `M ${innerStart.x} ${innerStart.y}`,
      `L ${outerEnd.x} ${outerEnd.y}`,
      `A ${radius} ${radius} 0 ${largeArc} 0 ${outerStart.x} ${outerStart.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`,
      'Z',
    ].join(' ');
  };

  // Colori alternati per le fette
  const getSliceColor = (index: number) => {
    const colors = [
      '#E53E3E', // Rosso pomodoro
      '#F6E05E', // Giallo mozzarella
      '#38A169', // Verde basilico
      '#703537', // Marrone crosta
      '#F6AD55', // Arancione
      '#8B4513', // Marrone scuro
    ];
    return colors[index % colors.length];
  };

  const spinWheel = () => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);
    setIsContinuousSpinning(false);
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

    // Calcola rotazione casuale (almeno 3 giri completi + angolo casuale)
    const randomSpins = 3 + Math.random() * 2; // 3-5 giri
    const randomAngle = Math.random() * 360;
    const totalRotation = randomSpins * 360 + randomAngle;

    // Animazione di rotazione con velocità elevata per almeno 2 secondi
    const fastDuration = 2000; // 2 secondi di velocità elevata
    const slowDuration = 3000; // 3 secondi di rallentamento
    
    // Prima fase: velocità elevata
    Animated.timing(spinValue, {
      toValue: totalRotation * 0.7, // 70% della rotazione in velocità elevata
      duration: fastDuration,
      useNativeDriver: true,
    }).start(() => {
      // Seconda fase: rallentamento graduale
      Animated.timing(spinValue, {
        toValue: totalRotation,
        duration: slowDuration,
        useNativeDriver: true,
      }).start(() => {
        // Calcola quale offerta è stata selezionata puntatore in alto (0°)
        const normalizedAngle = (360 - (totalRotation % 360)) % 360;
        const selectedIndex = Math.floor(normalizedAngle / sliceAngle);
        
        const offer = offers[selectedIndex];
        setSelectedOffer(offer);
        setIsSpinning(false);
        setIsContinuousSpinning(true);
        
        // Mostra il risultato dopo un breve delay
        setTimeout(() => {
          setShowResult(true);
          showOfferResult(offer);
        }, 500);
      });
    });

    // Animazione di pulse durante la rotazione
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 10 }
    );
    pulseAnimation.start();
  };

  const showOfferResult = (offer: Offer) => {
    Alert.alert(
      '🎉 Congratulazioni!',
      `Hai vinto: ${offer.name}\n\nPrezzo: €${offer.price.toFixed(2)}${offer.originalPrice ? ` (era €${offer.originalPrice.toFixed(2)})` : ''}\n\n${offer.description}`,
      [
        {
          text: 'Annulla',
          style: 'cancel',
        },
        {
          text: 'Riscatta',
          onPress: () => onOfferSelected(offer),
          style: 'default',
        },
      ]
    );
  };

  const resetWheel = () => {
    setShowResult(false);
    setSelectedOffer(null);
    spinValue.setValue(0);
    continuousSpinValue.setValue(0);
    setIsContinuousSpinning(true);
  };

  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const continuousSpinInterpolate = continuousSpinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  // Combina le due rotazioni
  const combinedRotation = isSpinning ? spinInterpolate : continuousSpinInterpolate;

  const labels = useMemo(() => offers.map(o => o.name.split(' ')[0]), [offers]);

  // Gestione swipe
  const handleSwipe = () => {
    spinWheel();
  };

  const onGestureEvent = (event: any) => {
    // Gestisce il movimento del dito
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === 5) { // END
      handleSwipe();
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={[styles.title, { color: colors.primary }]}>
        🍕 Ruota della Fortuna Pizza
      </ThemedText>
      
      <ThemedText style={[styles.subtitle, { color: colors.muted }]}>
        Gira la ruota e vinci un'offerta speciale!
      </ThemedText>

      <View style={styles.wheelContainer}>
        <PanGestureHandler 
          onGestureEvent={onGestureEvent} 
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={{ transform: [{ rotate: combinedRotation }, { scale: scaleValue }] }}
          >
            <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
              <G>
                {offers.map((offer, index) => {
                  const start = index * sliceAngle;
                  const end = (index + 1) * sliceAngle;
                  const d = describeSlice(start, end);
                  return (
                    <Path key={offer.id} d={d} fill={getSliceColor(index)} />
                  );
                })}
                {/* bordo pizza */}
                <Circle cx={radius} cy={radius} r={radius} stroke="#5c2e2f" strokeWidth={3} fill="transparent" />
                <Circle cx={radius} cy={radius} r={innerRadius} fill={'#3b1719'} />
              </G>
            </Svg>
          </Animated.View>
        </PanGestureHandler>

        {/* Etichette semplici posizionate sull'anello */}
        {labels.map((label, index) => {
          const middle = index * sliceAngle + sliceAngle / 2;
          const labelR = (radius + innerRadius) / 2 + innerRadius * 0.2;
          const pt = polarToCartesian(labelR, middle);
          return (
            <View key={`lbl-${index}`} style={[styles.textOverlay, { left: pt.x - 28, top: pt.y - 10 }]}> 
              <Text style={styles.sliceText} numberOfLines={1}>{label}</Text>
            </View>
          );
        })}

        {/* Freccia indicatrice in alto */}
        <View style={[styles.arrow, { borderBottomColor: colors.primary }]} />

        {/* Indicatore centrale */}
        <View style={[styles.centerIndicator, { backgroundColor: colors.primary }]}>
          <Text style={styles.centerText}>🍕</Text>
        </View>
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
        <Animated.Text
          style={[
            styles.spinButtonText,
            {
              color: isSpinning ? colors.text : 'white',
              transform: [{ scale: pulseValue }],
            },
          ]}
        >
          {isSpinning ? 'Girando...' : 'Gira la Ruota!'}
        </Animated.Text>
      </TouchableOpacity>

      {/* Risultato */}
      {showResult && selectedOffer && (
        <View style={[styles.resultContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText style={[styles.resultTitle, { color: colors.primary }]}>
            🎉 Hai vinto!
          </ThemedText>
          <ThemedText style={[styles.resultOffer, { color: colors.text }]}>
            {selectedOffer.name}
          </ThemedText>
          <ThemedText style={[styles.resultPrice, { color: colors.primary }]}>
            €{selectedOffer.price.toFixed(2)}
          </ThemedText>
          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: colors.border }]}
            onPress={resetWheel}
          >
            <ThemedText style={[styles.resetButtonText, { color: colors.text }]}>
              Gira di nuovo
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 24,
    textAlign: 'center',
  },
  wheelContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  textOverlay: {
    position: 'absolute',
    width: 56,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  sliceText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  centerIndicator: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#703537',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 8,
  },
  centerText: {
    fontSize: 24,
  },
  arrow: {
    position: 'absolute',
    top: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    zIndex: 10,
  },
  spinButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#703537',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  spinButtonText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    minWidth: 250,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  resultOffer: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  resultPrice: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
