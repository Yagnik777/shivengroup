"use client";
import { useEffect, useState } from "react";
import { 
  MapPin, Ban, RotateCcw, FileText, Download, Mail, 
  Phone, Briefcase, Hash, CreditCard, Building2, 
  CheckCircle2, XCircle, Clock, Search
} from "lucide-react";
import * as XLSX from "xlsx";

export default function AdminRecruiterManager() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchRecruiters(); }, []);

  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/recruiters");
      const data = await res.json();
      if (data.success) setRecruiters(data.recruiters);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleUpdateStatus = async (id, status, isRejected = false) => {
    const msg = isRejected ? "Reject this recruiter?" : status ? "Approve this recruiter?" : "Reset to pending?";
    if (!confirm(msg)) return;

    const res = await fetch("/api/admin/recruiters", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, isRejected }),
    });
    
    if (res.ok) {
      alert("Status updated successfully!");
      fetchRecruiters();
    }
  };

  const getFileUrl = (path) => path && path !== "No Document" ? (path.startsWith("/") ? path : `/${path}`) : null;

  // Filtering Logic
  const filtered = recruiters.filter(r => {
    const matchesStatus = statusFilter === "All" || 
      (statusFilter === "Approved" && r.isApproved) ||
      (statusFilter === "Rejected" && r.isRejected) ||
      (statusFilter === "Pending" && !r.isApproved && !r.isRejected);
    
    const matchesSearch = r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         r.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="p-4 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-[1700px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recruiter Database</h1>
            <p className="text-slate-500 text-sm">Manage recruiter approvals and verify documents</p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or company..." 
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="border border-slate-200 p-2 rounded-xl bg-white font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1400px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold uppercase text-slate-500">Recruiter Details</th>
                  <th className="p-4 text-xs font-bold uppercase text-slate-500">Company & Role</th>
                  <th className="p-4 text-xs font-bold uppercase text-slate-500 text-center">Location</th>
                  <th className="p-4 text-xs font-bold uppercase text-slate-500">GST Number</th>
                  <th className="p-4 text-xs font-bold uppercase text-slate-500">Aadhar Number</th>
                  <th className="p-4 text-xs font-bold uppercase text-slate-500">PAN Number</th>
                  <th className="p-4 text-xs font-bold uppercase text-slate-500 text-center">Documents</th>
                  <th className="p-4 text-xs font-bold uppercase text-slate-500 text-center">Status</th>
                  <th className="p-4 text-xs font-bold uppercase text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-indigo-50/30 transition-all group">
                    {/* Recruiter Details */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{r.fullName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1"><Mail size={12}/> {r.email}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1"><Phone size={12}/> {r.mobile}</div>
                    </td>

                    {/* Company & Role */}
                    <td className="p-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Building2 size={14} className="text-indigo-500"/> {r.companyName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 italic">{r.designation}</div>
                    </td>

                    {/* Location */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                        <MapPin size={12} className="text-red-500"/> {r.location}
                      </div>
                    </td>

                    {/* GST */}
                    <td className="p-4">
                      <code className="text-[11px] font-bold text-slate-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                        {r.gstNumber || "N/A"}
                      </code>
                    </td>

                    {/* Aadhar */}
                    <td className="p-4">
                      <span className="text-xs font-mono text-slate-600">
                        {r.aadharNumber || "Not Provided"}
                      </span>
                    </td>

                    {/* PAN */}
                    <td className="p-4">
                      <span className="text-xs font-mono text-slate-600 uppercase">
                        {r.panNumber || "Not Provided"}
                      </span>
                    </td>

                    {/* Documents */}
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {[
                          { path: r.gstProof, label: 'GST' },
                          { path: r.aadharProof, label: 'AAD' },
                          { path: r.panProof, label: 'PAN' },
                          { path: r.businessLicense, label: 'LIC' }
                        ].map((doc, i) => {
                          const url = getFileUrl(doc.path);
                          return url ? (
                            <a key={i} href={url} target="_blank" className="group/btn flex flex-col items-center gap-1" title={`View ${doc.label}`}>
                              <div className="p-2 bg-white border border-slate-200 rounded-lg group-hover/btn:border-indigo-500 group-hover/btn:text-indigo-600 shadow-sm transition-all">
                                <FileText size={15}/>
                              </div>
                              <span className="text-[9px] font-bold text-slate-400 group-hover/btn:text-indigo-600">{doc.label}</span>
                            </a>
                          ) : (
                            <div key={i} className="flex flex-col items-center gap-1 opacity-20 cursor-not-allowed">
                               <div className="p-2 bg-slate-100 border border-slate-200 rounded-lg"><FileText size={15}/></div>
                               <span className="text-[9px] font-bold">{doc.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      {r.isApproved ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black border border-emerald-100 uppercase">
                          <CheckCircle2 size={12}/> Approved
                        </div>
                      ) : r.isRejected ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-[10px] font-black border border-red-100 uppercase">
                          <XCircle size={12}/> Rejected
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black border border-amber-100 uppercase animate-pulse">
                          <Clock size={12}/> Pending
                        </div>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {r.isRejected || r.isApproved ? (
                          <button 
                            onClick={() => handleUpdateStatus(r._id, false, false)} 
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                            title="Reset to Pending"
                          >
                            <RotateCcw size={18}/>
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(r._id, true, false)} 
                              className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-95"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(r._id, false, true)} 
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                              title="Reject Application"
                            >
                              <Ban size={20}/>
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
            <div className="py-20 text-center">
              <div className="text-slate-300 mb-2 flex justify-center"><Building2 size={48}/></div>
              <p className="text-slate-500 font-medium">No recruiters found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}