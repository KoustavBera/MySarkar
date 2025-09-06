import Application from "../models/Application.js";
import PreApplication from "../models/PreApplication.js";
import Notification from "../models/notification.model.js";
export const createApplication = async (req, res) => {
  try {
    const { schemeId } = req.body;

    if (!schemeId) {
      return res.status(400).json({ message: "Scheme ID is required" });
    }

    const existingApplication = await Application.findOne({
      user: req.userId,
      scheme: schemeId,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "Already applied to this scheme" });
    }

    const application = new Application({
      user: req.userId,
      scheme: schemeId,
    });

    await application.save();

    // Update user's applied_schemes array
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.userId);
    if (!user.applied_schemes.includes(schemeId)) {
      user.applied_schemes.push(schemeId);
      await user.save();
    }

    res
      .status(201)
      .json({ message: "Application submitted successfully", application });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to submit application", error: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate("user", "name email phone")
      .populate("scheme")
      .populate("reviewedBy", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appliedAt: -1 });

    const total = await Application.countDocuments(filter);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch applications", error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes,
        reviewedBy: req.userId,
        reviewedAt: new Date(),
      },
      { new: true }
    )
      .populate("user", "name email")
      .populate("scheme");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Build notification message
    const notificationMessage =
      status === "approved"
        ? `Your application for ${application.scheme.schemeName} has been approved!`
        : `Your application for ${
            application.scheme.schemeName
          } has been rejected. ${notes || ""}`;

    // Save notification to DB
    const notification = await Notification.create({
      user: application.user._id,
      notification: notificationMessage,
    });

    // Response to client
    res.json({
      message: "Application status updated",
      application,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update application",
      error: error.message,
    });
  }
};

export const createApplicationAfterEligibility = async (req, res) => {
  try {
    const { schemeId } = req.body;
    const userId = req.userId;

    // Check if user passed eligibility
    const preApp = await PreApplication.findOne({
      user: userId,
      scheme: schemeId,
      eligibilityStatus: "eligible",
    });

    if (!preApp) {
      return res
        .status(403)
        .json({ message: "Eligibility check required first" });
    }

    const application = new Application({
      user: userId,
      scheme: schemeId,
      status: "pending",
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Application failed", error: error.message });
  }
};
