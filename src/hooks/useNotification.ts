import { useEffect, useState } from "react";
import {
  fetchNotificationsByUserId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../lib/data/notification";
import type { Notification } from "../types/notification";
import { NOTIFICATION_POLLING_INTERVAL } from "../lib/constants";
import { useModalStore } from "../stores/modalStore";

export function useNotification(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const {openModal, setTarget} = useModalStore();

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, NOTIFICATION_POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [userId]);


  const loadNotifications = async () => {
      if (!userId) return;

      const data = await fetchNotificationsByUserId(userId);
      setNotifications(data);
  };

  const markAsRead = async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      );
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    const success = await markAllNotificationsAsRead(userId);
    if (success) {
      setNotifications((prev) =>
        prev.map((notif) => ({
          ...notif,
          isRead: true,
          readAt: new Date().toISOString(),
        }))
      );
    }
  };

  const viewDetail = async (notification: Notification) => {
    if (!notification || !notification.relatedMessageId) return;

    await markAsRead(notification.id);

    switch (notification.type) {
      case "new_message":
      case "message_reply":
        setTarget("message", notification.relatedMessageId);
        openModal("message");
        break;

      case "friend_request":
        // TODO: Implement friend request navigation
        break;

      case "system":
        // TODO: Implement system notification handling
        break;

      default:
        break;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    viewDetail,
  };
}
