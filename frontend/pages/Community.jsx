import React, { useState, useEffect } from "react";
import { Search, Plus, TrendingUp } from "lucide-react";
import Community_PostCard from "../components/Community_PostCard";
import Community_CreatePost from "../components/Community_CreatePost";
import Community_TrendingTags from "../components/Community_TrendingTags";
import useConfigStore from "../stores/configStore";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";
import CommunitySummary from "../components/CommunitySummary";

const Community = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTags, setSelectedTags] = useState([]);
	const [sortBy, setSortBy] = useState("recent");
	const [showCreatePost, setShowCreatePost] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const { backendUrl } = useConfigStore();
	const { user, token } = useAuthStore();

	const fetchPosts = async (reset = false) => {
		try {
			setLoading(true);
			const currentPage = reset ? 1 : page;

			const params = new URLSearchParams({
				page: currentPage,
				limit: 10,
				sortBy,
			});

			if (selectedTags.length > 0) {
				params.append("tags", selectedTags.join(","));
			}

			const response = await fetch(`${backendUrl}/api/v1/posts?${params}`);
			const data = await response.json();

			if (data.success) {
				if (reset) {
					setPosts(data.posts);
					setPage(2);
				} else {
					setPosts((prev) => [...prev, ...data.posts]);
					setPage((prev) => prev + 1);
				}
				setHasMore(currentPage < data.totalPages);
			}
		} catch (error) {
			toast.error("Failed to fetch posts");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts(true);
	}, [sortBy, selectedTags]);

	const handleTagClick = (tag) => {
		if (selectedTags.includes(tag)) {
			setSelectedTags((prev) => prev.filter((t) => t !== tag));
		} else {
			setSelectedTags((prev) => [...prev, tag]);
		}
	};

	const handlePostCreated = (newPost) => {
		setPosts((prev) => [newPost, ...prev]);
		setShowCreatePost(false);
		toast.success("Post created successfully!");
	};

	const handlePostUpdate = (updatedPost) => {
		setPosts((prev) =>
			prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
		);
	};

	const filteredPosts = posts.filter(
		(post) =>
			post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.tags.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase())
			)
	);

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Community</h1>
						<p className="text-gray-600 mt-1">
							Share experiences and discuss government schemes
						</p>
					</div>
					{user && (
						<button
							onClick={() => setShowCreatePost(true)}
							className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
						>
							<Plus size={20} />
							Create Post
						</button>
					)}
				</div>

				<CommunitySummary />
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-3">
						{/* Search and Filters */}
						<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
							<div className="flex flex-col sm:flex-row gap-4 mb-4">
								<div className="flex-1 relative">
									<Search
										className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
										size={20}
									/>
									<input
										type="text"
										placeholder="Search posts..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
									/>
								</div>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								>
									<option value="recent">Most Recent</option>
									<option value="popular">Most Popular</option>
								</select>
							</div>

							{/* Selected Tags */}
							{selectedTags.length > 0 && (
								<div className="flex flex-wrap gap-2 mb-4">
									{selectedTags.map((tag) => (
										<span
											key={tag}
											onClick={() => handleTagClick(tag)}
											className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-purple-200 transition-colors"
										>
											#{tag} ×
										</span>
									))}
								</div>
							)}
						</div>

						{/* Posts */}
						<div className="space-y-6">
							{loading && posts.length === 0 ? (
								<div className="text-center py-8">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
									<p className="text-gray-600 mt-4">Loading posts...</p>
								</div>
							) : filteredPosts.length === 0 ? (
								<div className="text-center py-8">
									<p className="text-gray-600">No posts found</p>
								</div>
							) : (
								filteredPosts.map((post) => (
									<Community_PostCard
										key={post._id}
										post={post}
										onUpdate={handlePostUpdate}
									/>
								))
							)}

							{/* Load More */}
							{hasMore && !loading && (
								<div className="text-center">
									<button
										onClick={() => fetchPosts()}
										className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
									>
										Load More
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1">
						<Community_TrendingTags
							onTagClick={handleTagClick}
							selectedTags={selectedTags}
						/>
					</div>
				</div>

				{/* Create Post Modal */}
				{showCreatePost && (
					<Community_CreatePost
						onClose={() => setShowCreatePost(false)}
						onPostCreated={handlePostCreated}
					/>
				)}
			</div>
		</div>
	);
};

export default Community;
