// DesktopNav.jsx
import React, { useState } from "react";
import {
  Home,
  LayoutGrid,
  ScanLine,
  FileText,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  PhoneCall,
  Settings,
  MessageSquare,
  Bell,
} from "lucide-react";
import { NavLink } from "react-router-dom"; // or plain <a> tags if you don’t use RR
import useAuthStore from "../stores/authStore";
import LogoutButton from "./LogoutButton";
import NotificationPanel from "./NotificationPanel";

const links = [
  { name: "Home", path: "/", icon: Home },
  { name: "Schemes", path: "/scheme", icon: LayoutGrid },
  { name: "Scan", path: "/scan", icon: ScanLine },
  { name: "Application", path: "/apply", icon: FileText },
  { name: "Profile", path: "/profile", icon: UserCircle },
  { name: "Community", path: "/community", icon: MessageSquare },
  { name: "Call", path: "/call", icon: PhoneCall },
];

const adminLinks = [
  {
    name: "Admin Panel",
    path: "/admin",
    icon: Settings,
    roles: ["govt_official", "ngo"],
  },
];

const DesktopNav = () => {
  const [open, setOpen] = useState(true);
  const [dark, setDark] = React.useState(false);
  const user = useAuthStore((state) => state.user);
  const [name, setname] = useState(null);

  return (
    <aside
      className={`sticky top-0 group h-screen flex flex-col bg-secondary dark:bg-zinc-900 dark:border-zinc-700  transition-all satoshi duration-300 border-r-2  border-purple-200 ease-in-out ${
        open ? "w-64" : "w-20"
      }`}
    >
      {/* Header / Toggle button */}
      <div className="flex items-center justify-between h-16 px-4 border-b-2 border-text dark:border-zinc-700">
        {open && (
          <span className="font-bold text-xl text-zinc-900 dark:text-white">
            My Sarkar
          </span>
        )}
        <div className="flex items-center space-x-2">
          <NotificationPanel />
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="toggle sidebar"
          >
            {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>

      {/* Links */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-md transition-colors duration-200 relative group ${
                isActive
                  ? "bg-purple-200 dark:bg-blue-900/30 text-text dark:text-indigo-400"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-purple-200 dark:hover:bg-zinc-800"
              }`
            }
          >
            <Icon size={22} className="shrink-0" />
            <span
              className={`ml-3 font-medium whitespace-nowrap transition-opacity duration-200 ${
                open ? "opacity-100" : "opacity-0"
              }`}
            >
              {name}
            </span>

            {/* Floating tooltip when collapsed */}
            {!open && (
              <div
                className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/70 backdrop-blur-sm
                           dark:bg-zinc-800 dark:text-white border-[1px] border-gray-400 dark:border-0 text-md rounded-md shadow-lg font-semibold 
                           opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              >
                {name}
              </div>
            )}
          </NavLink>
        ))}

        {/* Admin Links - Only for govt_official and ngo */}
        {user && ["govt_official", "ngo"].includes(user.role) && (
          <div className="pt-2 border-t border-purple-200 dark:border-zinc-700">
            {adminLinks.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-md transition-colors duration-200 relative group ${
                    isActive
                      ? "bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-red-100 dark:hover:bg-zinc-800"
                  }`
                }
              >
                <Icon size={22} className="shrink-0" />
                <span
                  className={`ml-3 font-medium whitespace-nowrap transition-opacity duration-200 ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {name}
                </span>

                {/* Floating tooltip when collapsed */}
                {!open && (
                  <div
                    className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/70 backdrop-blur-sm
                               dark:bg-zinc-800 dark:text-white border-[1px] border-gray-400 dark:border-0 text-md rounded-md shadow-lg font-semibold 
                               opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  >
                    {name}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
      <div className="flex group items-center  gap-3 px-4 py-3 border-t border-purple-200 dark:border-zinc-700">
        <UserCircle
          size={36}
          strokeWidth={1}
          className="text-purple-600 dark:text-purple-400 shrink-0"
        />
        {open && (
          <div>
            <p className="font-semibold text-sm text-gray-800 dark:text-white">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {user?.email || "—"}
            </p>
          </div>
        )}
      </div>
      <div className="group-hover:block hidden w-full transition ease-in duration-150 ">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default DesktopNav;
