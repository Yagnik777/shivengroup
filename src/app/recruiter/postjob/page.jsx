"use client";
import React, { useState } from 'react';
import { ArrowLeft, Send, Info, Loader2 } from 'lucide-react';
import RecruiterSidebar from '@/components/RecruiterSidebar';

export default function PostJobForm() {
  const [formData, setFormData] = useState({
    title: '', category: '', jobType: 'Full-time',
    location: '', salaryRange: '', experienceLevel: '',
    description: '', requirements: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Job Data:", formData);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 font-sans">
      
      {/* 1. Sidebar */}
      <RecruiterSidebar />

      {/* 2. Main Content Area */}
      {/* mt-16 મોબાઈલ હેડર માટે અને p-4/md:p-10 રિસ્પોન્સિવ પેડિંગ માટે */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 mt-16 lg:mt-0 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          
          {/* Back Button */}
          <button className="flex items-center gap-2 text-slate-500 font-bold text-xs md:text-sm mb-6 hover:text-indigo-600 transition-all active:scale-95">
            <ArrowLeft size={18} /> Back to Dashboard
          </button>

          <div className="bg-white shadow-2xl shadow-indigo-100/30 rounded-[30px] md:rounded-[40px] border border-slate-100 overflow-hidden transition-all">
            
            {/* Header Section */}
            <div className="bg-indigo-600 p-6 md:p-12 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-2xl md:text-3xl font-black mb-2 leading-tight">Create a Job Post</h1>
                <p className="text-indigo-100 text-xs md:text-sm font-medium opacity-90">Find the perfect candidate for your team today.</p>
              </div>
              {/* Decorative Icon */}
              <div className="absolute -top-4 -right-4 md:top-0 md:right-0 p-8 opacity-10">
                <svg width="100" height="100" className="md:w-[120px] md:h-[120px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-8 md:space-y-10">
              
              {/* Section 01: Basic Info */}
              <section>
                <h3 className="flex items-center gap-2 text-base md:text-lg font-black text-slate-900 mb-6">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs md:text-sm shrink-0">01</span>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Job Title</label>
                    <input type="text" name="title" required onChange={handleChange}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-3.5 md:p-4 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold text-sm"
                      placeholder="e.g. Senior Frontend Engineer" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                    <select name="category" required onChange={handleChange} 
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-3.5 md:p-4 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-sm cursor-pointer appearance-none">
                      <option value="">Select Category</option>
                      <option value="IT">IT & Software</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Design">UI/UX Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Job Type</label>
                    <select name="jobType" required onChange={handleChange} 
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-3.5 md:p-4 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-sm cursor-pointer appearance-none">
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Section 02: Location */}
              <section className="pt-6 border-t border-slate-100">
                <h3 className="flex items-center gap-2 text-base md:text-lg font-black text-slate-900 mb-6">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs md:text-sm shrink-0">02</span>
                  Compensation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Location</label>
                    <input type="text" name="location" required onChange={handleChange} 
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-3.5 md:p-4 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-sm" 
                      placeholder="e.g. Ahmedabad" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Salary Range</label>
                    <input type="text" name="salaryRange" required onChange={handleChange} 
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-3.5 md:p-4 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-sm" 
                      placeholder="e.g. ₹50k - ₹80k" />
                  </div>
                </div>
              </section>

              {/* Section 03: Details */}
              <section className="pt-6 border-t border-slate-100">
                <h3 className="flex items-center gap-2 text-base md:text-lg font-black text-slate-900 mb-6">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs md:text-sm shrink-0">03</span>
                  Role Details
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Job Description</label>
                    <textarea name="description" rows="5" required onChange={handleChange} 
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700 text-sm" 
                      placeholder="Describe the role and responsibilities..."></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Key Requirements</label>
                    <textarea name="requirements" rows="3" required onChange={handleChange} 
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700 text-sm" 
                      placeholder="e.g. React, Node.js, 3+ years experience..."></textarea>
                    <p className="mt-2 text-[10px] text-slate-400 italic flex items-center gap-1"><Info size={12}/> Separate points with commas</p>
                  </div>
                </div>
              </section>

              {/* Form Actions */}
              <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                <button type="submit" disabled={loading} 
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-base md:text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70">
                  {loading ? <><Loader2 className="animate-spin" size={20}/> Publishing...</> : <><Send size={20}/> Publish Job</>}
                </button>
                <button type="button" className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm md:text-base hover:bg-slate-200 transition-all active:scale-95">
                  Save Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}