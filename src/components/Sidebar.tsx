"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "Planner", href: "/planner", icon: "calendar_today" },
    { name: "Attendance", href: "/dashboard", icon: "fact_check" }, // Redirects to dashboard summary
    { name: "Timetable", href: "/timetable", icon: "schedule" },
    { name: "Assignments", href: "/planner", icon: "assignment" },
    { name: "AI Agents", href: "/agents", icon: "smart_toy" },
    { name: "Study Sessions", href: "/timetable", icon: "timer" },
    { name: "Analytics", href: "/dashboard", icon: "analytics" },
  ];

  return (
    <nav className="hidden md:flex flex-col h-screen w-sidebar-width fixed left-0 top-0 bg-surface-container border-r border-outline-variant backdrop-blur-xl bg-opacity-70 py-margin-desktop px-4 gap-unit z-50">
      <div className="mb-8 px-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined">school</span>
        </div>
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight" style={{ fontSize: "24px", lineHeight: "32px" }}>
            CampusFlow
          </h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Academic OS</p>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-lg mb-6 transition-all duration-200 ease-in-out hover:bg-primary-container hover:scale-[0.98] shadow-sm">
        <span className="material-symbols-outlined text-[20px]">add</span>
        <span className="font-title-md text-title-md" style={{ fontSize: "14px" }}>New Task</span>
      </button>

      <div className="flex-1 overflow-y-auto pr-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
                isActive
                  ? "text-primary font-bold bg-surface-container-high scale-95 transition-transform"
                  : "text-on-surface-variant hover:bg-surface-variant hover:bg-opacity-50"
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? "filled-icon" : ""}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-outline-variant">
          <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all duration-200 ease-in-out hover:bg-surface-variant/50" href="#">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </a>
        </div>
      </div>

      <div className="mt-auto pt-4 flex items-center gap-3 px-4">
        <img
          alt="Alex's Profile Avatar"
          className="w-10 h-10 rounded-full object-cover border border-outline-variant"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIIgONthR8z8hKToxYl7dhG9eEAHU2_Qu-GIM5GmMjIVdlHKXf8HE7FXpeekVR4SWG35ScZqrTksnJVE0SKuEqxpM8i88fgtxR70r4GUKlhKUI1PSy5qTOgXCPt16DFyAlD6vqRCriUkgxGIp_IZsCXqW35wadWOhMHmXtoTpIlZvLFzKBx9bC_ASXfRUVhpVsbs97Nm_1Ombkg0eYzsi19WXbZQSrKmgDBoY9fCI16syIKkWXv4bcFKIqeopn14AjCTE8laS3_Mc"
        />
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm font-bold">Alex Johnson</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant" style={{ fontSize: "10px" }}>
            Computer Science
          </span>
        </div>
      </div>
    </nav>
  );
}
