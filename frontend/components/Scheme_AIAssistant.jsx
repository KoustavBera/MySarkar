import { useState } from "react";
import { Bot, X, Send } from "lucide-react";
import React from "react";

const AIAssistant = () => {
	const [messages, setMessages] = useState([]);
	const [inputText, setInputText] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const handleSend = () => {
		if (!inputText.trim()) return;
		setMessages([...messages, { text: inputText, sender: "user" }]);
		setInputText("");
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{ text: "AI Response here...", sender: "ai" },
			]);
		}, 1000);
	};

	if (!isOpen) {
		return (
			<button
				onClick={() => setIsOpen(true)}
				className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg"
			>
				<Bot className="w-6 h-6" />
			</button>
		);
	}

	return (
		<div className="fixed bottom-6 right-6 w-80 bg-white border rounded-xl shadow-xl z-50">
			<div className="flex items-center justify-between p-4 border-b">
				<div className="flex gap-2 items-center">
					<Bot className="w-5 h-5 text-purple-600" />
					<span className="font-semibold text-purple-600">Ask Yojana AI</span>
				</div>
				<button onClick={() => setIsOpen(false)}>
					<X className="w-5 h-5" />
				</button>
			</div>
			<div className="h-64 overflow-y-auto p-4">
				{messages.map((msg, i) => (
					<div
						key={i}
						className={msg.sender === "user" ? "text-right" : "text-left"}
					>
						<div
							className={`inline-block px-3 py-2 rounded-lg text-sm ${
								msg.sender === "user"
									? "bg-purple-600 text-white"
									: "bg-gray-200"
							}`}
						>
							{msg.text}
						</div>
					</div>
				))}
			</div>
			<div className="p-3 border-t flex gap-2">
				<input
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
					placeholder="Type your question..."
					className="flex-1 border rounded-lg px-2 py-1 text-sm"
				/>
				<button
					onClick={handleSend}
					className="p-2 bg-purple-600 text-white rounded-lg"
				>
					<Send className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
};

export default AIAssistant;
