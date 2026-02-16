"use client";

import { useEffect, useState } from "react";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    jobCategory: "",
    experienceLevel: "",
    type: "",
    description: "",
    requirements: "",
    published: false,
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // DROPDOWN STATE
  const [jobCategories, setJobCategories] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  // Fetch DROPDOWNS
  const fetchDropdowns = async () => {
    try {
      const res = await fetch("/api/dropdowns");
      const data = await res.json();

      const categories = data.filter(d => d.type === "jobCategory").map(x => x.value);
      const levels = data.filter(d => d.type === "experienceLevel").map(x => x.value);
      const types = data.filter(d => d.type === "jobType").map(x => x.value);

      setJobCategories(categories);
      setExperienceLevels(levels);
      setJobTypes(types);

      // Set defaults
      setForm(prev => ({
        ...prev,
        jobCategory: prev.jobCategory || categories[0] || "",
        experienceLevel: prev.experienceLevel || levels[0] || "",
        type: prev.type || types[0] || "",
      }));
    } catch (err) {
      console.error("Dropdown Error:", err);
    }
  };

  // Fetch JOBS
  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchDropdowns();
    fetchJobs();
  }, []);

  // HANDLE SUBMIT
  const handleSubmit = async () => {
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...form } : form;

      await fetch("/api/jobs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // Reset form
      setEditingId(null);
      setForm({
        title: "",
        company: "",
        location: "",
        jobCategory: jobCategories[0] || "",
        experienceLevel: experienceLevels[0] || "",
        type: jobTypes[0] || "",
        description: "",
        requirements: "",
        published: false,
      });
      setShowForm(false);

      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Error saving job");
    }
  };

  // HANDLE EDIT
  const handleEdit = (job) => {
    setEditingId(job._id);
    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      jobCategory: job.jobCategory || jobCategories[0] || "",
      experienceLevel: job.experienceLevel || experienceLevels[0] || "",
      type: job.type || jobTypes[0] || "",
      description: job.description || "",
      requirements: job.requirements || "",
      published: job.published || false,
    });
    setShowForm(true);
  };

  // HANDLE DELETE
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await fetch("/api/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Error deleting job");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Job Management</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {showForm ? "Hide Job Form" : "Add New Job"}
      </button>

      {showForm && (
        <div className="mb-6 space-y-3 p-4 bg-gray-50 rounded shadow">
          <input
            placeholder="Job Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 w-full rounded"
          />

          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="border p-2 w-full rounded"
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="border p-2 w-full rounded"
          />

          {/* JOB CATEGORY */}
          <select
            value={form.jobCategory}
            onChange={(e) => setForm({ ...form, jobCategory: e.target.value })}
            className="border p-2 w-full rounded"
          >
            <option value="" disabled>
              Select Job Category
            </option>
            {jobCategories.map((jc, i) => (
              <option key={i} value={jc}>
                {jc}
              </option>
            ))}
          </select>
          
          {/* EXPERIENCE LEVEL */}
          <select
            value={form.experienceLevel}
            onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
            className="border p-2 w-full rounded"
          >
            <option value="" disabled>
              Select Experience Level
            </option>
            {experienceLevels.map((lvl, i) => (
              <option key={i} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
          
          {/* JOB TYPE */}
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border p-2 w-full rounded"
          >
            <option value="" disabled>
              Select Job Type
            </option>
            {jobTypes.map((jt, i) => (
              <option key={i} value={jt}>
                {jt}
              </option>
            ))}
          </select>


          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 w-full rounded"
            rows={4}
          />

          <textarea
            placeholder="Requirements"
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            className="border p-2 w-full rounded"
            rows={2}
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            <span>Publish to user site</span>
          </label>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingId ? "Update Job" : "Add Job"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job._id} className="flex justify-between p-3 border rounded bg-white shadow-sm">
            <div>
              <h2 className="font-semibold">
                {job.title}{" "}
                {job.published && <span className="text-green-500 text-sm">(Published)</span>}
              </h2>
              <p className="text-sm text-gray-600">
                {job.company} • {job.location} • {job.jobCategory} • {job.experienceLevel} • {job.type}
              </p>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(job)} className="text-yellow-500 hover:underline">Edit</button>
              <button onClick={() => handleDelete(job._id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
