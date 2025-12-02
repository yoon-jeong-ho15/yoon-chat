import type { ModalProps } from "../../types/modal";
import Modal from "../modal/Modal";

export default function TrackerModal({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      isMinimized={isMinimized}
      onClose={onClose}
      onMinimize={onMinimize}
      title="트래커"
    >
      <div className="text-xl">Squat Tracker Page - Under Construction</div>
    </Modal>
  );
}
