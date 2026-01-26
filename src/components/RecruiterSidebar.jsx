"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Briefcase, Users, Settings, LogOut } from 'lucide-react';

export default function RecruiterSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={20}/>, label: "Overview", href: "/recruiter/dashboard" },
    { icon: <Briefcase size={20}/>, label: "My Jobs", href: "/recruiter/my-jobs" },
    { icon: <PlusCircle size={20}/>, label: "Post New Job", href: "/recruiter/postjob" },
    { icon: <Users size={20}/>, label: "Candidates", href: "/recruiter/candidate" },
    { icon: <Settings size={20}/>, label: "Settings", href: "/recruiter/settings" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-black text-indigo-600 tracking-tighter">
          JobConnect<span className="text-slate-900">Pro</span>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em]">Recruiter</p>
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer mb-1 ${
              pathname === item.href 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]" 
              : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
            }`}>
              {item.icon} {item.label}
            </div>
          </Link>
        ))}
      </nav>

      <button className="flex items-center gap-3 px-4 py-3 text-rose-600 font-bold hover:bg-rose-50 rounded-2xl transition-all mt-auto">
        <LogOut size={20}/> Logout
      </button>
    </aside>
  );
}