import React, { useState } from "react";
import {
	Heart,
	MessageCircle,
	Share2,
	MoreHorizontal,
	Calendar,
} from "lucide-react";
import Community_CommentSection from "./Community_CommentSection";
import useConfigStore from "../stores/configStore";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

const Community_PostCard = ({ post, onUpdate }) => {
	const [showComments, setShowComments] = useState(false);
	const [isLiked, setIsLiked] = useState(post.isLikedBy || false);
	const [likeCount, setLikeCount] = useState(post.likeCount || 0);
	const [commentCount, setCommentCount] = useState(post.commentCount || 0);

	const { backendUrl } = useConfigStore();
	const { user, token } = useAuthStore();

	const handleLike = async () => {
		if (!user) {
			toast.error("Please login to like posts");
			return;
		}

		try {
			const response = await fetch(
				`${backendUrl}/api/v1/posts/${post._id}/like`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			const data = await response.json();
			if (data.success) {
				setIsLiked(data.isLiked);
				setLikeCount(data.likeCount);
			}
		} catch (error) {
			toast.error("Failed to like post");
		}
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now - date);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 1) return "1 day ago";
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
		return date.toLocaleDateString();
	};

	const getCardStyle = () => {
		if (post.user?.role === "govt_official") {
			return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 shadow-md";
		}
		if (post.user?.role === "ngo") {
			return "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md";
		}
		return "bg-white border-gray-200 shadow-sm";
	};

	const getRoleTag = () => {
		if (post.user?.role === "govt_official") {
			return (
				<span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold ml-2">
					🏛️ OFFICIAL
				</span>
			);
		}
		if (post.user?.role === "ngo") {
			return (
				<span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold ml-2">
					🤝 NGO
				</span>
			);
		}
		return null;
	};

	return (
		<div className={`rounded-lg border overflow-hidden ${getCardStyle()}`}>
			{/* Header */}
			<div className="p-6 pb-4">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
							<span className="text-purple-600 font-semibold text-sm">
								{post.user?.name?.charAt(0).toUpperCase() || "U"}
							</span>
						</div>
						<div>
							<div className="flex items-center">
								<h4 className="font-semibold text-gray-900">
									{post.user?.name || "Anonymous"}
								</h4>
								{getRoleTag()}
								{post.user?.role}
							</div>
							<div className="flex items-center text-sm text-gray-500">
								<Calendar size={14} className="mr-1" />
								{formatDate(post.createdAt)}
							</div>
						</div>
					</div>
					<button className="text-gray-400 hover:text-gray-600">
						<MoreHorizontal size={20} />
					</button>
				</div>

				{/* Post Content */}
				<h3 className="text-xl font-semibold text-gray-900 mb-2">
					{post.title}
				</h3>
				<p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

				{/* Tags */}
				{post.tags && post.tags.length > 0 && (
					<div className="flex flex-wrap gap-2 mb-4">
						{post.tags.map((tag, index) => (
							<span
								key={index}
								className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
							>
								#{tag}
							</span>
						))}
					</div>
				)}

				{/* Scheme Reference */}
				{post.scheme && (
					<div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
						<p className="text-sm text-purple-700">
							<span className="font-medium">Related Scheme:</span>{" "}
							{post.scheme.name}
						</p>
					</div>
				)}
			</div>

			{/* Actions */}
			<div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-6">
						<button
							onClick={handleLike}
							className={`flex items-center space-x-2 text-sm transition-colors ${
								isLiked
									? "text-red-600 hover:text-red-700"
									: "text-gray-600 hover:text-red-600"
							}`}
						>
							<Heart size={18} className={isLiked ? "fill-current" : ""} />
							<span>{likeCount}</span>
						</button>

						<button
							onClick={() => setShowComments(!showComments)}
							className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
						>
							<MessageCircle size={18} />
							<span>{commentCount}</span>
						</button>

						<button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
							<Share2 size={18} />
							<span>Share</span>
						</button>
					</div>
				</div>
			</div>

			{/* Comments Section */}
			{showComments && (
				<Community_CommentSection
					postId={post._id}
					comments={post.comments || []}
					onUpdate={onUpdate}
					onCommentAdded={() => setCommentCount((prev) => prev + 1)}
				/>
			)}
		</div>
	);
};

export default Community_PostCard;
