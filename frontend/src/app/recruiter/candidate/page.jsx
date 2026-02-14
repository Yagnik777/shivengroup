"use client";
import React, { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Eye, Mail, Download, ArrowLeft, MoreHorizontal } from 'lucide-react';
import RecruiterSidebar from '@/components/RecruiterSidebar';

export default function CandidatesList() {
  const [searchTerm, setSearchTerm] = useState('');

  const candidates = [
    { id: 1, name: "Rahul Sharma", role: "Frontend Developer", experience: "3 Years", status: "Pending", email: "rahu@example.com" },
    { id: 2, name: "Priya Patel", role: "UI/UX Designer", experience: "2 Years", status: "Approved", email: "priy@example.com" },
    { id: 3, name: "Amit Verma", role: "Backend Engineer", experience: "5 Years", status: "Rejected", email: "amit@example.com" },
    { id: 4, name: "Sneha Reddy", role: "Frontend Developer", experience: "Fresher", status: "Pending", email: "sneh@example.com" },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 font-sans">
      
      {/* 1. Sidebar */}
      <RecruiterSidebar activePage="candidate" />

      {/* 2. Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 mt-16 lg:mt-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <div>
              <button className="flex items-center gap-2 text-slate-500 font-bold text-xs mb-3 hover:text-indigo-600 transition-all">
                <ArrowLeft size={14}/> Back to Dashboard
              </button>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Manage Candidates</h1>
              <p className="text-slate-500 font-medium text-sm">Review job applications</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <input 
                  type="text" 
                  placeholder="Search candidates..." 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all text-sm font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 shadow-sm transition-all active:scale-95">
                <Filter size={20}/>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-xl shadow-indigo-100/20 overflow-hidden">
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {candidates.map((person) => (
                    <tr key={person.id} className="group hover:bg-indigo-50/20 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            {person.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-none mb-1">{person.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium italic">{person.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-700 text-sm">{person.role}</td>
                      <td className="px-8 py-6 text-slate-500 font-semibold text-sm">{person.experience}</td>
                      <td className="px-8 py-6">
                        <StatusBadge status={person.status} />
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2">
                          <ActionButtons />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List View (Cards) */}
            <div className="md:hidden divide-y divide-slate-100">
              {candidates.map((person) => (
                <div key={person.id} className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        {person.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{person.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{person.role}</p>
                      </div>
                    </div>
                    <StatusBadge status={person.status} />
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Experience: {person.experience}</span>
                    <div className="flex gap-1">
                      <ActionButtons mobile />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State / Footer */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-70">
                End of list ({candidates.length} Applications)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper: Status Badge
function StatusBadge({ status }) {
  const styles = {
    Approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Rejected: 'bg-rose-50 text-rose-600 border-rose-100',
    Pending: 'bg-amber-50 text-amber-600 border-amber-100'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  );
}

// Helper: Action Buttons
function ActionButtons({ mobile = false }) {
  const btnClass = "p-2 rounded-xl transition-all border border-transparent";
  return (
    <div className="flex items-center gap-1">
      <button className={`${btnClass} text-slate-400 hover:text-indigo-600 hover:bg-indigo-50`}>
        <Eye size={mobile ? 16 : 18}/>
      </button>
      <button className={`${btnClass} text-slate-400 hover:text-blue-600 hover:bg-blue-50`}>
        <Download size={mobile ? 16 : 18}/>
      </button>
      <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
      <button className={`${btnClass} text-emerald-500 hover:bg-emerald-50`}>
        <CheckCircle size={mobile ? 18 : 20}/>
      </button>
      <button className={`${btnClass} text-rose-500 hover:bg-rose-50`}>
        <XCircle size={mobile ? 18 : 20}/>
      </button>
    </div>
  );
}