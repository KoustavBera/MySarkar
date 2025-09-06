// controllers/schemesController.js
import Scheme from "../models/Scheme.js";
import { pipeline } from "@xenova/transformers";

//import all_schemes model
import AllScheme from "../models/all_schemes.model.js";
import { vectorSearch } from "../utils/searchSchemes.js";

// Load the embedder once (reuse it across requests)
let embedder;
const embedderPromise = (async () => {
	embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
	return embedder;
})();

function buildTextForEmbedding({
	name,
	acronym,
	overview,
	eligibility,
	benefits,
	documents,
	apply,
	tags,
	faq,
}) {
	const eligibilityText =
		typeof eligibility === "string"
			? eligibility
			: JSON.stringify(eligibility || "");
	const benefitsText =
		typeof benefits === "string" ? benefits : benefits?.description || "";

	const faqText =
		Array.isArray(faq) && faq.length
			? faq.map((q) => `${q.question || ""} ${q.answer || ""}`).join(". ")
			: "";

	return [
		name || "",
		acronym || "",
		overview || "",
		eligibilityText,
		benefitsText,
		documents || "",
		apply || "",
		(tags || []).join(", "),
		faqText,
	]
		.filter(Boolean)
		.join(". ");
}

async function generateEmbeddingForScheme(schemeObj) {
	await embedderPromise;
	const text = buildTextForEmbedding(schemeObj);
	const output = await embedder(text, { pooling: "mean", normalize: true });
	return Array.from(output.data || []);
}

/* CREATE */
export const createScheme = async (req, res) => {
	try {
		const {
			source_url,
			name,
			acronym,
			tags,
			state,
			level,
			overview,
			eligibility,
			benefits,
			documents,
			apply,
			faq,
			isActive,
			isFeatured,
			priority,
		} = req.body;

		const scheme = new Scheme({
			source_url,
			name,
			acronym,
			tags,
			state,
			level,
			overview,
			eligibility,
			benefits,
			documents,
			apply,
			faq,
			isActive: isActive !== undefined ? isActive : true,
			isFeatured: !!isFeatured,
			priority: priority || "medium",
			createdBy: req.userId,
		});

		// Generate embedding from textual fields
		try {
			scheme.embedding = await generateEmbeddingForScheme({
				name,
				acronym,
				overview,
				eligibility,
				benefits,
				documents,
				apply,
				tags,
				faq,
			});
		} catch (embedErr) {
			console.warn("Embedding generation failed:", embedErr.message);
			// proceed without embedding (still save)
			scheme.embedding = [];
		}

		await scheme.save();
		res.status(201).json({ message: "Scheme created successfully", scheme });
	} catch (error) {
		res
			.status(400)
			.json({ message: "Failed to create scheme", error: error.message });
	}
};

/* LIST / FILTER */
export const getAllSchemes = async (req, res) => {
	try {
		const page = parseInt(req.query.page || "1", 10) || 1;
		const limit = parseInt(req.query.limit || "10", 10) || 10;
		const { category, state, isActive } = req.query;

		const filter = {};
		// only apply isActive filter if provided (explicit)
		if (isActive !== undefined) {
			// accept "true"/"false" (strings)
			filter.isActive = String(isActive) === "true";
		}

		if (category && typeof category === "string") filter.category = category;
		if (state && typeof state === "string") filter.state = state;

		// tags filter (comma separated)
		if (req.query.tags) {
			const tags = String(req.query.tags)
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean);
			if (tags.length) filter.tags = { $in: tags };
		}

		const schemes = await Scheme.find(filter)
			.populate("createdBy", "name email")
			.limit(limit)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });

		const total = await Scheme.countDocuments(filter);

		res.json({
			schemes,
			totalPages: Math.ceil(total / limit),
			currentPage: page,
			total,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Failed to fetch schemes", error: error.message });
	}
};

/* GET BY ID */
export const getSchemeById = async (req, res) => {
	try {
		const scheme = await Scheme.findById(req.params.id)
			.populate("createdBy", "name email")
			.populate("lastModifiedBy", "name email");

		if (!scheme) return res.status(404).json({ message: "Scheme not found" });

		res.json({ scheme });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Failed to fetch scheme", error: error.message });
	}
};

