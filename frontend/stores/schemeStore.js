// store/schemesStore.js
import { create } from "zustand";
import axios from "axios";

export const useSchemesStore = create((set) => ({
	schemes: [],
	totalPages: 1,
	currentPage: 1,
	loading: false,
	error: null,

	// fetchSchemes now accepts page + limit
	fetchSchemes: async (page = 1, limit = 10) => {
		set({ loading: true, error: null });
		try {
			const res = await axios.get(
				`http://localhost:5000/api/v1/all_schemes?page=${page}&limit=${limit}`
			);

			set({
				schemes: res.data.schemes, // only current page data
				totalPages: res.data.totalPages, // backend should return this
				currentPage: res.data.currentPage,
				loading: false,
			});
		} catch (err) {
			set({ error: err.message, loading: false });
		}
	},
}));
