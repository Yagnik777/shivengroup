"use client";
import { useEffect, useState } from "react";

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const res = await fetch("/api/apply"); // fetch all applications
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setApps(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  if (loading) return <p className="p-6">Loading applications...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Candidate</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Job ID</th>
            <th className="border p-2">Pricing</th>
            <th className="border p-2">Time Required</th>
            <th className="border p-2">Additional Info</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((a) => (
            <tr key={a._id} className="hover:bg-gray-50">
              <td className="border p-2">{a.name || "N/A"}</td>
              <td className="border p-2">{a.email || "N/A"}</td>
              <td className="border p-2 text-sm">{a.jobId}</td>
              <td className="border p-2">{a.pricing || "N/A"}</td>
              <td className="border p-2">{a.timeRequired || "N/A"}</td>
              <td className="border p-2">{a.additionalInfo || "N/A"}</td>
              <td className="border p-2">{a.status || "Pending"}</td>
              <td className="border p-2">
                <a
                  className="text-blue-600 hover:underline"
                  href={`/admin/applications/${a._id}`}
                >
                  View
                </a>
                {a.candidateId && (
                  <span className="ml-3 text-sm text-slate-600">
                    |{" "}
                    <a
                      className="text-blue-600 hover:underline"
                      href={`/admin/candidates/${a.candidateId}`}
                    >
                      Profile
                    </a>
                  </span>
                )}
              </td>
            </tr>
          ))}
          {apps.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-500">
                No applications found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
