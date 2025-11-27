import { useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import MessageList, {
  type MessageListRef,
} from "../components/message/MessageList";
import MessageForm from "../components/message/MessageForm";
import GradientContainer from "../components/common/GradientContainer";

export default function MessagePage() {
  const { user } = useAuth();
  const messageListRef = useRef<MessageListRef>(null);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Please log in to view messages.</div>
      </div>
    );
  }

  // Refresh messages after sending
  const handleMessageSent = () => {
    // Trigger a reload of messages without full page reload
    messageListRef.current?.loadMessages();
  };

  return (
    <div className="flex mt-5 mx-8 flex-grow space-x-4">
      <div
        className="w-1/3 border-gray-400 border bg-gray-100
          rounded-2xl font-[500] shadow-lg"
      >
        <h1>메시지를 남겨주세요</h1>
        <div className="border">
          <div>character animation</div>
        </div>
      </div>
      <GradientContainer className="container">
        <MessageList ref={messageListRef} currentUserId={user.id} />
        <MessageForm
          currentUserId={user.id}
          onMessageSent={handleMessageSent}
        />
      </GradientContainer>
    </div>
  );
}
