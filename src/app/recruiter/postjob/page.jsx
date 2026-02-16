"use client";
import React, { useState } from 'react';
import { ArrowLeft, Send, Info, Loader2, Briefcase, Calendar, MapPin, IndianRupee } from 'lucide-react';
import RecruiterSidebar from '@/components/RecruiterSidebar';
import { useRouter } from 'next/navigation';

export default function PostJobForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    jobType: 'Full-time',
    location: '',
    salaryRange: '',
    experienceLevel: 'Entry Level',
    description: '',
    requirements: '', // This will be sent as a string and converted to array in API
    deadline: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/recruiter/jobs/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("🚀 Job Published Successfully!");
        router.push("/recruiter/dashboard");
      } else {
        alert("❌ Error: " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 font-sans">
      <RecruiterSidebar activePage="postjob" />

      <main className="flex-1 p-4 sm:p-6 md:p-10 mt-16 lg:mt-0 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-6 hover:text-indigo-600 transition-all">
            <ArrowLeft size={18} /> Back
          </button>

          <div className="bg-white shadow-2xl shadow-indigo-100/30 rounded-[30px] border border-slate-100 overflow-hidden">
            <div className="bg-indigo-600 p-8 md:p-12 text-white">
              <h1 className="text-3xl font-black mb-2">Post a Job</h1>
              <p className="text-indigo-100 text-sm opacity-90">Fill in the details to find your next star hire.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-10">
              
              {/* Section 01: Basics */}
              <section className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">01</span>
                  Job Basics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Job Title</label>
                    <input type="text" name="title" required onChange={handleChange} value={formData.title}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                      placeholder="e.g. Senior React Developer" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Category</label>
                    <select name="category" required onChange={handleChange} value={formData.category}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold">
                      <option value="">Select Category</option>
                      <option value="IT">IT & Software</option>
                      <option value="Design">UI/UX Design</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Job Type</label>
                    <select name="jobType" onChange={handleChange} value={formData.jobType}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-semibold">
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Section 02: Requirements & Compensation */}
              <section className="pt-8 border-t border-slate-100 space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">02</span>
                  Details & Salary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Location</label>
                    <input type="text" name="location" required onChange={handleChange} value={formData.location}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-semibold" placeholder="e.g. Ahmedabad" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Salary Range</label>
                    <input type="text" name="salaryRange" required onChange={handleChange} value={formData.salaryRange}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-semibold" placeholder="e.g. ₹10L - ₹15L PA" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Experience Level</label>
                    <select name="experienceLevel" onChange={handleChange} value={formData.experienceLevel}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-semibold">
                      <option value="Entry Level">Entry Level (Fresher)</option>
                      <option value="Intermediate">Intermediate (2-5 Years)</option>
                      <option value="Senior">Senior (5+ Years)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Deadline</label>
                    <input type="date" name="deadline" required onChange={handleChange} value={formData.deadline}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-semibold" />
                  </div>
                </div>
              </section>

              {/* Section 03: Description */}
              <section className="pt-8 border-t border-slate-100 space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">03</span>
                  Role Description
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">About the Role</label>
                    <textarea name="description" rows="4" required onChange={handleChange} value={formData.description}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-medium text-sm" placeholder="Job duties..."></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Requirements (Skills)</label>
                    <textarea name="requirements" rows="3" required onChange={handleChange} value={formData.requirements}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-medium text-sm" placeholder="React, Node.js, MongoDB (separate with commas)"></textarea>
                  </div>
                </div>
              </section>

              <div className="pt-10 flex flex-col sm:flex-row gap-4">
                <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {loading ? <><Loader2 className="animate-spin" /> Publishing...</> : <><Send size={20} /> Publish Job</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}