import { useRef } from "react";
import { useAuth } from "../../contexts/useAuth";
import MessageList, { type MessageListRef } from "./MessageList";
import MessageForm from "./MessageForm";
import Modal from "../modal/Modal";
import type { ModalProps } from "../../types/modal";

export default function MessageModal({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
}: ModalProps) {
  const { user } = useAuth();
  const messageListRef = useRef<MessageListRef>(null);

  if (!isOpen) return null;

  if (!user) {
    return null;
  }

  // Refresh messages after sending
  const handleMessageSent = () => {
    // Trigger a reload of messages without full page reload
    messageListRef.current?.loadMessages();
  };

  return (
    <Modal
      isOpen={isOpen}
      isMinimized={isMinimized}
      onClose={onClose}
      onMinimize={onMinimize}
      title="메시지"
    >
      <MessageList ref={messageListRef} currentUserId={user.id} />
      <MessageForm currentUserId={user.id} onMessageSent={handleMessageSent} />
    </Modal>
  );
}
