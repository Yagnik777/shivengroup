"use client";

import { useEffect, useState } from "react";
import MarkdownIt from "markdown-it";
import { useSession } from "next-auth/react";
import 'tailwindcss/tailwind.css';

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

export default function JobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [jobTypes, setJobTypes] = useState([]);
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Application
  const [showForm, setShowForm] = useState(false);
  const [app, setApp] = useState({
    name: "",
    email: "",
    phone: "",
    pricing: "",
    timeRequired: "",
    additionalInfo: "",
    linkedIn: "",
    portfolio: "",
    resume: null
  });
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    if (session?.user) {
      setApp((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        const publishedJobs = data.filter(j => j.published === true);

        setCategories([...new Set(publishedJobs.map(j => j.jobCategory))]);
        setJobTypes([...new Set(publishedJobs.map(j => j.type))]);
        setExperienceLevels([...new Set(publishedJobs.map(j => j.experienceLevel))]);

        let filtered = publishedJobs;
        if (categoryFilter !== "All") filtered = filtered.filter(j => j.jobCategory === categoryFilter);
        if (jobTypeFilter !== "All") filtered = filtered.filter(j => j.type === jobTypeFilter);
        if (experienceFilter !== "All") filtered = filtered.filter(j => j.experienceLevel === experienceFilter);

        setJobs(filtered);
      } catch (err) {
        console.error(err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [categoryFilter, jobTypeFilter, experienceFilter]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch("/api/applications");
        const data = await res.json();
        const myApps = data.filter(a => a.email === session.user.email);
        setAppliedJobs(myApps.map(a => a.job?._id?.toString() || a.job.toString()));
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };
    fetchApplications();
  }, [session]);

  const selectedJobData = jobs.find(j => j._id === selectedJob);

  const handleApplyClick = () => {
    if (!session?.user?.email) {
      setMsg("You must be logged in to apply.");
      return;
    }
    if (appliedJobs.includes(selectedJob)) {
      setMsg("You have already applied for this job ✅");
      return;
    }
    setShowForm(true);
    setMsg("");
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) setApp((prev) => ({ ...prev, resume: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return setMsg("Please select a job.");
    if (!app.resume) return setMsg("Please upload your resume.");

    setSubmitting(true);
    setMsg("Submitting...");

    const formData = new FormData();
    formData.append("jobId", selectedJob);
    formData.append("name", app.name);
    formData.append("email", app.email);
    formData.append("phone", app.phone);
    formData.append("pricing", app.pricing);
    formData.append("timeRequired", app.timeRequired);
    formData.append("additionalInfo", app.additionalInfo);
    formData.append("linkedIn", app.linkedIn);
    formData.append("portfolio", app.portfolio);
    formData.append("resume", app.resume);
    formData.append("jobCategory", selectedJobData.jobCategory);
    formData.append("jobType", selectedJobData.type);
    formData.append("experienceLevel", selectedJobData.experienceLevel);

    try {
      const res = await fetch("/api/applications", { method: "POST", body: formData });
      const result = await res.json();
      if (!res.ok) return setMsg(result.message || "Failed to apply.");

      setAppliedJobs(prev => [...prev, selectedJob]);
      setMsg("Application submitted ✅");

      setApp({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
        pricing: "",
        timeRequired: "",
        additionalInfo: "",
        linkedIn: "",
        portfolio: "",
        resume: null
      });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setMsg("Network error ❌");
    }
    setSubmitting(false);
  };

//   return (
//     <div className="min-h-screen bg-gray-100 py-8">
//       <div className="max-w-[1600px] mx-auto px-4 flex flex-col gap-6">

//         <h1 className="text-3xl font-extrabold text-gray-800 text-center md:text-left">Job Board</h1>

//         <div className="flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow overflow-visible">

//           {/* Job List */}
//           <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r p-4 bg-gray-50 md:sticky md:top-0">
//             {loading ? <p>Loading jobs...</p> :
//               jobs.length === 0 ? <p>No jobs available.</p> :
//               jobs.map(job => (
//                 <div key={job._id} onClick={() => setSelectedJob(job._id)}
//                   className={`cursor-pointer p-4 mb-3 rounded-lg border transition-all duration-200 ${selectedJob === job._id ? "border-blue-500 bg-blue-50 shadow-lg" : "bg-white hover:shadow-md"}`}>
//                   <h3 className="font-semibold text-lg">{job.title}</h3>
//                   <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
//                   <p className="text-xs text-gray-500">{job.jobCategory} • {job.type} • {job.experienceLevel}</p>
//                 </div>
//               ))}
//           </div>

//           {/* Right Section */}
//           <div className="flex flex-col w-full md:w-2/3">

//             {/* Mobile Filter Toggle */}
//             <div className="flex md:hidden justify-end p-2">
//               <button onClick={() => setShowFilters(!showFilters)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
//                 {showFilters ? "Hide Filters" : "Show Filters"}
//               </button>
//             </div>

//             {/* Filters */}
//             <div className={`${showFilters ? "block" : "hidden"} md:block md:w-1/4 w-full p-4 border-t md:border-t-0 md:border-l bg-gray-50`}>
//               <h3 className="font-semibold mb-2">Filters</h3>
//               <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border p-2 rounded w-full mb-2">
//                 <option value="All">All Categories</option>
//                 {categories.map((c, i) => <option key={i}>{c}</option>)}
//               </select>
//               <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)} className="border p-2 rounded w-full mb-2">
//                 <option value="All">All Job Types</option>
//                 {jobTypes.map((t, i) => <option key={i}>{t}</option>)}
//               </select>
//               <select value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)} className="border p-2 rounded w-full">
//                 <option value="All">All Experience Levels</option>
//                 {experienceLevels.map((e, i) => <option key={i}>{e}</option>)}
//               </select>
//             </div>

//             {/* Job Details */}
//             <div className="w-full md:w-3/4 p-6">
//              {!selectedJobData ? (
//                <div className="text-gray-600 text-center mt-20">
//                  <p className="text-lg font-medium">Please select a job to see details.</p>
//                  <p className="text-sm mt-2">
//                    Before applying for a job, please go to your <span className="font-semibold">My Profile</span> page and complete your profile.
//                  </p>
//                </div>
//                 ) : (
//                 <div className="space-y-4">
//                   <h2 className="text-2xl font-bold">{selectedJobData.title}</h2>
//                   <p className="text-sm text-gray-600">{selectedJobData.company} • {selectedJobData.location}</p>
//                   <p className="text-sm text-gray-500">{selectedJobData.jobCategory} • {selectedJobData.type} • {selectedJobData.experienceLevel}</p>

//                   <div className="prose max-w-full mt-4" dangerouslySetInnerHTML={{ __html: md.render(selectedJobData.description || "") }} />

//                   {selectedJobData.requirements && (
//                     <div className="mt-4">
//                       <h3 className="text-lg font-semibold mb-2">Requirements</h3>
//                       <ul className="list-disc ml-6 space-y-1 text-gray-700">
//                         {selectedJobData.requirements.split(",").map((req, i) => <li key={i}>{req.trim()}</li>)}
//                       </ul>
//                     </div>
//                   )}

//                   {/* Apply Section */}
//                   {appliedJobs.includes(selectedJob) ? (
//                     <p className="mt-6 text-green-600 font-semibold">✅ You have already applied for this job</p>
//                   ) : !showForm ? (
//                     <button onClick={handleApplyClick} className="bg-blue-600 text-white px-6 py-2 rounded mt-6 hover:bg-blue-700 transition w-full md:w-auto">
//                       Apply Now
//                     </button>
//                   ) : (
//                     <form onSubmit={handleSubmit} className="space-y-3 mt-4">
//                       <input type="text" value={app.name} disabled className="border p-2 rounded w-full bg-gray-100" />
//                       <input type="email" value={app.email} disabled className="border p-2 rounded w-full bg-gray-100" />
//                       <input type="text" value={app.phone} placeholder="Mobile / Phone" onChange={(e) => setApp({...app, phone: e.target.value})} className="border p-2 rounded w-full" />
//                       <input type="text" value={app.pricing} placeholder="Pricing" onChange={(e) => setApp({...app, pricing: e.target.value})} className="border p-2 rounded w-full" />
//                       <input type="text" value={app.timeRequired} placeholder="Time Required" onChange={(e) => setApp({...app, timeRequired: e.target.value})} className="border p-2 rounded w-full" />
//                       <textarea value={app.additionalInfo} placeholder="Why Should We Hire You/Additional Info" onChange={(e) => setApp({...app, additionalInfo: e.target.value})} className="border p-2 rounded w-full" />

//                       <input type="text" value={selectedJobData.jobCategory} disabled className="border p-2 rounded w-full bg-gray-100" />
//                       <input type="text" value={selectedJobData.type} disabled className="border p-2 rounded w-full bg-gray-100" />
//                       <input type="text" value={selectedJobData.experienceLevel} disabled className="border p-2 rounded w-full bg-gray-100" />
//                       <input type="url" placeholder="LinkedIn Profile URL" value={app.linkedIn} onChange={(e) => setApp({...app, linkedIn: e.target.value})} className="border p-2 rounded w-full" />
//                       <input type="url" placeholder="Portfolio URL" value={app.portfolio} onChange={(e) => setApp({...app, portfolio: e.target.value})} className="border p-2 rounded w-full" />

//                       <label className="block text-sm font-medium">Upload Resume (PDF/DOC)</label>
//                       <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="border p-2 rounded w-full" />
//                       {app.resume && <p className="text-sm text-gray-600 mt-1">Selected File: {app.resume.name}</p>}

//                       <button disabled={submitting} className="bg-blue-600 text-white px-6 py-2 rounded mt-2 hover:bg-blue-700 transition w-full md:w-auto">
//                         {submitting ? "Submitting..." : "Submit Application"}
//                       </button>
//                       {msg && <p className="text-sm text-gray-600">{msg}</p>}
//                     </form>
//                   )}
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
return (
  <div className="min-h-screen bg-slate-50 py-10 font-sans">
    <div className="max-w-[1600px] mx-auto px-4 flex flex-col gap-8">

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-extrabold text-slate-900 text-center md:text-left tracking-tight">
          Explore Opportunities
        </h1>
        {/* Mobile Filter Toggle */}
        <div className="flex md:hidden w-full">
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            {showFilters ? "✕ Close Filters" : "🔍 Show Filters"}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 bg-white rounded-[32px] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden min-h-[700px]">

        {/* --- LEFT SECTION: Job List --- */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50 overflow-y-auto max-h-screen md:sticky md:top-0 p-5">
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="flex justify-center p-10"><span className="animate-spin h-6 w-6 border-4 border-indigo-600 border-t-transparent rounded-full"></span></div>
            ) : jobs.length === 0 ? (
              <p className="text-center text-slate-500 py-10 font-medium">No jobs available right now.</p>
            ) : (
              jobs.map(job => (
                <div 
                  key={job._id} 
                  onClick={() => setSelectedJob(job._id)}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 group ${
                    selectedJob === job._id 
                    ? "border-indigo-600 bg-white shadow-xl shadow-indigo-100 ring-1 ring-indigo-600" 
                    : "bg-white border-transparent hover:border-indigo-200 hover:shadow-lg"
                  }`}
                >
                  <h3 className={`font-bold text-lg leading-tight transition-colors ${selectedJob === job._id ? "text-indigo-600" : "text-slate-800 group-hover:text-indigo-600"}`}>
                    {job.title}
                  </h3>
                  <div className="mt-2 flex flex-col gap-1">
                    <p className="text-sm font-semibold text-slate-600 flex items-center gap-1">
                      🏢 {job.company} • 📍 {job.location}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-md">{job.type}</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md">{job.experienceLevel}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- RIGHT SECTION: Filters & Details --- */}
        <div className="flex flex-col w-full md:w-2/3">
          
          {/* Filters Bar */}
          <div className={`${showFilters ? "block" : "hidden"} md:block w-full p-5 border-b border-slate-100 bg-white`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Category</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-700">
                  <option value="All">All Categories</option>
                  {categories.map((c, i) => <option key={i}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Job Type</label>
                <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-700">
                  <option value="All">All Job Types</option>
                  {jobTypes.map((t, i) => <option key={i}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Experience</label>
                <select value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-700">
                  <option value="All">All Experience</option>
                  {experienceLevels.map((e, i) => <option key={i}>{e}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Job Details Content */}
          <div className="w-full p-8 md:p-10 overflow-y-auto">
            {!selectedJobData ? (
              <div className="flex flex-col items-center justify-center text-center mt-20 p-6 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                <div className="text-5xl mb-4">💼</div>
                <p className="text-xl font-bold text-slate-800">Select a job to see details</p>
                <p className="text-slate-500 mt-2 max-w-sm">
                  Complete your <span className="text-indigo-600 font-bold underline">My Profile</span> page to increase your chances of being hired.
                </p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Job Header */}
                <div className="border-b border-slate-100 pb-8">
                  <h2 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">{selectedJobData.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium">
                    <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg text-sm">🏢 {selectedJobData.company}</span>
                    <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg text-sm">📍 {selectedJobData.location}</span>
                    <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold">✨ {selectedJobData.type}</span>
                  </div>
                </div>

                {/* Job Body */}
                <div className="prose prose-slate max-w-full text-slate-700 leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: md.render(selectedJobData.description || "") }} 
                />

                {selectedJobData.requirements && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="bg-indigo-600 w-2 h-6 rounded-full inline-block"></span> Requirements
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedJobData.requirements.split(",").map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                          <span className="text-indigo-600 mt-1">✔</span> {req.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Apply Section */}
                <div className="pt-8 border-t border-slate-100">
                  {appliedJobs.includes(selectedJob) ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-center gap-2 text-emerald-700 font-bold shadow-sm">
                      <span className="text-xl">✅</span> Application Submitted Successfully
                    </div>
                  ) : !showForm ? (
                    <button 
                      onClick={handleApplyClick} 
                      className="w-full md:w-auto bg-indigo-600 text-white px-12 py-4 rounded-2xl font-extrabold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      Apply for this Job
                    </button>
                  ) : (
                    <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-200 shadow-inner">
                      <h4 className="text-xl font-bold mb-6 text-slate-900">Application Form</h4>
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" value={app.name} disabled className="bg-slate-200/50 p-4 rounded-xl text-slate-500 font-semibold border border-slate-200" />
                          <input type="email" value={app.email} disabled className="bg-slate-200/50 p-4 rounded-xl text-slate-500 font-semibold border border-slate-200" />
                          <input type="text" placeholder="Mobile / Phone" onChange={(e) => setApp({...app, phone: e.target.value})} className="bg-white p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                          <input type="text" placeholder="Expected Pricing" onChange={(e) => setApp({...app, pricing: e.target.value})} className="bg-white p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        
                        <input type="text" placeholder="Time Required (e.g. 2 weeks)" onChange={(e) => setApp({...app, timeRequired: e.target.value})} className="w-full bg-white p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        
                        <textarea rows="4" placeholder="Why should we hire you?" onChange={(e) => setApp({...app, additionalInfo: e.target.value})} className="w-full bg-white p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="url" placeholder="LinkedIn Profile URL" onChange={(e) => setApp({...app, linkedIn: e.target.value})} className="bg-white p-4 rounded-xl border border-slate-200" />
                          <input type="url" placeholder="Portfolio URL" onChange={(e) => setApp({...app, portfolio: e.target.value})} className="bg-white p-4 rounded-xl border border-slate-200" />
                        </div>

                        <div className="p-6 bg-white rounded-2xl border-2 border-dashed border-indigo-200">
                          <label className="block text-sm font-bold text-slate-700 mb-2">Upload Resume (PDF/DOC)</label>
                          <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                          {app.resume && <p className="text-xs text-indigo-600 font-bold mt-2">📎 {app.resume.name}</p>}
                        </div>

                        <button disabled={submitting} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                          {submitting ? "Processing..." : "Submit Application"}
                        </button>
                        {msg && <p className="text-center text-sm font-bold text-indigo-600">{msg}</p>}
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
