import Navigation from "../components/home/Navigation";
import MessageModal from "../components/message/MessageModal";
import TrackerModal from "../components/tracker/TrackerModal";
import { useModalStore } from "../stores/modalStore";

export default function HomePage() {
  const modals = useModalStore((state) => state.modals);
  const closeModal = useModalStore((state) => state.closeModal);
  const toggleMinimize = useModalStore((state) => state.toggleMinimize);

  return (
    <div className="flex flex-col flex-grow pb-4">
      <MessageModal
        isOpen={modals.message.isOpen}
        isMinimized={modals.message.isMinimized}
        onClose={() => closeModal("message")}
        onMinimize={() => toggleMinimize("message")}
      />
      <TrackerModal
        isOpen={modals.tracker.isOpen}
        isMinimized={modals.tracker.isMinimized}
        onClose={() => closeModal("tracker")}
        onMinimize={() => toggleMinimize("tracker")}
      />
      <div className="flex w-full justify-center fixed bottom-4">
        <Navigation />
      </div>
    </div>
  );
}
