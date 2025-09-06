import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import DesktopNav from "../components/DesktopNav";
import ScanPage from "../pages/ScanPage";
import Application from "../pages/Application";
import Calling from "../pages/Calling";
import ProfilePage from "../pages/ProfilePage";
import SchemePage from "../pages/SchemePage";
import Community from "../pages/Community";
import MobileBottomNav from "../components/MobileButtonNav";
import SchemeRecommender from "../pages/SchemeRecommender";
import Auth from "../pages/Auth";
import { Landing } from "../pages/Landing";
import useAuthStore from "../stores/authStore";
import useConfigStore from "../stores/configStore";
import ProtectedRoute from "../pages/ProtectedRoute";
import { ClipLoader } from "react-spinners";
import { Footer } from "../components/Footer";
import { useLocation } from "../src/hooks/useLocation";
import ShowAllSchemes from "../pages/ShowAllSchemes";
import AdminPanel from "../pages/AdminPanel";
import NotificationsPage from "../pages/NotificationsPage";
import { LanguageProvider } from "../contexts/LanguageContext";
import { Toaster } from "react-hot-toast";
import useNotifications from "../hooks/useNotifications";

const App = () => {
  const [loading, setLoading] = useState(true);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const user = useAuthStore((s) => s.user);
  const { detectLocation } = useLocation();

  // Set up real-time notifications
  useNotifications();

  useEffect(() => {
    const init = async () => {
      await fetchMe(); // This sets user in the store
      setLoading(false);
    };
    init();
  }, [fetchMe]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-purple-100">
        <ClipLoader
          color={"purple"}
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    ); // Or a spinner
  }

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // If not authenticated, show landing/auth pages without navigation
  if (!isAuthenticated) {
    return (
      <LanguageProvider>
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth initialTab="register" />} />
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </LanguageProvider>
    );
  }

  // If authenticated, show the main app with navigation
  return (
    <LanguageProvider>
      <Routes>
        <Route element={<ProtectedRoute />}>
          {/* Admin routes without DesktopNav */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* Regular routes with DesktopNav */}
          <Route
            path="/*"
            element={
              <div className="flex min-h-screen">
                <div className="md:block hidden flex-none">
                  <DesktopNav />
                </div>
                <main className="flex-1 flex flex-col bg-secondary dark:dark:bg-zinc-900">
                  <div className="flex-1 pt-16 md:pt-0">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/scan" element={<ScanPage />} />
                      <Route path="/apply" element={<Application />} />
                      <Route path="/call" element={<Calling />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/scheme" element={<SchemePage />} />
                      <Route path="/community" element={<Community />} />
                      <Route
                        path="/show-all-schemes"
                        element={<ShowAllSchemes />}
                      />
                      <Route
                        path="/scheme-recommender"
                        element={<SchemeRecommender />}
                      />
                      <Route
                        path="/notifications"
                        element={<NotificationsPage />}
                      />
                    </Routes>
                  </div>
                  <div className="h-16 md:hidden"></div>
                  <div className="md:hidden fixed bottom-0 w-full">
                    <MobileBottomNav />
                  </div>
                  <div className="h-[4rem] md:h-[5rem]"></div>
                </main>
              </div>
            }
          />
        </Route>
      </Routes>
    </LanguageProvider>
  );
};

export default App;
