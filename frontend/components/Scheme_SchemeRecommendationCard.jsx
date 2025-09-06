import { HelpCircle } from "lucide-react";
import React from "react";
const SchemeRecommendationCard = ({ scheme, onClick }) => {
	const matchColors = {
		High: "text-green-600 bg-green-50",
		Medium: "text-orange-600 bg-orange-50",
		Low: "text-red-600 bg-red-50",
	};

	return (
		<div
			onClick={() => onClick(scheme)}
			className="bg-white border-l-4 border-green-500 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md"
		>
			<div className="flex justify-between mb-3">
				<span
					className={`text-xs px-2 py-1 rounded-full ${
						matchColors[scheme.urgency]
					}`}
				>
					● {scheme.urgency} Match
				</span>
				<HelpCircle className="w-4 h-4 text-purple-600" />
			</div>
			<h3 className="text-lg font-semibold text-purple-600">{scheme.name}</h3>
			<p className="text-sm text-gray-700">{scheme.description}</p>
		</div>
	);
};

export default SchemeRecommendationCard;
