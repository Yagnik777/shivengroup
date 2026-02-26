"use client";
import React, { useState, useEffect } from 'react';
import RecruiterSidebar from '@/components/RecruiterSidebar';
import { 
  Mail, ExternalLink, Loader2, Calendar, User, Briefcase, Phone, 
  MapPin, X, CheckCircle, XCircle, GraduationCap, Globe, FileText, Trash2 
} from 'lucide-react';

export default function CandidateList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/applications'); 
      const data = await res.json();
      if (data.ok) setList(data.data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchCandidates(); }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    const res = await fetch('/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    });
    if (res.ok) {
      alert(`Application ${newStatus}`);
      setSelectedUser(null);
      fetchCandidates();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/applications?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Application deleted successfully");
        setSelectedUser(null);
        fetchCandidates();
      }
    } catch (err) {
      alert("Failed to delete application");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <RecruiterSidebar activePage="candidate" />
      
      <main className="flex-1 p-6 md:p-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Applications Management</h1>
            <button onClick={fetchCandidates} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <Globe size={18} className="text-indigo-600"/>
            </button>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
            {loading ? (
              <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
            ) : list.length === 0 ? (
              <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">No applications found</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied For</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {list.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 transition-all cursor-pointer" onClick={() => setSelectedUser(app)}>
                      <td className="px-6 py-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">{app.name?.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-slate-800">{app.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{app.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-bold text-slate-600">{app.role}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          app.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 
                          app.status === 'Rejected' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {app.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-indigo-600 font-bold text-xs hover:underline">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* --- FULL DETAILS SLIDE-OVER --- */}
        {selectedUser && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-full max-w-2xl bg-white h-full shadow-2xl p-0 overflow-y-auto animate-in slide-in-from-right duration-300">
              
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Application Insight</h2>
                  <p className="text-[10px] font-black text-indigo-600 uppercase">ID: {selectedUser._id.slice(-8)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDelete(selectedUser._id)} className="p-2 hover:bg-rose-50 rounded-xl text-rose-500 transition-colors"><Trash2 size={20}/></button>
                  <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={20}/></button>
                </div>
              </div>

              <div className="p-8 space-y-10 pb-32">
                {/* 1. Profile Banner */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-8 text-white shadow-2xl">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] flex items-center justify-center text-4xl font-black">
                      {selectedUser.name?.charAt(0)}
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-3xl font-black mb-1">{selectedUser.name}</h3>
                      <p className="text-indigo-300 font-bold text-lg">{selectedUser.profession || selectedUser.role}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                        <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 flex items-center gap-1 uppercase tracking-widest">
                           <MapPin size={12}/> {selectedUser.city}, {selectedUser.state}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Quick Contact Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</p>
                    <p className="font-bold text-slate-800 break-all text-sm">{selectedUser.email}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Phone Number</p>
                    <p className="font-bold text-slate-800 text-sm">{selectedUser.mobile || 'Not Linked'}</p>
                  </div>
                </div>

                {/* 3. Professional Experience */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-[0.2em]">
                    <Briefcase size={16}/> Work History
                  </div>
                  <div className="relative border-l-2 border-indigo-100 pl-8 space-y-2">
                    <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                    <h4 className="text-xl font-black text-slate-800">{selectedUser.currentCompanyName || "Open to Opportunities"}</h4>
                    <p className="text-indigo-600 font-black text-xs bg-indigo-50 px-2 py-1 rounded-md inline-block uppercase tracking-wider">
                      {selectedUser.jobDepartment} • {selectedUser.jobIndustry}
                    </p>
                    <p className="text-slate-400 text-[10px] font-black uppercase mt-1">
                      {selectedUser.jobFromDate} — {selectedUser.jobToDate || "Present"}
                    </p>
                    <div className="bg-slate-50 p-6 rounded-3xl text-slate-600 text-sm leading-relaxed border border-dashed border-slate-200 mt-4">
                      {selectedUser.jobDescription || "The candidate has not provided a specific job description for this role."}
                    </div>
                  </div>
                </div>

                {/* 4. Education Breakdown */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.2em]">
                    <GraduationCap size={18}/> Education
                  </div>
                  <div className="grid gap-4">
                    <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-black text-slate-800 text-lg">{selectedUser.graduationSpecialization}</h5>
                          <p className="text-slate-500 font-bold text-xs">{selectedUser.graduationUniversity}</p>
                        </div>
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-xl text-[10px] font-black">{selectedUser.graduationPercentage}%</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Class XII</p>
                        <p className="font-black text-slate-800 text-lg">{selectedUser.classXIIPercentage}%</p>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Class X</p>
                        <p className="font-black text-slate-800 text-lg">{selectedUser.classXPercentage}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Skills & Socials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">Top Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.skills && (Array.isArray(selectedUser.skills) ? selectedUser.skills : selectedUser.skills.split(',')).map((skill, i) => (
                        <span key={i} className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-xl text-[10px] font-black border border-purple-100 uppercase">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Portfolios</p>
                    <div className="flex flex-col gap-2">
                      {selectedUser.github && (
                        <a href={selectedUser.github} target="_blank" className="flex items-center justify-between p-3 bg-slate-100 rounded-xl text-slate-700 text-xs font-black hover:bg-slate-200 transition-all">
                          <span>GitHub</span> <ExternalLink size={14}/>
                        </a>
                      )}
                      {selectedUser.portfolio && (
                        <a href={selectedUser.portfolio} target="_blank" className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-black hover:bg-indigo-100 transition-all">
                          <span>Portfolio</span> <ExternalLink size={14}/>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* 6. Resume Action */}
                <div className="pt-6">
                  <a href={selectedUser.resumeUrl} target="_blank" className="flex items-center justify-between p-6 bg-indigo-600 rounded-[2rem] text-white hover:bg-indigo-700 transition-all group shadow-xl shadow-indigo-200/50">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-3 rounded-2xl group-hover:scale-110 transition-transform"><FileText size={24}/></div>
                      <div>
                        <p className="font-black text-lg">Download Resume</p>
                        <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Verify Credentials</p>
                      </div>
                    </div>
                    <ExternalLink size={20}/>
                  </a>
                </div>

                {/* Sticky Decision Bar */}
                <div className="fixed bottom-6 left-auto right-12 w-[calc(100%-4rem)] max-w-lg bg-white/80 backdrop-blur-xl p-4 rounded-[2.5rem] border border-slate-100 shadow-2xl flex gap-3 z-20">
                  <button onClick={() => handleStatusUpdate(selectedUser._id, 'Approved')} className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-200">
                    <CheckCircle size={18}/> APPROVE
                  </button>
                  <button onClick={() => handleStatusUpdate(selectedUser._id, 'Rejected')} className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-200">
                    <XCircle size={18}/> REJECT
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}