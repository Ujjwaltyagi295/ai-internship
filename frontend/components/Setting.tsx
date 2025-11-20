"use client"

import useAuthStore from "@/store/authStore"
import { X, User, Bell, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const settingsSidebarTabs = [
  { label: "Login & Security", icon: User },
  { label: "Job Alerts Preference", icon: Bell },
]

export default function SettingsModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState(settingsSidebarTabs[0].label)
const router= useRouter()
  const { user ,logout} = useAuthStore();

  if (!open) return null
 const handleOutsideClick = (e) => {
    if (e.target.id === "modal-wrapper") {
      onClose()
    }
    
  }
  const handleLogout=()=>{
        logout()
        router.push("/auth/login")
  }
  return (
    <div id="modal-wrapper" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={handleOutsideClick}>
      <div className="relative bg-white rounded-2xl w-full max-w-4xl flex flex-col lg:flex-row min-h-[600px] shadow-2xl overflow-hidden max-h-[90vh]">
   
        <button
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-600 z-10"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          <div
            className="
              w-full lg:w-72 
              bg-white border-b lg:border-b-0 lg:border-r border-gray-200 
              py-8 px-6 
              flex flex-col
              overflow-auto
            "
          >
            <nav className="flex flex-col gap-2 mb-6">
              {settingsSidebarTabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.label)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition w-full ${
                      activeTab === tab.label
                        ? "bg-gray-50 text-gray-900 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                )
              })}
            </nav>

            <div className="mt-auto hidden lg:flex">
              <button onClick={handleLogout} className="flex cursor-pointer items-center gap-3 px-4 py-2 text-gray-700 hover:text-gray-900 text-sm transition w-full">
                <LogOut  className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 sm:p-8 lg:p-12 bg-[#f2f4f5] overflow-y-auto">
            {activeTab === "Login & Security" && (
              <div className="max-w-2xl">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                  Login & Security
                </h1>
                <div className="space-y-8 sm:space-y-10">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Email</h3>
                    <p className="text-gray-600 text-sm break-all">{user?.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Password</h3>
                    <button className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition w-full sm:w-auto">
                      Reset password
                    </button>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Delete my account</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Permanently delete your Jobright account and all associated data
                    </p>
                    <button className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-red-600 text-sm font-medium hover:bg-red-50 transition w-full sm:w-auto">
                      Delete my account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Job Alerts Preference" && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                  Job Alerts Preference
                </h1>
                <p className="text-gray-600">Your job alert preferences will appear here.</p>
              </div>
            )}
          </div>
        </div>
        {/*mobile scrren */}
        <div className="border-t border-gray-200 p-4 bg-white flex justify-center lg:hidden">
          <button onClick={handleLogout} className="flex cursor-pointer items-center gap-3 px-4 py-2 text-gray-700 hover:text-gray-900 text-sm transition w-full max-w-xs justify-center rounded-lg border border-gray-300">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
