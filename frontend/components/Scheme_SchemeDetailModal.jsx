import React from "react";
import { X } from "lucide-react";

const SchemeDetailModal = ({ scheme, onClose }) => {
	if (!scheme) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50">
			<div className="bg-white p-6 rounded-xl w-full max-w-lg">
				{/* Header */}
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-bold">{scheme.name}</h2>
					<button onClick={onClose}>
						<X className="w-6 h-6" />
					</button>
				</div>

				{/* Description */}
				<p className="mt-4 text-gray-700">{scheme.description}</p>

				{/* More Info */}
				<div className="mt-6 space-y-2 text-gray-600">
					<p>
						<span className="font-semibold">Category:</span>{" "}
						{scheme.category || "General"}
					</p>
					<p>
						<span className="font-semibold">Eligibility:</span>{" "}
						{scheme.eligibility || "Not specified"}
					</p>
					<p>
						<span className="font-semibold">Benefits:</span>{" "}
						{scheme.benefits || "Not specified"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default SchemeDetailModal;
