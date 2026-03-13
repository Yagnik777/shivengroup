"use client";
import { useState, useEffect } from "react";
import { 
  Building2, User, MapPin, Clock, 
  Briefcase, Banknote, Search, ExternalLink,
  Phone, Mail, UserCircle, Calendar, Hash
} from "lucide-react";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Email States
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch("/api/admin/all-jobs");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const filteredData = jobs.filter(j => {
    const matchesTab = tab === "all" ? true : j.postedByRole === tab;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      j.title?.toLowerCase().includes(searchLower) || 
      j.name?.toLowerCase().includes(searchLower) || 
      j.companyDetails?.companyName?.toLowerCase().includes(searchLower) ||
      j.companyDetails?.contactPersonName?.toLowerCase().includes(searchLower);
    return matchesTab && matchesSearch;
  });

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      const allIds = filteredData.map((j) => j._id);
      setSelectedIds(allIds);
      setSelectAll(true);
    }
  };

  const handleSendMail = async (ids, all = false) => {
    if (!mailSubject.trim() || !mailBody.trim()) {
      alert("Please enter both subject and message!");
      return;
    }
    if (!all && ids.length === 0) {
      alert("Please select records!");
      return;
    }
    try {
      setSending(true);
      const res = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: mailSubject,
          message: mailBody,
          userIds: all ? [] : ids,
          allUsers: all,
          type: "jobs",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      alert(`✅ Sent to ${data.sentTo} users!`);
      setMailSubject(""); setMailBody(""); setSelectedIds([]); setSelectAll(false);
    } catch (err) {
      alert("Error sending mail");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">MASTER JOB PANEL</h1>
            <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em]">Administrator Dashboard v2.0</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Title, Company or HR Name..." 
              className="pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 w-full md:w-96 outline-none focus:border-indigo-500 bg-white shadow-sm transition-all font-bold"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-200/50 p-1 rounded-2xl w-fit">
          {['all', 'recruiter', 'candidate'].map((t) => (
            <button 
              key={t}
              onClick={() => { setTab(t); setSelectedIds([]); setSelectAll(false); }}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                tab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === "all" ? "All Records" : `${t} Posts`}
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-5 w-10 text-center">
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="accent-indigo-500 h-4 w-4" />
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest">Job & Entity</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest">Communication Info</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest">Requirements</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest">Location & Pay</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-right">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="7" className="p-24 text-center font-black text-indigo-500 animate-pulse uppercase tracking-[0.5em]">Fetching Live Data...</td></tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((job, i) => {
                    // ✅ Logical Fallbacks for Missing Data
                    const email = job.companyDetails?.email || job.companyDetails?.contactPersonEmail || job.companyDetails?.ownerEmail || job.email || "N/A";
                    const mobile = job.companyDetails?.mobile || job.companyDetails?.contactPersonNumber || job.companyDetails?.ownerNumber || job.phone || "N/A";
                    const poster = job.companyDetails?.companyName || job.companyDetails?.contactPersonName || job.companyDetails?.ownerName || job.name || "Individual";
                    const exp = job.experienceLevel || "No Experience Mentioned";

                    return (
                      <tr key={i} className={`hover:bg-slate-50/50 transition-colors ${selectedIds.includes(job._id) ? 'bg-indigo-50/40' : ''}`}>
                        <td className="p-5 text-center">
                          <input type="checkbox" checked={selectedIds.includes(job._id)} onChange={() => handleSelect(job._id)} className="accent-indigo-500 h-4 w-4" />
                        </td>
                        
                        {/* 1. Title & Poster */}
                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-800 text-base uppercase leading-tight">{job.title}</span>
                            <span className="text-[11px] font-black text-indigo-600 mt-1 flex items-center gap-1 uppercase">
                              <User size={12} className="text-slate-400"/> {poster}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-1">
                              <Calendar size={10}/> {job.postedAt?.$date ? new Date(job.postedAt.$date).toDateString() : 'Active'}
                            </span>
                          </div>
                        </td>

                        {/* 2. Communication - Fixed Fallback Logic */}
                        <td className="p-5">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-2">
                              <div className="p-1 bg-indigo-50 rounded text-indigo-500"><Mail size={10}/></div>
                              {email}
                            </span>
                            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-2">
                              <div className="p-1 bg-emerald-50 rounded text-emerald-500"><Phone size={10}/></div>
                              {mobile}
                            </span>
                          </div>
                        </td>

                        {/* 3. Requirements */}
                        <td className="p-5">
                          <div className="flex flex-col text-[10px] font-black uppercase gap-1">
                            <span className="text-slate-500 flex items-center gap-1.5"><Briefcase size={12} className="text-indigo-300"/> {exp}</span>
                            <span className="text-slate-500 flex items-center gap-1.5"><Clock size={12} className="text-indigo-300"/> {job.jobType}</span>
                            <div className="mt-1 px-2 py-0.5 bg-slate-100 rounded w-fit text-slate-400">{job.category}</div>
                          </div>
                        </td>

                        {/* 4. Location & Salary */}
                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-600 flex items-center gap-1 uppercase">
                              <MapPin size={14} className="text-red-500"/> {job.location || 'Remote'}
                            </span>
                            <span className="text-emerald-600 font-black text-xs mt-1.5 flex items-center gap-1">
                              <Banknote size={13}/> {job.salaryRange || 'NOT SPECIFIED'}
                            </span>
                          </div>
                        </td>

                        {/* 5. Status */}
                        <td className="p-5 text-center">
                          <div className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase border-2 ${
                            job.status === 'published' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                          }`}>
                            {job.status}
                          </div>
                        </td>

                        {/* 6. Action */}
                        <td className="p-5 text-right">
                          <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:border-indigo-500 hover:text-indigo-500 transition-all shadow-sm">
                            <ExternalLink size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="7" className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">No Database Records Match Your Query.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Improved Email Box */}
        <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10"><Mail size={150} className="text-white"/></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 italic">
               SEND BROADCAST EMAIL
            </h2>
            <div className="space-y-4 max-w-3xl">
              <input
                type="text"
                value={mailSubject}
                onChange={(e) => setMailSubject(e.target.value)}
                placeholder="EMAIL SUBJECT"
                className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:bg-white focus:text-slate-900 outline-none font-bold transition-all"
              />
              <textarea
                rows="4"
                value={mailBody}
                onChange={(e) => setMailBody(e.target.value)}
                placeholder="WRITE YOUR OFFICIAL MESSAGE HERE..."
                className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:bg-white focus:text-slate-900 outline-none font-medium transition-all"
              ></textarea>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => handleSendMail(selectedIds, false)}
                  disabled={sending || selectedIds.length === 0}
                  className="bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-400 disabled:opacity-30 shadow-xl transition-all"
                >
                  {sending ? "Processing..." : `Send to Selected (${selectedIds.length})`}
                </button>
                <button
                  onClick={() => handleSendMail([], true)}
                  disabled={sending}
                  className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 disabled:opacity-30 shadow-xl transition-all"
                >
                  Blast to All Users
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}