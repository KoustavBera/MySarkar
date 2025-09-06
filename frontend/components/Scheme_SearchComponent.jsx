import { Search } from "lucide-react";
import QuickSearchCategories from "./Scheme_QuickSearchCategories";
import React from "react";
const SearchComponent = ({ searchTerm, onSearchChange, onCategoryClick }) => (
	<div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
		<div className="flex items-center gap-2 mb-4">
			<Search className="w-5 h-5 text-gray-400" />
			<input
				value={searchTerm}
				onChange={(e) => onSearchChange(e.target.value)}
				placeholder="Search schemes..."
				className="flex-1 border rounded-lg px-3 py-2"
			/>
		</div>
		<QuickSearchCategories onCategoryClick={onCategoryClick} />
	</div>
);

export default SearchComponent;
