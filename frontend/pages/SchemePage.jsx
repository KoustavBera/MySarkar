import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "react-loading-skeleton/dist/skeleton.css";
import ResearchSummary from "../components/Scheme_ResearchSummary"; // modal version
import SchemeRecommendationCard from "../components/Scheme_SchemeRecommendationCard";
import SchemeDetailModal from "../components/SchemeDetailModal";
import AIQuestionModal from "../components/Scheme_AIQuestionModal";
import AIAssistant from "../components/Scheme_AIAssistant";
import Application_ProfileCard from "../components/Scheme_ProfileCard";
import SchemeNavigation from "../components/SchemeNavigation";
import { useSpeechTranslate } from "../hooks/useSpeechTranslate";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";
//Stores
import useAuthStore from "../stores/authStore";
import useConfigStore from "../stores/configStore";
import { useSchemesStore } from "../stores/schemeStore";
import { useRef } from "react";
import { Mic, Mic2Icon } from "lucide-react";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import MarkdownRenderer from "../components/MarkdownRenderer";
import Skeleton from "react-loading-skeleton";
// Lightweight how-to box (no action buttons here — purely instructional)
const HowToBox = () => {
	const steps = [
		{
			emoji: "✍️",
			title: "Describe your need",
			desc: "Write what you need in simple words in the Search box.",
		},
		{
			emoji: "🔍",
			title: "Search",
			desc: "Press Search — AI will summarize and we will recommend schemes.",
		},
		{
			emoji: "❓",
			title: "Review matches",
			desc: "See High match badges and short reasons why a scheme matched.",
		},
		{
			emoji: "✅",
			title: "Apply or Save",
			desc: "Apply directly or save to favorites for later.",
		},
	];

	const suggestions = [
		"I am a farmer looking for crop insurance",
		"Student searching for scholarship",
		"Need housing subsidy for low income",
		"Support for women entrepreneurs",
		"Healthcare assistance for senior citizens",
	];

	return (
		<div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">How to use</h3>
			<div className="space-y-4">
				{steps.map((s, i) => (
					<div key={i} className="flex items-start gap-3">
						<div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-sm font-medium text-blue-600">
							{i + 1}
						</div>
						<div className="flex-1 min-w-0">
							<div className="font-medium text-gray-900 text-sm">{s.title}</div>
							<div className="text-gray-500 text-xs mt-0.5 leading-relaxed">
								{s.desc}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default function SchemePage() {
	const { user, fetchMe, loadingUser } = useAuthStore();
	const { backendUrl } = useConfigStore();
	const [schemes, setSchemes] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedScheme, setSelectedScheme] = useState(null);
	const [aiModalScheme, setAiModalScheme] = useState(null);
	const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isSearching, setIsSearching] = useState();
	const [schemeScores, setSchemeScores] = useState({}); // { schemeId: score }
	const [lastSummary, setLastSummary] = useState(null);
	const {
		selectedLanguage,
		setSelectedLanguage,
		languages,
		getCurrentLanguage,
	} = useLanguage();

	//format schemes
	function formatSchemes(schemes) {
		return schemes
			.map(
				(s, i) => `
				Scheme ${i + 1}:
				- Name: ${s.schemeName}
				- Short Title: ${s.schemeShortTitle || "N/A"}
				- State: ${s.state || "All India"}
				- Tags: ${s.tags.join(", ")}
				- Category: ${s.category?.join(", ") || "N/A"}
				- Description: ${s.detailedDescription_md?.replace(/<\/?[^>]+(>|$)/g, "")}
				- References: ${s.references?.map((r) => `${r.title} (${r.url})`).join("; ")}
				`
			)
			.join("\n\n");
	}
	const model = new ChatGoogleGenerativeAI({
		model: "gemini-1.5-flash", // fast + cheap for summarization
		temperature: 0.3,
		apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
	});

	const summaryPrompt = new PromptTemplate({
		template: `
You are given a list of government schemes in India. Summarize them in simple terms,
highlighting:
- Target audience (farmers, students, women, etc.)
- Key benefits
- State/UT applicability
- Any important conditions.

Schemes:
{schemes}

Now provide a concise summary (bullet points preferred).
`,
		inputVariables: ["schemes"],
	});
	// Semantic Search
	const handleRecommend = async () => {
		if (!searchTerm || searchTerm.trim().length < 2) {
			alert("Please describe your need in 2+ characters.");
			return;
		}

		setIsSearching(true);

		try {
			const data = await axios.post(`${backendUrl}/api/v1/schemes/search`, {
				query: searchTerm,
			});

			const results = data.data.results || [];
			setSchemes(results);

			const formattedSchemes = formatSchemes(results);
			const prompt = await summaryPrompt.format({ schemes: formattedSchemes });
			const response = await model.invoke(prompt);

			console.log("AI response: " + response.content);
			setLastSummary(response.content);

			// Calculate similarity scores for display
			const mapping = {};
			results.forEach((scheme, index) => {
				const score = scheme.score || 1 - index * 0.1;
				mapping[scheme._id] = {
					score,
					reasons: [`Matches your search: "${searchTerm}"`],
				};
			});
			setSchemeScores(mapping);

			setIsResearchModalOpen(true);
		} catch (err) {
			console.error(err);
			alert("Search failed. See console for details.");
		} finally {
			setIsSearching(false);
		}
	};

	const handleCategoryClick = (category) => setSearchTerm(category);
	const handleSchemeClick = (scheme) => setSelectedScheme(scheme);
	const closeSchemeModal = () => setSelectedScheme(null);
	const handleAskAI = (scheme) => {
		setAiModalScheme(scheme);
		setSelectedScheme(null);
	};
	const closeAIModal = () => setAiModalScheme(null);

	const applyToScheme = async (schemeId) => {
		try {
			const token = localStorage.getItem("token");
			await axios.post(
				`${backendUrl}/api/v1/schemes/${schemeId}/apply`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			fetchMe();
			const el = document.createElement("div");
			el.setAttribute("role", "status");
			el.className =
				"fixed right-6 top-6 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 font-medium";
			el.textContent = "Applied successfully";
			document.body.appendChild(el);
			setTimeout(() => el.remove(), 2200);
		} catch (error) {
			console.error("Failed to apply to scheme:", error);
			alert("Failed to apply. Please try again.");
		}
	};

	const toggleFavorite = async (schemeId) => {
		try {
			const token = localStorage.getItem("token");
			const isFavorite = user?.favorite_schemes?.includes(schemeId);
			if (isFavorite) {
				await axios.delete(
					`${backendUrl}/api/v1/schemes/${schemeId}/favorite`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
			} else {
				await axios.post(
					`${backendUrl}/api/v1/schemes/${schemeId}/favorite`,
					{},
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
			}
			fetchMe();
		} catch (error) {
			console.error("Failed to toggle favorite:", error);
		}
	};

	const openResearchModal = () => setIsResearchModalOpen(true);
	const closeResearchModal = () => setIsResearchModalOpen(false);

	const handleSaveSummary = async (summaryText) => {
		try {
			const token = localStorage.getItem("token");
			await axios.post(
				`${backendUrl}/api/v1/user/interaction`,
				{
					type: "research_summary",
					text: summaryText,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			fetchMe();
		} catch (error) {
			console.error("Failed to save summary:", error);
		}
	};

	if (isLoading || loadingUser) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-gray-600 font-medium">Loading schemes...</p>
				</div>
			</div>
		);
	}
	const suggestions = [
		"I am a farmer looking for crop insurance",
		"Student searching for scholarship",
		"Need housing subsidy for low income",
		"Support for women entrepreneurs",
		"Healthcare assistance for senior citizens",
	];
	const recognitionRef = useRef(null);

	const { isListening, interim, start, stop } = useSpeechTranslate();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto p-6">
				{/* Navigation */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
					<SchemeNavigation />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Sidebar */}
					<aside className="lg:col-span-1 space-y-6">
						<Application_ProfileCard user={user || {}} />
						<HowToBox />
						{/* Stats Card */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
							<h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
								Quick Stats
							</h4>
							<div className="space-y-3">
								<div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
									<span className="text-sm text-gray-600">Applied</span>
									<span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs">
										{user?.applied_schemes?.length || 0}
									</span>
								</div>
								<div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
									<span className="text-sm text-gray-600">Favorites</span>
									<span className="font-semibold text-pink-600 bg-pink-50 px-2 py-1 rounded-full text-xs">
										{user?.favorite_schemes?.length || 0}
									</span>
								</div>
								<div className="flex items-center justify-between py-2">
									<span className="text-sm text-gray-600">Available</span>
									<span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-full text-xs">
										{schemes.length}
									</span>
								</div>
							</div>
						</div>
					</aside>

					{/* Main Content */}
					<main className="lg:col-span-3">
						{/* Search Section */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
							<div className="max-w-4xl">
								<div className="mb-6">
									<h1 className="text-3xl font-bold text-gray-900 mb-2">
										Find Government Schemes
									</h1>
									<p className="text-gray-600 text-lg leading-relaxed">
										Describe what you're looking for and we'll find the best
										matching schemes with AI-powered recommendations
									</p>
								</div>

								<div className="flex gap-3">
									<div className="flex flex-col">
										{/* Row: input + button */}
										<div className="flex gap-3">
											<div className="flex-1">
												<input
													value={searchTerm}
													onChange={(e) => setSearchTerm(e.target.value)}
													placeholder="e.g., small farmer looking for equipment subsidy"
													className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													aria-label="Describe your need"
												/>
											</div>
											<button
												onClick={handleRecommend}
												disabled={isSearching}
												className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap"
												aria-label="Search and recommend schemes"
											>
												{isSearching ? "Searching..." : "Search"}
											</button>
											{/* Language selector */}
											<LanguageSelector className="py-3" />
											{/* Mic button */}
											<button
												onClick={() => {
													isListening
														? stop()
														: start({
																lang: getCurrentLanguage().speechCode,
																debounceMs: 1200,
																selectedLanguage,
																onTranslated: (en) => setSearchTerm(en),
														  });
												}}
												className={`p-3 rounded-full border transition-colors ${
													isListening
														? "bg-red-500 text-white"
														: "bg-gray-100 hover:bg-gray-200 text-gray-700"
												}`}
												aria-label="Voice input"
												type="button"
											>
												<Mic />
											</button>
										</div>

										{/* Optional: show live Hindi/Tamil etc. while speaking */}
										{isListening && interim && (
											<div
												className="mt-2 text-sm text-gray-500 truncate"
												title={interim}
											>
												{interim}
											</div>
										)}

										{/* Suggestions row */}
										<div className="mt-4 flex flex-wrap gap-2">
											{suggestions.map((q, idx) => (
												<button
													key={idx}
													onClick={() => setSearchTerm(q)}
													className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
												>
													{q}
												</button>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* AI Summary Preview - Always show container during/after search */}
							{isSearching || lastSummary ? (
								<div className="mt-6 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
									<div className="flex items-start gap-3">
										<div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
											<span className="text-white text-xs font-bold">AI</span>
										</div>
										<div>
											<h4 className="font-medium text-blue-900 text-sm mb-1">
												AI Analysis
											</h4>
											<div className="text-blue-800 text-sm leading-relaxed w-full">
												{isSearching ? (
													// Show skeleton while searching
													<div className="w-full">
														<Skeleton count={5} className="w-full" />
													</div>
												) : lastSummary ? (
													// Show actual summary when available
													<MarkdownRenderer content={lastSummary} />
												) : null}
											</div>
										</div>
									</div>
								</div>
							) : null}
						</div>

						{/* Results Section */}
						<div className="space-y-4">
							{schemes.length === 0 ? (
								<div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
									<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<svg
											className="w-8 h-8 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											/>
										</svg>
									</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">
										No schemes found
									</h3>
									<p className="text-gray-500 max-w-sm mx-auto">
										Try adjusting your search terms or browse available
										categories.
									</p>
								</div>
							) : (
								schemes.map((scheme) => {
									const meta = schemeScores[scheme._id || scheme.id] || null;
									const score = meta ? meta.score : null;
									return (
										<div
											key={scheme._id || scheme.id}
											onClick={() => setSelectedScheme(scheme)} // 👈 open modal on click
											className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
										>
											<div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
												<div className="flex-1 min-w-0">
													{/* Header with badge */}
													<div className="flex items-start justify-between mb-3">
														<h3 className="text-xl font-semibold text-gray-900 leading-tight pr-4">
															{scheme.schemeName}
														</h3>
														{score !== null && (
															<div
																className={`flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
																	score >= 0.75
																		? "bg-green-100 text-green-700 border border-green-200"
																		: "bg-amber-100 text-amber-700 border border-amber-200"
																}`}
															>
																{score >= 0.75
																	? "High Match"
																	: `${Math.round(score * 100)}% Match`}
															</div>
														)}
													</div>

													{/* Short description */}
													<p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
														{scheme.detailedDescription_md.substring(0, 200) +
															"..." || "No description available"}
													</p>

													{/* Match reasons */}
													{meta && meta.reasons && meta.reasons.length > 0 && (
														<div className="bg-gray-50 rounded-lg p-3 mb-4">
															<div className="flex items-start gap-2">
																<span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
																	Why it matches:
																</span>
																<span className="text-sm text-gray-600">
																	{meta.reasons.join(" • ")}
																</span>
															</div>
														</div>
													)}

													{/* Category tag */}
													<div className="flex items-center gap-2">
														<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
															{scheme.state || "General"}
														</span>
													</div>
												</div>

												{/* Action buttons (stopPropagation so card click doesn't trigger) */}
												<div
													className="flex-shrink-0 flex flex-row lg:flex-col gap-2"
													onClick={(e) => e.stopPropagation()}
												>
													<button
														onClick={() =>
															applyToScheme(scheme._id || scheme.id)
														}
														className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors duration-200"
													>
														Apply Now
													</button>

													<button
														onClick={() =>
															toggleFavorite(scheme._id || scheme.id)
														}
														className={`px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors duration-200 ${
															user?.favorite_schemes?.includes(
																scheme._id || scheme.id
															)
																? "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
																: "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
														}`}
													>
														{user?.favorite_schemes?.includes(
															scheme._id || scheme.id
														)
															? "Saved"
															: "Save"}
													</button>

													<button
														onClick={() => handleAskAI(scheme)}
														className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
													>
														Ask AI
													</button>
												</div>
											</div>
										</div>
									);
								})
							)}
						</div>
					</main>
				</div>
			</div>

			{/* Floating AI Assistant */}
			<div className="fixed bottom-6 right-6 z-40">
				<div className="transition-transform duration-200 hover:scale-105">
					<AIAssistant />
				</div>
			</div>

			{/* Modals */}
			{selectedScheme && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
					<SchemeDetailModal
						scheme={selectedScheme}
						onClose={closeSchemeModal}
					/>
				</div>
			)}

			{aiModalScheme && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
					<AIQuestionModal scheme={aiModalScheme} onClose={closeAIModal} />
				</div>
			)}
		</div>
	);
}
