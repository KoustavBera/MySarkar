// MobileBottomNav.jsx
import React, { useState } from "react";
import {
  Home,
  LayoutGrid,
  ScanLine,
  FileText,
  UserCircle,
  PhoneCall,
  MessageSquare,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import NotificationPanel from "./NotificationPanel";

const links = [
  { name: "Home", path: "/", icon: Home },
  { name: "Schemes", path: "/scheme", icon: LayoutGrid },
  { name: "Scan", path: "/scan", icon: ScanLine },
  { name: "Apply", path: "/apply", icon: FileText },
  { name: "Community", path: "/community", icon: MessageSquare },
  { name: "Profile", path: "/profile", icon: UserCircle },
];

const MobileBottomNav = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      {/* Mobile Top Bar with Hamburger */}
      <div className="fixed top-0 left-0 right-0 bg-white/30 backdrop-blur-lg py-3 px-4 dark:bg-zinc-900 border-b-2 border-purple-200 dark:border-zinc-700 satoshi md:hidden z-50 h-16">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xl text-zinc-900 dark:text-white">
            My Sarkar
          </span>
          <div className="flex items-center space-x-2">
            <NotificationPanel />
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {showMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowMenu(false)}
        >
          <div className="fixed top-16 right-0 w-64 h-full bg-white dark:bg-zinc-900 shadow-lg">
            <div className="p-4 space-y-2">
              {links.map(({ name, path, icon: Icon }) => (
                <NavLink
                  key={name}
                  to={path}
                  onClick={() => setShowMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-md transition-colors duration-200 ${
                      isActive
                        ? "bg-purple-200 dark:bg-blue-900/30 text-text dark:text-indigo-400"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-purple-100 dark:hover:bg-zinc-800"
                    }`
                  }
                >
                  <Icon size={20} className="shrink-0 mr-3" />
                  <span className="font-medium">{name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/30 backdrop-blur-lg py-2 dark:bg-zinc-900 border-t-2 rounded-t-4xl border-purple-200 dark:border-zinc-700 satoshi md:hidden z-50">
        <div className="flex items-center justify-around px-1 py-1.5">
          {links.slice(0, 5).map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center px-1 py-1.5 rounded-3xl transition-colors duration-200 min-w-0 flex-1 max-w-16 ${
                  isActive
                    ? "bg-purple-200 dark:bg-blue-900/30 text-text dark:text-indigo-400"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-purple-100 dark:hover:bg-zinc-800"
                }`
              }
            >
              <Icon size={18} className="shrink-0 mb-0.5" />
              <span className="text-[10px] font-medium truncate w-full text-center leading-tight">
                {name}
              </span>
            </NavLink>
          ))}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex flex-col items-center px-1 py-1.5 rounded-3xl transition-colors duration-200 min-w-0 flex-1 max-w-16 text-zinc-700 dark:text-zinc-300 hover:bg-purple-100 dark:hover:bg-zinc-800"
          >
            <Menu size={18} className="shrink-0 mb-0.5" />
            <span className="text-[10px] font-medium truncate w-full text-center leading-tight">
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
