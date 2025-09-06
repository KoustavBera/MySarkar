import express from "express";
import {
	register,
	login,
	getMe,
	verifyUser,
	updateProfile,
} from "../controllers/auth.controller.js";
import {
	authenticateToken,
	requireRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getMe);
router.patch(
	"/verify/:userId",
	authenticateToken,
	requireRole(["govt_official"]),
	verifyUser
);
router.put("/update", authenticateToken, updateProfile);
export default router;
