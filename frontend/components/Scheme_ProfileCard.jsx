import {
	User,
	Plus,
	Mail,
	Phone,
	MapPin,
	Calendar,
	DollarSign,
	Shield,
	Edit,
} from "lucide-react";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
const ProfileSchemeCard = ({ user }) => {
	const getRoleDisplay = (role) => {
		const roleMap = {
			govt_official: "Government Official",
			beneficiary: "Beneficiary",
			admin: "Administrator",
		};
		return roleMap[role] || role;
	};

	const getRoleColor = (role) => {
		const colorMap = {
			govt_official: "bg-blue-600",
			beneficiary: "bg-green-600",
			admin: "bg-purple-600",
		};
		return colorMap[role] || "bg-gray-600";
	};

	const navigate = useNavigate();
	const { logout } = useAuthStore();
	return (
		<div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-200">
			{/* Header Section */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
				<div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
					<User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
				</div>
				<div className="flex-1 min-w-0">
					<h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
						{user?.name || "User Name"}
					</h2>
					<div
						className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white mt-2 ${getRoleColor(
							user?.role
						)}`}
					>
						<Shield className="w-3 h-3 flex-shrink-0" />
						<span className="truncate">{getRoleDisplay(user?.role)}</span>
					</div>
				</div>
				<div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
					<button
						onClick={() => navigate("/profile")}
						className="flex-1 sm:flex-none  bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors"
					>
						<Edit className="w-3 h-3 flex-shrink-0" />
						<span className="hidden xs:inline">Edit</span>
					</button>
					<button
						onClick={logout}
						className="flex-1 sm:flex-none bg-red-500 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors"
					>
						<Plus className="w-3 h-3 flex-shrink-0" />
						<span className="hidden xs:inline">New</span>
					</button>
				</div>
			</div>

			{/* Contact Information */}
			<div className="space-y-3 sm:space-y-4 mb-6">
				<div className="flex items-center gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl">
					<div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
						<Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-sm font-medium text-gray-900 truncate">
							{user?.email || "Not provided"}
						</p>
						<p className="text-xs text-gray-600">Email Address</p>
					</div>
				</div>

				<div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-xl">
					<div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
						<Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-sm font-medium text-gray-900 truncate">
							{user?.phone || "Not provided"}
						</p>
						<p className="text-xs text-gray-600">Phone Number</p>
					</div>
				</div>
			</div>

			{/* Profile Details Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
				<div className="p-3 sm:p-4 bg-purple-50 rounded-xl">
					<div className="flex items-center gap-2 mb-2">
						<Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
						<p className="text-xs font-medium text-purple-600">Age</p>
					</div>
					<p className="text-lg font-bold text-gray-900">
						{user?.profile?.age || "N/A"}
					</p>
				</div>

				<div className="p-3 sm:p-4 bg-orange-50 rounded-xl">
					<div className="flex items-center gap-2 mb-2">
						<DollarSign className="w-4 h-4 text-orange-600 flex-shrink-0" />
						<p className="text-xs font-medium text-orange-600">Income</p>
					</div>
					<p className="text-lg font-bold text-gray-900 truncate">
						{typeof user?.profile?.income === "object"
							? `${user?.profile?.income || ""} ${
									user?.profile?.income?.currency || ""
							  }`.trim() || "N/A"
							: user?.profile?.income || "N/A"}
					</p>
				</div>
			</div>

			{/* Location */}
			<div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl mb-6">
				<div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
					<MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
				</div>
				<div className="min-w-0 flex-1">
					<p className="text-sm font-medium text-gray-900 truncate">
						{user?.profile?.location || "Not specified"}
					</p>
					<p className="text-xs text-gray-600">Current Location</p>
				</div>
			</div>

			{/* Privacy Notice */}
			<div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
				<p className="text-xs text-blue-800 leading-relaxed">
					<Shield className="w-3 h-3 inline mr-1 flex-shrink-0" />
					Complete profile to get more relevant schemes
				</p>
			</div>
		</div>
	);
};

export default ProfileSchemeCard;
