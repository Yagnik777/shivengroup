"use client";
import React, { useEffect, useState } from 'react';
import { 
  Mail, Phone, MapPin, Briefcase, 
  Search, RotateCcw, Ban, FileText, Building2,
  CheckCircle2, XCircle, Clock, ExternalLink
} from 'lucide-react';

export default function AdminSPManager() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/serviceproviders');
      const data = await res.json();
      setProviders(data.providers || []);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, isRejected = false) => {
    const actionText = isRejected ? 'reject' : (status === 'approved' ? 'approve' : 'reset');
    if (!confirm(`Are you sure you want to ${actionText} this provider?`)) return;

    try {
      const res = await fetch('/api/admin/serviceproviders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: isRejected ? 'rejected' : status }),
      });
      if (res.ok) {
        fetchProviders();
      }
    } catch (err) {
      alert("Error updating status");
    }
  };

  const getFileUrl = (path) => {
    if (!path || path === "No Document" || path === "uploaded" || path === "") return null;
    let cleanPath = path.replace(/^public\//, '');
    if (!cleanPath.startsWith('/') && !cleanPath.startsWith('http')) {
      cleanPath = '/' + cleanPath;
    }
    return cleanPath;
  };

  const filtered = providers.filter(sp => {
    const matchesStatus = statusFilter === "All" || sp.status === statusFilter.toLowerCase();
    const searchableText = `${sp.fullName || ""} ${sp.providerName || ""} ${sp.email || ""}`.toLowerCase();
    return matchesStatus && searchableText.includes(searchTerm.toLowerCase());
  });

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Loading Records...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-[1700px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Expert Network Admin</h1>
            <p className="text-slate-500 font-medium">Verify and manage service provider applications</p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:min-w-[350px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search name, email, or business..." 
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="border-none shadow-sm px-4 py-3 rounded-2xl bg-white font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-slate-700"
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Applications</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-slate-400">Provider Details</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-slate-400">Business info</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-slate-400">Identity Details</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-slate-400 text-center">Verification Docs</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-slate-400 text-center">Approval Status</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((sp) => (
                  <tr key={sp._id} className="hover:bg-slate-50/80 transition-all">
                    <td className="p-5">
                      <div className="font-bold text-slate-900 text-base">{sp.fullName}</div>
                      <div className="text-[12px] text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                        <Mail size={13} className="text-slate-400"/> {sp.email}
                      </div>
                      <div className="text-[12px] text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                        <Phone size={13} className="text-slate-400"/> {sp.mobile}
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="font-bold text-indigo-600 flex items-center gap-1.5">
                        <Building2 size={14}/> {sp.providerName}
                      </div>
                      <div className="text-[12px] text-slate-600 font-bold mt-1.5 px-2 py-0.5 bg-indigo-50 rounded-md inline-block">
                        {sp.serviceCategory}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-2">
                        <MapPin size={12}/> {sp.location}
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Aadhar Number</div>
                        <div className="text-sm font-mono font-bold text-slate-700">{sp.aadharNumber || "---"}</div>
                        <div className="pt-2">
                          <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded">PAN: {sp.panNumber || "N/A"}</span>
                        </div>
                      </div> {/* Fixed: Correct closing div */}
                    </td>

                    <td className="p-5">
                      <div className="flex justify-center gap-3">
                        {[
                          { path: sp.aadharDoc, label: 'Aadhar' },
                          { path: sp.panDoc, label: 'PAN' },
                          { path: sp.gstDoc, label: 'GST' }
                        ].map((doc, i) => {
                          const url = getFileUrl(doc.path);
                          return url ? (
                            <a 
                              key={i} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="group/btn flex flex-col items-center gap-1 no-underline"
                            >
                              <div className="p-2.5 bg-white border-2 border-slate-100 rounded-xl group-hover/btn:border-indigo-500 group-hover/btn:text-indigo-600 group-hover/btn:shadow-lg group-hover/btn:shadow-indigo-100 transition-all text-slate-400">
                                <FileText size={18}/>
                              </div>
                              <span className="text-[9px] font-black text-slate-400 group-hover/btn:text-indigo-600 uppercase tracking-widest">{doc.label}</span>
                            </a>
                          ) : (
                            <div key={i} className="flex flex-col items-center gap-1 opacity-20 grayscale cursor-not-allowed">
                               <div className="p-2.5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                                 <FileText size={18}/>
                               </div>
                               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{doc.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <div className="flex justify-center">
                        {sp.status === 'approved' ? (
                          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-black border border-emerald-100 uppercase tracking-tight">
                            <CheckCircle2 size={14}/> Verified
                          </div>
                        ) : sp.status === 'rejected' ? (
                          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-700 rounded-full text-[11px] font-black border border-red-100 uppercase tracking-tight">
                            <XCircle size={14}/> Rejected
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-[11px] font-black border border-amber-100 uppercase tracking-tight animate-pulse">
                            <Clock size={14}/> Pending
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        {sp.status !== 'pending' ? (
                          <button 
                            onClick={() => updateStatus(sp._id, 'pending')} 
                            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                            title="Reset to Pending"
                          >
                            <RotateCcw size={20}/>
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => updateStatus(sp._id, 'approved')} 
                              className="bg-indigo-600 text-white px-5 py-2 rounded-2xl text-xs font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                            >
                              APPROVE
                            </button>
                            <button 
                              onClick={() => updateStatus(sp._id, 'rejected', true)} 
                              className="p-2.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                              title="Reject Application"
                            >
                              <Ban size={22}/>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filtered.length === 0 && (
            <div className="py-32 text-center bg-slate-50/30">
              <div className="inline-flex p-6 bg-white rounded-full shadow-sm text-slate-200 mb-4">
                <Search size={40}/>
              </div>
              <p className="text-slate-400 font-bold text-lg">No experts found matching your filters</p>
              <button onClick={() => {setSearchTerm(""); setStatusFilter("All");}} className="mt-4 text-indigo-600 font-black text-sm hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}