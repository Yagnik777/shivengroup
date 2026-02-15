"use client";
import { useEffect, useState } from "react";
import { Loader2, Briefcase, Calendar, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
// જે નામથી તમારું Sidebar હોય તે અહીં ઈમ્પોર્ટ કરો
import UserSidebar from "@/components/UserSidebar"; 

export default function UserStatusPage() {
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/user/applications");
        const data = await res.json();
        if (data.ok) {
          setApplications(data.applications);
          setSummary({
            total: data.total,
            approved: data.approved,
            pending: data.pending,
            rejected: data.rejected,
          });
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
      <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px] text-center">
        Fetching your <br/> application journey...
      </p>
    </div>
  );

  return (
    // ૧. ફ્લેક્સ લેઆઉટ ઉમેર્યું જેથી સાઈડબાર પ્રોપર દેખાય
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* Sidebar - activePage "status" રાખજો જેથી તે હાઈલાઈટ થાય */}
      <UserSidebar activePage="status" />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Journey</h1>
              <p className="text-slate-500 font-medium">Track all your job applications and their current status</p>
            </div>
            
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total Applied" value={summary.total} icon={<FileText size={20}/>} color="text-indigo-600" bgColor="bg-indigo-50" />
            <StatCard label="Approved" value={summary.approved} icon={<CheckCircle2 size={20}/>} color="text-emerald-600" bgColor="bg-emerald-50" />
            <StatCard label="Pending" value={summary.pending} icon={<Clock size={20}/>} color="text-amber-600" bgColor="bg-amber-50" />
            <StatCard label="Rejected" value={summary.rejected} icon={<XCircle size={20}/>} color="text-rose-600" bgColor="bg-rose-50" />
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            {applications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">#</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Details</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {applications.map((app, i) => (
                      <tr key={app._id} className="hover:bg-indigo-50/20 transition-all group">
                        <td className="px-8 py-6 text-center font-bold text-slate-300 group-hover:text-indigo-600 transition-colors">{i + 1}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              <Briefcase size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-lg leading-tight">{app.role || "Job Role"}</p>
                              <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-1 italic">Verified Application</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                            <Calendar size={14} className="text-slate-300"/>
                            {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="text-slate-200" size={40} />
                </div>
                <p className="text-slate-800 text-xl font-black">No Applications Yet</p>
                <p className="text-slate-400 mt-2 font-medium">You haven't applied to any jobs. Explore careers to get started!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// UI Helper components (StatCard and StatusBadge) remains same as before...
function StatCard({ label, value, color, bgColor, icon }) {
  return (
    <div className={`${bgColor} rounded-[24px] p-6 transition-all hover:scale-[1.02] border border-white/50 shadow-sm relative overflow-hidden group`}>
      <div className={`absolute -right-2 -bottom-2 opacity-10 group-hover:scale-125 transition-transform ${color}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-4xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status = "" }) {
  const normalized = status?.toLowerCase() || "pending";
  const styles = {
    approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-100 text-rose-700 border-rose-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200"
  };

  return (
    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${styles[normalized] || styles.pending}`}>
      {normalized}
    </span>
  );
}