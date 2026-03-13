"use client";
import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronRight, Bookmark, Bell, Loader2 } from 'lucide-react';
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
        setLoading(true);
        // 1. નોકરીઓ ફેચ કરો
        const jobsRes = await fetch('/api/jobs');
        if (!jobsRes.ok) {
          console.error("Failed to fetch jobs", jobsRes.status, jobsRes.statusText);
          setJobs([]);
          return;
        }
        const jobsData = await jobsRes.json();
        setJobs(Array.isArray(jobsData) ? jobsData.slice(0, 4) : []);

        // 2. એપ્લિકેશન ફેચ કરો
        const appRes = await fetch('/api/applications'); // તમારી API નું સાચું નામ ચેક કરજો
        if (!appRes.ok) {
          console.error("Failed to fetch applications", appRes.status, appRes.statusText);
          return;
        }
        const appResult = await appRes.json();
        
        if (appResult.ok && Array.isArray(appResult.data)) {
          const apps = appResult.data;
          setStats(prev => ({
            ...prev,
            applied: apps.length,
            interviews: apps.filter(a => a.status?.toLowerCase() === 'approved').length
          }));
        }
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredJobs = jobs.filter(job => job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.company.toLowerCase().includes(searchQuery.toLowerCase()) || job.description.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen bg-[#FDFEFF] overflow-hidden">
      <UserSidebar onCollapseChange={setIsSidebarCollapsed} />

      <main className={`flex-1 overflow-y-auto transition-all duration-300 pt-20 lg:pt-8 
        ${isSidebarCollapsed ? "lg:ml-24" : "lg:ml-72"}`}>
        
        <div className="p-4 sm:p-6 md:p-8 lg:px-12 max-w-7xl mx-auto">
          
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                Hello, <span className="text-indigo-600">{session?.user?.name?.split(' ')[0] || "User"}</span> 👋
              </h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Ready to find your next big opportunity?</p>
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl relative shadow-sm">
              <Bell size={24}/>
              <span className="absolute top-3 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
          </header>

          
          {/* SEARCH BAR */}
          <div className="flex-[2] relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
            <input 
              type="text" 
              placeholder="Search job title..." 
              className="w-full pl-14 pr-4 py-4.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm transition-all" 
              // અહીં ફેરફાર: value હંમેશા string હોવી જોઈએ, undefined નહીં
              value={searchQuery || ""} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Applied Jobs", value: stats.applied, color: "text-indigo-600", bg: "bg-indigo-50", href: "/user/status" },
              { label: "Approved", value: stats.interviews, color: "text-emerald-600", bg: "bg-emerald-50", href: "/user/status" },
              { label: "Saved Jobs", value: stats.saved, color: "text-amber-600", bg: "bg-amber-50", href: "/careers" },
            ].map((stat, i) => (
              <Link href={stat.href} key={i} className="bg-white p-7 rounded-[32px] border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-4xl font-black ${stat.color}`}>{stat.value.toString().padStart(2, '0')}</p>
                </div>
                <div className={`${stat.bg} p-4 rounded-2xl`}>
                  <ChevronRight size={24} />
                </div>
              </Link>
            ))}
          </div>

          {/* RECOMMENDED JOBS */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900">Recommended for you</h3>
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>
            ) : (
              jobs.length === 0 ? (
                <div className="text-center">No recommended jobs at this time</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredJobs.map((job) => (
                    <Link href={`/careers?jobId=${job._id}`} key={job._id} className="block group">
                      <div className="bg-white p-6 rounded-[30px] border border-slate-100 hover:border-indigo-100 transition-all flex flex-col sm:flex-row gap-6">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {job.title?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-bold text-slate-900 text-xl">{job.title}</h4>
                            <Bookmark size={20} className="text-slate-300" />
                          </div>
                          <p className="text-sm text-slate-500">{job.location}</p>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-indigo-600 font-bold">{job.salaryRange || "Best in Class"}</span>
                            <span className="text-[10px] font-black uppercase bg-slate-900 text-white px-5 py-2 rounded-xl">Details</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}