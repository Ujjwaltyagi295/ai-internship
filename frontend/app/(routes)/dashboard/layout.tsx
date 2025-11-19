// app/dashboard/layout.jsx
"use client";
import { JobsHeader } from "@/components/jobHeader";
import { Sidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  let section = "Jobs"; // default

  if (pathname.includes("/admin")) {
    section = "Admin";
  } else if (pathname.includes("/profile")) {
    section = "Profile";
  } else if (pathname.includes("/resume")) {
    section = "Resume";
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <JobsHeader section={section} />
        {children}
      </div>
    </div>
  );
}
