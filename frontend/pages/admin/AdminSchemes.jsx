import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useConfigStore from "../../stores/configStore";
import useAuthStore from "../../stores/authStore";
import { ClipLoader } from "react-spinners";

const AdminSchemes = () => {
	const { backendUrl } = useConfigStore();
	const { token } = useAuthStore();
	const [schemes, setSchemes] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchSchemes();
	}, []);

	const fetchSchemes = async () => {
		try {
			const response = await axios.get(`${backendUrl}/api/v1/all_schemes`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log("Fetched schemes:", response.data);
			setSchemes(response.data.schemes);
		} catch (error) {
			console.error("Error fetching schemes:", error);
		} finally {
			setLoading(false);
		}
	};

	const deleteScheme = async (id) => {
		if (!confirm("Are you sure you want to delete this scheme?")) return;

		try {
			await axios.delete(`${backendUrl}/api/v1/all_schemes/${id}`);
			setSchemes(schemes.filter((s) => s._id !== id));
		} catch (error) {
			console.error("Error deleting scheme:", error);
		}
	};

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Manage Schemes</h1>
				<button
					onClick={() => window.dispatchEvent(new CustomEvent('openCreateSchemeModal'))}
					className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
				>
					Create New Scheme
				</button>
			</div>

			{loading ? (
				<div className="w-full h-full flex items-center justify-center">
					<ClipLoader
						color={"purple"}
						size={50}
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
				</div>
			) : (
				<div className="bg-white rounded-lg shadow overflow-x-scroll">
					<table className="min-w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Category
								</th>

								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{schemes.map((scheme) => (
								<tr key={scheme._id}>
									<td className="px-6 py-4 whitespace-nowrap">
										{scheme.schemeName}
									</td>
									<td className="px-6 py-4 whitespace-nowrap capitalize">
										{scheme.category}
									</td>

									<td className="px-6 py-4 whitespace-nowrap space-x-2">
										<button
											onClick={() => deleteScheme(scheme._id)}
											className="text-red-600 hover:text-red-900"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default AdminSchemes;
