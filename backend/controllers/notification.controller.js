import mongoose from "mongoose";
import Notification from "../models/notification.model.js";

export const getNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    res.status(200).json(notification);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is attached to req via auth middleware
    const { limit = 5 } = req.query;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("user", "name email");

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
