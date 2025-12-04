import { useMessage } from "../../hooks/message/useMessage";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import Modal from "../modal/Modal";
import { useModal } from "../../stores/modalStore";
import UserList from "./UserList";
import EmptyMessageList from "./EmptyList";

export default function MessageModal() {
  const { isOpen, isMinimized, closeModal } = useModal("message");
  const messageData = useMessage();

  return (
    <Modal
      isOpen={isOpen}
      isMinimized={isMinimized}
      onClose={closeModal}
      onMinimize={closeModal}
      title="메시지"
      width="w-180"
      height="h-160"
      className="flex"
    >
      <UserList
        users={messageData.users}
        messageCount={messageData.messageCount}
        selectedUser={messageData.selectedUser}
        toggleSelectedUser={messageData.toggleSelectedUser}
      />

      <div className="flex-1 flex flex-col">
        {messageData.selectedUser ? (
          <>
            <MessageList
              messages={messageData.messages}
              messageDivRef={messageData.messageDivRef}
            />
            <MessageForm
              message={messageData.message}
              setMessage={messageData.setMessage}
              isSubmitting={messageData.isSubmitting}
              textareaRef={messageData.textareaRef}
              handleSubmit={messageData.handleSubmit}
              handleKeyDown={messageData.handleKeyDown}
              selectedUser={messageData.selectedUser}
            />
          </>
        ) : (
          <EmptyMessageList />
        )}
      </div>
    </Modal>
  );
}
