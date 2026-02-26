"use client";
import { useEffect, useState } from "react";
import { Loader2, Briefcase, Calendar, CheckCircle2, Clock, XCircle, FileText, ChevronRight } from "lucide-react";
import UserSidebar from "@/components/UserSidebar"; 

export default function UserStatusPage() {
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/applications");
        const data = await res.json();
        
        // Robust data handling for different API response structures
        let apps = [];
        if (data.ok && Array.isArray(data.data)) {
            apps = data.data;
        } else if (Array.isArray(data.applications)) {
            apps = data.applications;
        } else if (Array.isArray(data)) {
            apps = data;
        }
        
        setApplications(apps);
        
        // Summary Calculation Logic
        setSummary({
          total: apps.length,
          approved: apps.filter(a => a.status?.toLowerCase() === 'approved').length,
          pending: apps.filter(a => a.status?.toLowerCase() === 'pending' || !a.status).length,
          rejected: apps.filter(a => a.status?.toLowerCase() === 'rejected').length,
        });
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
      <div className="relative flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <div className="absolute inset-0 scale-150 blur-2xl bg-indigo-500/10 rounded-full"></div>
      </div>
      <p className="text-slate-400 font-black tracking-[0.3em] uppercase text-[10px] mt-8 text-center animate-pulse">
        Fetching your <br/> application journey
      </p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* Sidebar with proper collapse state management */}
      <UserSidebar onCollapseChange={setIsSidebarCollapsed} />

      {/* Dynamic margin based on sidebar state */}
      <main className={`flex-1 transition-all duration-500 ease-in-out ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-72"}`}>
        <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-10 bg-indigo-600 rounded-full"></div>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Candidate Dashboard</p>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight">My Journey</h1>
              <p className="text-slate-500 font-medium mt-2">Check the progress of your professional applications.</p>
            </div>
            
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Real-time Updates</p>
            </div>
          </div>

          {/* Premium Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard label="Applied" value={summary.total} icon={<FileText size={24}/>} color="text-indigo-600" bgColor="bg-indigo-50" />
            <StatCard label="Approved" value={summary.approved} icon={<CheckCircle2 size={24}/>} color="text-emerald-600" bgColor="bg-emerald-50" />
            <StatCard label="Pending" value={summary.pending} icon={<Clock size={24}/>} color="text-amber-600" bgColor="bg-amber-50" />
            <StatCard label="Rejected" value={summary.rejected} icon={<XCircle size={24}/>} color="text-rose-600" bgColor="bg-rose-50" />
          </div>

          {/* Modern Table Container */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
            {applications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-20">#</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Details</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied Date</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {applications.map((app, i) => (
                      <tr key={app._id} className="hover:bg-slate-50/80 transition-all group cursor-default">
                        <td className="px-10 py-8 text-center font-black text-slate-200 group-hover:text-indigo-600 transition-colors text-lg italic">
                          {(i + 1).toString().padStart(2, '0')}
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12 transition-all duration-300 shadow-sm">
                              <Briefcase size={22} />
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-xl tracking-tight leading-none mb-2">
                                {app.jobTitle || app.role || "Job Role"}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest px-2 py-0.5 bg-indigo-50 rounded">System Verified</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex flex-col gap-1">
                            <p className="text-slate-700 font-black text-sm">
                              {new Date(app.appliedAt || app.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Application Date</p>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <ChevronRight size={20} className="text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-32 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-100">
                  <FileText className="text-slate-200" size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">No Journey Started</h3>
                <p className="text-slate-400 mt-3 font-medium max-w-xs mx-auto">Explore the careers page and apply to your dream job to see them here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Fixed StatCard Component
function StatCard({ label, value, color, bgColor, icon }) {
  return (
    <div className={`${bgColor} rounded-[32px] p-8 transition-all hover:-translate-y-1 border border-white/50 shadow-lg shadow-slate-200/50 relative overflow-hidden group`}>
      {/* Background Icon - Removed React.cloneElement */}
      <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-150 group-hover:opacity-10 transition-all duration-700 ${color} rotate-12`}>
        {icon} 
      </div>
      
      <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm ${color}`}>
        {icon}
      </div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className={`text-5xl font-black tracking-tighter ${color}`}>{value.toString().padStart(2, '0')}</p>
    </div>
  );
}
// Fixed StatusBadge Component
function StatusBadge({ status = "" }) {
  const normalized = status?.toLowerCase() || "pending";
  const styles = {
    approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100"
  };

  return (
    <span className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border-2 shadow-sm inline-flex items-center gap-2 ${styles[normalized] || styles.pending}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${normalized === 'approved' ? 'bg-emerald-500' : normalized === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
      {normalized}
    </span>
  );
}