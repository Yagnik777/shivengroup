"use client";
import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronRight, Bookmark, Sparkles, Bell, Loader2 } from 'lucide-react';
import UserSidebar from '@/components/UserSidebar';
import Link from 'next/link';
import { useSession } from "next-auth/react";

export default function UserDashboard() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ applied: 0, interviews: 0, saved: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. નોકરીઓ ફેચ કરો
        const jobsRes = await fetch('/api/jobs', { cache: 'no-store' });
        const jobsData = await jobsRes.json();
        setJobs(Array.isArray(jobsData) ? jobsData.slice(0, 4) : []);

        // 2. એપ્લાય કરેલી નોકરીઓ ફેચ કરો (Error Fix: Array check ઉમેર્યું છે)
        const applicationsRes = await fetch('/api/user/applications'); 
        if (applicationsRes.ok) {
          const appData = await applicationsRes.json();
          const safeAppData = Array.isArray(appData) ? appData : [];
          
          const appliedCount = safeAppData.length;
          const interviewCount = safeAppData.filter(app => 
            app.status === 'interview' || app.status === 'scheduled'
          ).length;
          
          setStats(prev => ({
            ...prev,
            applied: appliedCount,
            interviews: interviewCount
          }));
        }

        // 3. સેવ કરેલી નોકરીઓ ફેચ કરો
        const savedRes = await fetch('/api/user/saved-jobs');
        if (savedRes.ok) {
          const savedData = await savedRes.json();
          const safeSavedData = Array.isArray(savedData) ? savedData : [];
          setStats(prev => ({ ...prev, saved: safeSavedData.length }));
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex h-screen bg-[#FDFEFF] overflow-hidden">
      
      {/* 1. સાઇડબાર */}
      <UserSidebar onCollapseChange={setIsSidebarCollapsed} />

      {/* 2. મેઈન કન્ટેન્ટ એરિયા */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 pt-20 lg:pt-0 
        ${isSidebarCollapsed ? "lg:ml-24" : "lg:ml-72"}`}>
        
        <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
          
          {/* HEADER */}
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Hello, <span className="text-indigo-600">{session?.user?.name?.split(' ')[0] || "User"}</span> 👋
              </h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Ready to find your next big opportunity?</p>
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 relative hover:bg-slate-50 transition-all shadow-sm shrink-0">
              <Bell size={24}/>
              <span className="absolute top-3 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
          </header>

          {/* SEARCH BAR */}
          <div className="bg-white p-3 md:p-4 rounded-[32px] shadow-xl shadow-indigo-100/20 border border-slate-50 flex flex-col md:flex-row gap-3 mb-12">
            <div className="flex-[2] relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
              <input 
                type="text" 
                placeholder="Search job title or keywords..." 
                className="w-full pl-14 pr-4 py-4.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm transition-all" 
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
              <input 
                type="text" 
                placeholder="Location" 
                className="w-full pl-14 pr-4 py-4.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm transition-all" 
              />
            </div>
            <button className="bg-indigo-600 text-white px-10 py-4.5 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200">
              Find Jobs
            </button>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Applied Jobs", value: stats.applied.toString().padStart(2, '0'), color: "text-indigo-600", bg: "bg-indigo-50", href: "/user/status" },
              { label: "Interviews", value: stats.interviews.toString().padStart(2, '0'), color: "text-emerald-600", bg: "bg-emerald-50", href: "/user/status" },
              { label: "Saved Jobs", value: stats.saved.toString().padStart(2, '0'), color: "text-amber-600", bg: "bg-amber-50", href: "/user/careers" },
            ].map((stat, i) => (
              <Link href={stat.href} key={i} className="bg-white p-7 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:border-indigo-300 transition-all shadow-sm hover:shadow-md cursor-pointer">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-4 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all`}>
                  <ChevronRight size={24} />
                </div>
              </Link>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recommended for you</h3>
                <Link href="/user/careers" className="text-indigo-600 font-bold text-sm hover:underline">View all</Link>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <Link href={`/user/careers/${job._id}`} key={job._id} className="block group">
                    <div className="bg-white p-7 rounded-[35px] border border-slate-100 hover:shadow-2xl hover:border-indigo-100 transition-all flex flex-col sm:flex-row gap-6 relative overflow-hidden">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                        {job.title?.charAt(0) || "J"}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-900 text-xl group-hover:text-indigo-600 transition-colors leading-tight">{job.title}</h4>
                            <p className="text-sm text-slate-500 font-medium mt-1">{job.category} • {job.location}</p>
                          </div>
                          <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <Bookmark size={22} className="text-slate-300 hover:text-indigo-600 transition-colors"/>
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-8">
                          <span className="text-indigo-600 font-black text-lg">
                            {job.salaryRange || "Best in Class"}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-7 py-3 rounded-xl group-hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                            View Details
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="bg-slate-50 rounded-[32px] py-20 text-center border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-bold text-lg">No matching jobs found yet.</p>
                </div>
              )}
            </div>

            {/* Right side: AI Card */}
            <div className="space-y-8">
              <div className="bg-slate-900 p-10 rounded-[45px] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/30 shadow-inner">
                    <Sparkles className="text-indigo-400" size={32}/>
                  </div>
                  <h3 className="text-3xl font-black mb-4 leading-tight">AI Resume Scan</h3>
                  <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
                    તમારા રેઝ્યૂમેને સ્કેન કરો અને જોબ ડિસ્ક્રિપ્શન સાથે મેચ ચેક કરો.
                  </p>
                  <Link href="/user/resume" className="block text-center w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-500 transition-all active:scale-95">
                    Start Scanning
                  </Link>
                </div>
                <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-indigo-600/20 rounded-full blur-[80px] group-hover:bg-indigo-600/40 transition-all duration-700"></div>
              </div>
              
              <div className="bg-indigo-50 p-10 rounded-[40px] border border-indigo-100 relative group">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">💡</div>
                <h4 className="text-xl font-black text-indigo-900 mb-2 tracking-tight">Pro Tip</h4>
                <p className="text-sm text-indigo-800/70 font-bold leading-relaxed">
                  "Keep your GitHub and Portfolio updated to attract tech recruiters."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}