/* UPDATE */
export const updateScheme = async (req, res) => {
	try {
		const updateFields = (({
			source_url,
			name,
			acronym,
			tags,
			state,
			level,
			overview,
			eligibility,
			benefits,
			documents,
			apply,
			faq,
			isActive,
			isFeatured,
			priority,
		}) => ({
			source_url,
			name,
			acronym,
			tags,
			state,
			level,
			overview,
			eligibility,
			benefits,
			documents,
			apply,
			faq,
			isActive,
			isFeatured,
			priority,
		}))(req.body);

		// remove undefined fields
		Object.keys(updateFields).forEach(
			(k) => updateFields[k] === undefined && delete updateFields[k]
		);

		updateFields.lastModifiedBy = req.userId;

		const prev = await Scheme.findById(req.params.id);
		if (!prev) return res.status(404).json({ message: "Scheme not found" });

		const scheme = await Scheme.findByIdAndUpdate(req.params.id, updateFields, {
			new: true,
			runValidators: true,
		});

		// Regenerate embedding if any of the textual fields changed
		const textKeys = [
			"name",
			"acronym",
			"overview",
			"eligibility",
			"benefits",
			"documents",
			"apply",
			"tags",
			"faq",
		];
		const changed = textKeys.some(
			(k) =>
				req.body[k] !== undefined &&
				JSON.stringify(req.body[k]) !== JSON.stringify(prev[k])
		);
		if (changed) {
			try {
				scheme.embedding = await generateEmbeddingForScheme({
					name: scheme.name,
					acronym: scheme.acronym,
					overview: scheme.overview,
					eligibility: scheme.eligibility,
					benefits: scheme.benefits,
					documents: scheme.documents,
					apply: scheme.apply,
					tags: scheme.tags,
					faq: scheme.faq,
				});
				await scheme.save();
			} catch (embedErr) {
				console.warn("Embedding regeneration failed:", embedErr.message);
			}
		}

		res.json({ message: "Scheme updated successfully", scheme });
	} catch (error) {
		res
			.status(400)
			.json({ message: "Failed to update scheme", error: error.message });
	}
};

/* DELETE */
export const deleteScheme = async (req, res) => {
	try {
		const scheme = await Scheme.findByIdAndDelete(req.params.id);
		if (!scheme) return res.status(404).json({ message: "Scheme not found" });
		res.json({ message: "Scheme deleted successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Failed to delete scheme", error: error.message });
	}
};

/* GET ELIGIBLE SCHEMES (simple version: filter by state / text eligibility) */
export const getEligibleSchemes = async (req, res) => {
	try {
		// simple eligibility filtering: active + state + optional keyword match against eligibility text
		const user = req.user || {}; // assume your auth middleware sets req.user
		const state = user.location?.state || req.query.state;
		const keyword = req.query.keyword;

		const q = { isActive: true };
		if (state) q.state = state;
		if (keyword) q.$text = { $search: keyword };

		const eligibleSchemes = await Scheme.find(q).limit(50);
		res.json({ schemes: eligibleSchemes });
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch eligible schemes",
			error: error.message,
		});
	}
};

/* APPROVE/REJECT */
export const approveScheme = async (req, res) => {
	try {
		const { approve } = req.body;
		const scheme = await Scheme.findByIdAndUpdate(
			req.params.id,
			{
				approvalStatus: approve ? "approved" : "rejected",
				lastModifiedBy: req.userId,
			},
			{ new: true }
		);

		if (!scheme) return res.status(404).json({ message: "Scheme not found" });

		res.json({
			message: `Scheme ${approve ? "approved" : "rejected"} successfully`,
			scheme,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to update scheme status",
			error: error.message,
		});
	}
};

