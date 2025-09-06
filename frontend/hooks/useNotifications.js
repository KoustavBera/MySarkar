import { useEffect } from "react";
import useNotificationStore from "../stores/notificationStore.js";
import useAuthStore from "../stores/authStore.js";

const useNotifications = () => {
  const { checkForNewNotifications, fetchRecentNotifications } =
    useNotificationStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchRecentNotifications();

    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(() => {
      checkForNewNotifications();
    }, 30000);

    // Also check when the page becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForNewNotifications();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, checkForNewNotifications, fetchRecentNotifications]);
};

export default useNotifications;
