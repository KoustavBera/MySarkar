import React, { useEffect, useState } from "react";
import { BellIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useNotificationStore from "../stores/notificationStore.js";
import NotificationItem from "../components/NotificationItem.jsx";
import PageContainer from "../components/PageContainer.jsx";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recent");

  const {
    notifications,
    recentNotifications,
    loading,
    error,
    fetchRecentNotifications,
    fetchAllNotifications,
    clearError,
  } = useNotificationStore();

  useEffect(() => {
    fetchRecentNotifications();
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
    <PageContainer>
      <div className="max-w-4xl mx-auto py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div className="flex items-center">
            <BellIcon className="h-8 w-8 text-gray-700 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => handleTabChange("recent")}
              className={`flex-1 py-4 px-6 text-sm font-medium ${
                activeTab === "recent"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Recent Notifications ({recentNotifications.length})
            </button>
            <button
              onClick={() => handleTabChange("all")}
              className={`flex-1 py-4 px-6 text-sm font-medium ${
                activeTab === "all"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Notifications ({notifications.length})
            </button>
          </div>

          {/* Content */}
          <div className="min-h-96">
            {error && (
              <div className="p-6 bg-red-50 border-l-4 border-red-400 m-6 rounded">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                    <button
                      onClick={clearError}
                      className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading notifications...</p>
              </div>
            ) : currentNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-500">
                  {activeTab === "recent"
                    ? "You don't have any recent notifications"
                    : "You don't have any notifications yet"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {currentNotifications?.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={() =>
              activeTab === "recent"
                ? fetchRecentNotifications()
                : fetchAllNotifications()
            }
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Refreshing..." : "Refresh Notifications"}
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default NotificationsPage;
