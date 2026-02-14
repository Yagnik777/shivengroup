"use client";
import React from 'react';
import { Search, MapPin, ChevronRight, Bookmark, Sparkles, Bell } from 'lucide-react';
import UserSidebar from '@/components/UserSidebar';

export default function UserDashboard() {
  const stats = [
    { label: "Applied Jobs", value: "24", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Interviews", value: "3", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Saved", value: "12", color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    // LG સ્ક્રીન પર Side-by-side, મોબાઈલમાં Column
    <div className="min-h-screen bg-[#FDFEFF] flex flex-col lg:flex-row">
      
      {/* 1. સાઇડબાર */}
      <UserSidebar activepage="dashboard" />

      {/* 2. મેઈન કન્ટેન્ટ એરિયા */}
      {/* મોબાઈલમાં હેડર પટ્ટી માટે mt-16 આપેલું છે */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 mt-16 lg:mt-0 w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER */}
          <header className="flex justify-between items-center mb-8 md:mb-10">
            <div className="max-w-[80%]">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Hello, <span className="text-indigo-600">Rahul</span> 👋
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-sm mt-1">Your profile is looking great today!</p>
            </div>
            {/* Notification Button */}
            <button className="p-2.5 md:p-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-slate-600 relative hover:bg-slate-50 transition-all shadow-sm flex-shrink-0">
              <Bell size={20} className="md:w-6 md:h-6"/>
              <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
          </header>

          {/* SEARCH BAR SECTION */}
          <div className="bg-white p-3 md:p-4 rounded-[24px] md:rounded-[32px] shadow-xl shadow-indigo-100/30 border border-slate-100 flex flex-col md:flex-row gap-3 mb-10">
            <div className="flex-[2] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <input 
                type="text" 
                placeholder="Search dream job..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm transition-all" 
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <input 
                type="text" 
                placeholder="Location" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm transition-all" 
              />
            </div>
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200 w-full md:w-auto">
              Find Jobs
            </button>
          </div>

          {/* STATS GRID: મોબાઈલમાં 1, ટેબ્લેટમાં 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[28px] md:rounded-[32px] border border-slate-100 flex items-center justify-between group hover:border-indigo-300 transition-all shadow-sm hover:shadow-md cursor-pointer">
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

          {/* MAIN GRID: JOBS & AI PROMO */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left side: Job Recommendations */}
            <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xl font-black text-slate-900">Recommended Jobs</h3>
                <button className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
              </div>
              
              {[1, 2].map((job) => (
                <div key={job} className="bg-white p-5 md:p-6 rounded-[28px] md:rounded-[32px] border border-slate-100 hover:shadow-lg transition-all flex flex-col sm:flex-row gap-4 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-50 rounded-2xl flex items-center justify-center font-bold text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {job === 1 ? "G" : "M"}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm md:text-base group-hover:text-indigo-600 transition-colors">
                          {job === 1 ? "Frontend Developer" : "UI/UX Designer"}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          {job === 1 ? "Google Inc. • Remote" : "Microsoft • Bangalore"}
                        </p>
                      </div>
                      <Bookmark size={18} className="text-slate-300 cursor-pointer hover:text-indigo-600 shrink-0 ml-2 transition-colors"/>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <span className="text-indigo-600 font-black text-sm">₹80k - ₹120k <span className="text-slate-400 font-medium text-[10px]">/mo</span></span>
                      <button className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-600 transition-all shadow-md">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: AI Card */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="bg-slate-900 p-8 rounded-[32px] md:rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
                    <Sparkles className="text-indigo-400" size={24}/>
                  </div>
                  <h3 className="text-xl font-black mb-3 leading-tight">AI Resume Scan</h3>
                  <p className="text-slate-400 text-xs mb-8 leading-relaxed">
                    તમારા રેઝ્યૂમેને જોબ ડિસ્ક્રિપ્શન સાથે સ્કેન કરો અને હાયર થવાના ચાન્સ 60% વધારો.
                  </p>
                  <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg hover:bg-indigo-500 transition-all active:scale-95">
                    Start AI Scan
                  </button>
                </div>
                {/* Decorative BG */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-all"></div>
              </div>
              
              {/* Quick Tip Card */}
              <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100">
                <h4 className="text-sm font-black text-indigo-900 mb-2">Career Tip 💡</h4>
                <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                  Keep your profile updated with latest skills to get noticed by top recruiters.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}