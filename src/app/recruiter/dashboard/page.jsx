"use client";
import React from 'react';
import { Bell, Search, Briefcase, Users, PlusCircle } from 'lucide-react';
import RecruiterSidebar from '@/components/RecruiterSidebar'; // સાઇડબાર ઈમ્પોર્ટ કરો

export default function RecruiterDashboard() {
  // Stats Data
  const stats = [
    { label: "Active Jobs", value: "12", icon: <Briefcase size={20}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Applications", value: "148", icon: <Users size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "New Messages", value: "5", icon: <Bell size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const recentApplications = [
    { id: 1, name: "Rahul Sharma", job: "Frontend Developer", date: "2 hours ago", status: "Pending" },
    { id: 2, name: "Priya Patel", job: "UI/UX Designer", date: "5 hours ago", status: "Reviewing" },
    { id: 3, name: "Amit Verma", job: "Backend Engineer", date: "Yesterday", status: "Shortlisted" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* SIDEBAR COMPONENT */}
      <RecruiterSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Recruiter Dashboard</h2>
            <p className="text-slate-500 font-medium text-sm">Welcome back, <span className="text-indigo-600">Tech Solutions HR</span></p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <input type="text" placeholder="Search candidates..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm shadow-sm" />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all relative">
              <Bell size={20}/>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-indigo-100/20 flex items-center gap-5 transition-transform hover:scale-[1.02]">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>{stat.icon}</div>
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Applications Table */}
          <div className="xl:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
                <button className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                      <th className="pb-4">Candidate</th>
                      <th className="pb-4">Applied Job</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentApplications.map((app) => (
                      <tr key={app.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-4">
                          <p className="font-bold text-slate-800 text-sm">{app.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{app.date}</p>
                        </td>
                        <td className="py-4 text-slate-600 font-semibold text-xs">{app.job}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            app.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                            app.status === 'Reviewing' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="text-indigo-600 font-bold text-[10px] uppercase hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all border border-indigo-100">Review</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Quick Post Card */}
          <div className="space-y-6">
            <section className="bg-indigo-600 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-2">Need to Hire?</h3>
                <p className="text-indigo-100 text-sm mb-6 font-medium leading-relaxed opacity-90">Post your job vacancies today and find the best talent.</p>
                <button className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-all hover:bg-indigo-50">
                  + Create Job Post
                </button>
              </div>
              <PlusCircle className="absolute -bottom-4 -right-4 text-white/10 group-hover:scale-110 transition-transform" size={120} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}