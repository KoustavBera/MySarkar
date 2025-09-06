import React, { useState } from "react";
import axios from "axios";
import useConfigStore from "../stores/configStore";
import useAuthStore from "../stores/authStore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
const Auth = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		role: "user",
	});
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};
	const backendUrl = useConfigStore((state) => state.backendUrl);
	const handleAdminLogin = () => {
		setForm({
			name: "",
			email: "admin@mysarkar.gov.in",
			password: "admin123",
			role: "govt_official",
		});
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		const toast_id = toast.loading("Logging in...");

		try {
			console.log("Attempting login with:", { email: form.email, backendUrl });

			const response = await axios.post(`${backendUrl}/api/v1/auth/login`, {
				email: form.email,
				password: form.password,
				role: form.role,
			});

			console.log("Login response:", response.data);

			if (!response.data.access_token) {
				throw new Error("No access token in response");
			}

			// 1. Store the token
			const token = response.data.access_token;
			try {
				localStorage.setItem("token", token);
				console.log("Token saved to localStorage");
			} catch (storageError) {
				console.error("Error saving to localStorage:", storageError);
				throw new Error("Failed to save login session");
			}

			// 2. Update auth store
			useAuthStore.setState({ token });
			console.log("Auth store updated");

			// 3. Fetch user data
			try {
				await useAuthStore.getState().fetchMe();
				console.log("User data fetched successfully");
			} catch (fetchError) {
				console.error("Error fetching user data:", fetchError);
				throw new Error("Logged in but failed to load user data");
			}

			toast.success("Login successful");
			console.log("Redirecting to home...");

			// 4. Navigate based on user role
			const userRole = response.data.user?.role;
			if (userRole === 'govt_official' || userRole === 'ngo') {
				setTimeout(() => {
					window.location.href = "/admin";
				}, 500);
			} else if (userRole === 'user') {
				setTimeout(() => {
					window.location.href = "/";
				}, 500);
			} else {
				throw new Error('Unauthorized role');
			}
		} catch (error) {
			console.error("Login error:", {
				message: error.message,
				response: error.response?.data,
				status: error.response?.status,
				stack: error.stack,
			});

			let errorMessage = error.response?.data?.message || error.message || "Login failed. Please try again.";
			
			if (error.message === 'Unauthorized role') {
				errorMessage = 'Unauthorized: Invalid role for this login';
			}
			
			toast.error(errorMessage);
		} finally {
			toast.dismiss(toast_id);
		}
	};
	const handleSignUp = async (e) => {
		e.preventDefault();
		const toast_id = toast.loading("Signing up...");

		try {
			const response = await axios.post(`${backendUrl}/api/v1/auth/register`, {
				name: form.name,
				email: form.email,
				password: form.password,
				role: form.role,
			});
			console.log(response.data);

			// 1. Store the token
			const token = response.data.access_token;
			localStorage.setItem("token", token);

			// 2. Update auth store
			useAuthStore.setState({ token });

			// 3. Fetch user data
			await useAuthStore.getState().fetchMe();

			toast.success("Sign up successful");

			// 4. Force a full page reload to ensure all auth state is properly set
			window.location.href = "/";
		} catch (error) {
			toast.error("Sign up failed");
			console.log(error.message);
		} finally {
			toast.dismiss(toast_id);
		}
	};
	const [signIn, setsignIn] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	return (
		<div className="w-full h-full flex items-center bg-secondary justify-center">
			<div className="border-1 flex-col flex items-start justify-start  md:h-[80%] md:w-[40%] w-[80%] rounded-2xl border-purple-700 border-r-4 border-b-4">
				<div className="self-center place-items-center p-3">
					<h1 className="font-semibold text-2xl">MySarkar</h1>
					<p className="text-black/70">Your gateway to government benefits </p>
				</div>
				<div className="flex bg-purple-200 w-[90%] h-[6%] self-center rounded-full border-r-4 border-1 border-purple-700">
					<button
						onClick={() => setsignIn(true)}
						className={`${
							signIn && "bg-white border-1 border-purple-700"
						} w-1/2 h-full rounded-full  place-items-center`}
					>
						<p>Log In</p>
					</button>
					<button
						onClick={() => setsignIn(false)}
						className={`${
							!signIn && "bg-white  border-1 border-purple-700"
						} w-1/2 h-full rounded-full  place-items-center`}
					>
						<p>Sign Up</p>
					</button>
				</div>
				{signIn ? (
					<form
						onSubmit={handleLogin}
						className="flex items-start px-[7%] py-4 w-full  justify-center flex-col gap-2"
					>
						<div className="flex flex-col w-full ">
							<label className="ml-2">Email</label>
							<input
								value={form.email}
								onChange={handleChange}
								type="email"
								name="email"
								className="border-1 rounded-2xl p-1"
							/>
						</div>
						<div className="flex flex-col w-full ">
							<label className="ml-2">Password</label>
							<div className="relative">
								<input
									value={form.password}
									onChange={handleChange}
									type={showPassword ? "text" : "password"}
									name="password"
									className="border-1 rounded-2xl p-1 pr-10 w-full"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
								>
									{showPassword ? (
										<EyeSlashIcon className="h-5 w-5" />
									) : (
										<EyeIcon className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>
						<div className="flex flex-col w-full ">
							<label className="ml-2">Role</label>
							<select
								value={form.role}
								onChange={handleChange}
								name="role"
								className="border-1 rounded-2xl p-1"
							>
								<option value="user">User</option>
								<option value="govt_official">Government Official</option>
								<option value="ngo">NGO</option>
							</select>
						</div>
						<div className="flex gap-2 w-full">
							<button
								type="submit"
								className="px-3 py-2 bg-purple-200 border-1 border-r-4 border-b-4 border-purple-700 flex-1"
							>
								Login
							</button>
						</div>
					</form>
				) : (
					<form
						onSubmit={handleSignUp}
						className="flex items-start px-[7%] py-4 w-full  justify-center flex-col gap-2"
					>
						<div className="flex flex-col w-full ">
							<label className="ml-2">Name</label>
							<input
								value={form.name}
								onChange={handleChange}
								type="text"
								name="name"
								className="border-1 rounded-2xl p-1"
							/>
						</div>
						<div className="flex flex-col w-full ">
							<label className="ml-2">Email</label>
							<input
								value={form.email}
								onChange={handleChange}
								type="email"
								name="email"
								className="border-1 rounded-2xl p-1"
							/>
						</div>
						<div className="flex flex-col w-full ">
							<label className="ml-2">Password</label>
							<div className="relative">
								<input
									value={form.password}
									onChange={handleChange}
									type={showPassword ? "text" : "password"}
									name="password"
									className="border-1 rounded-2xl p-1 pr-10 w-full"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
								>
									{showPassword ? (
										<EyeSlashIcon className="h-5 w-5" />
									) : (
										<EyeIcon className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>
						
						<button
							type="submit"
							className="px-3 py-2 bg-purple-200 border-1 border-r-4 border-b-4 border-purple-700"
						>
							Sign Up
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default Auth;
