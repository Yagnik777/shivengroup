"use client";

import { useEffect, useState } from "react";
import MarkdownIt from "markdown-it";
import { useSession } from "next-auth/react";

const md = new MarkdownIt();

export default function JobsPage() {
  const { data: session } = useSession(); // logged-in user
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("All");
  const [experienceLevel, setExperienceLevel] = useState("All");
  const [app, setApp] = useState({
    pricing: "",
    timeRequired: "",
    additionalInfo: "",
  });
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch Jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (type !== "All") params.set("type", type);
      if (experienceLevel !== "All") params.set("experienceLevel", experienceLevel);

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
  }, [type, experienceLevel]);

  // Handle Apply
  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!session?.user?.email) {
      setMsg("You must be logged in to apply.");
      return;
    }

    setSubmitting(true);
    setMsg("Submitting...");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJob,
          email: session.user.email,
          name: session.user.name,
          ...app,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setMsg(json?.message || "Failed to save application");
        setSubmitting(false);
        return;
      }

      setMsg("Application submitted ✅");
      setApp({ pricing: "", timeRequired: "", additionalInfo: "" });
    } catch (err) {
      console.error(err);
      setMsg("Network error, please try again ❌");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedJobData = jobs.find((j) => j._id === selectedJob);

  return (
    <div className="min-h-screen bg-gray-100 py-8 w-full">
      <div className="max-w-[2000px] mx-auto px-6 flex flex-col gap-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 px-4">
          Job Board
        </h1>

        <div className="flex flex-col md:flex-row gap-6 bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-120px)]">
          {/* Left: Job List */}
          <div className="md:w-1/3 w-full border-r overflow-auto p-4 h-full">
            {loading ? (
              <p className="text-sm text-slate-500">Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p className="text-sm text-slate-500">No jobs found.</p>
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
                  <p className="text-xs text-slate-500 mt-1">
                    {job.type} • {job.location}
                  </p>
                  <p className="text-xs text-slate-400">{job.experienceLevel}</p>
                </div>
              ))
            )}
          </div>

          {/* Right: Filters + Details + Apply */}
          <div className="md:w-2/3 w-full flex flex-col p-6 overflow-auto gap-4">
            {/* Filters */}
            <div className="flex gap-4 mb-4 flex-wrap">
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

            {!selectedJob && (
              <div className="bg-white p-8 rounded-lg shadow flex-1 flex items-center justify-center">
                Please select a job from the list to view details.
              </div>
            )}

            {selectedJob && !selectedJobData && (
              <p className="text-red-500">Job not found.</p>
            )}

            {selectedJobData && (
              <div className="bg-white p-8 rounded-lg shadow flex-1 flex flex-col gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {selectedJobData.title}
                  </h1>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                      {selectedJobData.type}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-700 text-sm">
                      {selectedJobData.experienceLevel}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">{selectedJobData.location}</p>
                </div>

                <hr className="my-4" />

                <div
                  className="prose max-w-none flex-1 overflow-auto"
                  dangerouslySetInnerHTML={{
                    __html: md.render(selectedJobData.description || "No description provided."),
                  }}
                />

                <hr className="my-4" />

                {/* Apply Form */}
                <h3 className="text-xl font-semibold mb-2">Requirements</h3>
                <form onSubmit={handleApply} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pricing
                      </label>
                      <input
                        required
                        value={app.pricing}
                        onChange={(e) => setApp({ ...app, pricing: e.target.value })}
                        className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300 outline-none"
                        placeholder="Enter your pricing"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time Required
                      </label>
                      <input
                        required
                        value={app.timeRequired}
                        onChange={(e) => setApp({ ...app, timeRequired: e.target.value })}
                        className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300 outline-none"
                        placeholder="Enter time required"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Information
                    </label>
                    <textarea
                      required
                      value={app.additionalInfo}
                      onChange={(e) => setApp({ ...app, additionalInfo: e.target.value })}
                      className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300 outline-none"
                      rows="3"
                      placeholder="Explain why you're a good fit..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-lg mx-auto block ${
                      submitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {submitting ? "Submitting..." : "Apply Now"}
                  </button>

                  {msg && <p className="text-sm text-gray-600 text-center">{msg}</p>}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
