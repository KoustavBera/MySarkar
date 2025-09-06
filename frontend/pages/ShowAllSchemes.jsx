import React, { useState, useMemo, useEffect } from "react";
import {
	Search,
	ChevronDown,
	ArrowLeft,
	MessageSquare,
	Filter,
	X,
	ChevronLeft,
	ChevronRight,
	Star,
	ExternalLink,
	FileText,
	Calendar,
	MapPin,
	Tag,
} from "lucide-react";
import { Link } from "react-router-dom";
import SchemeNavigation from "../components/SchemeNavigation";
import { useSchemesStore } from "../stores/schemeStore";
import MarkdownRenderer from "../components/MarkdownRenderer";
import EligibilityCheckModal from "../components/EligibilityCheckModal";
import axios from "axios";
import { toast } from "react-hot-toast";
import useConfigStore from "../stores/configStore";
import useAuthStore from "../stores/authStore";

const PAGE_SIZE = 10;

const ShowAllSchemes = () => {
	const [selectedTab, setSelectedTab] = useState("all");
	const [selectedScheme, setSelectedScheme] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("relevance");
	const [page, setPage] = useState(1);
	const [showEligibilityModal, setShowEligibilityModal] = useState(false);
	const [selectedSchemeForEligibility, setSelectedSchemeForEligibility] =
		useState(null);

	const { schemes, totalPages, fetchSchemes, loading, error } =
		useSchemesStore();
	const { backendUrl } = useConfigStore();
	const { token } = useAuthStore();

	const handleEligible = async (schemeId) => {
		try {
			await axios.post(
				`${backendUrl}/api/v1/applications/after-eligibility`,
				{ schemeId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success("Application submitted successfully!");
			setShowEligibilityModal(false);
		} catch (error) {
			toast.error("Failed to submit application");
			console.error(
				"Application error:",
				error.response?.data || error.message
			);
		}
	};

	useEffect(() => {
		fetchSchemes(page, PAGE_SIZE);
	}, [fetchSchemes, page]);

	// Filter states
	const [filters, setFilters] = useState({
		state: "Select",
		category: "Select",
		level: "Select",
	});

	const [showMobileFilters, setShowMobileFilters] = useState(false);

	// Extract unique values from actual data for filter options
	const filterOptions = useMemo(() => {
		if (!schemes || schemes.length === 0) {
			return {
				state: ["Select"],
				category: ["Select"],
				level: ["Select"],
			};
		}

		const uniqueStates = [
			"Select",
			...new Set(schemes.map((s) => s.state).filter(Boolean)),
		];
		const uniqueCategories = ["Select"];
		schemes.forEach((s) => {
			if (s.category && Array.isArray(s.category)) {
				s.category.forEach((cat) => {
					if (!uniqueCategories.includes(cat)) {
						uniqueCategories.push(cat);
					}
				});
			}
		});
		const uniqueLevels = [
			"Select",
			...new Set(schemes.map((s) => s.level).filter(Boolean)),
		];

		return {
			state: uniqueStates,
			category: uniqueCategories,
			level: uniqueLevels,
		};
	}, [schemes]);

	const handleFilterChange = (filterType, value) =>
		setFilters((prev) => ({ ...prev, [filterType]: value }));

	const resetFilters = () => {
		setFilters({
			state: "Select",
			category: "Select",
			level: "Select",
		});
		setSearchTerm("");
		setPage(1);
	};

	const activeFiltersCount = Object.values(filters).filter(
		(v) => v !== "Select"
	).length;

	const filteredSchemes = useMemo(() => {
		if (!schemes || schemes.length === 0) return [];
		let result = [...schemes];

		let filtered = schemes.filter((scheme) => {
			// Search filter
			const searchLower = searchTerm.toLowerCase();
			const searchMatch =
				!searchTerm ||
				scheme.schemeName?.toLowerCase().includes(searchLower) ||
				scheme.schemeShortTitle?.toLowerCase().includes(searchLower) ||
				scheme.detailedDescription_md?.toLowerCase().includes(searchLower) ||
				scheme.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

			// Tab filter
			const tabMatch =
				selectedTab === "all" ||
				(selectedTab === "state" && scheme.level === "State/ UT") ||
				(selectedTab === "central" && scheme.level === "Central");

			// State filter
			const stateMatch =
				filters.state === "Select" || scheme.state === filters.state;

			// Category filter
			const categoryMatch =
				filters.category === "Select" ||
				(scheme.category && scheme.category.includes(filters.category));

			// Level filter
			const levelMatch =
				filters.level === "Select" || scheme.level === filters.level;

			return (
				searchMatch && tabMatch && stateMatch && categoryMatch && levelMatch
			);
		});

		// Sort
		if (sortBy === "name") {
			filtered.sort((a, b) =>
				(a.schemeName || "").localeCompare(b.schemeName || "")
			);
		} else if (sortBy === "date") {
			filtered.sort((a, b) => {
				const dateA = new Date(a.openDate || 0);
				const dateB = new Date(b.openDate || 0);
				return dateB - dateA;
			});
		}

		return filtered;
	}, [schemes, filters, searchTerm, selectedTab, sortBy]);

	// Reset page when filters change
	useEffect(() => {
		setPage(1);
	}, [filters, searchTerm, selectedTab]);

	const Pagination = () => (
		<div className="flex justify-center items-center gap-4 mt-6">
			<button
				disabled={page === 1}
				onClick={() => setPage((p) => p - 1)}
				className="p-2 rounded-md disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 transition-colors"
			>
				<ChevronLeft size={20} />
			</button>
			<span className="text-sm">
				Page {page} of {totalPages || 1}
			</span>
			<button
				disabled={page === totalPages || totalPages === 0}
				onClick={() => setPage((p) => p + 1)}
				className="p-2 rounded-md disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 transition-colors"
			>
				<ChevronRight size={20} />
			</button>
		</div>
	);

	// Mobile Filter Drawer
	const MobileFilterDrawer = () => (
		<div
			className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
				showMobileFilters ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
			onClick={() => setShowMobileFilters(false)}
		>
			<div
				className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 space-y-4 max-h-[80vh] overflow-y-auto transition-transform z-50 ${
					showMobileFilters ? "translate-y-0" : "translate-y-full"
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-center">
					<h2 className="text-lg font-semibold">
						Filters ({activeFiltersCount})
					</h2>
					<button onClick={() => setShowMobileFilters(false)}>
						<X size={20} />
					</button>
				</div>
				{Object.entries(filterOptions).map(([key, opts]) => (
					<div key={key}>
						<label className="block text-sm font-medium mb-1 capitalize">
							{key.replace(/([A-Z])/g, " $1").trim()}
						</label>
						<select
							value={filters[key]}
							onChange={(e) => handleFilterChange(key, e.target.value)}
							className="w-full p-2 border rounded-md"
						>
							{opts.map((o) => (
								<option key={o} value={o}>
									{o}
								</option>
							))}
						</select>
					</div>
				))}
				<button
					onClick={() => {
						resetFilters();
						setShowMobileFilters(false);
					}}
					className="w-full py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300 transition-colors"
				>
					Reset Filters
				</button>
			</div>
		</div>
	);

	// DETAIL VIEW
	if (selectedScheme) {
		return (
			<div className="w-full min-h-screen bg-gray-50 dark:bg-zinc-900 overflow-x-hidden">
				<div className="max-w-4xl mx-auto p-4">
					<button
						onClick={() => setSelectedScheme(null)}
						className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
					>
						<ArrowLeft size={18} /> Back to schemes
					</button>
					<div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
						<div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
							<h1 className="text-2xl font-bold mb-2">
								{selectedScheme.schemeName}
							</h1>
							{selectedScheme.schemeShortTitle && (
								<p className="text-purple-100 text-sm mb-3">
									Abbreviation: {selectedScheme.schemeShortTitle}
								</p>
							)}
							<div className="flex flex-wrap gap-2 text-sm">
								{selectedScheme.state && (
									<span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
										<MapPin size={14} /> {selectedScheme.state}
									</span>
								)}
								{selectedScheme.level && (
									<span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
										Level: {selectedScheme.level}
									</span>
								)}
							</div>
						</div>

						<div className="p-6 space-y-6">
							{/* Tags */}
							{selectedScheme.tags && selectedScheme.tags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{selectedScheme.tags.map((tag, index) => (
										<span
											key={index}
											className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
										>
											<Tag size={12} /> {tag}
										</span>
									))}
								</div>
							)}

							{/* Description */}
							{selectedScheme.detailedDescription_md && (
								<section>
									<h2 className="text-xl font-semibold mb-3">Description</h2>
									<div className="prose max-w-none text-gray-700">
										<MarkdownRenderer
											content={selectedScheme.detailedDescription_md}
										/>
									</div>
								</section>
							)}

							{/* Benefits */}
							{selectedScheme.benefits &&
								selectedScheme.benefits.length > 0 && (
									<section>
										<h2 className="text-xl font-semibold mb-3">Benefits</h2>
										<div className="bg-purple-50 rounded-lg p-4">
											{selectedScheme.benefits.map((benefit, index) => (
												<div key={index} className="mb-3">
													{benefit.children &&
														benefit.children.map((item, idx) => (
															<div key={idx}>
																{item.children &&
																	item.children.map((child, childIdx) => (
																		<p
																			key={childIdx}
																			className="text-gray-700 mb-2"
																		>
																			• {child.text}
																		</p>
																	))}
															</div>
														))}
												</div>
											))}
										</div>
									</section>
								)}

							{/* Eligibility */}
							{selectedScheme.eligibilityDescription_md && (
								<section>
									<h2 className="text-xl font-semibold mb-3">
										Eligibility Criteria
									</h2>
									<div className="bg-blue-50 rounded-lg p-4">
										{selectedScheme.eligibilityDescription_md
											.split("\n")
											.filter((line) => line.trim())
											.map((line, i) => (
												<p key={i} className="text-gray-700 mb-2">
													{line.replace(/^-\s*/, "• ")}
												</p>
											))}
									</div>
								</section>
							)}

							{/* Documents Required */}
							{selectedScheme.documents_required &&
								selectedScheme.documents_required.length > 0 && (
									<section>
										<h2 className="text-xl font-semibold mb-3">
											Documents Required
										</h2>
										<div className="bg-gray-50 rounded-lg p-4">
											{selectedScheme.documents_required.map((doc, index) => (
												<div key={index}>
													{doc.children &&
														doc.children.map((item, idx) => (
															<div key={idx} className="mb-2">
																{item.children &&
																	item.children.map((child, childIdx) => (
																		<p key={childIdx} className="text-gray-700">
																			• {child.text}
																		</p>
																	))}
															</div>
														))}
												</div>
											))}
										</div>
									</section>
								)}

							{/* Application Process */}
							{selectedScheme.applicationProcess &&
								selectedScheme.applicationProcess.length > 0 && (
									<section>
										<h2 className="text-xl font-semibold mb-3">How to Apply</h2>
										{selectedScheme.applicationProcess.map((process, index) => (
											<div key={index} className="mb-4">
												<h3 className="font-semibold text-lg mb-2 text-purple-600">
													{process.mode} Application
												</h3>
												<div className="bg-gray-50 rounded-lg p-4">
													{process.process_md && (
														<div className="prose max-w-none text-gray-700">
															{process.process_md
																.split("\n")
																.filter((line) => line.trim())
																.map((line, i) => (
																	<p key={i} className="mb-2">
																		{line}
																	</p>
																))}
														</div>
													)}
												</div>
											</div>
										))}
									</section>
								)}

							{/* References/Links */}
							{selectedScheme.references &&
								selectedScheme.references.length > 0 && (
									<section>
										<h2 className="text-xl font-semibold mb-3">
											Important Links
										</h2>
										<div className="space-y-2">
											{selectedScheme.references.map((ref) => (
												<a
													key={ref._id}
													href={ref.url}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:underline"
												>
													<ExternalLink size={16} />
													{ref.title}
												</a>
											))}
										</div>
									</section>
								)}

							{/* Apply Button */}
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Loading state
	if (loading) {
		return (
			<div className="w-full min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading schemes...</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="w-full min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
				<div className="text-center bg-red-50 rounded-lg p-6 max-w-md">
					<p className="text-red-600 mb-4">Error loading schemes: {error}</p>
					<button
						onClick={() => fetchSchemes()}
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	// MAIN LIST VIEW
	return (
		<div className="w-full min-h-screen bg-gray-50 dark:bg-zinc-900">
			<div className="p-6">
				<SchemeNavigation />
			</div>
			<div className="flex justify-end md:p-3 p-1"></div>
			<div className="max-w-7xl mx-auto p-4">
				{/* Mobile filter toggle */}
				<div className="lg:hidden flex justify-between items-center mb-4">
					<h1 className="text-xl font-semibold">Government Schemes</h1>
					<button
						onClick={() => setShowMobileFilters(true)}
						className="flex items-center gap-1 text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors"
					>
						<Filter size={16} /> Filters
						{activeFiltersCount > 0 && ` (${activeFiltersCount})`}
					</button>
				</div>

				<div className="flex gap-6">
					{/* Desktop Sidebar */}
					<aside className="hidden lg:block w-72 bg-white shadow-lg rounded-xl p-4 h-fit">
						<div className="flex justify-between items-center mb-4">
							<h2 className="font-semibold">
								Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
							</h2>
							<button
								onClick={resetFilters}
								className="text-sm text-purple-600 hover:text-purple-700"
							>
								Reset
							</button>
						</div>
						<div className="space-y-4">
							{Object.entries(filterOptions).map(([key, opts]) => (
								<div key={key}>
									<label className="text-sm font-medium capitalize block mb-1">
										{key.replace(/([A-Z])/g, " $1").trim()}
									</label>
									<select
										value={filters[key]}
										onChange={(e) => handleFilterChange(key, e.target.value)}
										className="w-full p-2 border border-gray-300 rounded-md text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
									>
										{opts.map((o) => (
											<option key={o} value={o}>
												{o}
											</option>
										))}
									</select>
								</div>
							))}
						</div>
					</aside>

					{/* Main Content */}
					<main className="flex-1">
						{/* Search + Tabs + Sort */}
						<div className="mb-4 bg-white rounded-lg shadow p-4">
							<div className="flex gap-2 mb-3">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
									<input
										type="text"
										placeholder="Search schemes by name, description, or tags..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
									/>
								</div>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="px-3 py-2 border rounded-md text-sm focus:border-purple-500"
								>
									<option value="relevance">Sort by Relevance</option>
									<option value="name">Sort by Name</option>
									<option value="date">Sort by Date</option>
								</select>
							</div>

							<div className="flex border-b text-sm">
								{["all", "state", "central"].map((tab) => (
									<button
										key={tab}
										onClick={() => setSelectedTab(tab)}
										className={`capitalize px-4 py-2 transition-colors ${
											selectedTab === tab
												? "border-b-2 border-purple-600 text-purple-600 font-medium"
												: "text-gray-600 hover:text-gray-800"
										}`}
									>
										{tab} Schemes
									</button>
								))}
							</div>
						</div>

						<div className="text-sm text-gray-600 mb-3">
							Showing {filteredSchemes.length} schemes (Page {page} of{" "}
							{totalPages})
						</div>

						{/* Scheme Cards */}
						<div className="space-y-4">
							{filteredSchemes.length === 0 ? (
								<div className="bg-white rounded-lg shadow p-8 text-center">
									<p className="text-gray-500">
										No schemes found matching your criteria.
									</p>
									<button
										onClick={resetFilters}
										className="mt-4 text-purple-600 hover:text-purple-700"
									>
										Clear filters
									</button>
								</div>
							) : (
								filteredSchemes.map((scheme) => (
									<div
										key={scheme._id}
										className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 cursor-pointer border-l-4 border-purple-600"
										onClick={() => setSelectedScheme(scheme)}
									>
										<div className="flex justify-between items-start">
											<div className="flex-1">
												<div className="flex items-start justify-between mb-2">
													<div>
														<h3 className="font-semibold text-lg text-gray-900">
															{scheme.schemeName}
														</h3>
														{scheme.schemeShortTitle && (
															<p className="text-sm text-purple-600 font-medium">
																{scheme.schemeShortTitle}
															</p>
														)}
													</div>
												</div>

												<div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
													{scheme.state && (
														<span className="flex items-center gap-1">
															<MapPin size={14} /> {scheme.state}
														</span>
													)}
													{scheme.level && (
														<span className="flex items-center gap-1">
															<FileText size={14} /> {scheme.level}
														</span>
													)}
													{scheme.openDate && (
														<span className="flex items-center gap-1">
															<Calendar size={14} /> Open Date:{" "}
															{new Date(scheme.openDate).toLocaleDateString()}
														</span>
													)}
												</div>

												{scheme.detailedDescription_md && (
													<p className="text-sm text-gray-700 mb-3 line-clamp-2">
														{scheme.detailedDescription_md.substring(0, 200)}...
													</p>
												)}

												<div className="flex items-center justify-between">
													<div className="flex flex-wrap gap-1">
														{scheme.tags &&
															scheme.tags.slice(0, 4).map((tag, index) => (
																<span
																	key={index}
																	className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
																>
																	{tag}
																</span>
															))}
														{scheme.tags && scheme.tags.length > 4 && (
															<span className="text-xs text-gray-500">
																+{scheme.tags.length - 4} more
															</span>
														)}
													</div>

													<button
														onClick={(e) => {
															e.stopPropagation();
															setSelectedSchemeForEligibility(scheme);
															setShowEligibilityModal(true);
														}}
														className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
													>
														Check Eligibility
													</button>
												</div>
											</div>
										</div>
									</div>
								))
							)}
						</div>

						{totalPages > 1 && <Pagination />}
					</main>
				</div>
			</div>
			<MobileFilterDrawer />
			{showEligibilityModal && (
				<EligibilityCheckModal
					isOpen={showEligibilityModal}
					onClose={() => setShowEligibilityModal(false)}
					scheme={selectedSchemeForEligibility}
					onEligible={handleEligible}
				/>
			)}
		</div>
	);
};

export default ShowAllSchemes;
