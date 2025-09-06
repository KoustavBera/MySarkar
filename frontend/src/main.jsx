import React from "react"; // Add this line
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// in main.jsx or your modal file
import "@huggingface/inference";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<Toaster position="top-center" reverseOrder={false} />
		<App />
	</BrowserRouter>
);
