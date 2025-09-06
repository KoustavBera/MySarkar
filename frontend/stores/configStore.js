import { create } from "zustand";

// Hardcoded backend URL
const backendUrl = "http://localhost:5000";
const fastAPIUrl = "http://localhost:8000";
const useConfigStore = create((set) => ({
	backendUrl,
	fastAPIUrl,
	setBackendUrl: (url) => set({ backendUrl: url }),
}));

export default useConfigStore;
