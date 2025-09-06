import React from "react";
import { X, MapPin, Tag, ExternalLink } from "lucide-react";

// MarkdownRenderer component (assuming it exists in your project)
const MarkdownRenderer = ({ content }) => {
	return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export default function SchemeDetailModal({ scheme, onClose }) {
	if (!scheme) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center">
			{/* Background overlay */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Modal container */}
			<div className="relative w-full max-w-4xl bg-white dark:bg-zinc-800 rounded-t-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slide-up">
				{/* Header with gradient background */}
				<div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 relative">
					{/* Close button */}
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
					>
						<X size={24} />
					</button>

					<h1 className="text-2xl font-bold mb-2 pr-12">{scheme.schemeName}</h1>
					{scheme.schemeShortTitle && (
						<p className="text-purple-100 text-sm mb-3">
							Abbreviation: {scheme.schemeShortTitle}
						</p>
					)}
					<div className="flex flex-wrap gap-2 text-sm">
						{scheme.state && (
							<span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
								<MapPin size={14} /> {scheme.state}
							</span>
						)}
						{scheme.level && (
							<span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
								Level: {scheme.level}
							</span>
						)}
					</div>
				</div>

				{/* Scrollable content */}
				<div className="flex-1 overflow-y-auto p-6 space-y-6">
					{/* Tags */}
					{scheme.tags && scheme.tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{scheme.tags.map((tag, index) => (
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
					{scheme.detailedDescription_md && (
						<section>
							<h2 className="text-xl font-semibold mb-3">Description</h2>
							<div className="prose max-w-none text-gray-700">
								<MarkdownRenderer content={scheme.detailedDescription_md} />
							</div>
						</section>
					)}

					{/* Benefits */}
					{scheme.benefits && scheme.benefits.length > 0 && (
						<section>
							<h2 className="text-xl font-semibold mb-3">Benefits</h2>
							<div className="bg-purple-50 rounded-lg p-4">
								{scheme.benefits.map((benefit, index) => (
									<div key={index} className="mb-3">
										{benefit.children &&
											benefit.children.map((item, idx) => (
												<div key={idx}>
													{item.children &&
														item.children.map((child, childIdx) => (
															<p key={childIdx} className="text-gray-700 mb-2">
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
					{scheme.eligibilityDescription_md && (
						<section>
							<h2 className="text-xl font-semibold mb-3">
								Eligibility Criteria
							</h2>
							<div className="bg-blue-50 rounded-lg p-4">
								{scheme.eligibilityDescription_md
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
					{scheme.documents_required &&
						scheme.documents_required.length > 0 && (
							<section>
								<h2 className="text-xl font-semibold mb-3">
									Documents Required
								</h2>
								<div className="bg-gray-50 rounded-lg p-4">
									{scheme.documents_required.map((doc, index) => (
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
					{scheme.applicationProcess &&
						scheme.applicationProcess.length > 0 && (
							<section>
								<h2 className="text-xl font-semibold mb-3">How to Apply</h2>
								{scheme.applicationProcess.map((process, index) => (
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
					{scheme.references && scheme.references.length > 0 && (
						<section>
							<h2 className="text-xl font-semibold mb-3">Important Links</h2>
							<div className="space-y-2">
								{scheme.references.map((ref) => (
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
				</div>

				{/* Apply Button - Fixed at bottom */}
				<div className="p-6 pt-4 border-t bg-gray-50 dark:bg-zinc-700">
					<button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105">
						Apply for this Scheme
					</button>
				</div>
			</div>

			{/* CSS for animations */}
			<style jsx>{`
				@keyframes slide-up {
					from {
						transform: translateY(100%);
					}
					to {
						transform: translateY(0);
					}
				}

				.animate-slide-up {
					animation: slide-up 0.3s ease-out;
				}
			`}</style>
		</div>
	);
}
