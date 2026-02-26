"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import RecruiterSidebar from '@/components/RecruiterSidebar';
import { Loader2, Ban, Clock, CheckCircle2, Briefcase, Users, Calendar, Award } from "lucide-react";

export default function RecruiterDashboard() {
  const { data: session, status: authStatus } = useSession();
  const [dbUser, setDbUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    recentJobs: [],
    interviews: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      if (session?.user?.email) {
        try {
          // 1. Fetch Recruiter Status
          const res = await fetch(`/api/admin/recruiters?email=${session.user.email}`);
          const data = await res.json();
          
          if (data.success) {
            setDbUser(data.recruiter);
            
            // 2. જો Approved હોય તો જ બાકીનો ડેટા લાવવો (Jobs, Apps વગેરે)
            if (data.recruiter.isApproved) {
              // અહીં તમે તમારી Jobs API કોલ કરી શકો છો
              // અત્યારે હું ડેટાને ડાયનેમિકલી સેટ કરવા માટેનું સ્ટ્રક્ચર આપું છું
              setDashboardData({
                stats: [
                  { label: "Active Jobs", value: data.recruiter.jobsCount || "0", icon: <Briefcase size={20}/>, color: "bg-blue-50 text-blue-600" },
                  { label: "Total Applications", value: data.recruiter.appsCount || "0", icon: <Users size={20}/>, color: "bg-indigo-50 text-indigo-600" },
                  { label: "Interviews", value: "0", icon: <Calendar size={20}/>, color: "bg-purple-50 text-purple-600" },
                  { label: "Hired", value: "0", icon: <Award size={20}/>, color: "bg-emerald-50 text-emerald-600" },
                ],
                // તમારી API માંથી આવતી Jobs અહીં આવશે
                recentJobs: data.recruiter.recentJobs || [], 
                interviews: [] 
              });
            }
          }
        } catch (err) {
          console.error("Error fetching dashboard data:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    if (authStatus === "authenticated") fetchAllData();
  }, [session, authStatus]);

  // Loading, Rejected, Pending States (પેલાની જેમ જ રહેશે)
  if (authStatus === "loading" || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDFEFF]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-slate-500 font-bold animate-pulse text-sm">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  if (dbUser?.isRejected) {
    return (
      <div className="h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="max-w-md w-full text-center bg-white p-10 rounded-[40px] shadow-2xl border border-red-100">
          <Ban size={40} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-3">Access Denied</h1>
          <p className="text-slate-500 mb-8">Your recruiter account was not approved.</p>
          <button onClick={() => window.location.href = 'mailto:support@resumebuilder.com'} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">Contact Support</button>
        </div>
      </div>
    );
  }

  if (!dbUser?.isApproved) {
    return (
      <div className="h-screen flex items-center justify-center bg-amber-50 p-6">
        <div className="max-w-md w-full text-center bg-white p-10 rounded-[40px] shadow-2xl border border-amber-100">
          <Clock size={40} className="text-amber-500 animate-pulse mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-3">Under Review</h1>
          <p className="text-slate-500 mb-8">Our team is verifying your profile. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEFF] flex flex-col lg:flex-row">
      <RecruiterSidebar activePage="dashboard" />
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 w-full overflow-x-hidden">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Welcome, <span className="text-indigo-600">{session?.user?.name?.split(' ')[0]}</span>! 👋
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-100 uppercase">
                  <CheckCircle2 size={10} /> Verified Recruiter
                </div>
            </div>
          </div>
          <button className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 text-sm">
            <span className="text-xl">+</span> Post New Job
          </button>
        </header>

        {/* DYNAMIC STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardData.stats.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4`}>
                {item.icon}
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
              <h2 className="text-3xl font-black text-slate-900 mt-1">{item.value}</h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* DYNAMIC JOBS TABLE */}
          <div className="xl:col-span-2 bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <h3 className="text-xl font-black text-slate-800 mb-8">Active Postings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Applicants</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentJobs.length > 0 ? (
                    dashboardData.recentJobs.map((job, i) => (
                      <JobRow key={i} title={job.title} apps={job.applicationsCount} status={job.status} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-10 text-slate-400 font-medium italic">No jobs posted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* INTERVIEWS */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm h-fit">
            <h3 className="text-lg font-black text-slate-800 mb-6">Upcoming Interviews</h3>
            <div className="space-y-4">
              {dashboardData.interviews.length > 0 ? (
                dashboardData.interviews.map((inv, i) => (
                  <InterviewItem key={i} name={inv.name} time={inv.time} role={inv.role} />
                ))
              ) : (
                <p className="text-slate-400 text-sm italic">No scheduled interviews.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function JobRow({ title, apps, status }) {
  return (
    <tr className="group cursor-pointer">
      <td className="px-4 py-5 bg-slate-50/50 rounded-l-2xl font-bold text-slate-700 text-sm">{title}</td>
      <td className="px-4 py-5 bg-slate-50/50 font-bold text-indigo-600 text-sm">{apps}</td>
      <td className="px-4 py-5 bg-slate-50/50 rounded-r-2xl">
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}

function InterviewItem({ name, time, role }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-lg">👤</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black text-slate-800 truncate">{name}</p>
        <p className="text-[10px] text-indigo-600 font-bold uppercase truncate">{role}</p>
      </div>
      <div className="text-[10px] text-slate-400 font-black whitespace-nowrap">{time}</div>
    </div>
  );
}