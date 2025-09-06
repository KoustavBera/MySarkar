import User from "../models/User.js";
import Scheme from "../models/Scheme.js";
import Application from "../models/Application.js";

export const getDashboardStats = async (req, res) => {
	try {
		const [totalSchemes, totalApplications, totalUsers] = await Promise.all([
			Scheme.db.collection("all_schemes").countDocuments(), // direct collection
			Application.countDocuments(),
			User.countDocuments({ role: "user" }),
		]);

		const approvedApplications = await Application.countDocuments({
			status: "approved",
		});
		const approvalRate =
			totalApplications > 0
				? Math.round((approvedApplications / totalApplications) * 100)
				: 0;

		res.json({
			totalSchemes,
			totalApplications,
			totalUsers,
			approvalRate: `${approvalRate}%`,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch dashboard stats",
			error: error.message,
		});
	}
};
