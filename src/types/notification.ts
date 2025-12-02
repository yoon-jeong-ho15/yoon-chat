
// Notification type - represents the notification table in database
export type NotificationRow = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string | null;
  related_user_id: string | null;
  related_message_id: string | null;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
};

// Transformed notification type with camelCase for frontend use
export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string | null;
  relatedUserId: string | null;
  relatedMessageId: string | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
};

// Notification types enum
export type NotificationType =
  | "new_message"
  | "message_reply"
  | "friend_request"
  | "system";