/* APPLY */
export const applyToScheme = async (req, res) => {
	try {
		const Application = (await import("../models/Application.js")).default;
		const existingApplication = await Application.findOne({
			user: req.userId,
			scheme: req.params.id,
		});

		if (existingApplication)
			return res
				.status(400)
				.json({ message: "Already applied to this scheme" });

		const application = new Application({
			user: req.userId,
			scheme: req.params.id,
		});

		await application.save();

		// Update user.appliedSchemes (camelCase)
		const User = (await import("../models/User.js")).default;
		const user = await User.findById(req.userId);
		if (!user.appliedSchemes) user.appliedSchemes = [];
		if (!user.appliedSchemes.map(String).includes(String(req.params.id))) {
			user.appliedSchemes.push(req.params.id);
			await user.save();
		}

		res.json({ message: "Application submitted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Failed to apply", error: error.message });
	}
};

/* FAVORITES */
export const addToFavorites = async (req, res) => {
	try {
		const User = (await import("../models/User.js")).default;
		const user = await User.findById(req.userId);
		if (!user.favoriteSchemes) user.favoriteSchemes = [];
		if (!user.favoriteSchemes.map(String).includes(String(req.params.id))) {
			user.favoriteSchemes.push(req.params.id);
			await user.save();
		}
		res.json({ message: "Added to favorites" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Failed to add favorite", error: error.message });
	}
};

export const removeFromFavorites = async (req, res) => {
	try {
		const User = (await import("../models/User.js")).default;
		const user = await User.findById(req.userId);
		user.favoriteSchemes = (user.favoriteSchemes || []).filter(
			(id) => String(id) !== String(req.params.id)
		);
		await user.save();
		res.json({ message: "Removed from favorites" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Failed to remove favorite", error: error.message });
	}
};

/* USER INTERACTION HISTORY */
export const saveUserInteraction = async (req, res) => {
	try {
		const User = (await import("../models/User.js")).default;
		const { type, text } = req.body;
		const user = await User.findById(req.userId);
		if (!user.interactionHistory) user.interactionHistory = [];
		user.interactionHistory.push({ type, text, at: new Date() });
		await user.save();
		res.json({ message: "Interaction saved" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Failed to save interaction", error: error.message });
	}
};

// get all_schemes(3000+)
// controllers/allSchemesController.js

export const getAllSchemes_all = async (req, res) => {
	try {
		const page = parseInt(req.query.page || "1", 10);
		const limit = parseInt(req.query.limit || "10", 10);

		const schemes = await AllScheme.find({})
			.skip((page - 1) * limit)
			.limit(limit);

		const total = await AllScheme.countDocuments();

		res.json({
			schemes,
			total,
			totalPages: Math.ceil(total / limit),
			currentPage: page,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Failed to fetch schemes", error: error.message });
	}
};

export const getSchemeById_all = async (req, res) => {
	try {
		const scheme = await AllScheme.findById(req.params.id);
		if (!scheme) return res.status(404).json({ message: "Scheme not found" });
		res.json(scheme);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Failed to fetch scheme", error: error.message });
	}
};

export const searchSchemes = async (req, res) => {
	try {
		const { query } = req.body;
		if (!query) {
			return res.status(400).json({ message: "Query parameter required" });
		}
		const response = await vectorSearch(query);
		res.status(200).json({ results: response });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Failed to search schemes", error: error.message });
	}
};
// Add these functions to your scheme.controller.js

export const createScheme_all = async (req, res) => {
	try {
		const scheme = new AllScheme(req.body);
		await scheme.save();
		res.status(201).json({ message: "Scheme created successfully", scheme });
	} catch (error) {
		res
			.status(400)
			.json({ message: "Failed to create scheme", error: error.message });
	}
};

export const updateScheme_all = async (req, res) => {
	try {
		const scheme = await AllScheme.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!scheme) return res.status(404).json({ message: "Scheme not found" });
		res.json({ message: "Scheme updated successfully", scheme });
	} catch (error) {
		res
			.status(400)
			.json({ message: "Failed to update scheme", error: error.message });
	}
};

export const deleteScheme_all = async (req, res) => {
	try {
		const scheme = await AllScheme.findByIdAndDelete(req.params.id);
		if (!scheme) return res.status(404).json({ message: "Scheme not found" });
		res.json({ message: "Scheme deleted successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Failed to delete scheme", error: error.message });
	}
};
