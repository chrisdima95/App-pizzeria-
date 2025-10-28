import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export interface PizzaModalButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

interface PizzaModalProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: PizzaModalButton[];
  onClose?: () => void;
}

export const PizzaModal: React.FC<PizzaModalProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: "OK" }],
  onClose,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  const handleButtonPress = (button: PizzaModalButton) => {
    if (button.onPress) {
      button.onPress();
    }
    // Chiudi sempre il modal quando un pulsante viene premuto
    if (onClose) {
      onClose();
    }
  };

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case "destructive":
        return {
          backgroundColor: colors.error,
        };
      case "cancel":
        return {
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return {
          backgroundColor: colors.primary,
        };
    }
  };

  const getButtonTextColor = (style?: string) => {
    switch (style) {
      case "cancel":
        return colors.text;
      default:
        return "white";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} accessible={false}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.primary,
                },
              ]}
            >
              {/* Header con mascotte a sinistra e testi a destra */}
              <View style={styles.headerRow}>
                <Image
                  source={require("@/assets/images/Mascotte.png")}
                  style={styles.mascotte}
                  resizeMode="contain"
                />
                <View style={styles.headerTextContainer}>
                  <ThemedText
                    type="title"
                    style={[styles.title, { color: colors.text }]}
                  >
                    {title}
                  </ThemedText>
                  {message && (
                    <ThemedText
                      style={[styles.message, { color: colors.text }]}
                    >
                      {message}
                    </ThemedText>
                  )}
                </View>
              </View>

              {/* Pulsanti */}
              <View style={styles.buttonsContainer}>
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      getButtonStyle(button.style),
                      buttons.length === 1 && styles.singleButton,
                    ]}
                    onPress={() => handleButtonPress(button)}
                    activeOpacity={0.8}
                  >
                    <ThemedText
                      style={[
                        styles.buttonText,
                        { color: getButtonTextColor(button.style) },
                      ]}
                    >
                      {button.text}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 400,
  },
  modalContent: {
    borderRadius: 20,
    borderWidth: 2,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#E53E3E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
    gap: 12,
  },
  mascotte: {
    width: 80,
    height: 80,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  message: {
    fontSize: 14,
    textAlign: "left",
    lineHeight: 20,
    marginTop: 4,
    paddingRight: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  singleButton: {
    borderTopWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
