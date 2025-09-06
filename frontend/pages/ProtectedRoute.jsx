import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Landing } from "./Landing";

export default function ProtectedRoute() {
	const isAuthenticated = true;

	if (!isAuthenticated) {
		return <Navigate to="/landing" replace />;
	}

	return <Outlet />;
}
