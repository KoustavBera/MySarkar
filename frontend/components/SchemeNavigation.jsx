import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Flame, Grid } from "lucide-react";

const SchemeNavigation = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const isPersonalised = location.pathname === "/scheme";
	const isShowAll = location.pathname === "/show-all-schemes";

	return (
		<div className="flex justify-center mb-6">
			<div className="bg-white rounded-full p-1 shadow-lg border-2 border-purple-200">
				<div className="flex">
					<button
						onClick={() => navigate("/show-all-schemes")}
						className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
							isShowAll
								? "bg-purple-600 text-white shadow-md"
								: "text-gray-600 hover:text-purple-600"
						}`}
					>
						<Grid size={18} />
						<span className="font-medium">Show All Schemes</span>
					</button>
					<button
						onClick={() => navigate("/scheme")}
						className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
							isPersonalised
								? "bg-purple-600 text-white shadow-md"
								: "text-gray-600 hover:text-purple-600"
						}`}
					>
						<Flame size={18} />
						<span className="font-medium">Personalised Scheme 🔥</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default SchemeNavigation;