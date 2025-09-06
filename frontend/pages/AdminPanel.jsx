import React, { useState, useEffect } from "react";
import axios from "axios";
import useConfigStore from "../stores/configStore";
import useAuthStore from "../stores/authStore";
import { toast } from "react-hot-toast";
import AdminSidebar from "../components/AdminSidebar";
import CreateSchemeModal from "../components/CreateSchemeModal";
import Community from "../pages/Community.jsx";
import {
	ChartBarIcon,
	UsersIcon,
	DocumentTextIcon,
	ClipboardDocumentListIcon,
	PlusIcon,
	EyeIcon,
	PencilIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import AdminSchemes from "./admin/AdminSchemes";

const AdminPanel = () => {
	const { backendUrl } = useConfigStore();
	const { user, token } = useAuthStore();
	const [activeTab, setActiveTab] = useState("dashboard");
	const [schemes, setSchemes] = useState([]);
	const [applications, setApplications] = useState([]);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [dashboardStats, setDashboardStats] = useState({
		totalSchemes: 0,
		totalApplications: 0,
		totalUsers: 0,
		approvalRate: "0%",
	});
	useEffect(() => {
		if (activeTab === "dashboard") fetchDashboardStats();
		if (activeTab === "applications") fetchApplications();
	}, [activeTab]);

	useEffect(() => {
		const handleOpenModal = () => setShowCreateModal(true);
		window.addEventListener("openCreateSchemeModal", handleOpenModal);
		return () =>
			window.removeEventListener("openCreateSchemeModal", handleOpenModal);
	}, []);

	const fetchDashboardStats = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`${backendUrl}/api/v1/admin-dashboard/stats`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setDashboardStats(response.data);
		} catch (error) {
			console.error("Error fetching dashboard stats:", error);
			toast.error("Failed to load dashboard stats");
		} finally {
			setLoading(false);
		}
	};

	// Check if user has admin access
	if (!user || !["govt_official", "ngo"].includes(user.role)) {
		return (
			<div className="flex items-center justify-center h-screen bg-gray-50">
				<div className="text-center bg-white p-8 rounded-lg shadow-lg">
					<h1 className="text-2xl font-bold text-red-600 mb-2">
						Access Denied
					</h1>
					<p className="text-gray-600">
						You don't have permission to access this page.
					</p>
				</div>
			</div>
		);
	}

	const isGovtOfficial = user.role === "govt_official";

	const fetchApplications = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${backendUrl}/api/v1/applications`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log(response.data.applications[0].scheme.schemeName);
			setApplications(response.data.applications);
		} catch (error) {
			console.error("Error fetching applications:", error);
			toast.error("Failed to load applications");
		} finally {
			setLoading(false);
		}
	};

	const updateApplicationStatus = async (id, status, notes = "") => {
		try {
			const response = await axios.patch(
				`${backendUrl}/api/v1/applications/${id}/status`,
				{ status, notes },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success(`Application ${status} successfully`);
			fetchApplications();

			// Log notification data for future use
			console.log("Notification data:", response.data.notification);
		} catch (error) {
			console.error("Error updating application:", error);
			toast.error("Failed to update application");
		}
	};

	const deleteUser = async (userId) => {
		if (!confirm("Are you sure you want to delete this user?")) return;

		try {
			await axios.delete(`${backendUrl}/api/v1/users/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			toast.success("User deleted successfully");
			fetchUsers();
		} catch (error) {
			toast.error("Failed to delete user");
		}
	};

	const StatCard = ({ title, value, icon: Icon, color }) => (
		<div
			className={`bg-gradient-to-r ${color} p-6 rounded-xl shadow-lg text-white`}
		>
			<div className="flex items-center justify-between">
				<div>
					<p className="text-white/80 text-sm font-medium">{title}</p>
					<p className="text-3xl font-bold mt-1">{value}</p>
				</div>
				<Icon className="w-12 h-12 text-white/60" />
			</div>
		</div>
	);

	return (
		<div className="flex h-screen bg-gray-50">
			<AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

			<div className="flex-1 overflow-auto">
				{/* Header */}
				<div className="bg-white shadow-sm border-b px-8 py-6">
					<h1 className="text-2xl font-bold text-gray-900 capitalize">
						{activeTab === "dashboard"
							? "Dashboard Overview"
							: activeTab.replace("_", " ")}
					</h1>
					<p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
				</div>

				{/* Content */}
				<div className="p-8">
					{activeTab === "dashboard" && (
						<div className="space-y-8">
							{/* Stats Grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								<StatCard
									title="Total Schemes"
									value={dashboardStats.totalSchemes}
									icon={DocumentTextIcon}
									color="from-blue-500 to-blue-600"
								/>
								<StatCard
									title="Applications"
									value={dashboardStats.totalApplications}
									icon={ClipboardDocumentListIcon}
									color="from-green-500 to-green-600"
								/>
								<StatCard
									title="Active Users"
									value={dashboardStats.totalUsers}
									icon={UsersIcon}
									color="from-purple-500 to-purple-600"
								/>
								<StatCard
									title="Approval Rate"
									value={dashboardStats.approvalRate}
									icon={ChartBarIcon}
									color="from-orange-500 to-orange-600"
								/>
							</div>

							{/* Recent Activity */}
							<div className="bg-white rounded-xl shadow-lg p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Recent Activity
								</h3>
								<div className="space-y-4">
									<div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">
												New application submitted
											</p>
											<p className="text-xs text-gray-500">
												PM Kisan Scheme - 2 minutes ago
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
										<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">
												Scheme updated
											</p>
											<p className="text-xs text-gray-500">
												Healthcare Scheme - 1 hour ago
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
										<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">
												User registered
											</p>
											<p className="text-xs text-gray-500">
												New user from Delhi - 3 hours ago
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === "applications" && (
						<div className="bg-white rounded-xl shadow-lg p-6">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-xl font-semibold text-gray-900">
									Manage Applications
								</h2>
							</div>

							{loading ? (
								<div className="text-center py-12">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
									<p className="text-gray-500 mt-2">Loading applications...</p>
								</div>
							) : (
								<div className="overflow-hidden">
									<table className="min-w-full">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													User
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Scheme
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Status
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Applied Date
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{applications.map((application) => (
												<tr key={application._id} className="hover:bg-gray-50">
													<td className="px-6 py-4 whitespace-nowrap">
														<div>
															<div className="text-sm font-medium text-gray-900">
																{application.user?.name}
															</div>
															<div className="text-sm text-gray-500">
																{application.user?.email}
															</div>
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">
															{application.scheme?.name}
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<span
															className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
																application.status === "approved"
																	? "bg-green-100 text-green-800"
																	: application.status === "rejected"
																	? "bg-red-100 text-red-800"
																	: "bg-yellow-100 text-yellow-800"
															}`}
														>
															{application.status}
														</span>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
														{new Date(
															application.appliedAt
														).toLocaleDateString()}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
														{application.status === "pending" && (
															<div className="flex space-x-2">
																<button
																	onClick={() =>
																		updateApplicationStatus(
																			application._id,
																			"approved"
																		)
																	}
																	className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
																>
																	Approve
																</button>
																<button
																	onClick={() =>
																		updateApplicationStatus(
																			application._id,
																			"rejected",
																			"Application does not meet requirements"
																		)
																	}
																	className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
																>
																	Reject
																</button>
															</div>
														)}
														{application.status !== "pending" && (
															<span className="text-gray-500 capitalize">
																{application.status}
															</span>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					)}

					{activeTab === "schemes" && <AdminSchemes />}
					{activeTab === "community" && <Community />}
					{activeTab === "settings" && (
						<div className="bg-white rounded-xl shadow-lg p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-6">
								Settings
							</h2>

							<div className="space-y-6">
								<div className="border-b border-gray-200 pb-6">
									<h3 className="text-lg font-medium text-gray-900 mb-4">
										Profile Settings
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Name
											</label>
											<input
												type="text"
												value={user?.name || ""}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
												readOnly
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Email
											</label>
											<input
												type="email"
												value={user?.email || ""}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
												readOnly
											/>
										</div>
									</div>
								</div>

								<div className="pt-6">
									<button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
										Save Changes
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Create Scheme Modal */}
			<CreateSchemeModal
				isOpen={showCreateModal}
				onClose={() => setShowCreateModal(false)}
				onSchemeCreated={(newScheme) => {
					setSchemes((prev) => [newScheme, ...prev]);
					setShowCreateModal(false);
				}}
			/>
		</div>
	);
};

export default AdminPanel;
