import React, { useState, useEffect } from "react";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import useNotificationStore from "../stores/notificationStore.js";
import NotificationItem from "./NotificationItem.jsx";

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("recent");

  const {
    notifications,
    recentNotifications,
    loading,
    error,
    fetchRecentNotifications,
    fetchAllNotifications,
    checkForNewNotifications,
    clearError,
  } = useNotificationStore();

  useEffect(() => {
    // Initial fetch
    fetchRecentNotifications();

    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(() => {
      checkForNewNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (tab === "all" && notifications.length === 0) {
      await fetchAllNotifications();
    }
  };

  const currentNotifications =
    activeTab === "recent" ? recentNotifications : notifications;

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      >
        <BellIcon className="h-6 w-6" />
        {recentNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {recentNotifications.length > 9 ? "9+" : recentNotifications.length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 md:left-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-w-[calc(100vw-2rem)] mr-2 md:mr-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => handleTabChange("recent")}
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === "recent"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Recent (5)
            </button>
            <button
              onClick={() => handleTabChange("all")}
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === "all"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Notifications
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                    <button
                      onClick={clearError}
                      className="mt-2 text-sm text-red-600 hover:text-red-500"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">
                  Loading notifications...
                </p>
              </div>
            ) : currentNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {currentNotifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {currentNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  if (activeTab === "recent") {
                    handleTabChange("all");
                  }
                }}
                className="w-full text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                {activeTab === "recent"
                  ? "View All Notifications"
                  : `Showing ${notifications.length} notifications`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
