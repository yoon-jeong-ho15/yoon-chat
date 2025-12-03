import { useEffect, useState } from "react";
import { getUnreadNotificationCount } from "../lib/data/notification";
import { NOTIFICATION_POLLING_INTERVAL } from "../lib/constants";

export function useUnreadNotifications(userId?: string) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchUnreadCount = async () => {
      const count = await getUnreadNotificationCount(userId);
      setUnreadCount(count);
    };

    // Initial fetch
    fetchUnreadCount();

    // Poll for updates
    const interval = setInterval(fetchUnreadCount, NOTIFICATION_POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [userId]);

  return unreadCount;
}
