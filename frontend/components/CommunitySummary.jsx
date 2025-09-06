import React, { useEffect, useState } from "react";
import axios from "axios";
import useConfigStore from "../stores/configStore";
import { GoogleGenerativeAI } from "@google/generative-ai";
import MarkdownRenderer from "../components/MarkdownRenderer.jsx";
const CommunitySummary = () => {
	const { backendUrl } = useConfigStore();
	const [posts, setPosts] = useState([]);
	const [summary, setSummary] = useState("");
	const [loading, setLoading] = useState(false);
	const [prompt, setPrompt] = useState("");
	const [error, setError] = useState("");
	// init Gemini
	const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

	useEffect(() => {
		const fetchAndAnalyze = async () => {
			try {
				const response = await axios.get(`${backendUrl}/api/v1/posts/all`);
				const fetchedPosts = response.data.posts;
				setPosts(fetchedPosts);

				// Combine all post contents
				const combinedPrompt = fetchedPosts.map((p) => p.content).join("\n");
				setPrompt(combinedPrompt);

				// Auto-analyze immediately after fetching
				if (combinedPrompt) {
					await analyzeSentiment(combinedPrompt);
				}
			} catch (error) {
				console.error("Failed to fetch posts:", error);
				setError("Failed to analyze sentiment. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchAndAnalyze();
	}, [backendUrl]);

	const analyzeSentiment = async (text) => {
		setLoading(true);
		try {
			const result = await model.generateContent(
				`Summarize the overall sentiment of these community comments and give a short summary (positive/negative/neutral with reasons):\n\n${text}`
			);
			const aiText = result.response.text();
			setSummary(aiText);
		} catch (error) {
			console.error("Error calling Gemini API:", error);
		} finally {
			setLoading(false);
		}
	};
	// In the return statement, add:
	{
		error && (
			<div className="mt-4 p-3 border rounded bg-red-50 text-red-700">
				{error}
			</div>
		);
	}

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-2">Community Summary</h2>

			{loading && <p className="text-gray-500">Analyzing sentiment...</p>}

			{summary && !loading && (
				<div className="mt-4 p-3 border rounded-2xl bg-green-100 text-green-700	">
					<h3 className="font-semibold">AI Sentiment Summary:</h3>
					<MarkdownRenderer content={summary} />
				</div>
			)}
		</div>
	);
};

export default CommunitySummary;
