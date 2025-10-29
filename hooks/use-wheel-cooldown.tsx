import { CooldownModal } from "@/components/ui/cooldown-modal";
import { useOrder } from "@/contexts/OrderContext";
import { useCallback, useEffect, useState } from "react";

const COOLDOWN_HOURS = 24;
const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000; // 24 ore in millisecondi

export const useWheelCooldown = () => {
  const { lastWheelSpinTimestamp, redeemedOffers, hasOfferInCart } = useOrder();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isOnCooldown, setIsOnCooldown] = useState<boolean>(false);
  const [showCooldownModal, setShowCooldownModal] = useState<boolean>(false);

  // Calcola il tempo rimanente
  const calculateTimeRemaining = useCallback(() => {
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

  // Verifica se può girare la ruota
  // Regole:
  // - Se c'è già un'offerta nel carrello, non può girare di nuovo finché non conferma o rimuove l'offerta
  // - Se non ci sono offerte riscattate, può girare
  // - Se ha riscattato e confermato, vale il cooldown di 24h
  const canSpinWheel = useCallback(() => {
    if (hasOfferInCart) return false;
    // Se non ci sono offerte riscattate, può sempre girare la ruota
    if (redeemedOffers.length === 0) return true;
    
    // Se non c'è timestamp dell'ultimo utilizzo, può girare
    if (!lastWheelSpinTimestamp) return true;
    
    const now = Date.now();
    const timeSinceLastSpin = now - lastWheelSpinTimestamp;
    
    // Può girare solo se è passato il tempo di cooldown
    return timeSinceLastSpin >= COOLDOWN_MS;
  }, [lastWheelSpinTimestamp, redeemedOffers.length, hasOfferInCart]);

  // Gestisce il tentativo di girare la ruota
  const handleSpinAttempt = useCallback(() => {
    if (!canSpinWheel()) {
      showCooldownModalHandler();
      return false;
    }
    return true;
  }, [canSpinWheel, showCooldownModalHandler]);

  const CooldownElement = (
    <CooldownModal
      visible={showCooldownModal}
      onClose={hideCooldownModal}
      timeRemaining={timeRemaining}
    />
  );

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
