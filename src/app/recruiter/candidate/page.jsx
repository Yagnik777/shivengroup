"use client";
import React, { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Eye, Mail, Download, ArrowLeft } from 'lucide-react';
import RecruiterSidebar from '@/components/RecruiterSidebar';

export default function CandidatesList() {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy Candidates Data
  const candidates = [
    { id: 1, name: "Rahul Sharma", role: "Frontend Developer", experience: "3 Years", status: "Pending", email: "rahul@example.com" },
    { id: 2, name: "Priya Patel", role: "UI/UX Designer", experience: "2 Years", status: "Approved", email: "priya@example.com" },
    { id: 3, name: "Amit Verma", role: "Backend Engineer", experience: "5 Years", status: "Rejected", email: "amit@example.com" },
    { id: 4, name: "Sneha Reddy", role: "Frontend Developer", experience: "Fresher", status: "Pending", email: "sneha@example.com" },
  ];

  return (
    // આખા પેજને 'flex' આપ્યું છે જેથી Sidebar અને Content બાજુ-બાજુમાં ગોઠવાય
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* 1. Sidebar - ડાબી બાજુ ફિક્સ */}
      <RecruiterSidebar />

      {/* 2. Main Content Area - જમણી બાજુ */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <button className="flex items-center gap-2 text-slate-500 font-bold text-xs mb-2 hover:text-indigo-600 transition-all">
                <ArrowLeft size={14}/> Back to Dashboard
              </button>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Candidates</h1>
              <p className="text-slate-500 font-medium text-sm">Review and manage job applications</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <input 
                  type="text" 
                  placeholder="Search by name or role..." 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all text-sm font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
                <Filter size={20}/>
              </button>
            </div>
          </div>

          {/* Candidates Table/List */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-indigo-100/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate Information</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied Role</th>
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
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm">
                            {person.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{person.name}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 font-medium italic"><Mail size={12}/> {person.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-700 text-sm">{person.role}</td>
                      <td className="px-8 py-6 text-slate-500 font-semibold text-sm">{person.experience}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                          person.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          person.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {person.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2">
                          <button title="View Profile" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100">
                            <Eye size={18}/>
                          </button>
                          <button title="Download Resume" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">
                            <Download size={18}/>
                          </button>
                          <div className="w-[1px] h-6 bg-slate-100 mx-1"></div>
                          <button title="Approve" className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100">
                            <CheckCircle size={20}/>
                          </button>
                          <button title="Reject" className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100">
                            <XCircle size={20}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Footer Info */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest opacity-70">
                Total {candidates.length} Applications received so far
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}