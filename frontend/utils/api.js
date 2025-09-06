// api.js
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:5000", // replace with your backend
  headers: { "Content-Type": "application/json" },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// reusable wrapper
export const requestWithToast = async (
  promise,
  { loading, success, error }
) => {
  return toast.promise(promise, {
    loading: loading || "Loading...",
    success: (data) => success || "Success ✅",
    error: (err) =>
      error || err.response?.data?.message || "Something went wrong ❌",
  });
};

export default api;
