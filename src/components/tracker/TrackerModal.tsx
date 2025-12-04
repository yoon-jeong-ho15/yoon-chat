import Modal from "../modal/Modal";
import { useModal } from "../../stores/modalStore";

export default function TrackerModal() {
  const { isOpen, isMinimized, closeModal } = useModal("tracker");

  return (
    <Modal
      isOpen={isOpen}
      isMinimized={isMinimized}
      onClose={closeModal}
      onMinimize={closeModal}
      title="트래커"
      width="w-140"
      height="h-140"
      className="flex flex-col"
    >
      <div className="flex flex-col items-center">
        <h1 className="text-xl">개발중입니다.</h1>
      </div>
      <div className="flex-1 w-full bg-gray-200"></div>
    </Modal>
  );
}
