import React, { useState } from "react";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "react-hot-toast";
import useConfigStore from "../stores/configStore";
import useAuthStore from "../stores/authStore";
import { ClipLoader } from "react-spinners";

const CreateSchemeModal = ({ isOpen, onClose, onSchemeCreated }) => {
	const { backendUrl } = useConfigStore();
	const { token, user } = useAuthStore();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		schemeName: "",
		schemeShortTitle: "",
		schemeCategory: [], // array of strings
		category: [], // array of strings
		tags: [], // array of strings
		state: "",
		level: "State", // default, can be changed
		nodalMinistryName: "",
		openDate: null,
		closeDate: null,
		detailedDescription_md: "",
		eligibilityDescription_md: "",
		applicationProcess: [""], // array of steps
		benefits: [""], // array of strings
		references: [""], // array of urls/text
		faqs: [{ question: "", answer: "" }], // array of objects
		documents_required: [""], // array of strings
	});

	const categories = [
		"education",
		"healthcare",
		"employment",
		"housing",
		"agriculture",
		"social_welfare",
		"financial_assistance",
		"skill_development",
		"women_empowerment",
		"senior_citizen",
		"disability",
		"other",
	];

	const benefitTypes = [
		"monetary",
		"subsidy",
		"loan",
		"scholarship",
		"training",
		"healthcare",
		"housing",
		"food",
		"other",
	];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleArrayChange = (field, index, value) => {
		setFormData((prev) => {
			const updated = [...prev[field]];
			updated[index] = value;
			return { ...prev, [field]: updated };
		});
	};

	const handleFAQChange = (index, key, value) => {
		setFormData((prev) => {
			const updated = [...prev.faqs];
			updated[index][key] = value;
			return { ...prev, faqs: updated };
		});
	};

	const addArrayItem = (field, defaultValue = "") => {
		setFormData((prev) => ({
			...prev,
			[field]: [...prev[field], defaultValue],
		}));
	};

	const removeArrayItem = (field, index) => {
		setFormData((prev) => ({
			...prev,
			[field]: prev[field].filter((_, i) => i !== index),
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Clean and prepare formData before sending
			const schemeData = {
				...formData,
				createdBy: user?.id,
				// remove empty strings from arrays
				schemeCategory: formData.schemeCategory.filter((c) => c.trim() !== ""),
				category: formData.category.filter((c) => c.trim() !== ""),
				tags: formData.tags.filter((t) => t.trim() !== ""),
				references: formData.references.filter((r) => r.trim() !== ""),
				benefits: formData.benefits.filter((b) => b.trim() !== ""),
				applicationProcess: formData.applicationProcess.filter(
					(step) => step.trim() !== ""
				),
				documents_required: formData.documents_required.filter(
					(d) => d.trim() !== ""
				),
				faqs: formData.faqs.filter(
					(f) => f.question.trim() !== "" || f.answer.trim() !== ""
				),
				// handle dates: convert "" to null
				openDate: formData.openDate || null,
				closeDate: formData.closeDate || null,
			};

			// send to backend
			await axios.post(`${backendUrl}/api/v1/all_schemes`, schemeData, {
				headers: { Authorization: `Bearer ${token}` },
			});

			toast.success("✅ Scheme created successfully");
			onSchemeCreated?.(); // optional callback for parent
			onClose();
		} catch (error) {
			console.error("Error creating scheme:", error);
			toast.error(
				error.response?.data?.message || "❌ Failed to create scheme"
			);
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
				{/* Header */}
				<div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 flex justify-between items-center">
					<div>
						<h2 className="text-3xl font-bold text-white">Create New Scheme</h2>
						<p className="text-purple-100 mt-1">
							Fill in the details to create a government scheme
						</p>
					</div>
					<button
						onClick={onClose}
						className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
					>
						<XMarkIcon className="w-6 h-6" />
					</button>
				</div>

				{/* Form Container */}
				<div className="flex-1 overflow-y-auto px-8 py-6">
					<form onSubmit={handleSubmit} className="space-y-8">
						{/* Basic Information Section */}
						<div className="bg-gray-50 rounded-xl p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
								<div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
									<span className="text-purple-600 font-bold">1</span>
								</div>
								Basic Information
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="md:col-span-2">
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Scheme Name <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="schemeName"
										value={formData.schemeName}
										onChange={handleChange}
										className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
										placeholder="Enter the full scheme name"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Short Title
									</label>
									<input
										type="text"
										name="schemeShortTitle"
										value={formData.schemeShortTitle}
										onChange={handleChange}
										className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
										placeholder="Abbreviated title"
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Nodal Ministry
									</label>
									<input
										type="text"
										name="nodalMinistryName"
										value={formData.nodalMinistryName}
										onChange={handleChange}
										className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
										placeholder="Ministry responsible for the scheme"
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										State
									</label>
									<input
										type="text"
										name="state"
										value={formData.state}
										onChange={handleChange}
										className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
										placeholder="State name"
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Level
									</label>
									<select
										name="level"
										value={formData.level}
										onChange={handleChange}
										className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
									>
										<option value="State">State</option>
										<option value="Central">Central</option>
									</select>
								</div>
							</div>
						</div>

						{/* Dates Section */}
						<div className="bg-blue-50 rounded-xl p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
								<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
									<span className="text-blue-600 font-bold">2</span>
								</div>
								Scheme Duration
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Open Date
									</label>
									<input
										type="date"
										name="openDate"
										value={formData.openDate || ""}
										onChange={handleChange}
										className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Close Date
									</label>
									<input
										type="date"
										name="closeDate"
										value={formData.closeDate || ""}
										onChange={handleChange}
										className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									/>
								</div>
							</div>
						</div>

						{/* Descriptions Section */}
						<div className="bg-green-50 rounded-xl p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
								<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
									<span className="text-green-600 font-bold">3</span>
								</div>
								Descriptions
							</h3>

							<div className="space-y-6">
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Detailed Description (Markdown)
									</label>
									<textarea
										name="detailedDescription_md"
										value={formData.detailedDescription_md}
										onChange={handleChange}
										rows={6}
										className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-vertical"
										placeholder="Detailed description of the scheme in markdown format"
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Eligibility Description (Markdown)
									</label>
									<textarea
										name="eligibilityDescription_md"
										value={formData.eligibilityDescription_md}
										onChange={handleChange}
										rows={4}
										className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-vertical"
										placeholder="Eligibility criteria in markdown format"
									/>
								</div>
							</div>
						</div>

						{/* Categories and Tags Section */}
						<div className="bg-orange-50 rounded-xl p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
								<div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
									<span className="text-orange-600 font-bold">4</span>
								</div>
								Categories & Tags
							</h3>

							{/* Tags */}
							<div className="mb-6">
								<label className="block text-sm font-semibold text-gray-700 mb-3">
									Tags
								</label>
								<div className="space-y-3">
									{formData.tags.map((tag, idx) => (
										<div key={idx} className="flex gap-2">
											<input
												type="text"
												value={tag}
												onChange={(e) =>
													handleArrayChange("tags", idx, e.target.value)
												}
												className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
												placeholder="Enter tag"
											/>
											{formData.tags.length > 1 && (
												<button
													type="button"
													onClick={() => removeArrayItem("tags", idx)}
													className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
												>
													<TrashIcon className="w-5 h-5" />
												</button>
											)}
										</div>
									))}
									<button
										type="button"
										onClick={() => addArrayItem("tags")}
										className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors font-medium"
									>
										<PlusIcon className="w-5 h-5" />
										Add Tag
									</button>
								</div>
							</div>
						</div>

						{/* Benefits Section */}
						<div className="bg-purple-50 rounded-xl p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
								<div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
									<span className="text-purple-600 font-bold">5</span>
								</div>
								Benefits
							</h3>

							<div className="space-y-3">
								{formData.benefits.map((benefit, idx) => (
									<div key={idx} className="flex gap-2">
										<input
											type="text"
											value={benefit}
											onChange={(e) =>
												handleArrayChange("benefits", idx, e.target.value)
											}
											className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
											placeholder="Enter benefit"
										/>
										{formData.benefits.length > 1 && (
											<button
												type="button"
												onClick={() => removeArrayItem("benefits", idx)}
												className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
											>
												<TrashIcon className="w-5 h-5" />
											</button>
										)}
									</div>
								))}
								<button
									type="button"
									onClick={() => addArrayItem("benefits")}
									className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors font-medium"
								>
									<PlusIcon className="w-5 h-5" />
									Add Benefit
								</button>
							</div>
						</div>

						{/* Application Process Section */}
						<div className="bg-indigo-50 rounded-xl p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
								<div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
									<span className="text-indigo-600 font-bold">6</span>
								</div>
								Application Process
							</h3>

							<div className="space-y-3">
								{formData.applicationProcess.map((step, idx) => (
									<div key={idx} className="flex gap-2">
										<div className="flex items-center justify-center w-8 h-10 bg-indigo-100 text-indigo-600 rounded-lg font-semibold text-sm">
											{idx + 1}
										</div>
										<input
											type="text"
											value={step}
											onChange={(e) =>
												handleArrayChange(
													"applicationProcess",
													idx,
													e.target.value
												)
											}
											className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
											placeholder="Enter application step"
										/>
										{formData.applicationProcess.length > 1 && (
											<button
												type="button"
												onClick={() =>
													removeArrayItem("applicationProcess", idx)
												}
												className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
											>
												<TrashIcon className="w-5 h-5" />
											</button>
										)}
									</div>
								))}
								<button
									type="button"
									onClick={() => addArrayItem("applicationProcess")}
									className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors font-medium"
								>
									<PlusIcon className="w-5 h-5" />
									Add Step
								</button>
							</div>
						</div>

						{/* Required Documents Section */}
						<div className="bg-teal-50 rounded-xl p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
								<div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
									<span className="text-teal-600 font-bold">7</span>
								</div>
								Required Documents
							</h3>

							<div className="space-y-3">
								{formData.documents_required.map((doc, idx) => (
									<div key={idx} className="flex gap-2">
										<input
											type="text"
											value={doc}
											onChange={(e) =>
												handleArrayChange(
													"documents_required",
													idx,
													e.target.value
												)
											}
											className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
											placeholder="Enter required document"
										/>
										{formData.documents_required.length > 1 && (
											<button
												type="button"
												onClick={() =>
													removeArrayItem("documents_required", idx)
												}
												className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
											>
												<TrashIcon className="w-5 h-5" />
											</button>
										)}
									</div>
								))}
								<button
									type="button"
									onClick={() => addArrayItem("documents_required")}
									className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors font-medium"
								>
									<PlusIcon className="w-5 h-5" />
									Add Document
								</button>
							</div>
						</div>

						{/* References Section */}
						<div className="bg-pink-50 rounded-xl p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
								<div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
									<span className="text-pink-600 font-bold">8</span>
								</div>
								References
							</h3>

							<div className="space-y-3">
								{formData.references.map((ref, idx) => (
									<div key={idx} className="flex gap-2">
										<input
											type="text"
											value={ref}
											onChange={(e) =>
												handleArrayChange("references", idx, e.target.value)
											}
											className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
											placeholder="Enter reference URL or text"
										/>
										{formData.references.length > 1 && (
											<button
												type="button"
												onClick={() => removeArrayItem("references", idx)}
												className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
											>
												<TrashIcon className="w-5 h-5" />
											</button>
										)}
									</div>
								))}
								<button
									type="button"
									onClick={() => addArrayItem("references")}
									className="flex items-center gap-2 px-4 py-2 text-pink-600 hover:bg-pink-100 rounded-lg transition-colors font-medium"
								>
									<PlusIcon className="w-5 h-5" />
									Add Reference
								</button>
							</div>
						</div>

						{/* FAQs Section */}
						<div className="bg-yellow-50 rounded-xl p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
								<div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
									<span className="text-yellow-600 font-bold">9</span>
								</div>
								Frequently Asked Questions
							</h3>

							<div className="space-y-4">
								{formData.faqs.map((faq, idx) => (
									<div
										key={idx}
										className="bg-white rounded-lg p-4 border border-yellow-200"
									>
										<div className="flex justify-between items-start mb-3">
											<span className="text-sm font-semibold text-gray-600">
												FAQ {idx + 1}
											</span>
											{formData.faqs.length > 1 && (
												<button
													type="button"
													onClick={() => removeArrayItem("faqs", idx)}
													className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
												>
													<TrashIcon className="w-4 h-4" />
												</button>
											)}
										</div>
										<div className="space-y-3">
											<input
												type="text"
												placeholder="Enter question"
												value={faq.question}
												onChange={(e) =>
													handleFAQChange(idx, "question", e.target.value)
												}
												className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
											/>
											<textarea
												placeholder="Enter answer"
												value={faq.answer}
												onChange={(e) =>
													handleFAQChange(idx, "answer", e.target.value)
												}
												rows={3}
												className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-vertical"
											/>
										</div>
									</div>
								))}
								<button
									type="button"
									onClick={() =>
										addArrayItem("faqs", { question: "", answer: "" })
									}
									className="flex items-center gap-2 px-4 py-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors font-medium"
								>
									<PlusIcon className="w-5 h-5" />
									Add FAQ
								</button>
							</div>
						</div>
					</form>
				</div>

				{/* Footer */}
				<div className="sticky bottom-0 bg-white border-t px-8 py-6 flex justify-end gap-4">
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						disabled={loading}
						className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
					>
						{loading ? (
							<>
								<ClipLoader size={16} color="white" />
								Creating...
							</>
						) : (
							"Create Scheme"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateSchemeModal;
