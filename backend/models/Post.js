import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  tags: [
    {
      type: String,
      lowercase: true,
      trim: true,
    },
  ],
  scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scheme",
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  comments: [commentSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
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
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ user: 1 });
postSchema.index({ scheme: 1 });

// Update updatedAt on save
postSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for like count
postSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Method to check if user has liked the post
postSchema.methods.isLikedBy = function (userId) {
  return this.likes.some((like) => like.user.toString() === userId.toString());
};

export default mongoose.model("Post", postSchema);
