// src/components/QuickSearchCategories.jsx
import React, { useMemo, useState } from "react";

/**
 * QuickSearchCategories
 *
 * Props:
 *  - categories: string[] (optional)  -- list of category names
 *  - onCategoryClick: (category: string) => void  -- required
 *  - selectedCategory: string (optional) -- currently active category
 *  - className: string (optional) -- container className
 */
const defaultCategories = [
	"Education",
	"Healthcare",
	"Agriculture",
	"Student Loans",
	"Startup Funding",
	"Women Empowerment",
	"Housing",
	"Employment",
	"Senior Citizen Benefits",
	"Disability Support",
	"Farmers",
];

const QuickSearchCategories = ({
	categories = defaultCategories,
	onCategoryClick,
	selectedCategory,
	className = "",
}) => {
	const [filter, setFilter] = useState("");

	const visible = useMemo(() => {
		if (!filter.trim()) return categories;
		const q = filter.toLowerCase().trim();
		return categories.filter((c) => c.toLowerCase().includes(q));
	}, [filter, categories]);

	const handleKeyDown = (e, category) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onCategoryClick && onCategoryClick(category);
		}
	};

	return (
		<div className={`mb-6 ${className}`}>
			<div className="flex items-center justify-between mb-3">
				<p className="text-sm text-gray-600">Quick Search:</p>
				<input
					type="text"
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					placeholder="Filter categories..."
					className="text-xs border px-2 py-1 rounded bg-white"
					aria-label="Filter quick search categories"
				/>
			</div>

			<div className="flex flex-wrap gap-2">
				{visible.map((category) => {
					const isSelected = selectedCategory === category;
					return (
						<button
							key={category}
							onClick={() => onCategoryClick && onCategoryClick(category)}
							onKeyDown={(e) => handleKeyDown(e, category)}
							aria-pressed={isSelected}
							className={`px-3 py-1 text-sm rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 
                ${
									isSelected
										? "bg-purple-600 text-white border-transparent"
										: "bg-gray-100 hover:bg-purple-50 text-gray-700"
								}`}
						>
							{category}
						</button>
					);
				})}

				{visible.length === 0 && (
					<div className="text-sm text-gray-500 px-2 py-1">
						No categories match “{filter}”
					</div>
				)}
			</div>
		</div>
	);
};

export default QuickSearchCategories;
