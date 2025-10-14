"use client";

import { useState, useEffect } from "react";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("All");
  const [experienceLevel, setExperienceLevel] = useState("All");
  const [app, setApp] = useState({ fullName: "", email: "", phone: "", resumeUrl: "", coverLetter: "" });
  const [msg, setMsg] = useState("");

  // Fetch jobs from API
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (type) params.set("type", type);
      if (experienceLevel) params.set("experienceLevel", experienceLevel);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, experienceLevel]);

  // Handle Job Application
  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    setMsg("Submitting...");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: selectedJob, ...app }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setMsg("Application submitted ✅");
      setApp({ fullName: "", email: "", phone: "", resumeUrl: "", coverLetter: "" });
    } catch (err) {
      console.error(err);
      setMsg("Failed to submit");
    }
  };

  const selectedJobData = jobs.find((j) => j._id === selectedJob);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Job Board</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex">
          {/* Left side - Job List */}
          <div className="w-1/3 border-r h-[78vh] overflow-auto px-4 py-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">Job Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option>All</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Freelance</option>
                  <option>Contract</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">Experience</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option>All</option>
                  <option>Entry</option>
                  <option>Mid</option>
                  <option>Senior</option>
                </select>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Loading jobs...</p>
            ) : (
              jobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => setSelectedJob(job._id)}
                  className={`cursor-pointer p-4 rounded-lg mb-3 transition-shadow border ${
                    selectedJob === job._id
                      ? "border-blue-400 bg-gradient-to-r from-white to-slate-50 shadow-md"
                      : "bg-white/90 hover:shadow-md"
                  }`}
                >
                  <h3 className="font-semibold text-slate-900">{job.title}</h3>
                  <p className="text-xs text-slate-500 mt-2">{job.type} • {job.location}</p>
                  <p className="text-xs text-slate-400 mt-1">{job.experienceLevel}</p>
                </div>
              ))
            )}
            {!loading && jobs.length === 0 && <p className="text-sm text-slate-500">No jobs found.</p>}
          </div>

          {/* Right side - Job Details */}
          <div className="w-2/3 p-8 overflow-auto">
            {!selectedJob && (
              <div className="bg-white p-8 rounded-lg shadow">
                Please select a job from the list to view details.
              </div>
            )}

            {selectedJob && !selectedJobData && <p className="text-red-500">Job not found.</p>}

            {selectedJobData && (
              <div className="bg-white p-8 rounded-lg shadow">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{selectedJobData.title}</h1>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">{selectedJobData.type}</span>
                    <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-700 text-sm">{selectedJobData.experienceLevel}</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm">Salary Not specified</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">{selectedJobData.location}</p>
                </div>

                <hr className="my-6" />

                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: md.render(selectedJobData.description || "No description provided.") }} />

                <hr className="my-6" />

                <h3 className="text-lg font-semibold mb-3">Apply for this job</h3>
                <form onSubmit={handleApply} className="grid grid-cols-1 gap-3 max-w-xl">
                  <input required value={app.fullName} onChange={(e) => setApp({ ...app, fullName: e.target.value })} placeholder="Full name" className="w-full border rounded px-3 py-2" />
                  <input required value={app.email} onChange={(e) => setApp({ ...app, email: e.target.value })} placeholder="Email" type="email" className="w-full border rounded px-3 py-2" />
                  <input value={app.phone} onChange={(e) => setApp({ ...app, phone: e.target.value })} placeholder="Phone" className="w-full border rounded px-3 py-2" />
                  <input value={app.resumeUrl} onChange={(e) => setApp({ ...app, resumeUrl: e.target.value })} placeholder="Resume URL (optional)" className="w-full border rounded px-3 py-2" />
                  <textarea value={app.coverLetter} onChange={(e) => setApp({ ...app, coverLetter: e.target.value })} placeholder="Cover letter (optional)" className="w-full border rounded px-3 py-2" rows="5" />
                  <div className="flex items-center gap-3">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit Application</button>
                    <span className="text-sm text-slate-600">{msg}</span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
