import Post from "../models/Post.js";
import User from "../models/User.js";

// Create a new post
export const createPost = async (req, res) => {
	try {
		const { title, content, tags, scheme } = req.body;

		const post = new Post({
			user: req.userId,
			title,
			content,
			tags: tags || [],
			scheme: scheme || null,
		});

		await post.save();
		await post.populate("user", "name email");

		res.status(201).json({
			success: true,
			message: "Post created successfully",
			post,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error creating post",
			error: error.message,
		});
	}
};

// Get all posts with pagination and filtering
export const getAllPosts = async (req, res) => {
	try {
		const { page = 1, limit = 10, tags, sortBy = "recent" } = req.query;
		const userId = req.userId; // From auth middleware

		let query = { isActive: true };

		// Filter by tags if provided
		if (tags) {
			const tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
			query.tags = { $in: tagArray };
		}

		// Sort options
		let sortOptions = {};
		switch (sortBy) {
			case "recent":
				sortOptions = { createdAt: -1 };
				break;
			case "popular":
				sortOptions = { likes: -1, createdAt: -1 };
				break;
			default:
				sortOptions = { createdAt: -1 };
		}

		const posts = await Post.find(query)
			.populate("user", "name email")
			.populate("scheme", "name")
			.populate("comments.user", "name email")
			.sort(sortOptions)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.lean();

		// Add virtual fields and user-specific data
		const postsWithMeta = posts.map((post) => ({
			...post,
			likeCount: post.likes?.length || 0,
			commentCount: post.comments?.length || 0,
			isLikedBy: userId
				? post.likes?.some((like) => like.user.toString() === userId.toString())
				: false,
		}));

		const total = await Post.countDocuments(query);

		res.json({
			success: true,
			posts: postsWithMeta,
			totalPages: Math.ceil(total / limit),
			currentPage: page,
			total,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching posts",
			error: error.message,
		});
	}
};

// Get single post by ID
export const getPostById = async (req, res) => {
	try {
		const userId = req.userId;
		const post = await Post.findById(req.params.id)
			.populate("user", "name email")
			.populate("scheme", "name")
			.populate("comments.user", "name email")
			.lean();

		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}

		// Add virtual fields and user-specific data
		const postWithMeta = {
			...post,
			likeCount: post.likes?.length || 0,
			commentCount: post.comments?.length || 0,
			isLikedBy: userId
				? post.likes?.some((like) => like.user.toString() === userId.toString())
				: false,
		};

		res.json({
			success: true,
			post: postWithMeta,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching post",
			error: error.message,
		});
	}
};

// Like/Unlike a post
export const toggleLike = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}

		const existingLike = post.likes.find(
			(like) => like.user.toString() === req.userId
		);

		if (existingLike) {
			// Unlike the post
			post.likes = post.likes.filter(
				(like) => like.user.toString() !== req.userId
			);
		} else {
			// Like the post
			post.likes.push({ user: req.userId });
		}

		await post.save();

		res.json({
			success: true,
			message: existingLike ? "Post unliked" : "Post liked",
			likeCount: post.likes.length,
			isLiked: !existingLike,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error toggling like",
			error: error.message,
		});
	}
};

// Add comment to a post
export const addComment = async (req, res) => {
	try {
		const { content } = req.body;

		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}

		const comment = {
			user: req.userId,
			content,
		};

		post.comments.push(comment);
		await post.save();

		await post.populate("comments.user", "name email");

		res.status(201).json({
			success: true,
			message: "Comment added successfully",
			comment: post.comments[post.comments.length - 1],
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error adding comment",
			error: error.message,
		});
	}
};

// Delete a post (only by author or admin)
export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}

		// Check if user is the author or has admin role
		if (
			post.user.toString() !== req.userId &&
			!["govt_official"].includes(req.user.role)
		) {
			return res.status(403).json({
				success: false,
				message: "Not authorized to delete this post",
			});
		}

		post.isActive = false;
		await post.save();

		res.json({
			success: true,
			message: "Post deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error deleting post",
			error: error.message,
		});
	}
};

// Get trending tags
export const getTrendingTags = async (req, res) => {
	try {
		const tags = await Post.aggregate([
			{ $match: { isActive: true } },
			{ $unwind: "$tags" },
			{ $group: { _id: "$tags", count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: 10 },
		]);

		res.json({
			success: true,
			tags: tags.map((tag) => ({ name: tag._id, count: tag.count })),
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching trending tags",
			error: error.message,
		});
	}
};
// Get all posts without pagination or filters
export const getAllPostsUnfiltered = async (req, res) => {
	try {
		const userId = req.userId;

		const posts = await Post.find();

		res.json({
			posts: posts,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching all posts",
			error: error.message,
		});
	}
};
