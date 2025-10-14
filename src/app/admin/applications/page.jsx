"use client";
import { useEffect, useState } from "react";

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      setApps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchApps(); }, []);

  if (loading) return <p className="p-6">Loading applications...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Candidate</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Job ID</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apps.map(a => (
            <tr key={a._id} className="hover:bg-gray-50">
              <td className="border p-2">{a.name}</td>
              <td className="border p-2">{a.email}</td>
              <td className="border p-2 text-sm">{a.jobId}</td>
              <td className="border p-2">{a.status}</td>
              <td className="border p-2">
                <a className="text-blue-600 hover:underline" href={`/admin/applications/${a._id}`}>View</a>
                {a.candidateId && <span className="ml-3 text-sm text-slate-600">| <a href={`/admin/candidates/${a.candidateId}`}>Profile</a></span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
