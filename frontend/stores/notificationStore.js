import { create } from "zustand";
import api from "../utils/api.js";
import toast from "react-hot-toast";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  recentNotifications: [],
  loading: false,
  error: null,
  lastFetchTime: null,

  // Fetch recent notifications (5 most recent)
  fetchRecentNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/v1/notification/recent?limit=5");
      set({
        recentNotifications: response.data,
        loading: false,
        lastFetchTime: Date.now(),
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch notifications",
        loading: false,
      });
      throw error;
    }
  },

  // Fetch all notifications
  fetchAllNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/v1/notification/all");
      set({
        notifications: response.data,
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch notifications",
        loading: false,
      });
      throw error;
    }
  },

  // Check for new notifications and show toast
  checkForNewNotifications: async () => {
    try {
      const { lastFetchTime, recentNotifications } = get();
      const response = await api.get("/api/v1/notification/recent?limit=5");
      const newNotifications = response.data;

      if (lastFetchTime && newNotifications.length > 0) {
        // Check if there are any new notifications since last fetch
        const latestNotificationTime = new Date(
          newNotifications[0].createdAt
        ).getTime();

        if (latestNotificationTime > lastFetchTime) {
          // Find truly new notifications
          const newOnes = newNotifications.filter(
            (notification) =>
              new Date(notification.createdAt).getTime() > lastFetchTime
          );

          // Show toast for each new notification
          newOnes.forEach((notification) => {
            toast.success(`New notification: ${notification.notification}`, {
              duration: 4000,
              position: "top-right",
            });
          });
        }
      }

      set({
        recentNotifications: newNotifications,
        lastFetchTime: Date.now(),
      });
    } catch (error) {
      console.error("Error checking for new notifications:", error);
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Add a new notification (for real-time updates)
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      recentNotifications: [
        notification,
        ...state.recentNotifications.slice(0, 4),
      ],
    }));

    // Show toast for new notification
    toast.success(`New notification: ${notification.notification}`, {
      duration: 4000,
      position: "top-right",
    });
  },
}));

export default useNotificationStore;
