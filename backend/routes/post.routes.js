import express from "express";
import {
	createPost,
	getAllPosts,
	getPostById,
	toggleLike,
	addComment,
	deletePost,
	getTrendingTags,
	getAllPostsUnfiltered,
} from "../controllers/post.controller.js";
import {
	authenticateToken,
	optionalAuth,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes with optional auth
router.get("/", optionalAuth, getAllPosts);
router.get("/all", optionalAuth, getAllPostsUnfiltered); // Add this new route

router.get("/trending-tags", getTrendingTags);
router.get("/:id", optionalAuth, getPostById);
// Protected routes
router.post("/", authenticateToken, createPost);
router.post("/:id/like", authenticateToken, toggleLike);
router.post("/:id/comment", authenticateToken, addComment);
router.delete("/:id", authenticateToken, deletePost);

export default router;
