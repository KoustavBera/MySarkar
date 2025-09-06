import React, { useState, useEffect } from "react";
import axios from "axios";
import useConfigStore from "../../stores/configStore";
import useAuthStore from "../../stores/authStore";
import { toast } from "react-hot-toast";

const AdminApplications = () => {
  console.log("AdminApplications component rendered");
  const { backendUrl } = useConfigStore();
  const { token } = useAuthStore();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    console.log("fetchApplications called with filter:", filter);
    try {
      const params = filter !== "all" ? `?status=${filter}` : "";
      console.log(
        "Making request to:",
        `${backendUrl}/api/v1/applications${params}`
      );

      const response = await axios.get(
        `${backendUrl}/api/v1/applications${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response received:", response.data);
      setApplications(response.data.applications);
      console.log(response.data.applications);

      // Enhanced debugging
      console.log("Full applications data:", response.data.applications);
      if (response.data.applications && response.data.applications.length > 0) {
        const firstApp = response.data.applications[0];
        console.log("First application full data:", firstApp);

        if (firstApp.scheme) {
          console.log("Scheme data exists:");
          console.log("Scheme ID:", firstApp.scheme._id);
          console.log("Scheme keys:", Object.keys(firstApp.scheme));
          console.log("Scheme values:", Object.values(firstApp.scheme));

          if (firstApp.scheme.schemeName) {
            console.log(
              "Scheme name found at top level:",
              firstApp.scheme.schemeName
            );
          }
          if (firstApp.scheme.name) {
            console.log(
              "Scheme name found in 'name' field:",
              firstApp.scheme.name
            );
          }
          if (firstApp.scheme.scheme) {
            console.log("Nested scheme object found:", firstApp.scheme.scheme);
          }
        } else {
          console.log("No scheme data in first application");
        }
      } else {
        console.log("No applications found");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      console.error("Error details:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const reviewApplication = async (id, status, comments = "") => {
    try {
      await axios.patch(
        `${backendUrl}/api/v1/applications/${id}/status`,
        {
          status,
          notes: comments,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Application ${status} successfully`);
      fetchApplications();
    } catch (error) {
      toast.error("Failed to update application");
      console.error("Error reviewing application:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Applications - DEBUG MODE</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="all">All Applications</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Application ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Scheme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                    {app.applicationId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium">{app.user?.name}</div>
                      <div className="text-sm text-gray-500">
                        {app.user?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {app.scheme?.schemeName || "N/A"}
                    <br />
                    <small style={{ fontSize: "10px", color: "gray" }}>
                      Debug Info: <br />
                      Has scheme: {app.scheme ? "Yes" : "No"} <br />
                      Scheme type: {app.scheme
                        ? typeof app.scheme
                        : "null"}{" "}
                      <br />
                      {app.scheme && (
                        <>
                          Scheme keys: {Object.keys(app.scheme).join(", ")}{" "}
                          <br />
                          Scheme values:{" "}
                          {Object.values(app.scheme)
                            .map((v) => {
                              if (typeof v === "object")
                                return JSON.stringify(v);
                              return v;
                            })
                            .join(" | ")}
                        </>
                      )}
                    </small>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    {app.status === "submitted" && (
                      <>
                        <button
                          onClick={() =>
                            reviewApplication(app._id, "under_review")
                          }
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => reviewApplication(app._id, "approved")}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => reviewApplication(app._id, "rejected")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {app.status === "under_review" && (
                      <>
                        <button
                          onClick={() => reviewApplication(app._id, "approved")}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => reviewApplication(app._id, "rejected")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No applications found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
