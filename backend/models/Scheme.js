import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
	{
		question: { type: String, required: true, trim: true },
		answer: { type: String, required: true, trim: true },
	},
	{ _id: false }
);

const schemeSchema = new mongoose.Schema(
	{
		source_url: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		acronym: {
			type: String,
			trim: true,
			default: "",
		},
		tags: {
			type: [String],
			default: [],
		},
		state: {
			type: String,
			trim: true,
			default: "",
		},
		level: {
			type: String,
			enum: ["Central", "State", "Other", ""],
			default: "",
		},
		overview: {
			type: String,
			default: "",
		},
		eligibility: {
			type: String,
			default: "",
		},
		benefits: {
			type: String,
			default: "",
		},
		documents: {
			type: String,
			default: "",
		},
		apply: {
			type: String,
			default: "",
		},
		faq: {
			type: [faqSchema],
			default: [],
		},
		embedding: {
			type: [Number],
			index: "vector",
		},
		// 🔹 minimal extra fields for filtering
		isActive: {
			type: Boolean,
			default: true,
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high", "critical"],
			default: "medium",
		},
	},
	{ timestamps: true }
);

// 📌 Indexes for filtering & search
schemeSchema.index({ tags: 1 });
schemeSchema.index({ state: 1 });
schemeSchema.index({ level: 1 });
schemeSchema.index({ isActive: 1 });
schemeSchema.index({ isFeatured: 1 });
schemeSchema.index({ priority: 1 });
schemeSchema.index({ name: "text", overview: "text" });

// 📌 Auto-update updatedAt
schemeSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

// ⚡ Example filtering helper
schemeSchema.statics.filterSchemes = async function (filters = {}) {
	const query = {};

	if (filters.state) query.state = filters.state;
	if (filters.level) query.level = filters.level;
	if (filters.tags && filters.tags.length > 0)
		query.tags = { $in: filters.tags };
	if (filters.isActive !== undefined) query.isActive = filters.isActive;
	if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
	if (filters.priority) query.priority = filters.priority;

	return this.find(query);
};

export default mongoose.model("Scheme", schemeSchema);
