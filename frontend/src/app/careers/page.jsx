"use client";

import React, { useState, useEffect } from 'react';
import UserSidebar from '@/components/UserSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  MapPin, Coffee, Laptop, Heart, 
  ArrowRight, Zap, Rocket, Loader2, Search, Briefcase, Clock, X, Building2, Globe, Users, Wallet
} from 'lucide-react'; // ✅ 'lucide-center' ને બદલે 'lucide-react' કરી દીધું છે

const CareersPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);

  // ૧. જોબ્સ ફેચ કરવા માટે
  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs', { cache: 'no-store' });
      const data = await res.json();
      const jobList = data.data || data; 
      const activeJobs = Array.isArray(jobList) ? jobList : [];
      setJobs(activeJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // ૨. કંપની પ્રોફાઇલ ફેચ કરવા માટે
  const fetchCompanyProfile = async (job) => {
    const targetId = job.recruiterId || job.companyId; 
    
    if (!targetId) {
      setCompanyDetails(null);
      return;
    }

    setLoadingCompany(true);
    try {
      const res = await fetch(`/api/recruiter/register?action=get-profile&id=${targetId}`);
      const result = await res.json();
      
      if (res.ok && result.data) {
        setCompanyDetails(result.data);
      } else {
        setCompanyDetails(null);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      setCompanyDetails(null);
    } finally {
      setLoadingCompany(false);
    }
  };

  const handleApply = async () => {
    if (!session) {
      alert("⚠️ તમારે જોબ એપ્લાય કરવા માટે પહેલા લોગિન કરવું પડશે!");
      router.push("/login");
      return;
    }

    // Optional: Add a check to ensure a job is actually selected
    if (!selectedJob) return;

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Make sure these keys match exactly what your API expects
          jobId: selectedJob._id,
          recruiterId: selectedJob.recruiterId || selectedJob.userId, 
          role: selectedJob.title,
        })
      });
      
      const data = await res.json();

      if (res.ok) {
        alert("🚀 Application Sent Successfully!");
        setSelectedJob(null); // Close the side drawer
      } else {
        // This will show the "Profile Incomplete" message from your API
        alert(data.error || "તમારી પ્રોફાઇલ અધૂરી છે!");
        
        // Next Step: If profile is incomplete, redirect them to profile page
        if (data.error?.includes("પ્રોફાઇલ અધૂરી")) {
          router.push("/candidate/profile"); 
        }
      }
    } catch (error) {
      console.error("Error applying:", error);
      alert("Something went wrong! Please try again.");
    }
  };
  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchCompanyProfile(selectedJob);
    } else {
      setCompanyDetails(null);
    }
  }, [selectedJob]);

  const perks = [
    { icon: <Laptop size={24} />, title: "Remote First", desc: "Work from anywhere in the world." },
    { icon: <Heart size={24} />, title: "Wellness First", desc: "Premium health cover & mental health days." },
    { icon: <Coffee size={24} />, title: "Learning Budget", desc: "$2,000 yearly for your upskilling." },
    { icon: <Rocket size={24} />, title: "Equity", desc: "Own a piece of the future of hiring." },
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'All' || job.category === filter || job.jobCategory === filter;
    const matchesType = typeFilter === 'All' || job.jobType === typeFilter || job.type === typeFilter;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-6 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-sm font-bold mb-8 backdrop-blur-md">
            <Zap size={16} className="fill-indigo-400" /> <span>Join the Revolution</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight">
            Design your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Own Destiny.</span>
          </motion.h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed font-medium">We’re not just building products; we’re building a culture of excellence and empathy.</p>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, i) => (
            <motion.div key={i} whileHover={{ y: -8 }} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600">{perk.icon}</div>
              <h3 className="text-xl font-black text-slate-900 mb-2">{perk.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{perk.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Job Board Section */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 space-y-10">
            <div className="text-center md:text-left text-4xl font-black text-slate-900">Open Opportunities</div>
            
            <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100 space-y-4">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Search jobs by title or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[1.8rem] outline-none font-bold text-slate-800" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode='popLayout'>
              {loading ? (
                <div className="flex flex-col items-center py-32 text-slate-400"><Loader2 className="animate-spin mb-4" size={48} /><p>Scanning Careers...</p></div>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <motion.div key={job._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedJob(job)}>
                    <div className="group bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 hover:border-indigo-600 hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg">{job.category || job.jobCategory}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Clock size={12} className="inline mr-1"/> {job.jobType}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-6 text-slate-500 mt-4 text-sm font-bold uppercase">
                          <span className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-500" /> {job.location}</span>
                          {job.salaryRange && <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-indigo-500" /> {job.salaryRange}</span>}
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-3 bg-slate-950 text-white px-10 py-5 rounded-[1.5rem] font-black group-hover:bg-indigo-600 transition-all">
                        Apply Now <ArrowRight size={20} />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">No jobs found matching your search.</div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Side Drawer */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedJob(null)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white z-[101] shadow-2xl overflow-y-auto">
              
              <div className="sticky top-0 bg-white/80 backdrop-blur-md p-6 flex justify-between items-center border-b z-20">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Building2 size={24} /></div>
                   <div>
                    <h2 className="font-black text-slate-900 leading-none">Job Details</h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase mt-1">
                      {loadingCompany ? "Loading..." : (companyDetails?.companyName || "Verified Partner")}
                    </p>
                   </div>
                </div>
                <button onClick={() => setSelectedJob(null)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
              </div>

              <div className="p-8 md:p-12 space-y-12">
                <div>
                   <div className="flex gap-2 mb-4">
                     <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full">{selectedJob.jobType}</span>
                     {selectedJob.experienceLevel && <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-full">{selectedJob.experienceLevel}</span>}
                   </div>
                   <h1 className="text-4xl font-black text-slate-900 leading-tight mb-6">{selectedJob.title}</h1>
                   
                   <div className="flex flex-wrap gap-6 border-y border-slate-100 py-6">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-indigo-500"/>
                        <span className="text-sm font-black text-slate-600 uppercase">{selectedJob.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={18} className="text-indigo-500"/>
                        <span className="text-sm font-black text-slate-600 uppercase">{selectedJob.category}</span>
                      </div>
                      {selectedJob.salaryRange && (
                        <div className="flex items-center gap-2">
                          <Wallet size={18} className="text-indigo-500" />
                          <span className="text-sm font-black text-slate-600 uppercase">{selectedJob.salaryRange}</span>
                        </div>
                      )}
                   </div>
                </div>

                {/* ✅ Company Profile Card */}
                <div className="bg-slate-50 p-7 md:p-9 rounded-[2.5rem] border border-slate-200/60 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Company Profile</h4>
                    {!loadingCompany && companyDetails?.website && (
                      <a href={companyDetails.website} target="_blank" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-indigo-600 hover:scale-110 transition-transform">
                        <Globe size={18} />
                      </a>
                    )}
                  </div>

                  {loadingCompany ? (
                    <div className="flex items-center gap-3 text-indigo-600 font-bold py-4">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-xs uppercase tracking-widest">Loading Profile...</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-black text-indigo-600 leading-tight">
                          {companyDetails?.companyName || "Corporate Partner"}
                        </h3>
                        <div className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase rounded">
                          {companyDetails?.designation || companyDetails?.industry || "Tech & Innovation"}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/60 p-4 rounded-2xl border border-white shadow-sm">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Location</p>
                          <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                            <MapPin size={12} className="text-indigo-500" />
                            {companyDetails?.location || "Remote / Pan India"}
                          </div>
                        </div>
                        <div className="bg-white/60 p-4 rounded-2xl border border-white shadow-sm">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Recruiter</p>
                          <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                            <Users size={12} className="text-indigo-500" />
                            {companyDetails?.fullName || "HR Team"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-200/50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">About the Team</p>
                        <p className="text-slate-600 font-medium leading-relaxed text-sm">
                          {companyDetails?.description || "A forward-thinking organization focused on delivering high-impact solutions and building a culture of excellence."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                   <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">The Role</h4>
                   <div className="text-slate-600 leading-relaxed font-medium whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-100">
                     {selectedJob.description}
                   </div>
                </div>

                {selectedJob.skills && selectedJob.skills.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills.map((skill, index) => (
                        <span key={index} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-black rounded-xl uppercase shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-8 border-t border-slate-100 sticky bottom-0 bg-white pb-4">
                   <button 
                     onClick={handleApply} 
                     className="w-full bg-slate-950 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                   >
                     {!session && <Clock size={20} className="text-amber-400"/>}
                     {session ? "Apply for this Position" : "Login to Apply"}
                   </button>
                   {!session && (
                     <p className="text-center text-[10px] font-bold text-slate-400 uppercase mt-3 tracking-widest">
                       Sign in required to submit application
                     </p>
                   )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareersPage;