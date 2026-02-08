"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Search, FileText, User, 
  Bell, Clock, Sparkles, Headphones, Bookmark,
  ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';

export default function UserSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop toggle
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile toggle

  const menuItems = [
    { icon: <LayoutDashboard size={20}/>, label: "Dashboard", href: "/user/dashboard" },
    { icon: <Search size={20}/>, label: "Find Jobs", href: "/user/jobs" },
    { icon: <Clock size={20}/>, label: "My Status", href: "/user/status" },
    { icon: <FileText size={20}/>, label: "Resume Builder", href: "/resume" },
    { icon: <Sparkles size={20}/>, label: "AI Features", href: "/resume-toolkit" },
    { icon: <Bell size={20}/>, label: "Notifications", href: "/notifications" },
    { icon: <Bookmark size={20}/>, label: "Saved Jobs", href: "/user/saved" },
    { icon: <User size={20}/>, label: "My Profile", href: "/profile" },
    { icon: <Headphones size={20}/>, label: "Career Counseling", href: "/user/counseling" },
  ];

  return (
    <>
      {/* --- Mobile Trigger Button --- */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600"
      >
        <Menu size={24} />
      </button>

      {/* --- Mobile Overlay --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- Main Sidebar --- */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-100 flex flex-col transition-all duration-300 z-[70]
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "w-20" : "w-72"}
      `}>
        
        {/* Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm transition-all"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Close Button (Mobile Only) */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute right-4 top-4 p-2 text-slate-400 hover:text-rose-500"
        >
          <X size={24} />
        </button>

        {/* Logo Section */}
        <div className={`p-6 mb-4 ${isCollapsed ? "items-center" : ""}`}>
          <h1 className="text-xl font-black text-indigo-600 tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
               <Sparkles size={18} className="text-white" />
            </div>
            {!isCollapsed && (
              <span>JobConnect<span className="text-slate-900">Pro</span></span>
            )}
          </h1>
          {!isCollapsed && (
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] mt-1 ml-10 font-bold">Candidate</p>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
              <div className={`
                flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer mb-1
                ${pathname === item.href 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"}
                ${isCollapsed ? "justify-center px-0" : ""}
              `}>
                <span className="shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </div>
            </Link>
          ))}
        </nav>

        {/* Upgrade Card */}
        <div className="p-4">
          {!isCollapsed ? (
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-100">
              <p className="text-[10px] font-black uppercase opacity-80 mb-1">AI Assistant</p>
              <p className="text-xs font-bold mb-3 leading-snug text-white">Optimize your resume with AI Assistant</p>
              <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-[10px] font-black uppercase transition-all">Try Now</button>
            </div>
          ) : (
            <div className="w-full flex justify-center">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Sparkles size={20} />
               </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}