"use client";
import { useEffect, useState } from "react";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: "", company: "", location: "", type: "Full-time", experienceLevel: "Entry", description: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchJobs = async () => {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSubmit = async () => {
    if (editingId) {
      await fetch("/api/jobs", { method: "PUT", body: JSON.stringify({ id: editingId, ...form }) });
      setEditingId(null);
    } else {
      await fetch("/api/jobs", { method: "POST", body: JSON.stringify(form) });
    }
    setForm({ title: "", company: "", location: "", type: "Full-time", experienceLevel: "Entry", description: "" });
    fetchJobs();
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    setForm({ title: job.title, company: job.company, location: job.location, type: job.type, experienceLevel: job.experienceLevel, description: job.description });
  };

  const handleDelete = async (id) => {
    await fetch("/api/jobs", { method: "DELETE", body: JSON.stringify({ id }) });
    fetchJobs();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Job Management</h1>

      <div className="mb-6 space-y-3 p-4 bg-gray-50 rounded shadow">
        <input placeholder="Job Title" value={form.title} onChange={e => setForm({...form, title:e.target.value})} className="border p-2 w-full rounded" />
        <input placeholder="Company" value={form.company} onChange={e => setForm({...form, company:e.target.value})} className="border p-2 w-full rounded" />
        <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location:e.target.value})} className="border p-2 w-full rounded" />
        <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="border p-2 w-full rounded">
          <option>Full-time</option><option>Part-time</option><option>Freelance</option><option>Contract</option>
        </select>
        <select value={form.experienceLevel} onChange={e=>setForm({...form,experienceLevel:e.target.value})} className="border p-2 w-full rounded">
          <option>Entry</option><option>Mid</option><option>Senior</option>
        </select>
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="border p-2 w-full rounded" rows={4}/>
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {editingId ? "Update Job" : "Add Job"}
        </button>
      </div>

      <div className="space-y-3">
        {jobs.map(job => (
          <div key={job._id} className="flex justify-between p-3 border rounded bg-white shadow-sm">
            <div>
              <h2 className="font-semibold">{job.title}</h2>
              <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
            </div>
            <div className="space-x-2">
              <button onClick={()=>handleEdit(job)} className="text-yellow-500 hover:underline">Edit</button>
              <button onClick={()=>handleDelete(job._id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
