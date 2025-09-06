import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		maxlength: 100,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
	},
	role: {
		type: String,
		enum: ["user", "govt_official", "ngo"],
		default: "user",
	},
	permissions: [
		{
			type: String,
			enum: [
				"read_schemes",
				"apply_schemes",
				"manage_schemes",
				"manage_users",
				"approve_applications",
				"view_analytics",
			],
		},
	],
	location: {
		state: {
			type: String,
		},
		district: {
			type: String,
		},
		pincode: {
			type: String,
			match: /^[1-9][0-9]{5}$/,
		},
		address: {
			type: String,
			maxlength: 500,
		},
		coordinates: {
			latitude: Number,
			longitude: Number,
		},
	},
	profile: {
		phone: {
			type: String,
			match: /^[6-9]\d{9}$/,
		},
		dateOfBirth: Date,
		gender: {
			type: String,
			enum: ["male", "female", "other"],
		},
		category: {
			type: String,
			enum: ["general", "obc", "sc", "st", "ews"],
		},
		income: {
			annual: Number,
			currency: {
				type: String,
				default: "INR",
			},
		},
		documents: [
			{
				type: {
					type: String,
					enum: [
						"aadhar",
						"pan",
						"voter_id",
						"driving_license",
						"passport",
						"income_certificate",
						"caste_certificate",
					],
				},
				number: String,
				verified: {
					type: Boolean,
					default: false,
				},
				uploadedAt: Date,
			},
		],
	},
	appliedSchemes: [
		{
			scheme: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Scheme",
			},
			appliedAt: {
				type: Date,
				default: Date.now,
			},
			status: {
				type: String,
				enum: ["pending", "approved", "rejected", "under_review"],
				default: "pending",
			},
			applicationId: String,
		},
	],

	emailVerified: {
		type: Boolean,
		default: false,
	},
	phoneVerified: {
		type: Boolean,
		default: false,
	},
	lastLogin: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Indexes for better performance
userSchema.index({ "location.state": 1, "location.district": 1 });
userSchema.index({ role: 1 });
userSchema.index({ "location.pincode": 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

// Update updatedAt on save
userSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user has permission
userSchema.methods.hasPermission = function (permission) {
	return this.permissions.includes(permission);
};

// Get user's eligible schemes based on location and profile
userSchema.methods.getEligibleSchemes = function () {
	return mongoose.model("Scheme").find({
		$and: [
			{ isActive: true },
			{
				$or: [
					{ "eligibility.location.states": this.location.state },
					{ "eligibility.location.nationwide": true },
				],
			},
			{
				$or: [
					{ "eligibility.category": { $in: [this.profile.category, "all"] } },
					{ "eligibility.category": { $exists: false } },
				],
			},
		],
	});
};

export default mongoose.model("User", userSchema);
