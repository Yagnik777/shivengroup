"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Search, FileText, User, 
  Bell, Clock, Sparkles, Headphones, Bookmark,
  ChevronLeft, ChevronRight, Menu, X, LogOut,
  Briefcase, CheckCircle, Calendar, ShieldCheck,
  Mail, Users, Settings, Wallet, Globe, Landmark,
  LineChart, FolderOpen, MessageSquare, Wand2, Hammer
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function UserSidebar() {
  const pathname = usePathname();
  // isCollapsed સ્ટેટ કાઢી નાખ્યું છે કારણ કે હવે સાઇડબાર ફિક્સ રહેશે
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const menuItems = [
    { icon: <LayoutDashboard size={20}/>, label: "Dashboard", href: "/user/dashboard" },
    { icon: <User size={20}/>, label: "Profile", href: "/user/profile" },
    //{ icon: <Wand2 size={20}/>, label: "Resume Builder & Analyzer", href: "/user/resume" },
    //{ icon: <FileText size={20}/>, label: "Cover Letter Generator", href: "/user/cover-letter" },
    { icon: <Search size={20}/>, label: "Find Jobs", href: "/careers" },
    //{ icon: <Briefcase size={20}/>, label: "Apply Job Openings", href: "/user/apply" },
    { icon: <Clock size={20}/>, label: "My Status", href: "/user/status" },
    // { icon: <Bookmark size={20}/>, label: "Saved Jobs", href: "/user/saved" },
    // { icon: <Calendar size={20}/>, label: "Events & Activities", href: "/user/events" },
    // { icon: <Sparkles size={20}/>, label: "AI Features", href: "/user/resume-toolkit" },
    // { icon: <Users size={20}/>, label: "Post Referral Jobs", href: "/user/referrals" },
    // { icon: <ShieldCheck size={20}/>, label: "Job Scam Detection", href: "/user/scam-detection" },
    // { icon: <Mail size={20}/>, label: "Auto-Mailer System", href: "/user/mailer" },
    // { icon: <MessageSquare size={20}/>, label: "Mailing List", href: "/user/mailing-list" },
    // { icon: <Settings size={20}/>, label: "Contact Management", href: "/user/contacts" },
    // { icon: <Headphones size={20}/>, label: "Specialized Services", href: "/user/counseling" },
    //{ icon: <Bell size={20}/>, label: "Notifications", href: "/user/notifications" },
    // { icon: <FolderOpen size={20}/>, label: "Files & Folder", href: "/user/files" },
    // { icon: <Wallet size={20}/>, label: "Digital Wallet", href: "/user/wallet" },
    // { icon: <Globe size={20}/>, label: "My Website", href: "/user/website" },
    // { icon: <Landmark size={20}/>, label: "Government Schemes", href: "/user/schemes" },
    // { icon: <LineChart size={20}/>, label: "Company Insights", href: "/user/insights" },
    // { icon: <LineChart size={20}/>, label: "Analytics & Reports", href: "/user/analytics" },
    {icon:  <Hammer size={20}/>, label: "Career Counseling", href: "/user/service" },
  ];

  return (
    <>
      {/* --- Mobile Header --- */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 fixed top-0 left-0 right-0 z-[100]">
        <div className="flex items-center gap-2">
          {/* Logo Removed from Mobile Header */}
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

      {/* --- Main Sidebar (Fix: Adjusted top and height to stay between Navbar and Footer) --- */}
      <aside className={`
        fixed left-0 bg-white border-r border-slate-100 flex flex-col transition-all duration-300 z-[40]
        ${isMobileOpen ? "translate-x-0 shadow-2xl top-0 h-full" : "-translate-x-full lg:translate-x-0 lg:top-[80px] lg:h-[calc(90vh-160px)]"}
        lg:w-72 w-72 pt-4
      `}>
        
        {/* Toggle Button Removed for Fixed Sidebar */}

        {/* Logo Section - Completely Removed */}
        <div className="p-4 mb-2 lg:px-4 flex justify-center">
          {/* Logo and Text have been removed as per request */}
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
    </>
  );
}