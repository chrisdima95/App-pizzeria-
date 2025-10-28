import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { PizzaCard } from './pizza-card';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.75;
const CARD_SPACING = 20;
const PEEK_WIDTH = 20;

// Funzione per ottenere elementi distintivi per categoria
const getCategoryElements = (category: string) => {
  const elements = {
    kids: { icon: '●', pattern: 'dots', accent: 'top' },
    teens: { icon: '▲', pattern: 'lines', accent: 'right' },
    adults: { icon: '■', pattern: 'grid', accent: 'bottom' },
    seniors: { icon: '◆', pattern: 'diamonds', accent: 'left' },
    family: { icon: '★', pattern: 'stars', accent: 'center' },
    gourmet: { icon: '♦', pattern: 'luxury', accent: 'all' },
  };
  return elements[category as keyof typeof elements] || elements.adults;
};

export interface Offer {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  emoji: string;
  discount?: number;
  category: string;
  ageGroup?: string;
  target?: string;
}

interface OfferCarouselProps {
  offers: Offer[];
  title: string;
  subtitle?: string;
  onSelectOffer: (offer: Offer) => void;
  redeemedOffers: string[];
}

export function OfferCarousel({
  offers,
  title,
  subtitle,
  onSelectOffer,
  redeemedOffers,
}: OfferCarouselProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Animazioni per effetti dinamici
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Effetto di caricamento con animazioni
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => setIsLoading(false));
  }, []);

  // Funzione per calcolare l'opacità e scala basata sulla posizione
  const getCardStyle = (index: number) => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + CARD_SPACING),
      index * (CARD_WIDTH + CARD_SPACING),
      (index + 1) * (CARD_WIDTH + CARD_SPACING),
    ];

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp',
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.95, 1.05, 0.95],
      extrapolate: 'clamp',
    });

    return { opacity, scale };
  };

  const renderOffer = ({ item, index }: { item: Offer; index: number }) => {
    const isRedeemed = redeemedOffers.includes(item.id);
    const hasDiscount = item.originalPrice && item.originalPrice > item.price;
    const categoryElements = getCategoryElements(item.category);
    const cardAnimations = getCardStyle(index);

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          { 
            width: CARD_WIDTH,
            opacity: cardAnimations.opacity,
            transform: [{ scale: cardAnimations.scale }],
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => onSelectOffer(item)}
          disabled={isRedeemed}
          activeOpacity={0.9}
          style={styles.touchableCard}
        >
          <PizzaCard
            variant="elevated"
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: isRedeemed ? 0.6 : 1,
                ...getCategoryBorderStyle(categoryElements.accent, colors),
              },
            ]}
          >
            {/* Pattern di sfondo sottile */}
            <View style={[styles.patternOverlay, getPatternStyle(categoryElements.pattern, colors)]} />
            
            {/* Header con elementi distintivi */}
            <View style={styles.cardHeader}>
              <View style={styles.categoryIndicator}>
                <ThemedText style={[styles.categoryIcon, { color: colors.primary }]}>
                  {categoryElements.icon}
                </ThemedText>
              </View>
              {hasDiscount && (
                <Animated.View 
                  style={[
                    styles.discountBadge, 
                    { backgroundColor: colors.error },
                    styles.badgeAnimation
                  ]}
                >
                  <ThemedText style={styles.discountText}>
                    -{item.discount}%
                  </ThemedText>
                </Animated.View>
              )}
            </View>

            {/* Titolo con typography dinamica */}
            <ThemedText 
              type="subtitle" 
              style={[
                styles.cardTitle,
                { fontSize: index === currentIndex ? 20 : 18 },
                { fontWeight: index === currentIndex ? '800' : '700' }
              ]}
            >
              {item.name}
              {isRedeemed && (
                <ThemedText style={[styles.redeemedText, { color: colors.error }]}>
                  {' '}- RISCATTATA
                </ThemedText>
              )}
            </ThemedText>

            {/* Descrizione con truncation intelligente */}
            <ThemedText 
              style={[
                styles.description, 
                { color: colors.muted },
                { lineHeight: index === currentIndex ? 20 : 18 }
              ]}
              numberOfLines={index === currentIndex ? 4 : 3}
            >
              {item.description}
            </ThemedText>

            {/* Prezzi con highlighting */}
            <View style={styles.priceContainer}>
              {hasDiscount && (
                <ThemedText style={[styles.originalPrice, { color: colors.muted }]}>
                  €{item.originalPrice!.toFixed(2)}
                </ThemedText>
              )}
              <View style={[styles.priceHighlight, { backgroundColor: colors.primary + '10' }]}>
                <ThemedText style={[styles.price, { color: colors.primary }]}>
                  €{item.price.toFixed(2)}
                </ThemedText>
              </View>
            </View>

            {/* CTA Button con micro-interazioni */}
            <TouchableOpacity
              style={[
                styles.cta,
                {
                  backgroundColor: isRedeemed ? colors.border : colors.primary,
                  opacity: isRedeemed ? 0.7 : 1,
                  ...getButtonShadowStyle(index === currentIndex, colors),
                },
              ]}
              onPress={() => onSelectOffer(item)}
              disabled={isRedeemed}
              activeOpacity={0.8}
            >
              <ThemedText
                style={[
                  styles.ctaText,
                  { color: isRedeemed ? colors.text : 'white' },
                  { fontSize: index === currentIndex ? 16 : 14 }
                ]}
              >
                {isRedeemed ? 'Già riscattata' : 'Riscatta offerta'}
              </ThemedText>
            </TouchableOpacity>
          </PizzaCard>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Funzioni helper per stili dinamici
  const getCategoryBorderStyle = (accent: string, colors: any) => {
    const borderStyles = {
      top: { borderTopWidth: 3, borderTopColor: colors.primary },
      right: { borderRightWidth: 3, borderRightColor: colors.primary },
      bottom: { borderBottomWidth: 3, borderBottomColor: colors.primary },
      left: { borderLeftWidth: 3, borderLeftColor: colors.primary },
      center: { borderWidth: 2, borderColor: colors.primary },
      all: { borderWidth: 1, borderColor: colors.primary + '50' },
    };
    return borderStyles[accent as keyof typeof borderStyles] || borderStyles.center;
  };

  const getPatternStyle = (pattern: string, colors: any) => {
    const patterns = {
      dots: { backgroundColor: colors.primary + '05' },
      lines: { backgroundColor: colors.primary + '03' },
      grid: { backgroundColor: colors.primary + '07' },
      diamonds: { backgroundColor: colors.primary + '04' },
      stars: { backgroundColor: colors.primary + '06' },
      luxury: { backgroundColor: colors.primary + '08' },
    };
    return patterns[pattern as keyof typeof patterns] || patterns.dots;
  };

  const getButtonShadowStyle = (isActive: boolean, colors: any) => {
    return isActive ? {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    } : {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    };
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (CARD_WIDTH + CARD_SPACING));
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  if (offers.length === 0) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      {/* Header della sezione con typography migliorata */}
      <View style={styles.header}>
        <ThemedText 
          type="title" 
          style={[
            styles.title,
            { letterSpacing: 0.5 }
          ]}
        >
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText 
            style={[
              styles.subtitle, 
              { color: colors.muted },
              { letterSpacing: 0.3 }
            ]}
          >
            {subtitle}
          </ThemedText>
        )}
      </View>

      {/* Carosello con animazioni avanzate */}
      <FlatList
        ref={flatListRef}
        data={offers}
        renderItem={renderOffer}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.carouselContent,
          { paddingLeft: PEEK_WIDTH }
        ]}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        onScroll={onScroll}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
        bounces={false}
        pagingEnabled={false}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH + CARD_SPACING,
          offset: (CARD_WIDTH + CARD_SPACING) * index,
          index,
        })}
      />

      {/* Indicatori semplici senza progress bar */}
      {offers.length > 1 && (
        <View style={styles.indicatorsContainer}>
          {/* Dots animati */}
          <View style={styles.indicators}>
            {offers.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.indicator,
                  {
                    backgroundColor: index === currentIndex ? colors.primary : colors.border,
                    transform: [{ scale: index === currentIndex ? 1.2 : 1 }],
                  },
                ]}
                onPress={() => scrollToIndex(index)}
                activeOpacity={0.7}
              />
            ))}
          </View>
          
          {/* Counter numerico */}
          <ThemedText style={[styles.counter, { color: colors.muted }]}>
            {currentIndex + 1} di {offers.length}
          </ThemedText>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
    lineHeight: 20,
  },
  carouselContent: {
    paddingHorizontal: 16,
    paddingRight: PEEK_WIDTH,
  },
  cardContainer: {
    marginRight: CARD_SPACING,
  },
  touchableCard: {
    borderRadius: 20,
  },
  card: {
    height: 320,
    justifyContent: 'space-between',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 1,
  },
  categoryIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(112, 53, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  discountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeAnimation: {
    transform: [{ scale: 1.05 }],
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    flex: 1,
    letterSpacing: 0.2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  originalPrice: {
    fontSize: 15,
    textDecorationLine: 'line-through',
    letterSpacing: 0.3,
  },
  priceHighlight: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(112, 53, 55, 0.2)',
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cta: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#703537',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  redeemedText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  indicatorsContainer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 12,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: '#703537',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  counter: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
