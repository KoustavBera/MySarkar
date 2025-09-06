import { FileText } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../stores/authStore";

const Scan_documents = ({ documents, fastApiUrl }) => {
  const [error, setError] = useState(null);
  const { token } = useAuthStore();



  const handleDownload = async (id, filename) => {
    try {
      const response = await axios.get(`${fastApiUrl}/documents/${id}/download`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` }
      });

      // Create a blob URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Use the original filename from the document
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      setError("Failed to download the file. Please try again.");
    }
  };

  // Group documents by category
  const grouped = documents.reduce((acc, doc) => {
    const category = doc.doc_type || "Uncategorized";
    acc[category] = [...(acc[category] || []), doc];
    return acc;
  }, {});

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  if (documents.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        No documents found. Upload some documents to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {Object.keys(grouped).map((category) => (
        <div
          key={category}
          className="rounded-2xl bg-white shadow-md border p-4"
        >
          <h2 className="font-bold mb-2 text-lg">{category}</h2>
          <div className="space-y-2">
            {grouped[category].map((doc) => (
              <button
                key={doc._id}
                onClick={() => handleDownload(doc._id, doc.filename)}
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 w-full text-left transition-colors"
              >
                <FileText size={18} className="text-blue-500 flex-shrink-0" />
                <span className="truncate">{doc.filename}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Scan_documents;
