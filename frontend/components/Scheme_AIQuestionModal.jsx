import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { InferenceClient } from "@huggingface/inference";
import { useLanguage } from "../contexts/LanguageContext";

const AIQuestionModal = ({ scheme, onClose }) => {
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [utterance, setUtterance] = useState(null);
	const { selectedLanguage, setSelectedLanguage, languages } = useLanguage();

	// Clean up speech synthesis when component unmounts or when answer changes
	useEffect(() => {
		return () => {
			if (utterance) {
				window.speechSynthesis.cancel();
			}
		};
	}, [utterance]);

	const handleAsk = async () => {
		if (!question.trim()) return;
		setIsLoading(true);
		try {
			const client = new InferenceClient(
				import.meta.env.VITE_HUGGINGFACE_API_KEY
			);

			// Determine the language name for the prompt
			const currentLang = languages.find(l => l.code === selectedLanguage);
			const languageName = currentLang?.name || "English";

			const response = await client.chatCompletion({
				provider: "cohere",
				model: "CohereLabs/command-a-translate-08-2025",
				messages: [
					{
						role: "system",
						content: `You are a helpful AI assistant that answers questions about government schemes in ${languageName}.
            Scheme: "${scheme.schemeName}" - ${
							scheme.detailedDescription_md?.substring(0, 500) ||
							"No description available"
						}
            Please respond in ${languageName}.`,
					},
					{
						role: "user",
						content: question,
					},
				],
			});
			const answerText = response.choices[0].message.content;
			setAnswer(answerText);
			speak(answerText);
		} catch (error) {
			console.error("AI Error:", error);
			setAnswer("Sorry, I couldn't process your question. Please try again.");
		} finally {
			setIsLoading(false);
			setQuestion("");
		}
	};

	const speak = (text) => {
		if ("speechSynthesis" in window) {
			// Cancel any ongoing speech
			window.speechSynthesis.cancel();

			const newUtterance = new SpeechSynthesisUtterance(text);
			// Set the language based on the selected language
			const currentLang = languages.find(l => l.code === selectedLanguage);
			newUtterance.lang = currentLang?.speechCode || "en-US";

			newUtterance.onstart = () => setIsSpeaking(true);
			newUtterance.onend = () => setIsSpeaking(false);
			newUtterance.onerror = (event) => {
				console.error("SpeechSynthesis error:", event);
				setIsSpeaking(false);
			};
			setUtterance(newUtterance);
			window.speechSynthesis.speak(newUtterance);
		} else {
			console.warn("Text-to-speech not supported in this browser.");
		}
	};

	const stopSpeaking = () => {
		if (utterance) {
			window.speechSynthesis.cancel();
			setIsSpeaking(false);
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50">
			<div className="bg-white p-6 rounded-xl w-full max-w-lg">
				{/* Header */}
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-bold">AI Assistant</h2>
					<button onClick={onClose}>
						<X className="w-6 h-6" />
					</button>
				</div>

				<p className="mt-4 text-gray-600">
					Ask any question about <strong>{scheme.schemeName}</strong>.
				</p>

				{/* Input */}
				<div className="mt-4 flex space-x-2">
					<input
						type="text"
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						className="flex-grow border rounded-lg px-3 py-2"
						placeholder="Type your question..."
					/>
					<button
						onClick={handleAsk}
						disabled={isLoading}
						className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
					>
						{isLoading ? "Thinking..." : "Ask"}
					</button>
				</div>

				{/* Answer */}
				{answer && (
					<div className="mt-4 p-3 bg-gray-100 rounded-lg">
						<div className="flex justify-between items-center">
							<strong className="text-gray-800">AI:</strong>
							{isSpeaking && (
								<button
									onClick={stopSpeaking}
									className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
								>
									Stop
								</button>
							)}
						</div>
						<div className="mt-2 text-gray-800">{answer}</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AIQuestionModal;
