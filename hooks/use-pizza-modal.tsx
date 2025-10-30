import { PizzaModal, PizzaModalButton } from "@/components/ui/pizza-modal";
import { useState } from "react";

interface UsePizzaModalReturn {
  modalVisible: boolean;
  showModal: (
    title: string,
    message?: string,
    buttons?: PizzaModalButton[]
  ) => void;
  hideModal: () => void;
  ModalComponent: any;
}

/**
 * Hook per gestire comodamente un modale custom a livello componente.
 * Restituisce: stato open/close, funzione per mostrare/nascondere modale e componente React da instanziare.
 */
export const usePizzaModal = (): UsePizzaModalReturn => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState<string | undefined>();
  const [modalButtons, setModalButtons] = useState<PizzaModalButton[]>([
    { text: "OK" },
  ]);

  // Mostra il modale con parametri di titolo, messaggio e bottoni personalizzabili
  const showModal = (
    title: string,
    message?: string,
    buttons?: PizzaModalButton[]
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalButtons(buttons || [{ text: "OK" }]);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  // Componente React pronto da inserire (si preoccupa lui di NON renderizzare se modale chiuso)
  const ModalComponent = () => {
    if (!modalVisible) return null;
    return (
      <PizzaModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        buttons={modalButtons}
        onClose={hideModal}
      />
    );
  };

  // Permette ai consumer di agganciare il componente e triggerare show/hide con params
  return {
    modalVisible,
    showModal,
    hideModal,
    ModalComponent,
  };
};
