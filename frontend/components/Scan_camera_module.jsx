// Scan_camera_module.js
import { CameraIcon, UploadIcon } from "lucide-react";
import React, { useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "../stores/authStore";

const Scan_camera_module = ({ onUploaded, fastApiUrl }) => {
  const fileInputCam = useRef();
  const fileInputGallery = useRef();
  const { token } = useAuthStore();

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        toast.loading("Scanning document...", { id: 'upload' });
        
        const response = await axios.post(`${fastApiUrl}/documents/upload`, formData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        });

        toast.success("Document scanned ✅", { id: 'upload' });
        onUploaded(response.data);
      } catch (err) {
        console.error('Upload error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          headers: err.response?.headers
        });
        
        let errorMessage = "Upload failed";
        if (err.response?.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (err.response?.status === 403) {
          errorMessage = "Access denied. Only regular users can upload documents.";
        } else if (err.response?.data?.detail) {
          errorMessage = err.response.data.detail;
        }
        
        toast.error(errorMessage, { id: 'upload' });
      }
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 md:px-[4rem]">
      {/* Camera Button */}
      <div
        className="w-full flex-col md:hidden rounded-2xl flex items-center justify-center h-[10rem] bg-white border-purple-700 border-b-4 border-r-4 border-1 cursor-pointer"
        onClick={() => fileInputCam.current.click()}
      >
        <div className="bg-green-200 rounded-full p-2 md:p-4">
          <CameraIcon size={30} strokeWidth={1} color="green" />
        </div>
        <h1 className="text-base mt-2 font-semibold text-text">Take Photo</h1>
        <p className="text-xs md:text-sm text-black/70">
          Capture your document with camera
        </p>
        <input
          ref={fileInputCam}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      {/* Gallery Button */}
      <div
        className="w-full flex-col rounded-2xl flex items-center justify-center h-[10rem] bg-white border-purple-700 border-b-4 border-r-4 border-1 cursor-pointer"
        onClick={() => fileInputGallery.current.click()}
      >
        <div className="bg-cyan-200 rounded-full p-2 md:p-4">
          <UploadIcon size={30} strokeWidth={1} color="green" />
        </div>
        <h1 className="text-base mt-2 font-semibold text-text">
          Upload from Gallery
        </h1>
        <p className="text-xs md:text-sm text-black/70">
          Or select a photo from your gallery
        </p>
        <input
          ref={fileInputGallery}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default Scan_camera_module;
