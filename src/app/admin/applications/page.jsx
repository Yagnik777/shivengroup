"use client";

import { useEffect, useState } from "react";

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobFilter, setJobFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [filteredApps, setFilteredApps] = useState([]);

  // Fetch applications from backend
  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    let filtered = apps;
    if (statusFilter !== "All") filtered = filtered.filter(a => a.status.toLowerCase() === statusFilter.toLowerCase());
    if (jobFilter !== "All") filtered = filtered.filter(a => a.job?.title === jobFilter);
    if (categoryFilter !== "All") filtered = filtered.filter(a => a.job?.jobCategory === categoryFilter);
    setFilteredApps(filtered);
  }, [apps, statusFilter, jobFilter, categoryFilter]);

  const deleteApplication = async (id) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setApps((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Error deleting application");
    }
  };

  const updateApplication = async (id, status) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setApps((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
    } catch (err) {
      console.error(err);
      alert(err.message || "Error updating application");
    }
  };

  if (loading) return <p className="p-6">Loading applications...</p>;

  // Extract unique job titles and categories for filters
  const jobTitles = [...new Set(apps.map(a => a.job?.title).filter(Boolean))];
  const jobCategories = [...new Set(apps.map(a => a.job?.jobCategory).filter(Boolean))];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border p-2 rounded w-full md:w-48">
          <option value="All">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select value={jobFilter} onChange={e => setJobFilter(e.target.value)} className="border p-2 rounded w-full md:w-48">
          <option value="All">All Jobs</option>
          {jobTitles.map((title, i) => <option key={i} value={title}>{title}</option>)}
        </select>

        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border p-2 rounded w-full md:w-48">
          <option value="All">All Categories</option>
          {jobCategories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full table-auto border-collapse text-sm min-w-[1200px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Candidate</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Job Title</th>
              <th className="border p-2">Job Category</th>
              <th className="border p-2">Job Type</th>
              <th className="border p-2">Experience</th>
              <th className="border p-2">Pricing</th>
              <th className="border p-2">Time Required</th>
              <th className="border p-2">Additional Info</th>
              <th className="border p-2">LinkedIn</th>
              <th className="border p-2">Portfolio</th>
              <th className="border p-2">Resume</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan="15" className="text-center p-4 text-gray-500">
                  No applications found.
                </td>
              </tr>
            ) : (
              filteredApps.map((a) => (
                <tr key={a._id} className="hover:bg-gray-50">
                  <td className="border p-2">{a.name}</td>
                  <td className="border p-2">{a.email}</td>
                  <td className="border p-2">{a.phone}</td>
                  <td className="border p-2">{a.job?.title || "Unknown"}</td>
                  <td className="border p-2">{a.job?.jobCategory || "N/A"}</td>
                  <td className="border p-2">{a.job?.type || "N/A"}</td>
                  <td className="border p-2">{a.job?.experienceLevel || "N/A"}</td>
                  <td className="border p-2">{a.price}</td>
                  <td className="border p-2">{a.estimatedDays}</td>
                  <td className="border p-2">{a.coverLetter}</td>
                  <td className="border p-2"><a href={a.linkedIn} target="_blank" className="text-blue-600">View</a></td>
                  <td className="border p-2"><a href={a.portfolio} target="_blank" className="text-blue-600">View</a></td>
                  <td className="border p-2">
                    {a.attachments?.map((f) => (
                      <a key={f} href={`/uploads/${f}`} target="_blank" className="text-blue-600 underline mr-2">
                        View
                      </a>
                    ))}
                  </td>
                  <td className="border p-2">{a.status}</td>
                  <td className="border p-2 flex flex-col gap-1">
                    {a.status !== "approved" && (
                      <button
                        className="text-green-600 hover:underline"
                        onClick={() => updateApplication(a._id, "approved")}
                      >
                        Approve
                      </button>
                    )}
                    {a.status !== "rejected" && (
                      <button
                        className="text-yellow-600 hover:underline"
                        onClick={() => updateApplication(a._id, "rejected")}
                      >
                        Reject
                      </button>
                    )}
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => deleteApplication(a._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
