import express from "express";
import {
  createApplication,
  getAllApplications,
  updateApplicationStatus,
  createApplicationAfterEligibility,
} from "../controllers/application.controller.js";
import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// User routes
router.post("/", authenticateToken, createApplication);
router.post(
  "/after-eligibility",
  authenticateToken,
  createApplicationAfterEligibility
);

// Admin routes
router.get(
  "/",
  authenticateToken,
  requireRole(["govt_official"]),
  getAllApplications
);
router.patch(
  "/:id/status",
  authenticateToken,
  requireRole(["govt_official"]),
  updateApplicationStatus
);

export default router;
