# Notification System

This notification system provides real-time notifications for users with toast notifications and a comprehensive notification panel.

## Features

- **Real-time Notifications**: Automatic polling every 30 seconds for new notifications
- **Toast Notifications**: Immediate toast alerts when new notifications arrive
- **Notification Panel**: Dropdown panel in the navigation showing recent notifications
- **Dedicated Page**: Full notifications page with recent and all notifications tabs
- **Mobile Support**: Notification access in mobile navigation

## Components

### Backend Components

1. **Notification Model** (`backend/models/notification.model.js`)

   - MongoDB schema for notifications
   - Links notifications to users
   - Includes timestamps

2. **Notification Controller** (`backend/controllers/notification.controller.js`)

   - `getUserNotifications`: Get recent notifications (default 5)
   - `getAllUserNotifications`: Get all user notifications
   - `getNotification`: Get specific notification by ID

3. **Notification Routes** (`backend/routes/notification.routes.js`)
   - `GET /api/v1/notification/recent`: Get recent notifications
   - `GET /api/v1/notification/all`: Get all notifications
   - `GET /api/v1/notification/:id`: Get specific notification
   - Protected with authentication middleware

### Frontend Components

1. **Notification Store** (`frontend/stores/notificationStore.js`)

   - Zustand store for notification state management
   - Handles fetching and real-time updates
   - Shows toast notifications for new items

2. **NotificationPanel** (`frontend/components/NotificationPanel.jsx`)

   - Dropdown panel with bell icon
   - Shows notification count badge
   - Tabs for recent vs all notifications

3. **NotificationItem** (`frontend/components/NotificationItem.jsx`)

   - Individual notification display component
   - Shows notification text and time ago

4. **NotificationsPage** (`frontend/pages/NotificationsPage.jsx`)

   - Full-page notification view
   - Tabbed interface for recent/all notifications

5. **useNotifications Hook** (`frontend/hooks/useNotifications.js`)
   - Sets up real-time polling
   - Handles visibility change detection

## Usage

### Adding the Notification System

1. The notification panel is automatically added to the desktop navigation
2. Notifications link is added to both desktop and mobile navigation
3. Real-time polling is set up in the main App component
4. Toast notifications appear automatically for new notifications

### Creating Notifications

To create notifications in your backend code:

```javascript
import Notification from "../models/notification.model.js";

// Create a new notification
const notification = new Notification({
  user: userId,
  notification: "Your application has been approved!",
});
await notification.save();
```

### Customizing Toast Notifications

Toast notifications are configured in the main App component:

```javascript
<Toaster
  position="top-right"
  toastOptions={{
    duration: 4000,
    style: {
      background: "#363636",
      color: "#fff",
    },
  }}
/>
```

## API Endpoints

- `GET /api/v1/notification/recent?limit=5` - Get recent notifications
- `GET /api/v1/notification/all` - Get all user notifications
- `GET /api/v1/notification/:id` - Get specific notification

All endpoints require authentication via Bearer token.

## Real-time Updates

The system polls for new notifications every 30 seconds and also checks when the browser tab becomes visible again. When new notifications are detected, they trigger toast notifications automatically.

## Mobile Support

The notification system is fully responsive and includes:

- Notification icon in mobile bottom navigation
- Full notifications page accessible on mobile
- Touch-friendly notification panel

## Dependencies

- `react-hot-toast`: For toast notifications
- `@heroicons/react`: For notification icons
- `zustand`: For state management
- `axios`: For API calls
