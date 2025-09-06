import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const generateToken = (userId, role) => {
	return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
};

export const login = async (req, res) => {
	try {
		const { email, password, role } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		if (role && user.role !== role) {
			return res.status(403).json({ message: "Role mismatch" });
		}

		user.lastLogin = new Date();
		await user.save();

		const token = generateToken(user._id, user.role); // Include role

		res.json({
			message: "Login successful",
			access_token: token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Login failed", error: error.message });
	}
};

export const register = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const user = new User({
			name,
			email,
			password,
			role: role || "user",
		});

		await user.save();

		const token = generateToken(user._id, user.role); // Include role

		res.status(201).json({
			message: "Registration successful",
			access_token: token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Registration failed", error: error.message });
	}
};

export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				password: user.password,
				profile: user.profile,
				location: user.location,
			},
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Failed to fetch user", error: error.message });
	}
};

export const verifyUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const { approve } = req.body;

		// Check if requester is admin
		const admin = await User.findById(req.userId);
		if (
			admin.role !== "govt_official" ||
			!admin.permissions.includes("manage_users")
		) {
			return res.status(403).json({ message: "Insufficient permissions" });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({
			message: "User verification not required",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Verification failed", error: error.message });
	}
};

export const updateProfile = async (req, res) => {
	const { name, email, password, profile, location, role, permissions } =
		req.body;
	try {
		const user = await User.findById(req.userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		// Update basic fields only if provided and not empty
		if (name && name.trim()) user.name = name;
		if (email && email.trim()) user.email = email;
		if (password && password !== "********" && password.trim())
			user.password = password;
		if (role && role.trim()) user.role = role;
		if (permissions && Array.isArray(permissions))
			user.permissions = permissions;

		// Handle profile updates - merge only non-empty fields
		if (profile && typeof profile === "object") {
			user.profile = user.profile || {};
			Object.keys(profile).forEach((key) => {
				if (
					profile[key] !== null &&
					profile[key] !== undefined &&
					profile[key] !== ""
				) {
					if (
						typeof profile[key] === "object" &&
						!Array.isArray(profile[key])
					) {
						user.profile[key] = { ...user.profile[key], ...profile[key] };
					} else {
						user.profile[key] = profile[key];
					}
				}
			});
		}

		// Handle location updates - merge only non-empty fields
		if (location && typeof location === "object") {
			user.location = user.location || {};
			Object.keys(location).forEach((key) => {
				if (
					location[key] !== null &&
					location[key] !== undefined &&
					location[key] !== ""
				) {
					if (
						typeof location[key] === "object" &&
						!Array.isArray(location[key])
					) {
						user.location[key] = { ...user.location[key], ...location[key] };
					} else {
						user.location[key] = location[key];
					}
				}
			});
		}

		await user.save();

		res.status(200).json({
			message: "Profile updated successfully",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				profile: user.profile,
				location: user.location,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
