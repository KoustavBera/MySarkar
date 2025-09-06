import React, { useState, useEffect } from "react";
import { X, Hash, FileText } from "lucide-react";
import useConfigStore from "../stores/configStore";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

const Community_CreatePost = ({ onClose, onPostCreated }) => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState("");
	const [selectedScheme, setSelectedScheme] = useState("");
	const [schemes, setSchemes] = useState([]);
	const [loading, setLoading] = useState(false);

	const { backendUrl, fastAPIUrl } = useConfigStore();
	const { token } = useAuthStore();

	useEffect(() => {
		fetchSchemes();
	}, []);

	const fetchSchemes = async () => {
		try {
			const response = await fetch(`${backendUrl}/api/v1/schemes`);
			const data = await response.json();
			if (data.success) {
				setSchemes(data.schemes);
			}
		} catch (error) {
			console.error("Failed to fetch schemes:", error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title.trim() || !content.trim()) {
			toast.error("Title and content are required");
			return;
		}

		setLoading(true);

		try {
			const tagArray = tags
				.split(",")
				.map((tag) => tag.trim().toLowerCase())
				.filter((tag) => tag.length > 0);

			const postData = {
				title: title.trim(),
				content: content.trim(),
				tags: tagArray,
				scheme: selectedScheme || null,
			};
			// Check for hate speech
			const hateCheckResponse = await fetch(`${fastAPIUrl}/detect-hatespeech`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: `${title} ${content}` }),
			});

			const hateCheckData = await hateCheckResponse.json();

			if (!hateCheckData.is_hate_speech) {
				toast.error(
					"Your post contains inappropriate content. Please revise and try again."
				);
				setLoading(false);
				return;
			}
			const response = await fetch(`${backendUrl}/api/v1/posts`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(postData),
			});

			const data = await response.json();

			if (data.success) {
				onPostCreated(data.post);
			} else {
				toast.error(data.message || "Failed to create post");
			}
		} catch (error) {
			toast.error("Failed to create post");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/5 backdrop-blur-xl bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">
						Create New Post
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X size={24} />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6">
					{/* Title */}
					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Title *
						</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="What's your post about?"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
							maxLength={200}
						/>
						<p className="text-xs text-gray-500 mt-1">
							{title.length}/200 characters
						</p>
					</div>

					{/* Content */}
					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Content *
						</label>
						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Share your thoughts, experiences, or questions about government schemes..."
							rows={6}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
							maxLength={2000}
						/>
						<p className="text-xs text-gray-500 mt-1">
							{content.length}/2000 characters
						</p>
					</div>

					{/* Tags */}
					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							<Hash size={16} className="inline mr-1" />
							Tags
						</label>
						<input
							type="text"
							value={tags}
							onChange={(e) => setTags(e.target.value)}
							placeholder="education, healthcare, agriculture (comma separated)"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Add relevant tags separated by commas
						</p>
					</div>

					{/* Related Scheme */}
					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							<FileText size={16} className="inline mr-1" />
							Related Scheme (Optional)
						</label>
						<select
							value={selectedScheme}
							onChange={(e) => setSelectedScheme(e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						>
							<option value="">Select a scheme (optional)</option>
							{schemes.map((scheme) => (
								<option key={scheme._id} value={scheme._id}>
									{scheme.name}
								</option>
							))}
						</select>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading || !title.trim() || !content.trim()}
							className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{loading ? "Creating..." : "Create Post"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Community_CreatePost;
