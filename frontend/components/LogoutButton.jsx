import useAuthStore from "../stores/authStore";
import React from "react";
const LogoutButton = () => {
	const { logout } = useAuthStore();

	return (
		<button
			onClick={logout}
			className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
		>
			Logout
		</button>
	);
};

export default LogoutButton;
