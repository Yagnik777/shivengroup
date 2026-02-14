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

  // જ્યારે મોબાઈલમાં લિંક બદલાય ત્યારે સાઈડબાર ઓટોમેટિક બંધ થઈ જાય
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
      {/* --- Mobile Trigger Header (મોબાઈલમાં ઉપર પટ્ટી દેખાશે) --- */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-50">
        <h1 className="text-lg font-black text-indigo-600 tracking-tighter">
          JobConnect<span className="text-slate-900">Pro</span>
        </h1>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-slate-50 rounded-xl text-slate-600 active:scale-95 transition-all"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* --- Mobile Overlay --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- Main Sidebar --- */}
      <aside className={`
        fixed inset-y-0 left-0 h-screen bg-white border-r border-slate-100 flex flex-col transition-all duration-300 z-[70]
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "lg:w-20" : "lg:w-72"}
        w-72 
      `}>
        
        {/* Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm transition-all z-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Close Button (Mobile Only) */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute right-4 top-5 p-2 text-slate-400 hover:text-rose-500 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Logo Section */}
        <div className={`p-6 mb-2 ${isCollapsed ? "lg:px-4 flex justify-center" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
               <Sparkles size={20} className="text-white" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="overflow-hidden">
                <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                  JobConnect<span className="text-indigo-600">Pro</span>
                </h1>
                <p className="text-[9px] text-indigo-600 uppercase tracking-[0.2em] font-black mt-1">Candidate</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer mb-1 group
                  ${isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
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

        {/* Bottom Section (Upgrade & Logout) */}
        <div className="p-4 space-y-3">
          {(!isCollapsed || isMobileOpen) ? (
            <div className="bg-slate-900 p-4 rounded-2xl text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase text-indigo-400 mb-1">Pro Feature</p>
                <p className="text-[11px] font-bold mb-3 opacity-90">AI Resume Optimizer</p>
                <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-[10px] font-black uppercase transition-all">
                  Upgrade Now
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/20 rounded-full blur-2xl"></div>
            </div>
          ) : (
            <div className="flex justify-center">
               <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-indigo-400 shadow-lg cursor-pointer hover:scale-105 transition-all">
                  <Sparkles size={18} />
               </div>
            </div>
          )}

          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={`
              w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all
              ${isCollapsed ? "lg:justify-center lg:px-0" : ""}
            `}
          >
            <LogOut size={20} />
            {(!isCollapsed || isMobileOpen) && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}