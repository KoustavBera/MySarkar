import React from "react";

const NotificationItem = ({ notification }) => {
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return notificationDate.toLocaleDateString();
  };

  const timeAgo = formatTimeAgo(notification.createdAt);

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex items-start space-x-3">
        {/* Notification Icon */}
        <div className="flex-shrink-0">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 leading-5">
            {notification.notification}
          </p>
          <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
