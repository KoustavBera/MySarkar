import React, { useState } from "react";
import { Send, Calendar } from "lucide-react";
import useConfigStore from "../stores/configStore";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

const Community_CommentSection = ({ postId, comments, onUpdate, onCommentAdded }) => {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl } = useConfigStore();
  const { user, token } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/v1/posts/${postId}/comment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newComment.trim() }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setNewComment("");
        // Refresh the post to get updated comments
        const postResponse = await fetch(
          `${backendUrl}/api/v1/posts/${postId}`
        );
        const postData = await postResponse.json();
        if (postData.success) {
          onUpdate(postData.post);
        }
        // Update comment count
        if (onCommentAdded) {
          onCommentAdded();
        }
        toast.success("Comment added successfully");
      } else {
        toast.error(data.message || "Failed to add comment");
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      {/* Comments List */}
      {comments && comments.length > 0 && (
        <div className="p-6 space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="flex space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-semibold text-xs">
                  {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium text-gray-900">
                      {comment.user?.name || "Anonymous"}
                    </h5>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 font-semibold text-xs">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-end space-x-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {newComment.length}/500 characters
              </p>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">Please login to add comments</p>
        </div>
      )}
    </div>
  );
};

export default Community_CommentSection;
