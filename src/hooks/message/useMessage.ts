import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type FormEvent,
} from "react";
import type { Message } from "../../types/message";
import { ERROR_MESSAGES, MESSAGE_POLLING_INTERVAL } from "../../lib/constants";
import type { User } from "../../types/user";
import { fetchAllUsers, fetchUsersByGroup } from "../../lib/data/user";
import {
  fetchAllMessagesByUserId,
  insertMessage,
} from "../../lib/data/message";
import { isAdmin } from "../../utils/user";
import { useModal } from "../../stores/modalStore";
import { validateMessage } from "../../utils/message";
import { useAuth } from "../../contexts";

export function useMessage() {
  const { user } = useAuth();
  const currentUserId = user?.id || "";
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [messageCount, setMessageCount] = useState<Map<string, number>>(
    new Map()
  );
  const { target, scrollToTarget } = useModal("message");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messageDivRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadUsers = useCallback(async () => {
    const allUsers = isAdmin(currentUserId)
      ? await fetchAllUsers(currentUserId)
      : await fetchUsersByGroup(currentUserId);
    setUsers(allUsers);
  }, [currentUserId]);

  const loadMessages = useCallback(async () => {
    const fetchedMessages = await fetchAllMessagesByUserId(user?.id || "");
    setAllMessages(fetchedMessages);

    // Calculate message count for each user
    const counts = new Map<string, number>();
    users.forEach((u) => {
      const count = fetchedMessages.filter(
        (msg) => msg.author.id === u.id || msg.recipient.id === u.id
      ).length;
      counts.set(u.id, count);
    });
    setMessageCount(counts);

    // Update messages for selected user
    if (selectedUser) {
      const userMessages = fetchedMessages.filter(
        (msg) =>
          msg.author.id === selectedUser.id ||
          msg.recipient.id === selectedUser.id
      );
      setMessages(userMessages);
    }
  }, [users, selectedUser]);

  const toggleSelectedUser = (newSelectedUser: User) => {
    if (selectedUser?.id === newSelectedUser.id) {
      setSelectedUser(null);
      setMessages([]);
    } else {
      setSelectedUser(newSelectedUser);
      const userMessages = allMessages.filter(
        (msg) =>
          msg.author.id === newSelectedUser.id ||
          msg.recipient.id === newSelectedUser.id
      );
      setMessages(userMessages);
    }
  };

  // Handle message submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    validateMessage(message);

    try {
      const messageId = await insertMessage(
        currentUserId,
        message,
        selectedUser?.id
      );

      if (messageId) {
        setMessage("");
        // Trigger refresh after sending
        await loadMessages();

        requestAnimationFrame(() => {
          textareaRef.current?.focus();
        });
      } else {
        alert(ERROR_MESSAGES.MESSAGE.SEND_FAILED);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert(ERROR_MESSAGES.MESSAGE.SEND_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key - Submit on Enter, new line on Shift+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageDivRef.current) {
      messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
    }
  }, [messages]);

  // Scroll to target message when target is set
  useEffect(() => {
    if (target) {
      scrollToTarget(messageDivRef);
    }
  }, [target, scrollToTarget]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Polling every 3 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadMessages();
    }, MESSAGE_POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [loadMessages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [message]);

  return {
    users,
    selectedUser,
    toggleSelectedUser,
    messageCount,
    messages,
    messageDivRef,
    message,
    setMessage,
    isSubmitting,
    textareaRef,
    handleSubmit,
    handleKeyDown,
  };
}
