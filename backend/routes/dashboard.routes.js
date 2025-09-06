import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import {
	authenticateToken,
	requireRole,
} from "../middleware/auth.middleware.js";

const dashboardRouter = express.Router();

dashboardRouter.get(
	"/stats",
	authenticateToken,
	requireRole(["govt_official", "ngo"]),

	getDashboardStats
);

export default dashboardRouter;
