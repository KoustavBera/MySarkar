import express from "express";
import {
	createScheme,
	getAllSchemes,
	getSchemeById,
	updateScheme,
	deleteScheme,
	getEligibleSchemes,
	approveScheme,
	searchSchemes,
	applyToScheme,
	addToFavorites,
	removeFromFavorites,
	saveUserInteraction,
} from "../controllers/scheme.controller.js";
import {
	authenticateToken,
	requireRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllSchemes);
router.post("/search", searchSchemes);
router.get("/:id", getSchemeById);

// Protected routes
router.get("/eligible/me", authenticateToken, getEligibleSchemes);
router.post("/:id/apply", authenticateToken, applyToScheme);
router.post("/:id/favorite", authenticateToken, addToFavorites);
router.delete("/:id/favorite", authenticateToken, removeFromFavorites);

// Govt official/NGO routes
router.post("/", createScheme);
router.put(
	"/:id",
	authenticateToken,
	requireRole(["govt_official", "ngo"]),
	updateScheme
);
router.delete(
	"/:id",
	authenticateToken,
	requireRole(["govt_official"]),
	deleteScheme
);
router.patch(
	"/:id/approve",
	authenticateToken,
	requireRole(["govt_official"]),
	approveScheme
);

export default router;
