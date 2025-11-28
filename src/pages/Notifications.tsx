import { useEffect, useState } from "react";
import { useAuth } from "../contexts/useAuth";
import {
  fetchNotificationsByUserId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../lib/data/notification";
import type { Notification } from "../lib/types";
import { motion } from "motion/react";
import { CheckIcon, BellIcon } from "@heroicons/react/24/outline";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    const data = await fetchNotificationsByUserId(user.id);
    setNotifications(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, [user?.id]);

  const handleMarkAsRead = async (notificationId: string) => {
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

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;

    const success = await markAllNotificationsAsRead(user.id);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInDays < 7) return `${diffInDays}일 전`;

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="text-gray-500 text-lg">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BellIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">알림</h1>
          {unreadCount > 0 && (
            <span className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            모두 읽음으로 표시
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">알림이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                bg-white rounded-xl shadow-sm p-4 cursor-pointer
                transition-all hover:shadow-md
                ${!notification.isRead ? "border-l-4 border-blue-500 bg-blue-50" : ""}
              `}
              onClick={() => {
                if (!notification.isRead) {
                  handleMarkAsRead(notification.id);
                }
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`text-base font-semibold ${
                        !notification.isRead
                          ? "text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  {notification.content && (
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.content}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{formatDate(notification.createdAt)}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full">
                      {notification.type}
                    </span>
                  </div>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification.id);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                    aria-label="Mark as read"
                  >
                    <CheckIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
