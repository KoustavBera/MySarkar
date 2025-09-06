import mongoose from "mongoose";

const preApplicationSchema = new mongoose.Schema(
  {
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
    eligibilityStatus: {
      type: String,
      enum: ["eligible", "not_eligible", "pending_review"],
      required: true,
    },
    aiResponse: {
      eligible: Boolean,
      reason: String,
      questions: [String],
    },
    userAnswers: {
      type: Map,
      of: String,
    },
    approvedForApplication: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PreApplication", preApplicationSchema);
