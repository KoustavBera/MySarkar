// ResearchSummary.jsx
import React, { useEffect, useState } from "react";
import { X, RefreshCw, Download } from "lucide-react";

/**
 * ResearchSummary modal (LLM-provided)
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: function
 *  - schemes: array (list of scheme objects)
 *  - user: object (user profile)
 *  - onSaveSummary?: function(text) optional callback to persist the summary
 *
 * NOTE: simulateLLMGenerate simulates an LLM response. Replace it with a real API call.
 */

const simulateLLMGenerate = (schemes = [], user = {}) => {
	// Synchronous string-building to simulate a generated summary.
	// Replace with fetch -> backend LLM endpoint when available.
	if (!schemes || schemes.length === 0) {
		return `I couldn't find any schemes matching your profile (age: ${
			user?.profile?.age || "N/A"
		}, income: ${
			user?.profile?.income || "N/A"
		}). Try changing filters or keywords.`;
	}

	// Short headline
	const topCount = Math.min(5, schemes.length);
	let text = `Personalized Research Summary for ${
		user?.name || "User"
	} — top ${topCount} recommended scheme${topCount > 1 ? "s" : ""}:\n\n`;

	// List top schemes with reasons (basic heuristics)
	schemes.slice(0, topCount).forEach((s, i) => {
		const reasonParts = [];
		if (user?.profile?.income && s.benefits?.length) {
			reasonParts.push(`helps with ${s.benefits[0]}`);
		}
		if (s.category) reasonParts.push(`${s.category} support`);
		if (s.tags?.length)
			reasonParts.push(`tags: ${s.tags.slice(0, 3).join(", ")}`);

		const reason = reasonParts.length
			? `Reason: ${reasonParts.join(" · ")}`
			: "";
		text += `${i + 1}. ${s.name}\n   ${s.description}\n   ${reason}\n\n`;
	});

	// Actionable next steps
	text += `Next steps:\n`;
	text += `• Check required documents listed per-scheme and keep Aadhaar & bank details ready if applicable.\n`;
	text += `• For urgent schemes (High urgency), apply within 2–4 weeks. For medium/low urgency, plan accordingly.\n\n`;

	// Short personalized tip
	text += `Personalized tip: Since your income is ₹${
		user?.profile?.income || "N/A"
	}, prioritize schemes that offer direct transfer or loans with low eligibility thresholds.\n`;

	return text;
};

const ResearchSummary = ({
	isOpen,
	onClose,
	schemes = [],
	user = {},
	onSaveSummary,
}) => {
	const [loading, setLoading] = useState(false);
	const [summary, setSummary] = useState("");
	const [lastGeneratedAt, setLastGeneratedAt] = useState(null);

	// generate when modal opens (first time)
	useEffect(() => {
		if (!isOpen) return;
		generateSummary();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	const generateSummary = () => {
		setLoading(true);
		setSummary("");
		// simulate network/LLM delay
		setTimeout(() => {
			const generated = simulateLLMGenerate(schemes, user);
			setSummary(generated);
			setLastGeneratedAt(new Date());
			setLoading(false);
		}, 700); // small simulated latency
	};

	const handleRegenerate = () => generateSummary();

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(summary);
			alert("Summary copied to clipboard");
		} catch (err) {
			alert("Unable to copy. Browser denied clipboard permission.");
		}
	};

	const handleDownload = () => {
		const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		const filename = `research-summary-${new Date()
			.toISOString()
			.slice(0, 19)
			.replace(/[:T]/g, "-")}.txt`;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleSave = () => {
		if (onSaveSummary) onSaveSummary(summary);
		alert(
			"Summary saved locally (callback invoked). Replace with backend call to persist."
		);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-white/10 backdrop-blur-sm p-4">
			<div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
				<div className="flex items-center justify-between p-4 border-b">
					<div>
						<h3 className="text-lg font-semibold">Research Summary (AI)</h3>
						<div className="text-xs text-gray-500">
							Generated for {user?.name || "you"} • {schemes.length} schemes
							considered
						</div>
					</div>

					<div className="flex items-center gap-2">
						<button
							onClick={handleRegenerate}
							className="flex items-center gap-2 px-3 py-1 border rounded text-sm disabled:opacity-60"
							disabled={loading}
							title="Regenerate summary"
						>
							<RefreshCw className="w-4 h-4" />
							Regenerate
						</button>

						<button
							onClick={handleCopy}
							className="flex items-center gap-2 px-3 py-1 border rounded text-sm"
							title="Copy to clipboard"
						>
							Copy
						</button>

						<button
							onClick={handleDownload}
							className="flex items-center gap-2 px-3 py-1 border rounded text-sm"
							title="Download as text"
						>
							<Download className="w-4 h-4" />
							Download
						</button>

						<button
							onClick={() => {
								onClose();
							}}
							className="ml-2 p-2 rounded hover:bg-gray-100"
							title="Close"
						>
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>

				<div className="p-6 max-h-[60vh] overflow-y-auto">
					{loading ? (
						<div className="text-center text-gray-500">Generating summary…</div>
					) : (
						<>
							<pre className="whitespace-pre-wrap text-sm text-gray-800">
								{summary}
							</pre>
							<div className="mt-4 text-xs text-gray-500">
								{lastGeneratedAt
									? `Last generated: ${lastGeneratedAt.toLocaleString()}`
									: ""}
							</div>
						</>
					)}
				</div>

				<div className="flex items-center justify-between p-4 border-t">
					<div className="text-sm text-gray-600">
						Tip: You can regenerate the summary after changing filters or user
						profile.
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={handleSave}
							className="px-4 py-2 bg-black text-white rounded-md text-sm"
							disabled={loading || !summary}
						>
							Save Summary
						</button>
						<button
							onClick={onClose}
							className="px-4 py-2 border rounded-md text-sm"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResearchSummary;
