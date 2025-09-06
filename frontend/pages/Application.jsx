import React, { useState, useRef } from "react";
import {
	Camera,
	Mic,
	MicOff,
	Volume2,
	Send,
	Image,
	Bot,
	X,
	Square,
} from "lucide-react";

// Function to strip markdown formatting for clean text (used for TTS)
const stripMarkdown = (text) => {
	if (!text) return text;

	return (
		text
			// Remove headers
			.replace(/^#{1,6}\s+/gm, "")

			// Remove bold/italic formatting
			.replace(/\*\*(.*?)\*\*/g, "$1")
			.replace(/__(.*?)__/g, "$1")
			.replace(/\*(.*?)\*/g, "$1")
			.replace(/_(.*?)_/g, "$1")

			// Remove code blocks and inline code
			.replace(/```[\s\S]*?```/g, "")
			.replace(/`([^`]+)`/g, "$1")

			// Remove list markers
			.replace(/^\s*[-*+]\s+/gm, "")
			.replace(/^\s*\d+\.\s+/gm, "")

			// Remove links (keep text only)
			.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")

			// Clean up extra whitespace
			.replace(/\n{3,}/g, "\n\n")
			.replace(/\s{2,}/g, " ")
			.trim()
	);
};

// Simple markdown parser for rendering in UI
const parseMarkdown = (text) => {
	if (!text) return text;

	return (
		text
			// Headers
			.replace(
				/^### (.*$)/gim,
				'<h3 class="text-lg font-semibold mb-2 mt-3">$1</h3>'
			)
			.replace(
				/^## (.*$)/gim,
				'<h2 class="text-xl font-semibold mb-2 mt-4">$1</h2>'
			)
			.replace(
				/^# (.*$)/gim,
				'<h1 class="text-2xl font-bold mb-3 mt-4">$1</h1>'
			)

			// Bold text
			.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
			.replace(/__(.*?)__/g, '<strong class="font-semibold">$1</strong>')

			// Italic text
			.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
			.replace(/_(.*?)_/g, '<em class="italic">$1</em>')

			// Code blocks
			.replace(
				/```([\s\S]*?)```/g,
				'<pre class="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto my-2 border"><code>$1</code></pre>'
			)

			// Inline code
			.replace(
				/`([^`]+)`/g,
				'<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>'
			)

			// Unordered lists - convert to proper HTML lists
			.replace(/^[\s]*[-*+][\s]+(.*$)/gim, '<li class="mb-1">$1</li>')

			// Ordered lists
			.replace(/^[\s]*\d+\.[\s]+(.*$)/gim, '<li class="mb-1">$1</li>')

			// Line breaks
			.replace(/\n\n/g, '</p><p class="mb-2">')
			.replace(/\n/g, "<br>")
	);
};

// Component to render markdown content
const MarkdownText = ({ children, className = "" }) => {
	if (!children) return null;

	let htmlContent = parseMarkdown(children);

	// Wrap list items in proper ul/ol tags
	htmlContent = htmlContent.replace(
		/(<li class="mb-1">.*?<\/li>)/g,
		(match) => {
			return match;
		}
	);

	// Group consecutive list items
	htmlContent = htmlContent.replace(
		/(<li class="mb-1">.*?<\/li>(\s*<li class="mb-1">.*?<\/li>)*)/g,
		'<ul class="list-disc list-inside ml-4 mb-3 space-y-1">$1</ul>'
	);

	// Wrap content in paragraphs if not already wrapped
	if (
		!htmlContent.includes("<p") &&
		!htmlContent.includes("<h") &&
		!htmlContent.includes("<ul")
	) {
		htmlContent = `<p class="mb-2">${htmlContent}</p>`;
	}

	return (
		<div
			className={`prose prose-sm max-w-none leading-relaxed ${className}`}
			dangerouslySetInnerHTML={{ __html: htmlContent }}
		/>
	);
};

const Application = () => {
	const [messages, setMessages] = useState([]);
	const [inputText, setInputText] = useState("");
	const [selectedLanguage, setSelectedLanguage] = useState("English");
	const [isListening, setIsListening] = useState(false);
	const [uploadedImage, setUploadedImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [currentAudio, setCurrentAudio] = useState(null);
	const [playingMessageId, setPlayingMessageId] = useState(null);

	const fileInputRef = useRef(null);
	const cameraInputRef = useRef(null);
	const textareaRef = useRef(null);
	const languages = ["English", "Hindi", "Bengali"];
	const API_BASE = "http://localhost:8000";

	const stopCurrentAudio = () => {
		if (currentAudio) {
			currentAudio.pause();
			currentAudio.currentTime = 0;
			setCurrentAudio(null);
			setPlayingMessageId(null);
		}
	};

	const handleSendMessage = async () => {
		if (!inputText.trim() && !uploadedImage) return;

		// Stop any currently playing audio
		stopCurrentAudio();

		const newMessage = {
			id: Date.now(),
			type: "user",
			text: inputText,
			image: uploadedImage,
			timestamp: new Date().toLocaleTimeString(),
		};

		setMessages((prev) => [...prev, newMessage]);
		setIsLoading(true);

		try {
			let response;

			if (uploadedImage) {
				// Form analysis
				response = await fetch(`${API_BASE}/analyze-form`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						image_data: uploadedImage,
						language: selectedLanguage,
					}),
				});
			} else {
				// Regular chat
				response = await fetch(`${API_BASE}/chat`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						message: inputText,
						language: selectedLanguage,
					}),
				});
			}

			const data = await response.json();

			const aiResponse = {
				id: Date.now() + 1,
				type: "ai",
				text: uploadedImage ? data.help : data.response,
				audio_url: null, // Audio will be generated on-demand
				timestamp: new Date().toLocaleTimeString(),
			};

			setMessages((prev) => [...prev, aiResponse]);
		} catch (error) {
			const errorResponse = {
				id: Date.now() + 1,
				type: "ai",
				text: "Sorry, I encountered an error. Please try again.",
				timestamp: new Date().toLocaleTimeString(),
			};
			setMessages((prev) => [...prev, errorResponse]);
		}

		setInputText("");
		setUploadedImage(null);
		setIsLoading(false);
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
		}
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => setUploadedImage(e.target.result);
			reader.readAsDataURL(file);
		}
	};

	const toggleListening = () => {
		if (!isListening) {
			// Start speech recognition
			if ("webkitSpeechRecognition" in window) {
				const recognition = new window.webkitSpeechRecognition();
				recognition.lang =
					selectedLanguage === "Hindi"
						? "hi-IN"
						: selectedLanguage === "Bengali"
						? "bn-IN"
						: "en-US";
				recognition.onresult = (event) => {
					setInputText(event.results[0][0].transcript);
					setIsListening(false);
				};
				recognition.start();
				setIsListening(true);
			}
		} else {
			setIsListening(false);
		}
	};

	const handleTextToSpeech = async (messageId, text, audioUrl) => {
		// If this message is currently playing, stop it
		if (playingMessageId === messageId) {
			stopCurrentAudio();
			return;
		}

		// Stop any currently playing audio
		stopCurrentAudio();

		try {
			// Generate audio on-demand if not available
			if (!audioUrl) {
				setPlayingMessageId(messageId); // Show loading state

				// Strip markdown formatting before sending to TTS
				const cleanText = stripMarkdown(text);

				const response = await fetch(`${API_BASE}/generate-audio`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						text: cleanText, // Send clean text without markdown
						language: selectedLanguage,
					}),
				});

				const data = await response.json();
				audioUrl = data.audio_url;

				// Update the message with the generated audio URL
				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === messageId ? { ...msg, audio_url: audioUrl } : msg
					)
				);
			}

			if (audioUrl) {
				const audio = new Audio(audioUrl);
				setCurrentAudio(audio);
				setPlayingMessageId(messageId);

				audio.onended = () => {
					setCurrentAudio(null);
					setPlayingMessageId(null);
				};

				audio.onerror = () => {
					console.log("Audio play failed");
					setCurrentAudio(null);
					setPlayingMessageId(null);
				};

				audio.play().catch((e) => {
					console.log("Audio play failed:", e);
					setCurrentAudio(null);
					setPlayingMessageId(null);
				});
			}
		} catch (error) {
			console.error("Failed to generate audio:", error);
			setCurrentAudio(null);
			setPlayingMessageId(null);
		}
	};

	const handleInput = (e) => {
		setInputText(e.target.value);
		const el = textareaRef.current;
		if (el) {
			el.style.height = "auto";
			el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
		}
	};

	return (
		<div className="w-full h-screen bg-gray-50 flex flex-col">
			{/* Header */}
			<div className="bg-white border-b-1 border-purple-700 p-4">
				<div className="flex items-center gap-5">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
							<Bot className="text-white" size={20} />
						</div>
						<div>
							<h1 className="text-lg font-semibold text-text">
								Multilingual RAG Agent
							</h1>
							<p className="text-xs text-gray-500">
								Form filling & scheme assistant
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						{/* Global TTS Control */}
						{currentAudio && (
							<button
								onClick={stopCurrentAudio}
								className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition-colors"
							>
								<Square size={14} />
								Stop Audio
							</button>
						)}

						<select
							value={selectedLanguage}
							onChange={(e) => setSelectedLanguage(e.target.value)}
							className="text-sm border border-purple-700 rounded-lg px-2 py-1 bg-white "
						>
							{languages.map((lang) => (
								<option key={lang} value={lang}>
									{lang}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Chat Area */}
			<div className="flex-1 overflow-y-auto px-4 py-2">
				{messages.length === 0 ? (
					<div className="text-center mt-16">
						<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Bot size={32} className="text-purple-600" />
						</div>
						<h2 className="text-xl font-semibold text-text mb-2">Welcome!</h2>
						<p className="text-gray-600 text-sm px-8">
							Upload forms to get AI assistance or ask about government schemes
						</p>
					</div>
				) : (
					<div className="space-y-3 pb-4">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${
									message.type === "user" ? "justify-end" : "justify-start"
								}`}
							>
								<div
									className={`max-w-[80%] ${
										message.type === "user"
											? "bg-purple-600 text-white rounded-t-2xl rounded-bl-2xl"
											: "bg-white border border-purple-700 border-r-4 border-b-4 rounded-t-2xl rounded-br-2xl"
									} p-4`}
								>
									{message.image && (
										<img
											src={message.image}
											alt="Uploaded"
											className="w-full max-w-48 h-32 object-cover rounded-lg mb-3"
										/>
									)}

									{/* Render text with markdown support for AI messages, plain text for user messages */}
									{message.type === "ai" ? (
										<MarkdownText className="text-sm leading-relaxed break-words">
											{message.text}
										</MarkdownText>
									) : (
										<p className="text-sm leading-relaxed break-words">
											{message.text}
										</p>
									)}

									<div className="flex items-center justify-between mt-2">
										<span className="text-xs opacity-70">
											{message.timestamp}
										</span>
										{message.type === "ai" && (
											<button
												onClick={() =>
													handleTextToSpeech(
														message.id,
														message.text,
														message.audio_url
													)
												}
												className={`ml-2 p-1 rounded-full transition-colors ${
													playingMessageId === message.id
														? "bg-red-100 hover:bg-red-200"
														: "hover:bg-purple-50"
												}`}
												title={
													playingMessageId === message.id
														? "Stop audio"
														: "Generate & play audio"
												}
											>
												{playingMessageId === message.id ? (
													<Square size={14} className="text-red-600" />
												) : (
													<Volume2 size={14} className="text-purple-600" />
												)}
											</button>
										)}
									</div>
								</div>
							</div>
						))}
						{isLoading && (
							<div className="flex justify-start">
								<div className="bg-white border border-purple-700 rounded-2xl p-4">
									<div className="flex space-x-2">
										<div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
										<div
											className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
											style={{ animationDelay: "0.1s" }}
										></div>
										<div
											className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
											style={{ animationDelay: "0.2s" }}
										></div>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Image Preview */}
			{uploadedImage && (
				<div className="px-4 pb-2">
					<div className="bg-white border border-purple-700 rounded-lg p-3 relative">
						<button
							onClick={() => setUploadedImage(null)}
							className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
						>
							<X size={14} />
						</button>
						<img
							src={uploadedImage}
							alt="Preview"
							className="w-full max-h-20 object-cover rounded"
						/>
					</div>
				</div>
			)}

			{/* Voice Status */}
			{isListening && (
				<div className="px-4 pb-2">
					<div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
						<span className="text-sm text-red-600">
							🎤 Listening in {selectedLanguage}...
						</span>
					</div>
				</div>
			)}

			{/* Input Area */}
			<div className="bg-purple-100 border-t-1 border-purple-700 p-4">
				<div className="flex items-end gap-2">
					<div className="flex-1 bg-white border-2 border-purple-700 rounded-2xl">
						<textarea
							ref={textareaRef}
							value={inputText}
							onChange={handleInput}
							placeholder={`Ask about schemes or upload a form in ${selectedLanguage}...`}
							className="w-full px-4 py-3 resize-none outline-none text-base rounded-2xl overflow-y-hidden"
							onKeyPress={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleSendMessage();
								}
							}}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<div className="flex gap-2">
							<button
								onClick={() => cameraInputRef.current?.click()}
								className="w-12 h-12 bg-white border-2 border-purple-700 border-r-4 border-b-4 rounded-xl flex items-center justify-center hover:bg-purple-50 active:scale-95"
							>
								<Camera size={20} className="text-purple-700" />
							</button>
							<button
								onClick={() => fileInputRef.current?.click()}
								className="w-12 h-12 bg-white border-2 border-purple-700 border-r-4 border-b-4 rounded-xl flex items-center justify-center hover:bg-purple-50 active:scale-95"
							>
								<Image size={20} className="text-purple-700" />
							</button>
						</div>
						<div className="flex gap-2">
							<button
								onClick={toggleListening}
								className={`w-12 h-12 border-2 border-purple-700 border-r-4 border-b-4 rounded-xl flex items-center justify-center active:scale-95 ${
									isListening ? "bg-red-500" : "bg-white hover:bg-purple-50"
								}`}
							>
								{isListening ? (
									<MicOff size={20} className="text-white" />
								) : (
									<Mic size={20} className="text-purple-700" />
								)}
							</button>
							<button
								onClick={handleSendMessage}
								disabled={(!inputText.trim() && !uploadedImage) || isLoading}
								className="w-12 h-12 bg-purple-600 border-2 border-purple-700 border-r-4 border-b-4 rounded-xl flex items-center justify-center hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
							>
								<Send size={20} className="text-white" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Hidden file inputs */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleImageUpload}
				className="hidden"
			/>
			<input
				ref={cameraInputRef}
				type="file"
				accept="image/*"
				capture="environment"
				onChange={handleImageUpload}
				className="hidden"
			/>
		</div>
	);
};

export default Application;
