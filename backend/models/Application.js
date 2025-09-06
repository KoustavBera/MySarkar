import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AllScheme",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "under_review"],
    default: "pending",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviewedAt: {
    type: Date,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Application", applicationSchema);