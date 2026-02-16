"use client";
import React, { useState, useEffect } from 'react';
import RecruiterSidebar from '@/components/RecruiterSidebar';
import { Mail, ExternalLink, Loader2, Calendar, User, Briefcase, Phone, MapPin, X, CheckCircle, XCircle } from 'lucide-react';

export default function CandidateList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // મોડલ માટે

  const fetchCandidates = async () => {
    try {
      const res = await fetch('/api/applications'); 
      const data = await res.json();
      if (data.ok) setList(data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
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

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <RecruiterSidebar activePage="candidate" />
      
      <main className="flex-1 p-6 md:p-10 relative">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 mb-8">Applications Management</h1>

          <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
            {loading ? (
              <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
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
                          <p className="text-xs text-slate-400">{app.email}</p>
                        </div>
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

        {/* --- FULL DETAILS SLIDE-OVER (SIDE MODAL) --- */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-slate-900">Candidate Profile</h2>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">{selectedUser.name?.charAt(0)}</div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{selectedUser.name}</h3>
                    <p className="text-indigo-600 font-bold text-sm">{selectedUser.role}</p>
                  </div>
                </div>

                <div className="grid gap-4 text-sm font-medium">
                  <div className="flex items-center gap-3 text-slate-600"><Mail size={16}/> {selectedUser.email}</div>
                  <div className="flex items-center gap-3 text-slate-600"><Phone size={16}/> {selectedUser.mobile || 'N/A'}</div>
                  <div className="flex items-center gap-3 text-slate-600"><MapPin size={16}/> {selectedUser.city || 'Remote'}</div>
                  <div className="flex items-center gap-3 text-slate-600"><Calendar size={16}/> Applied on {new Date(selectedUser.appliedAt).toLocaleDateString()}</div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Documents</h4>
                  <a href={selectedUser.resumeUrl} target="_blank" className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                    <span className="font-bold text-slate-700">Resume / CV</span>
                    <ExternalLink size={16} className="text-indigo-600"/>
                  </a>
                </div>

                <div className="pt-10 flex gap-3">
                  <button 
                    onClick={() => handleStatusUpdate(selectedUser._id, 'Approved')}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100"
                  >
                    <CheckCircle size={16}/> APPROVE
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedUser._id, 'Rejected')}
                    className="flex-1 bg-rose-600 text-white py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-rose-700 shadow-lg shadow-rose-100"
                  >
                    <XCircle size={16}/> REJECT
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