import { CooldownModal } from "@/components/ui/cooldown-modal";
import { useOrder } from "@/contexts/OrderContext";
import { useCallback, useEffect, useState } from "react";

// Hook custom che gestisce la logica di cooldown della ruota della fortuna (regole business: solo 1 giro ogni 24h e 1 offerta riscattata per ordine/cartello)
const COOLDOWN_HOURS = 24;
const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000; // 24 ore in millisecondi

export const useWheelCooldown = () => {
  const { lastWheelSpinTimestamp, redeemedOffers, hasOfferInCart } = useOrder();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isOnCooldown, setIsOnCooldown] = useState<boolean>(false);
  const [showCooldownModal, setShowCooldownModal] = useState<boolean>(false);

  // Calcola quanto tempo manca prima di poter rigirare la ruota (controllo timestamp su ordine/redeem)
  const calculateTimeRemaining = useCallback(() => {
    // Se user non ha ancora mai girato la ruota, tutto ok
    if (!lastWheelSpinTimestamp) {
      setTimeRemaining(0);
      setIsOnCooldown(false);
      return;
    }

    const now = Date.now();
    const timeSinceLastSpin = now - lastWheelSpinTimestamp;
    const remaining = COOLDOWN_MS - timeSinceLastSpin;

    if (remaining > 0) {
      setTimeRemaining(remaining);
      setIsOnCooldown(true);
    } else {
      setTimeRemaining(0);
      setIsOnCooldown(false);
    }
  }, [lastWheelSpinTimestamp]);

  // Aggiorna il countdown ogni secondo
  useEffect(() => {
    calculateTimeRemaining();
    
    const interval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeRemaining]);

  // Formatta il tempo rimanente in ore, minuti e secondi
  const formatTimeRemaining = (ms: number) => {
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

  // Mostra il modale di cooldown
  const showCooldownModalHandler = useCallback(() => {
    setShowCooldownModal(true);
  }, []);

  const hideCooldownModal = useCallback(() => {
    setShowCooldownModal(false);
  }, []);

  // Verifica se l'utente può realmente girare la ruota
  // Rules: non deve avere offerta in carrello, se ha già riscattato può solo dopo COOLDOWN_MS
  const canSpinWheel = useCallback(() => {
    if (hasOfferInCart) return false;
    if (redeemedOffers.length === 0) return true;
    if (!lastWheelSpinTimestamp) return true;
    const now = Date.now();
    const timeSinceLastSpin = now - lastWheelSpinTimestamp;
    return timeSinceLastSpin >= COOLDOWN_MS;
  }, [lastWheelSpinTimestamp, redeemedOffers.length, hasOfferInCart]);

  // Quando tenti giro ruota: se regole non rispettate mostra modale di blocco, altrimenti true
  const handleSpinAttempt = useCallback(() => {
    if (!canSpinWheel()) {
      showCooldownModalHandler();
      return false;
    }
    return true;
  }, [canSpinWheel, showCooldownModalHandler]);

  // Elemento React pronto da renderizzare con il modale che mostra il countdown attivo (giorno, ora, secondi mancanti)
  const CooldownElement = (
    <CooldownModal
      visible={showCooldownModal}
      onClose={hideCooldownModal}
      timeRemaining={timeRemaining}
    />
  );

  // Restituisce API usabile nei componenti consumer per sapere se mostrarsi/abilitare pulsanti o mostrare avviso di blocco
  return {
    isOnCooldown,
    timeRemaining,
    formatTimeRemaining,
    canSpinWheel,
    handleSpinAttempt,
    showCooldownModal: showCooldownModalHandler,
    CooldownElement,
  };
};
