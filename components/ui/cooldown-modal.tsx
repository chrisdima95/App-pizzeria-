import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface CooldownModalProps {
  visible: boolean;
  onClose: () => void;
  timeRemaining: number;
}

export function CooldownModal({
  visible,
  onClose,
  timeRemaining,
}: CooldownModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [displayTime, setDisplayTime] = useState(timeRemaining);

  // Mantiene il tempo rimanente aggiornato quando cambia la prop
  useEffect(() => {
    setDisplayTime(timeRemaining);
  }, [timeRemaining]);

  // Funzione per formattare il tempo rimanente in hh:mm:ss
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return {
      hours,
      minutes,
      seconds,
      formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    };
  };

  // Oggetto con orario formattato
  const time = formatTime(displayTime);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Mascotte */}
          <View style={styles.mascotteContainer}>
            <Image
              source={require("@/assets/images/Mascotte.png")}
              style={styles.mascotte}
              resizeMode="contain"
            />
          </View>

          {/* Titolo */}
          <ThemedText type="title" style={[styles.title, { color: colors.primary }]}>
          Offerta Già Riscattata
          </ThemedText>

          {/* Messaggio */}
          <ThemedText style={[styles.message, { color: colors.text }]}>
            Hai già riscattato un&apos;offerta dalla ruota della fortuna!{'\n'}
            Devi aspettare il tempo indicato per poter rigirare la ruota.
          </ThemedText>

          {/* Countdown Timer */}
          <View style={[styles.timerContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <ThemedText style={[styles.timerLabel, { color: colors.muted }]}>
              Prossima girata disponibile tra:
            </ThemedText>
            <ThemedText type="title" style={[styles.timer, { color: colors.primary }]}>
              {time.formatted}
            </ThemedText>
          </View>

          {/* Pulsante */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.buttonText}>
              Capito!
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    borderWidth: 2,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mascotteContainer: {
    width: 100,
    height: 100,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotte: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  timerContainer: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: "center",
  },
  timerLabel: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  timer: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  timerDetails: {
    fontSize: 12,
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: "#703537",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
