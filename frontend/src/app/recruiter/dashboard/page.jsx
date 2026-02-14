"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import RecruiterSidebar from '@/components/RecruiterSidebar';

export default function RecruiterDashboard() {
  const { data: session } = useSession();

  // મોક ડેટા
  const stats = [
    { label: "Active Jobs", value: "12", icon: "💼", color: "bg-blue-50 text-blue-600" },
    { label: "Total Applications", value: "450", icon: "👥", color: "bg-indigo-50 text-indigo-600" },
    { label: "Interviews", value: "28", icon: "📅", color: "bg-purple-50 text-purple-600" },
    { label: "Hired", value: "05", icon: "🎉", color: "bg-emerald-50 text-emerald-600" },
  ];

  const recentJobs = [
    { title: "Frontend Developer", candidates: 45, status: "Active", date: "2 Oct, 2025" },
    { title: "UI/UX Designer", candidates: 12, status: "Closed", date: "28 Sep, 2025" },
    { title: "Backend Engineer", candidates: 89, status: "Active", date: "1 Oct, 2025" },
  ];

  return (
    // મોબાઈલ માટે flex-col અને મોટા ડિવાઈસ માટે flex-row
    <div className="min-h-screen bg-[#FDFEFF] flex flex-col lg:flex-row">
      
      {/* 1. SIDEBAR (હવે રિસ્પોન્સિવ છે) */}
      <RecruiterSidebar activePage="dashboard" />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 w-full overflow-x-hidden">
        
        {/* HEADER: મોબાઈલ માં બટન નીચે આવી શકે એટલે flex-wrap */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Welcome back, <span className="text-indigo-600">{session?.user?.name?.split(' ')[0] || "Recruiter"}</span>! 👋
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-xs md:text-sm">Here's what's happening with your hiring today.</p>
          </div>
          <button className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 text-sm">
            <span className="text-xl">+</span> Post New Job
          </button>
        </header>

        {/* STATS OVERVIEW: મોબાઈલ 1, ટેબલેટ 2, લેપટોપ 4 કોલમ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12">
          {stats.map((item, idx) => (
            <div key={idx} className="bg-white p-5 md:p-6 rounded-[28px] md:rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${item.color} rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl mb-3 md:mb-4`}>
                {item.icon}
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{item.value}</h2>
            </div>
          ))}
        </div>

        {/* MAIN GRID: RECENT JOBS & QUICK ACTIONS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          
          {/* Recent Job Table - Card Style for Mobile */}
          <div className="xl:col-span-2 bg-white p-5 md:p-8 rounded-[30px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-black text-slate-800">Recent Postings</h3>
              <button className="text-indigo-600 font-bold text-xs md:text-sm hover:underline">View All</button>
            </div>
            
            {/* Table wrapper with horizontal scroll for small screens */}
            <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full text-left border-separate border-spacing-y-3 min-w-[500px]">
                <thead>
                  <tr className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-4 py-2">Job Title</th>
                    <th className="px-4 py-2">Apps</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job, i) => (
                    <tr key={i} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 bg-slate-50/50 rounded-l-2xl font-bold text-slate-700 text-sm">{job.title}</td>
                      <td className="px-4 py-4 bg-slate-50/50 font-bold text-indigo-600 text-xs md:text-sm">{job.candidates}</td>
                      <td className="px-4 py-4 bg-slate-50/50">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${job.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 bg-slate-50/50 rounded-r-2xl text-slate-400 text-[10px] md:text-xs font-medium">{job.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
            <div className="bg-slate-900 p-6 md:p-8 rounded-[30px] md:rounded-[40px] text-white relative overflow-hidden group h-fit">
              <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-black mb-2">Upgrade Pro 🚀</h3>
                <p className="text-slate-400 text-xs md:text-sm font-medium mb-6">Unlimited posts & AI matching.</p>
                <button className="w-full py-3.5 bg-indigo-600 rounded-2xl font-bold hover:bg-indigo-500 transition-all text-sm">Learn More</button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-slate-100 shadow-sm h-fit">
              <h3 className="text-md md:text-lg font-black text-slate-800 mb-4 md:mb-6">Upcomings</h3>
              <div className="space-y-4">
                <InterviewItem name="Rahul Sharma" time="Today, 02 PM" role="React Dev" />
                <InterviewItem name="Priya Patel" time="Tomorrow, 11 AM" role="Designer" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Interview Item Helper - રિસ્પોન્સિવ ટેક્સ્ટ
function InterviewItem({ name, time, role }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 text-sm">👤</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-black text-slate-800 truncate">{name}</p>
        <p className="text-[9px] text-indigo-600 font-bold uppercase truncate">{role}</p>
      </div>
      <div className="text-[9px] text-slate-400 font-bold whitespace-nowrap">{time}</div>
    </div>
  );
}