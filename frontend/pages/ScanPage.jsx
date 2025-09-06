import React, { useState, useEffect, useCallback } from "react";
import Scan_camera_module from "../components/Scan_camera_module";
import Scan_documents from "../components/Scan_documents";
import { Toaster, toast } from "react-hot-toast";
import {
	Upload,
	FileText,
	Folder,
	Search,
	Grid,
	List,
	Camera,
	Image,
	AlertCircle,
	X,
} from "lucide-react";
import axios from "axios";
import useAuthStore from "../stores/authStore";

const ScanPage = () => {
	const [documents, setDocuments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [viewMode, setViewMode] = useState("grid");
	const [selectedFolder, setSelectedFolder] = useState(null);
	const [isDragOver, setIsDragOver] = useState(false);
	const [uploading, setUploading] = useState(false);
	const { token } = useAuthStore();

	const fastApiUrl = "http://localhost:8000";
	const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
	const maxFileSize = 10 * 1024 * 1024; // 10MB

	useEffect(() => {
		fetchDocuments();
	}, []);

	const fetchDocuments = async () => {
		try {
			const response = await axios.get(`${fastApiUrl}/documents/`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setDocuments(response.data);
		} catch (error) {
			console.error("Error fetching documents:", error);
			toast.error("Failed to fetch documents");
		} finally {
			setLoading(false);
		}
	};

	const handleUploaded = (doc) => {
		setDocuments((prev) => [...prev, doc]);
		toast.success("Document uploaded successfully!");
	};

	// File validation
	const validateFile = (file) => {
		if (!allowedFileTypes.includes(file.type)) {
			toast.error("Only JPG and PNG images are allowed");
			return false;
		}
		if (file.size > maxFileSize) {
			toast.error("File size must be less than 10MB");
			return false;
		}
		return true;
	};

	// Handle file upload
	const uploadFile = async (file) => {
		if (!validateFile(file)) return;

		setUploading(true);
		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await axios.post(
				`${fastApiUrl}/documents/upload/`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			handleUploaded(response.data);
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("Failed to upload file");
		} finally {
			setUploading(false);
		}
	};

	// Drag and drop handlers
	const handleDragEnter = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!e.currentTarget.contains(e.relatedTarget)) {
			setIsDragOver(false);
		}
	}, []);

	const handleDragOver = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDrop = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);

		const files = Array.from(e.dataTransfer.files);
		files.forEach(uploadFile);
	}, []);

	// File input handler
	const handleFileInput = (e) => {
		const files = Array.from(e.target.files);
		files.forEach(uploadFile);
		e.target.value = "";
	};

	// Group documents by type for folder structure
	const folders = {
		Recent: documents.slice(0, 3),
		PDFs: documents.filter((doc) => doc.type?.toLowerCase().includes("pdf")),
		Images: documents.filter((doc) =>
			doc.type?.toLowerCase().includes("image")
		),
		"All Documents": documents,
	};

	const filteredDocuments = selectedFolder
		? folders[selectedFolder]
		: documents.filter((doc) =>
				doc.name?.toLowerCase().includes(searchTerm.toLowerCase())
		  );

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-3 bg-blue-600 rounded-xl">
							<FileText className="h-8 w-8 text-white" />
						</div>
						<div>
							<h1 className="text-3xl md:text-4xl font-bold text-gray-900">
								Document Scanner
							</h1>
							<p className="text-gray-600 mt-1">
								Scan, organize and manage your documents with AI
							</p>
						</div>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
						<div className="bg-white rounded-lg shadow-sm border p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-blue-100 rounded-lg">
									<FileText className="h-5 w-5 text-blue-600" />
								</div>
								<div>
									<p className="text-sm text-gray-500">Total Documents</p>
									<p className="text-2xl font-bold text-gray-900">
										{documents.length}
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-sm border p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-green-100 rounded-lg">
									<Upload className="h-5 w-5 text-green-600" />
								</div>
								<div>
									<p className="text-sm text-gray-500">PDFs</p>
									<p className="text-2xl font-bold text-gray-900">
										{folders.PDFs.length}
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-sm border p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-purple-100 rounded-lg">
									<Image className="h-5 w-5 text-purple-600" />
								</div>
								<div>
									<p className="text-sm text-gray-500">Images</p>
									<p className="text-2xl font-bold text-gray-900">
										{folders.Images.length}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Compact Upload Section */}
				<div className="bg-white rounded-xl shadow-sm border mb-6">
					<div className="p-4">
						<h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<Upload className="h-5 w-5" />
							Upload Documents
						</h2>

						{/* Upload Area and Instructions Side by Side */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
							{/* Instructions */}
							<div className="lg:col-span-1">
								<div className="p-3 bg-blue-50 rounded-lg border border-blue-200 h-full">
									<div className="flex items-start gap-2">
										<AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
										<div className="">
											<h3 className="font-bold text-blue-900 mb-1 text-lg">
												Upload Instructions
											</h3>
											<ul className="text-base  text-blue-800 space-y-0.5">
												<li>• JPG and PNG images only</li>
												<li>• Max file size: 10MB</li>
												<li>• Drag & drop or browse</li>
												<li>• Multiple files supported</li>
											</ul>
										</div>
									</div>
								</div>
							</div>

							{/* Drag and Drop Area */}
							<div className="lg:col-span-2">
								<div
									className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 h-full ${
										isDragOver
											? "border-blue-500 bg-blue-50"
											: "border-gray-300 bg-gray-50 hover:bg-gray-100"
									} ${uploading ? "opacity-50 pointer-events-none" : ""}`}
									onDragEnter={handleDragEnter}
									onDragLeave={handleDragLeave}
									onDragOver={handleDragOver}
									onDrop={handleDrop}
								>
									{uploading ? (
										<div className="flex flex-col items-center justify-center h-full min-h-[100px]">
											<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
											<p className="text-gray-600 font-medium text-sm">
												Uploading...
											</p>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center h-full min-h-[100px]">
											<div className="flex justify-center mb-2">
												<div className="p-2 bg-white rounded-full shadow-sm">
													<Upload className="h-6 w-6 text-blue-600" />
												</div>
											</div>
											<h3 className="text-base font-semibold text-gray-900 mb-1">
												{isDragOver ? "Drop files here" : "Upload documents"}
											</h3>
											<p className="text-gray-600 mb-3 text-sm">
												Drag files here or click to browse
											</p>
											<label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors text-sm">
												<Upload className="h-4 w-4" />
												Choose Files
												<input
													type="file"
													multiple
													accept=".jpg,.jpeg,.png"
													onChange={handleFileInput}
													className="hidden"
												/>
											</label>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Camera Module - Compact */}
						<div className="pt-3 border-t border-gray-200">
							<h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
								<Camera className="h-4 w-4" />
								Camera Capture
							</h3>
							<Scan_camera_module
								onUploaded={handleUploaded}
								fastApiUrl={fastApiUrl}
							/>
						</div>
					</div>
				</div>

				{/* Documents Section - More Space */}
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
					{/* Folders Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-sm border p-4">
							<h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
								<Folder className="h-4 w-4" />
								Folders
							</h3>
							<div className="space-y-1">
								{Object.entries(folders).map(([folderName, folderDocs]) => (
									<div
										key={folderName}
										onClick={() =>
											setSelectedFolder(
												selectedFolder === folderName ? null : folderName
											)
										}
										className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
											selectedFolder === folderName
												? "bg-blue-50 border border-blue-200"
												: "hover:bg-gray-50"
										}`}
									>
										<div className="flex items-center gap-3">
											<Folder
												className={`h-4 w-4 ${
													selectedFolder === folderName
														? "text-blue-600"
														: "text-gray-500"
												}`}
											/>
											<span
												className={`text-sm font-medium ${
													selectedFolder === folderName
														? "text-blue-900"
														: "text-gray-700"
												}`}
											>
												{folderName}
											</span>
										</div>
										<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
											{folderDocs.length}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Main Documents Area - Expanded */}
					<div className="lg:col-span-4">
						<div className="bg-white rounded-lg shadow-sm border">
							{/* Search and Controls */}
							<div className="p-4 border-b border-gray-200">
								<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
									<div className="relative flex-1 max-w-md">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
										<input
											type="text"
											placeholder="Search documents..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>

									<div className="flex gap-2">
										<div className="flex border border-gray-200 rounded-lg overflow-hidden">
											<button
												onClick={() => setViewMode("grid")}
												className={`p-2 transition-colors ${
													viewMode === "grid"
														? "bg-blue-500 text-white"
														: "bg-white text-gray-600 hover:bg-gray-50"
												}`}
											>
												<Grid className="h-4 w-4" />
											</button>
											<button
												onClick={() => setViewMode("list")}
												className={`p-2 transition-colors ${
													viewMode === "list"
														? "bg-blue-500 text-white"
														: "bg-white text-gray-600 hover:bg-gray-50"
												}`}
											>
												<List className="h-4 w-4" />
											</button>
										</div>
									</div>
								</div>

								{selectedFolder && (
									<div className="mt-4 flex items-center gap-2">
										<span className="text-sm text-gray-500">Showing:</span>
										<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
											<Folder className="h-3 w-3" />
											{selectedFolder}
											<button
												onClick={() => setSelectedFolder(null)}
												className="hover:bg-blue-200 rounded-full p-0.5 ml-1"
											>
												<X className="h-3 w-3" />
											</button>
										</span>
									</div>
								)}
							</div>

							{/* Documents Content */}
							<div className="p-6">
								{loading ? (
									<div className="text-center py-12">
										<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
										<p className="text-gray-500">Loading documents...</p>
									</div>
								) : filteredDocuments.length === 0 ? (
									<div className="text-center py-12">
										<FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											{searchTerm
												? "No documents match your search"
												: selectedFolder
												? `No documents in ${selectedFolder}`
												: "No documents found"}
										</h3>
										<p className="text-gray-500">
											{searchTerm
												? "Try adjusting your search terms"
												: "Upload your first document to get started"}
										</p>
									</div>
								) : (
									<div
										className={`transition-all duration-300 ${
											viewMode === "grid"
												? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
												: "space-y-2"
										}`}
									>
										<Scan_documents
											documents={filteredDocuments}
											fastApiUrl={fastApiUrl}
											viewMode={viewMode}
										/>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ScanPage;
