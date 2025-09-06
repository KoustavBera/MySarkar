import express from "express";
import {
  getNotification,
  getUserNotifications,
  getAllUserNotifications,
} from "../controllers/notification.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const notificationRouter = express.Router();

// Apply authentication to all notification routes
notificationRouter.use(authenticateToken);

notificationRouter.get("/recent", getUserNotifications);
notificationRouter.get("/all", getAllUserNotifications);
notificationRouter.get("/:id", getNotification);

export default notificationRouter;
