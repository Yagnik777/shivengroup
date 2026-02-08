"use client";
import React from 'react';
import { Search, MapPin, ChevronRight, Bookmark, Star, Bell } from 'lucide-react';
import UserSidebar from '@/components/UserSidebar';
import { Sparkles } from "lucide-react";


export default function UserDashboard() {
  const stats = [
    { label: "Applied Jobs", value: "24", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Interviews", value: "3", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Saved", value: "12", color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* સાઇડબાર અહીં એડ કર્યો છે */}
      <UserSidebar />

      {/* મેઈન કન્ટેન્ટ */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Header with Notification Icon */}
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hello, Rahul 👋</h1>
              <p className="text-slate-500 font-medium">Your profile is looking great today!</p>
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 relative hover:bg-slate-50 transition-all shadow-sm">
              <Bell size={22}/>
              <span className="absolute top-3 right-3.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
          </header>

          {/* Search Bar */}
          <div className="bg-white p-3 rounded-[28px] shadow-xl shadow-indigo-100/40 border border-slate-100 flex flex-col md:flex-row gap-2 mb-10">
            <div className="flex-[2] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <input type="text" placeholder="Search dream job..." className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm" />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <input type="text" placeholder="Location" className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm" />
            </div>
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
              Find Jobs
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-all shadow-sm">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all`}>
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Job Activity */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-black text-slate-900">Recommended for you</h3>
              {[1, 2].map((job) => (
                <div key={job} className="bg-white p-6 rounded-[32px] border border-slate-100 hover:shadow-lg transition-all flex gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">Co</div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-slate-900">Frontend Developer</h4>
                      <Bookmark size={18} className="text-slate-300 cursor-pointer hover:text-indigo-600"/>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">Google Inc. • Remote</p>
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-600 font-black text-sm">₹80k - ₹120k</span>
                      <button className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-4 py-2 rounded-lg">Apply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Resume Feature Card */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <Sparkles className="mb-4 text-indigo-200" size={32}/>
                  <h3 className="text-xl font-black mb-2">AI Resume Scan</h3>
                  <p className="text-indigo-100 text-xs mb-6 leading-relaxed">Scan your resume against job descriptions to increase hire chance by 60%.</p>
                  <button className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-black text-sm shadow-lg hover:bg-indigo-50 transition-all">
                    Start Scan
                  </button>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}