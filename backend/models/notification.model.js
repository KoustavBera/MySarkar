import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		notification: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Notification", notificationSchema);
