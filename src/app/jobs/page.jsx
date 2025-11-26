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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-[1600px] mx-auto px-4 flex flex-col gap-6">

        <h1 className="text-3xl font-extrabold text-gray-800 text-center md:text-left">Job Board</h1>

        <div className="flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow overflow-visible">

          {/* Job List */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r p-4 bg-gray-50 md:sticky md:top-0">
            {loading ? <p>Loading jobs...</p> :
              jobs.length === 0 ? <p>No jobs available.</p> :
              jobs.map(job => (
                <div key={job._id} onClick={() => setSelectedJob(job._id)}
                  className={`cursor-pointer p-4 mb-3 rounded-lg border transition-all duration-200 ${selectedJob === job._id ? "border-blue-500 bg-blue-50 shadow-lg" : "bg-white hover:shadow-md"}`}>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                  <p className="text-xs text-gray-500">{job.jobCategory} • {job.type} • {job.experienceLevel}</p>
                </div>
              ))}
          </div>

          {/* Right Section */}
          <div className="flex flex-col w-full md:w-2/3">

            {/* Mobile Filter Toggle */}
            <div className="flex md:hidden justify-end p-2">
              <button onClick={() => setShowFilters(!showFilters)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? "block" : "hidden"} md:block md:w-1/4 w-full p-4 border-t md:border-t-0 md:border-l bg-gray-50`}>
              <h3 className="font-semibold mb-2">Filters</h3>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border p-2 rounded w-full mb-2">
                <option value="All">All Categories</option>
                {categories.map((c, i) => <option key={i}>{c}</option>)}
              </select>
              <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)} className="border p-2 rounded w-full mb-2">
                <option value="All">All Job Types</option>
                {jobTypes.map((t, i) => <option key={i}>{t}</option>)}
              </select>
              <select value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)} className="border p-2 rounded w-full">
                <option value="All">All Experience Levels</option>
                {experienceLevels.map((e, i) => <option key={i}>{e}</option>)}
              </select>
            </div>

            {/* Job Details */}
            <div className="w-full md:w-3/4 p-6">
             {!selectedJobData ? (
               <div className="text-gray-600 text-center mt-20">
                 <p className="text-lg font-medium">Please select a job to see details.</p>
                 <p className="text-sm mt-2">
                   Before applying for a job, please go to your <span className="font-semibold">My Profile</span> page and complete your profile.
                 </p>
               </div>
                ) : (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{selectedJobData.title}</h2>
                  <p className="text-sm text-gray-600">{selectedJobData.company} • {selectedJobData.location}</p>
                  <p className="text-sm text-gray-500">{selectedJobData.jobCategory} • {selectedJobData.type} • {selectedJobData.experienceLevel}</p>

                  <div className="prose max-w-full mt-4" dangerouslySetInnerHTML={{ __html: md.render(selectedJobData.description || "") }} />

                  {selectedJobData.requirements && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                      <ul className="list-disc ml-6 space-y-1 text-gray-700">
                        {selectedJobData.requirements.split(",").map((req, i) => <li key={i}>{req.trim()}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Apply Section */}
                  {appliedJobs.includes(selectedJob) ? (
                    <p className="mt-6 text-green-600 font-semibold">✅ You have already applied for this job</p>
                  ) : !showForm ? (
                    <button onClick={handleApplyClick} className="bg-blue-600 text-white px-6 py-2 rounded mt-6 hover:bg-blue-700 transition w-full md:w-auto">
                      Apply Now
                    </button>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                      <input type="text" value={app.name} disabled className="border p-2 rounded w-full bg-gray-100" />
                      <input type="email" value={app.email} disabled className="border p-2 rounded w-full bg-gray-100" />
                      <input type="text" value={app.phone} placeholder="Mobile / Phone" onChange={(e) => setApp({...app, phone: e.target.value})} className="border p-2 rounded w-full" />
                      <input type="text" value={app.pricing} placeholder="Pricing" onChange={(e) => setApp({...app, pricing: e.target.value})} className="border p-2 rounded w-full" />
                      <input type="text" value={app.timeRequired} placeholder="Time Required" onChange={(e) => setApp({...app, timeRequired: e.target.value})} className="border p-2 rounded w-full" />
                      <textarea value={app.additionalInfo} placeholder="Why Should We Hire You/Additional Info" onChange={(e) => setApp({...app, additionalInfo: e.target.value})} className="border p-2 rounded w-full" />

                      <input type="text" value={selectedJobData.jobCategory} disabled className="border p-2 rounded w-full bg-gray-100" />
                      <input type="text" value={selectedJobData.type} disabled className="border p-2 rounded w-full bg-gray-100" />
                      <input type="text" value={selectedJobData.experienceLevel} disabled className="border p-2 rounded w-full bg-gray-100" />
                      <input type="url" placeholder="LinkedIn Profile URL" value={app.linkedIn} onChange={(e) => setApp({...app, linkedIn: e.target.value})} className="border p-2 rounded w-full" />
                      <input type="url" placeholder="Portfolio URL" value={app.portfolio} onChange={(e) => setApp({...app, portfolio: e.target.value})} className="border p-2 rounded w-full" />

                      <label className="block text-sm font-medium">Upload Resume (PDF/DOC)</label>
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="border p-2 rounded w-full" />
                      {app.resume && <p className="text-sm text-gray-600 mt-1">Selected File: {app.resume.name}</p>}

                      <button disabled={submitting} className="bg-blue-600 text-white px-6 py-2 rounded mt-2 hover:bg-blue-700 transition w-full md:w-auto">
                        {submitting ? "Submitting..." : "Submit Application"}
                      </button>
                      {msg && <p className="text-sm text-gray-600">{msg}</p>}
                    </form>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
