import React from "react";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import useNotificationStore from "../stores/notificationStore.js";

const NotificationTester = () => {
  const { fetchRecentNotifications } = useNotificationStore();

  const createTestNotification = async () => {
    try {
      // This would typically be done by the backend when certain events occur
      // For testing purposes, you can create a test endpoint or manually add to database
      toast.success("Test notification created! Check your notifications.", {
        duration: 3000,
      });

      // Refresh notifications to show the new one
      setTimeout(() => {
        fetchRecentNotifications();
      }, 1000);
    } catch (error) {
      toast.error("Failed to create test notification");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Notification System Tester</h3>
      <p className="text-sm text-gray-600 mb-4">
        This component is for testing the notification system. In a real app,
        notifications would be created by backend events.
      </p>
      <button
        onClick={createTestNotification}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Simulate New Notification
      </button>
    </div>
  );
};

export default NotificationTester;
