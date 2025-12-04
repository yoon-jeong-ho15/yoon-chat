import { create } from 'zustand';
import type { RefObject } from 'react';

export type ModalType = 'message' | 'tracker' | 'account' | 'notification';

type ModalState = {
  isOpen: boolean;
  isMinimized: boolean;
};

type ModalStore = {
  modals: Record<ModalType, ModalState>;
  target: { modalType: ModalType; targetId: string } | null;
  openModal: (modalType: ModalType) => void;
  closeModal: (modalType: ModalType) => void;
  toggleShow: (modalType: ModalType) => void;
  toggleMinimize: (modalType: ModalType) => void;
  setTarget: (modalType: ModalType, targetId: string) => void;
  clearTarget: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  modals: {
    message: { isOpen: false, isMinimized: false },
    tracker: { isOpen: false, isMinimized: false },
    account: { isOpen: false, isMinimized: false },
    notification: { isOpen: false, isMinimized: false },
  },
  target: null,
  openModal: (modalType) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalType]: {
          ...state.modals[modalType],
          isOpen: true,
        },
      },
    })),
  closeModal: (modalType) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalType]: { isOpen: false, isMinimized: false },
      },
    })),
  toggleShow: (modalType)=>set((state)=>({
    modals: { ...state.modals, [modalType]: {...state.modals[modalType], isOpen : !state.modals[modalType].isOpen}}
  })),
  toggleMinimize: (modalType) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalType]: {
          ...state.modals[modalType],
          isMinimized: !state.modals[modalType].isMinimized,
        },
      },
    })),
  setTarget: (modalType, targetId) =>
    set({
      target: { modalType, targetId },
    }),
  clearTarget: () =>
    set({
      target: null,
    }),
}));

export const useModal = (modalType: ModalType) => {
  const isOpen = useModalStore((state) => state.modals[modalType].isOpen);
  const isMinimized = useModalStore((state) => state.modals[modalType].isMinimized);
  const target = useModalStore((state) => state.target);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const toggleShow = useModalStore((state) => state.toggleShow);
  const toggleMinimize = useModalStore((state) => state.toggleMinimize);
  const setTarget = useModalStore((state) => state.setTarget);
  const clearTarget = useModalStore((state) => state.clearTarget);

  const scrollToTarget = (containerRef: RefObject<HTMLElement | null>) => {
    if (target?.modalType === modalType && target.targetId && containerRef.current) {
      const element = containerRef.current.querySelector(
        `[data-id="${target.targetId}"]`
      );
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clearTarget();
      }
    }
  };

  return {
    isOpen,
    isMinimized,
    target: target?.modalType === modalType ? target : null,
    openModal: () => openModal(modalType),
    closeModal: () => closeModal(modalType),
    toggleShow: () => toggleShow(modalType),
    toggleMinimize: () => toggleMinimize(modalType),
    setTarget: (targetId: string) => setTarget(modalType, targetId),
    scrollToTarget,
  };
};
