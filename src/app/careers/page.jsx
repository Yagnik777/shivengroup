"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  MapPin, Coffee, Laptop, Heart, 
  ArrowRight, Zap, Rocket, Loader2, Search, Briefcase, Clock, X, Building2, Globe, Users, Wallet, Filter, Calendar, BriefcaseBusiness, Tag, GraduationCap, UserCheck
} from 'lucide-react';

const CareersContent = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || 'All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [professionFilter, setProfessionFilter] = useState('All');
  const [educationFilter, setEducationFilter] = useState('All');
  const [designationFilter, setDesignationFilter] = useState('All');

  const [selectedJob, setSelectedJob] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true); // Loading start
      
      // ૧. મેઈન જોબ્સ ફેચ કરવી
      const res = await fetch('/api/jobs', { cache: 'no-store' });
      const data = await res.json();
      const jobList = data.data || data.jobs || data; 
      const rawJobs = Array.isArray(jobList) ? jobList : [];

      // --- NEW ADDITION: કેન્ડિડેટ જોબ્સ ફેચ કરવી (FIXED LOGIC) ---
      let rawCandJobs = [];
      try {
        const resCand = await fetch('/api/candidate-jobs', { cache: 'no-store' });
        const candData = await resCand.json();
        
        // જો API સીધો એરે આપે અથવા { data: [] } માં આપે, બંને કેસ હેન્ડલ કર્યા છે
        const finalCandData = Array.isArray(candData) ? candData : (candData.data || []);
        
        rawCandJobs = finalCandData.map(j => ({ 
          ...j, 
          isCandidate: true,
          // ખાતરી કરો કે ID પ્રોપર છે
          _id: j._id || j.id 
        }));
      } catch (e) { 
        console.error("Candidate jobs fetch error", e); 
      }

      // બંને જોબ્સ ભેગી કરવી
      const combinedJobs = [...rawJobs, ...rawCandJobs];

      const activeJobs = combinedJobs.filter(job => {
        if (!job.deadline) return true;
        try {
          const deadlineDate = new Date(job.deadline);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          // જો તારીખ વેલિડ ન હોય તો પણ જોબ બતાવો
          if (isNaN(deadlineDate.getTime())) return true;
          return deadlineDate >= today;
        } catch (e) { return true; }
      })
      .sort((a, b) => {
        const dateA = new Date(a.postedAt || a.createdAt || 0);
        const dateB = new Date(b.postedAt || b.createdAt || 0);
        return dateB - dateA; // નવી જોબ ઉપર આવશે
      });

      setJobs(activeJobs);

      const jobId = searchParams.get('jobId');
      if (jobId) {
        const targetJob = activeJobs.find(j => j._id === jobId || j.id === jobId);
        if (targetJob && session) setSelectedJob(targetJob);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyProfile = async (job) => {
    // જો કેન્ડિડેટ જોબ હોય તો API કોલ કરવાની જરૂર નથી, ડેટા અંદર જ છે
    if (job.isCandidate) {
      setCompanyDetails(job.companyDetails);
      return;
    }

    const targetId = job.recruiterId || job.companyId; 
    if (!targetId) { setCompanyDetails(null); return; }
    setLoadingCompany(true);
    try {
      const res = await fetch(`/api/recruiter/register?action=get-profile&id=${targetId}`);
      const result = await res.json();
      if (res.ok && result.data) setCompanyDetails(result.data);
    } catch (error) {
      console.error("Error fetching company details:", error);
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
    if (!selectedJob) return;
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJob._id,
          recruiterId: selectedJob.recruiterId || selectedJob.userId, 
          role: selectedJob.title,
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("🚀 Application Sent Successfully!");
        setSelectedJob(null);
      } else {
        alert(data.error || "તમારી પ્રોફાઇલ અધૂરી છે!");
        if (data.error?.includes("પ્રોફાઇલ અધૂરી")) router.push("/candidate/profile"); 
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  const handleViewDetails = (job) => {
    if (!session) {
      router.push("/login");
    } else {
      setSelectedJob(job);
    }
  };

  useEffect(() => { fetchJobs(); }, [session, searchParams]);
  useEffect(() => { if (selectedJob) fetchCompanyProfile(selectedJob); }, [selectedJob]);

  const filteredJobs = jobs.filter(job => {
    const titleMatch = job.title?.toLowerCase() || "";
    const locMatch = job.location?.toLowerCase() || "";
    const matchesSearch = titleMatch.includes(searchTerm.toLowerCase()) || locMatch.includes(searchTerm.toLowerCase());
    
    const matchesLocation = (locationFilter || '').toLowerCase() === 'all' || (job.location || '').toLowerCase().includes((locationFilter || '').toLowerCase());
    const matchesType = typeFilter === 'All' || job.jobType === typeFilter;
    const matchesExp = expFilter === 'All' || job.experienceLevel === expFilter;
    const matchesIndustry = industryFilter === 'All' || (job.industry || job.jobCategory) === industryFilter;
    const matchesProfession = professionFilter === 'All' || job.profession === professionFilter;
    const matchesEducation = educationFilter === 'All' || job.education === educationFilter;
    const matchesDesignation = designationFilter === 'All' || job.designation === designationFilter;
    
    return matchesSearch && matchesLocation && matchesType && matchesExp && matchesIndustry && matchesProfession && matchesEducation && matchesDesignation;
  });

  const perks = [
    { icon: <Laptop size={24} />, title: "Remote First", desc: "Work from anywhere in the world." },
    { icon: <Heart size={24} />, title: "Wellness First", desc: "Premium health cover & mental health days." },
    { icon: <Coffee size={24} />, title: "Learning Budget", desc: "$2,000 yearly for your upskilling." },
    { icon: <Rocket size={24} />, title: "Equity", desc: "Own a piece of the future of hiring." },
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <section className="relative pt-32 pb-32 px-6 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-sm font-bold mb-8 backdrop-blur-md">
            <Zap size={16} className="fill-indigo-400" /> <span>Join the Revolution</span>
          </motion.div>
          <motion.h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight">
            Design your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Own Destiny.</span>
          </motion.h1>
        </div>
      </section>

      <section className="py-12 px-6 max-w-7xl mx-auto -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {perks.map((perk, i) => (
            <motion.div key={i} whileHover={{ y: -8 }} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600">{perk.icon}</div>
              <h3 className="text-xl font-black text-slate-900 mb-2">{perk.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{perk.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl border border-slate-100 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="xl:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search title or skills..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800 focus:ring-2 ring-indigo-500/20" />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800 appearance-none">
                <option value="All">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Surat">Surat</option>
              </select>
            </div>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select onChange={(e) => setTypeFilter(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800 appearance-none">
                <option value="All">Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select onChange={(e) => setExpFilter(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800 appearance-none">
                <option value="All">Experience</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                <Tag size={16} className="text-indigo-500" />
                <select onChange={(e) => setIndustryFilter(e.target.value)} className="bg-transparent border-none outline-none font-bold text-xs text-slate-600 uppercase">
                   <option value="All">All Industries</option>
                   <option value="IT">IT & Software</option>
                   <option value="Healthcare">Healthcare</option>
                   <option value="Finance">Finance</option>
                   <option value="Education">Education</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                <BriefcaseBusiness size={16} className="text-indigo-500" />
                <select onChange={(e) => setProfessionFilter(e.target.value)} className="bg-transparent border-none outline-none font-bold text-xs text-slate-600 uppercase">
                   <option value="All">All Professions</option>
                   <option value="Developer">Developer</option>
                   <option value="Designer">Designer</option>
                   <option value="Manager">Manager</option>
                   <option value="Marketing">Marketing</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                <GraduationCap size={16} className="text-indigo-500" />
                <select onChange={(e) => setEducationFilter(e.target.value)} className="bg-transparent border-none outline-none font-bold text-xs text-slate-600 uppercase">
                   <option value="All">Any Education</option>
                   <option value="10th">10th Pass</option>
                   <option value="12th">12th Pass</option>
                   <option value="Diploma">Diploma / ITI</option>
                   <option value="Graduate">Graduate</option>
                   <option value="Post Graduate">Post Graduate</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                <UserCheck size={16} className="text-indigo-500" />
                <select onChange={(e) => setDesignationFilter(e.target.value)} className="bg-transparent border-none outline-none font-bold text-xs text-slate-600 uppercase">
                   <option value="All">All Designations</option>
                   <option value="Intern">Intern</option>
                   <option value="Junior">Junior</option>
                   <option value="Senior">Senior</option>
                   <option value="Lead">Lead</option>
                   <option value="Manager">Manager</option>
                </select>
              </div>
          </div>
        </div>
      </section>

      <section className="pb-24 px-6 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6">
            <AnimatePresence mode='popLayout'>
              {loading ? (
                <div className="flex flex-col items-center py-32 text-slate-400"><Loader2 className="animate-spin mb-4" size={48} /><p>Scanning Careers...</p></div>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <motion.div key={job._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    onClick={() => handleViewDetails(job)}
                  >
                    <div className="group bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 hover:border-indigo-600 hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
                      
                      {/* --- NEW ADDITION: CANDIDATE TAG --- */}
                      {job.isCandidate && (
                        <div className="absolute top-0 right-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-1.5 rounded-b-2xl text-[10px] font-black uppercase tracking-widest shadow-lg z-10">
                          Post by Candidate
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg">
                            {job.jobCategory || job.category || "General"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Clock size={12} className="inline mr-1"/> {job.jobType}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                        
                        {/* કેન્ડિડેટ જોબ માટે કંપનીનું નામ */}
                        {job.isCandidate && job.companyDetails?.companyName && (
                          <p className="text-indigo-500 font-bold text-sm mt-1">{job.companyDetails.companyName}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-6 text-slate-500 mt-4 text-sm font-bold uppercase">
                          <span className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-500" /> {job.location}</span>
                          <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-indigo-500" /> {job.experienceLevel || "Any Exp"}</span>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-3 bg-slate-950 text-white px-10 py-5 rounded-[1.5rem] font-black group-hover:bg-indigo-600 transition-all">
                        View Details <ArrowRight size={20} />
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

      <AnimatePresence>
        {selectedJob && session && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedJob(null)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white z-[101] shadow-2xl overflow-y-auto">
              <div className="sticky top-0 bg-white/80 backdrop-blur-md p-6 flex justify-between items-center border-b z-20">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Building2 size={24} /></div>
                    <div>
                    <h2 className="font-black text-slate-900 leading-none">Job Details</h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase mt-1">
                      {selectedJob.isCandidate ? (selectedJob.companyDetails?.companyName || "Candidate Listing") : (loadingCompany ? "Loading..." : (companyDetails?.companyName || "Verified Partner"))}
                    </p>
                    </div>
                </div>
                <button onClick={() => setSelectedJob(null)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
              </div>
              
              <div className="p-8 md:p-12 space-y-12">
                  <div>
                    <div className="flex gap-2 mb-4">
                      <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full">{selectedJob.jobType}</span>
                      <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-full">{selectedJob.experienceLevel}</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 leading-tight mb-6">{selectedJob.title}</h1>
                    <div className="flex flex-wrap gap-6 border-y border-slate-100 py-6">
                        <div className="flex items-center gap-2">
                          <MapPin size={18} className="text-indigo-500"/><span className="text-sm font-black text-slate-600 uppercase">{selectedJob.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wallet size={18} className="text-indigo-500"/><span className="text-sm font-black text-slate-600 uppercase">{selectedJob.salaryRange || "Competitive"}</span>
                        </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200/60">
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-4">About Company</h4>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-indigo-600">
                        {selectedJob.isCandidate ? (selectedJob.companyDetails?.companyName || "Candidate Listing") : (companyDetails?.companyName || "Tech Corp")}
                      </h3>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        {selectedJob.isCandidate ? (selectedJob.companyDetails?.description || "A new job opportunity shared by our community.") : (companyDetails?.description || "Leading tech innovators.")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Job Description</h4>
                    <div className="text-slate-600 leading-relaxed font-medium whitespace-pre-line bg-slate-50 p-6 rounded-2xl">{selectedJob.description}</div>
                  </div>

                  <div className="pt-8 border-t sticky bottom-0 bg-white pb-4">
                    <button onClick={handleApply} className="w-full bg-slate-950 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-indigo-600 transition-all">
                      Apply for this Position
                    </button>
                  </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CareersPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    }>
      <CareersContent />
    </Suspense>
  );
}