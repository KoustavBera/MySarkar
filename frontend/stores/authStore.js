import { create } from "zustand";
import axios from "axios";
import useConfigStore from "./configStore"; // <-- import the config store

const useAuthStore = create((set) => ({
	user: null,
	token: localStorage.getItem("token") || null,
	loadingUser: false,

	fetchMe: async () => {
		const token = localStorage.getItem("token");
		if (!token) return;

		// grab the live backendUrl from the config store
		const backendUrl = useConfigStore.getState().backendUrl;

		set({ loadingUser: true });
		try {
			const { data } = await axios.get(`${backendUrl}/api/v1/auth/me`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			set({ user: data.user });
		} catch {
			set({ user: null, token: null });
			localStorage.removeItem("token");
		} finally {
			set({ loadingUser: false });
		}
	},

	setToken: (t) => {
		localStorage.setItem("token", t);
		set({ token: t });
	},
	updateProfile: async (profileData) => {
		const token = localStorage.getItem("token");
		if (!token) return;

		const backendUrl = useConfigStore.getState().backendUrl;
		try {
			const { data } = await axios.put(`${backendUrl}/api/v1/auth/update`, profileData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			set({ user: data.user });
			return { success: true };
		} catch (error) {
			return { success: false, error: error.response?.data?.error || "Update failed" };
		}
	},
	logout: () => {
		localStorage.removeItem("token");
		set({ user: null, token: null });
		window.location.href = "/login";
	},
}));

export default useAuthStore;
