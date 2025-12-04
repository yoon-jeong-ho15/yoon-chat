import { useAuth } from "../../contexts/useAuth";
import { useMessage } from "../../hooks/message/useMessage";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import Modal from "../modal/Modal";
import { useModal, useModalStore } from "../../stores/modalStore";
import { isAdmin } from "../../utils/user";
import UserList from "./UserList";
import { useAdminMessage } from "../../hooks/message/useAdminMessage";
import EmptyMessageList from "./EmptyList";

export default function MessageModal() {
  const { user } = useAuth();
  if (!user) return null;

  return isAdmin(user.id) ? <AdminMessageModal /> : <UserMessageModal />;
}

export function UserMessageModal() {
  const { user } = useAuth();
  const { isOpen, isMinimized, closeModal } = useModal("message");

  const { messageListProps, messageFormProps } = useMessage({
    currentUserId: user?.id || "",
  });

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      isMinimized={isMinimized}
      onClose={closeModal}
      onMinimize={closeModal}
      title="메시지"
      width="w-110"
      height="h-160"
      className="flex flex-col"
    >
      <MessageList {...messageListProps} currentUserId={user.id} />
      <MessageForm {...messageFormProps} />
    </Modal>
  );
}

export function AdminMessageModal() {
  const { user } = useAuth();
  const { messageListProps, messageFormProps, userListProps } =
    useAdminMessage();
  const isOpen = useModalStore((state) => state.modals.message.isOpen);
  const isMinimized = useModalStore(
    (state) => state.modals.message.isMinimized
  );
  const closeModal = useModalStore((state) => state.closeModal);
  const toggleMinimize = useModalStore((state) => state.toggleMinimize);

  if (!user) return null;
  return (
    <Modal
      isOpen={isOpen}
      isMinimized={isMinimized}
      onClose={() => closeModal("message")}
      onMinimize={() => toggleMinimize("message")}
      title="메시지"
      width="w-180"
      height="h-160"
      className="flex"
    >
      <UserList {...userListProps} />

      <div className="flex-1 flex flex-col">
        {userListProps?.selectedUser ? (
          <>
            <MessageList {...messageListProps} currentUserId={user.id} />
            <MessageForm {...messageFormProps} />
          </>
        ) : (
          <EmptyMessageList />
        )}
      </div>
    </Modal>
  );
}
