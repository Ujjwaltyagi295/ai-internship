"use client";

import {
  BriefcaseBusiness,
  FileText,
  User,
  MessageCircle,
  Gift,
  Bell,
  Download,
  MessageSquare,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SettingsModal from "./Setting";

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { icon: BriefcaseBusiness, label: "Jobs", path: "/dashboard/job" },
    { icon: FileText, label: "Resume", path: "/dashboard/resume" },
    { icon: User, label: "Profile", path: "/dashboard/profile" },
    { icon: MessageCircle, label: "Dashboard", path: "/dashboard/admin" },
  ];

  const bottomItems = [
    { icon: Bell, label: "Messages" },
    { icon: Download, label: "Download App" },
    { icon: MessageSquare, label: "Feedback" },
    { icon: Settings, label: "Settings" },
  ];

  function handleMenuClick(path) {
    router.push(path);
    setSidebarOpen(false);
  }

  function handleBottomClick(label) {
    if (label === "Settings") setSettingsOpen(true);
    setSidebarOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-72 bg-white flex flex-col p-6 h-screen
      `}>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-teal-400 rounded-lg flex items-center justify-center"></div>
          <a  href="/" className="text-2xl font-bold text-black">CareerPath</a>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <div
                key={item.label}
                onClick={() => handleMenuClick(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors relative
                  ${isActive ? "bg-teal-50" : "hover:bg-gray-50"}
                `}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <item.icon
                    className={`w-5 h-5 stroke-[2] ${
                      isActive ? "text-teal-600" : "text-gray-700"
                    }`}
                  />
                </div>
                <span
                  className={`text-[15px] font-medium ${
                    isActive ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </nav>

        <div className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-teal-600" />
            <p className="text-sm font-bold text-gray-900">Refer & Earn</p>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-auto"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Invite friends or share on LinkedIn to earn extra rewards!
          </p>
        </div>

        <nav className="space-y-1 border-t border-gray-100 pt-4">
          {bottomItems.map((item) => (
            <div
              key={item.label}
              onClick={() => handleBottomClick(item.label)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors
                hover:bg-gray-50
              `}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <item.icon className="w-5 h-5 stroke-[2] text-gray-700" />
              </div>
              <span className="text-[15px] font-medium text-gray-700">
                {item.label}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Settings Modal */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
