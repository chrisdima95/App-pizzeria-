import React, { useState } from "react";
import { PizzaModal, PizzaModalButton } from "@/components/ui";

interface UsePizzaModalReturn {
  modalVisible: boolean;
  showModal: (
    title: string,
    message?: string,
    buttons?: PizzaModalButton[]
  ) => void;
  hideModal: () => void;
  ModalComponent: () => React.ReactElement | null;
}

export const usePizzaModal = (): UsePizzaModalReturn => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState<string | undefined>();
  const [modalButtons, setModalButtons] = useState<PizzaModalButton[]>([
    { text: "OK" },
  ]);

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

  return {
    modalVisible,
    showModal,
    hideModal,
    ModalComponent,
  };
};
