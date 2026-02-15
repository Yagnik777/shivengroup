"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Search, FileText, User, 
  Bell, Clock, Sparkles, Headphones, Bookmark,
  ChevronLeft, ChevronRight, Menu, X, LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function UserSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false); 
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const menuItems = [
    { icon: <LayoutDashboard size={20}/>, label: "Dashboard", href: "/user/dashboard" },
    { icon: <Search size={20}/>, label: "Find Jobs", href: "/user/jobs" },
    { icon: <Clock size={20}/>, label: "My Status", href: "/user/status" },
    { icon: <FileText size={20}/>, label: "Resume Builder", href: "/user/resume" },
    { icon: <Sparkles size={20}/>, label: "AI Features", href: "/user/resume-toolkit" },
    { icon: <Bell size={20}/>, label: "Notifications", href: "/user/notifications" },
    { icon: <Bookmark size={20}/>, label: "Saved Jobs", href: "/user/saved" },
    { icon: <User size={20}/>, label: "My Profile", href: "/user/profile" },
    { icon: <Headphones size={20}/>, label: "Counseling", href: "/user/counseling" },
  ];

  return (
    <>
      {/* --- Mobile Header --- */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 fixed top-0 left-0 right-0 z-[100]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-black text-slate-900 tracking-tighter text-sm">CANDIDATE</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-slate-50 rounded-xl text-slate-600 active:scale-95 transition-all"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* --- Mobile Overlay --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] lg:hidden transition-all"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- Main Sidebar --- */}
      <aside className={`
        fixed inset-y-0 left-0 h-full bg-white border-r border-slate-100 flex flex-col transition-all duration-300 z-[120]
        ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "lg:w-24" : "lg:w-72"}
        w-72 
      `}>
        
        {/* Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm transition-all z-[130] hover:scale-110"
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Logo Section */}
        <div className={`p-8 mb-4 ${isCollapsed ? "lg:px-4 flex justify-center" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-xl shadow-indigo-100">
               <Sparkles size={22} className="text-white" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="overflow-hidden">
                <h1 className="text-lg font-black text-slate-900 tracking-tighter leading-none uppercase">
                  Candidate<span className="text-indigo-600 ml-1">Portal</span>
                </h1>
                <p className="text-[9px] text-slate-400 font-bold mt-1 tracking-[0.2em] uppercase">Verified User</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar scroll-smooth">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-[13px] transition-all cursor-pointer mb-1 group
                  ${isActive 
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" 
                    : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"}
                  ${isCollapsed ? "lg:justify-center lg:px-0" : ""}
                `}>
                  <span className={`shrink-0 transition-transform ${!isActive && "group-hover:scale-110"}`}>
                    {item.icon}
                  </span>
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        
      </aside>
    </>
  );
}