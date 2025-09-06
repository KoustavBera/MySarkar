import React, { useEffect, useState } from "react";
import {
	User,
	MapPin,
	FileText,
	Calendar,
	Phone,
	Mail,
	Building,
} from "lucide-react";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const ProfilePage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "user",
		permissions: [],
		location: {
			state: "",
			district: "",
			pincode: "",
			address: "",
			coordinates: { latitude: "", longitude: "" },
		},
		profile: {
			phone: "",
			dateOfBirth: "",
			gender: "",
			category: "",
			income: { annual: "", currency: "INR" },
			documents: [],
		},
	});

	const [showProfile, setShowProfile] = useState(true);

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		if (name.includes(".")) {
			const keys = name.split(".");
			setFormData((prev) => {
				const updated = { ...prev };
				let current = updated;

				for (let i = 0; i < keys.length - 1; i++) {
					current = current[keys[i]];
				}
				current[keys[keys.length - 1]] = value;
				return updated;
			});
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handlePermissionsChange = (e) => {
		const { value, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			permissions: checked
				? [...prev.permissions, value]
				: prev.permissions.filter((p) => p !== value),
		}));
	};

	const addDocument = () => {
		setFormData((prev) => ({
			...prev,
			profile: {
				...prev.profile,
				documents: [
					...prev.profile.documents,
					{ type: "", number: "", verified: false },
				],
			},
		}));
	};

	const updateDocument = (index, field, value) => {
		setFormData((prev) => {
			const docs = [...prev.profile.documents];
			docs[index] = { ...docs[index], [field]: value };
			return { ...prev, profile: { ...prev.profile, documents: docs } };
		});
	};

	const handleSubmit = async () => {
		const result = await updateProfile(formData);
		if (result.success) {
			toast.success("Profile updated successfully!");
			setShowProfile(true);
		} else {
			toast.error(result.error || "Update failed");
		}
	};

	const resetForm = () => {
		setShowProfile(false);
	};

	const { user, fetchMe, loadingUser, updateProfile } = useAuthStore();

	useEffect(() => {
		fetchMe();
	}, [fetchMe]);

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || "",
				email: user.email || "",
				password: "********",
				role: user.role || "user",
				permissions: user.permissions || [],
				location: {
					state: user.location?.state || "",
					district: user.location?.district || "",
					pincode: user.location?.pincode || "",
					address: user.location?.address || "",
					coordinates: {
						latitude: user.location?.coordinates?.latitude || "",
						longitude: user.location?.coordinates?.longitude || "",
					},
				},
				profile: {
					phone: user.profile?.phone || "",
					dateOfBirth: user.profile?.dateOfBirth
						? user.profile.dateOfBirth.split("T")[0]
						: "",
					gender: user.profile?.gender || "",
					category: user.profile?.category || "",
					income: {
						annual: user.profile?.income?.annual || "",
						currency: "INR",
					},
					documents: user.profile?.documents || [],
				},
			});
		}
	}, [user]);

	if (loadingUser)
		return (
			<div className="w-full h-full flex items-center justify-center">
				<ClipLoader
					color={"purple"}
					size={50}
					aria-label="Loading Spinner"
					data-testid="loader"
				/>
			</div>
		);

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white">
			{!showProfile ? (
				<div className="space-y-6">
					<div className="flex items-center gap-2 mb-6">
						<User className="w-6 h-6 text-blue-600" />
						<h1 className="text-2xl font-bold text-gray-800">
							User Profile Setup
						</h1>
					</div>

					{/* Basic Info */}
					<div className="bg-gray-50 p-4 rounded-lg">
						<h2 className="text-lg font-semibold mb-3 text-gray-700">
							Basic Information
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<input
								type="text"
								name="name"
								placeholder="Full Name"
								value={formData.name}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								required
							/>
							<input
								type="email"
								name="email"
								placeholder="Email"
								value={formData.email}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								required
							/>
							<input
								type="password"
								name="password"
								placeholder="Password"
								value={formData.password}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								required
							/>
						</div>
					</div>

					{/* Location */}
					<div className="bg-gray-50 p-4 rounded-lg">
						<h2 className="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
							<MapPin className="w-5 h-5" />
							Location
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<input
								type="text"
								name="location.state"
								placeholder="State"
								value={formData.location.state}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<input
								type="text"
								name="location.district"
								placeholder="District"
								value={formData.location.district}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<input
								type="text"
								name="location.pincode"
								placeholder="Pincode"
								value={formData.location.pincode}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<input
								type="text"
								name="location.coordinates.latitude"
								placeholder="Latitude"
								value={formData.location.coordinates.latitude}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<input
								type="text"
								name="location.coordinates.longitude"
								placeholder="Longitude"
								value={formData.location.coordinates.longitude}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<textarea
								name="location.address"
								placeholder="Address"
								value={formData.location.address}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
								rows="2"
							/>
						</div>
					</div>

					{/* Profile Details */}
					<div className="bg-gray-50 p-4 rounded-lg">
						<h2 className="text-lg font-semibold mb-3 text-gray-700">
							Profile Details
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<input
								type="tel"
								name="profile.phone"
								placeholder="Phone Number"
								value={formData.profile.phone}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<input
								type="date"
								name="profile.dateOfBirth"
								value={formData.profile.dateOfBirth}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<select
								name="profile.gender"
								value={formData.profile.gender}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">Select Gender</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="other">Other</option>
							</select>
							<select
								name="profile.category"
								value={formData.profile.category}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">Select Category</option>
								<option value="general">General</option>
								<option value="obc">OBC</option>
								<option value="sc">SC</option>
								<option value="st">ST</option>
								<option value="ews">EWS</option>
							</select>
							<input
								type="number"
								name="profile.income.annual"
								placeholder="Annual Income"
								value={formData.profile.income.annual}
								onChange={handleInputChange}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>

					{/* Documents */}
					<div className="bg-gray-50 p-4 rounded-lg">
						<div className="flex justify-between items-center mb-3">
							<h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
								<FileText className="w-5 h-5" />
								Documents
							</h2>
							<button
								type="button"
								onClick={addDocument}
								className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-blue-700"
							>
								Add Document
							</button>
						</div>
						{formData.profile.documents.map((doc, index) => (
							<div
								key={index}
								className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2"
							>
								<select
									value={doc.type}
									onChange={(e) =>
										updateDocument(index, "type", e.target.value)
									}
									className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									<option value="">Select Document Type</option>
									<option value="aadhar">Aadhar</option>
									<option value="pan">PAN</option>
									<option value="voter_id">Voter ID</option>
									<option value="driving_license">Driving License</option>
									<option value="passport">Passport</option>
									<option value="income_certificate">Income Certificate</option>
									<option value="caste_certificate">Caste Certificate</option>
								</select>
								<input
									type="text"
									placeholder="Document Number"
									value={doc.number}
									onChange={(e) =>
										updateDocument(index, "number", e.target.value)
									}
									className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
								<label className="flex items-center space-x-2">
									<input
										type="checkbox"
										checked={doc.verified}
										onChange={(e) =>
											updateDocument(index, "verified", e.target.checked)
										}
									/>
									<span className="text-sm">Verified</span>
								</label>
							</div>
						))}
					</div>

					<button
						type="button"
						onClick={handleSubmit}
						className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
					>
						Update Profile
					</button>
				</div>
			) : (
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
							<User className="w-6 h-6 text-blue-600" />
							User Profile
						</h1>
						<button
							onClick={resetForm}
							className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
						>
							Edit Profile
						</button>
					</div>

					{/* Basic Info Display */}
					<div className="bg-white border border-gray-200 rounded-lg p-6">
						<h2 className="text-lg font-semibold mb-4 text-gray-700">
							Basic Information
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center gap-2">
								<User className="w-4 h-4 text-gray-500" />
								<span className="font-medium">Name:</span> {formData.name}
							</div>
							<div className="flex items-center gap-2">
								<Mail className="w-4 h-4 text-gray-500" />
								<span className="font-medium">Email:</span> {formData.email}
							</div>
							<div className="flex items-center gap-2">
								<Building className="w-4 h-4 text-gray-500" />
								<span className="font-medium">Role:</span> {formData.role}
							</div>
							<div className="flex items-center gap-2">
								<span className="font-medium">Permissions:</span>
								<span className="text-sm bg-blue-100 px-2 py-1 rounded">
									{formData.permissions.length} assigned
								</span>
							</div>
						</div>
						{formData.permissions.length > 0 && (
							<div className="mt-3">
								<div className="flex flex-wrap gap-1">
									{formData.permissions.map((perm) => (
										<span
											key={perm}
											className="text-xs bg-blue-200 px-2 py-1 rounded"
										>
											{perm.replace(/_/g, " ")}
										</span>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Location Display */}
					<div className="bg-white border border-gray-200 rounded-lg p-6">
						<h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
							<MapPin className="w-5 h-5" />
							Location
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<span className="font-medium">State:</span>{" "}
								{formData.location.state}
							</div>
							<div>
								<span className="font-medium">District:</span>{" "}
								{formData.location.district}
							</div>
							<div>
								<span className="font-medium">Pincode:</span>{" "}
								{formData.location.pincode}
							</div>
							<div>
								<span className="font-medium">Coordinates:</span>
								{formData.location.coordinates.latitude &&
								formData.location.coordinates.longitude
									? `${formData.location.coordinates.latitude}, ${formData.location.coordinates.longitude}`
									: "Not provided"}
							</div>
							{formData.location.address && (
								<div className="md:col-span-2">
									<span className="font-medium">Address:</span>{" "}
									{formData.location.address}
								</div>
							)}
						</div>
					</div>

					{/* Profile Details Display */}
					<div className="bg-white border border-gray-200 rounded-lg p-6">
						<h2 className="text-lg font-semibold mb-4 text-gray-700">
							Profile Details
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center gap-2">
								<Phone className="w-4 h-4 text-gray-500" />
								<span className="font-medium">Phone:</span>{" "}
								{formData.profile.phone}
							</div>
							<div className="flex items-center gap-2">
								<Calendar className="w-4 h-4 text-gray-500" />
								<span className="font-medium">Date of Birth:</span>{" "}
								{formData.profile.dateOfBirth}
							</div>
							<div>
								<span className="font-medium">Gender:</span>{" "}
								{formData.profile.gender}
							</div>
							<div>
								<span className="font-medium">Category:</span>{" "}
								{formData.profile.category}
							</div>
							<div>
								<span className="font-medium">Annual Income:</span>
								{formData.profile.income.annual
									? `₹${formData.profile.income.annual}`
									: "Not provided"}
							</div>
						</div>
					</div>

					{/* Documents Display */}
					{formData.profile.documents.length > 0 && (
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
								<FileText className="w-5 h-5" />
								Documents
							</h2>
							<div className="space-y-3">
								{formData.profile.documents.map((doc, index) => (
									<div
										key={index}
										className="flex justify-between items-center p-3 bg-gray-50 rounded"
									>
										<div>
											<span className="font-medium">
												{doc.type.replace(/_/g, " ").toUpperCase()}:
											</span>{" "}
											{doc.number}
										</div>
										<span
											className={`px-2 py-1 rounded text-xs ${
												doc.verified
													? "bg-green-200 text-green-800"
													: "bg-yellow-200 text-yellow-800"
											}`}
										>
											{doc.verified ? "Verified" : "Pending"}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default ProfilePage;
