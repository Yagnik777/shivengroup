"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Search, User, 
  Clock, Menu, X, Hammer,FileText, // આ ઉમેરો
  Image
} from 'lucide-react';

export default function UserSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const menuItems = [
    { icon: <LayoutDashboard size={20}/>, label: "Dashboard", href: "/user/dashboard" },
    { icon: <User size={20}/>, label: "Profile", href: "/user/profile" },
    { icon: <Search size={20}/>, label: "Find Jobs", href: "/careers" },
    
    // નવા ઉમેરેલા પેજીસ
    { icon: <FileText size={20}/>, label: "Post", href: "/user/post" },
    //{ icon: <Image size={20}/>, label: "Media Feed", href: "/user/media" },
    
    { icon: <Clock size={20}/>, label: "My Status", href: "/user/status" },
    
    // કમેન્ટ કરેલી લાઈનો એમને એમ છે
    //{ icon: <Hammer size={20}/>, label: "Career Counseling", href: "/user/service" },
    { icon: <Clock size={20}/>, label: "Resume Builder", href: "/user/resumebuilder" },
  ];

  return (
    <>
      {/* --- Mobile Header --- */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 fixed top-0 left-0 right-0 z-[100] h-16">
        <div className="text-lg font-black text-indigo-600">
          JobConnect<span className="text-slate-900">Pro</span>
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
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] lg:hidden transition-all duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- Main Sidebar --- */}
      <aside className={`
        fixed left-0 bg-white border-r border-slate-100 flex flex-col transition-all duration-300 z-[120] lg:z-[40]
        ${isMobileOpen 
          ? "translate-x-0 w-72 top-0 h-full shadow-2xl" 
          : "-translate-x-full lg:translate-x-0 lg:top-[80px] lg:h-[calc(100vh-100px)] lg:w-72 w-72"}
        pt-4
      `}>
        
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end px-4 mb-4">
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="p-2 bg-slate-50 rounded-xl text-slate-600"
          >
            <X size={22} />
          </button>
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
                `}>
                  <span className={`shrink-0 transition-transform ${!isActive && "group-hover:scale-110"}`}>
                    {item.icon}
                  </span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Spacer for mobile to push content below fixed header */}
      <div className="h-16 lg:hidden" />
    </>
  );
}
