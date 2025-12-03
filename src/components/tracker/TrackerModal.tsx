import Modal from "../modal/Modal";
import { useModalStore } from "../../stores/modalStore";

export default function TrackerModal() {
  const isOpen = useModalStore((state) => state.modals.tracker.isOpen);
  const isMinimized = useModalStore(
    (state) => state.modals.tracker.isMinimized
  );
  const closeModal = useModalStore((state) => state.closeModal);
  const toggleMinimize = useModalStore((state) => state.toggleMinimize);

  return (
    <Modal
      isOpen={isOpen}
      isMinimized={isMinimized}
      onClose={() => closeModal("tracker")}
      onMinimize={() => toggleMinimize("tracker")}
      title="트래커"
      className="flex flex-col h-160 w-160"
    >
      <div className="flex flex-col items-center">
        <h1 className="text-xl">개발중입니다.</h1>
      </div>
      <div className="flex-1 w-full bg-gray-200"></div>
    </Modal>
  );
}
