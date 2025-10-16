"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
export default function CandidatesAdmin() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch("/api/candidates");
        if (!res.ok) throw new Error("Failed to fetch candidates");
        const data = await res.json();
        setCandidates(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  if (loading) return <p>Loading candidates...</p>;

  return (
  <AdminLayout>   
    <div className="p-6 overflow-x-auto">
      <h1 className="text-xl font-bold mb-4">All Candidates</h1>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Mobile</th>
            <th className="border px-2 py-1">DOB</th>
            <th className="border px-2 py-1">Profession</th>
            <th className="border px-2 py-1">Position</th>
            <th className="border px-2 py-1">Role</th>
            <th className="border px-2 py-1">Experience</th>
            <th className="border px-2 py-1">City</th>
            <th className="border px-2 py-1">Reference</th>
            <th className="border px-2 py-1">LinkedIn</th>
            <th className="border px-2 py-1">Portfolio</th>
            <th className="border px-2 py-1">Skills</th>
            <th className="border px-2 py-1">Resume</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(c => (
            <tr key={c._id}>
              <td className="border px-2 py-1">{c.fullName}</td>
              <td className="border px-2 py-1">{c.email}</td>
              <td className="border px-2 py-1">{c.mobile}</td>
              <td className="border px-2 py-1">{c.dob}</td>
              <td className="border px-2 py-1">{c.profession}</td>
              <td className="border px-2 py-1">{c.position}</td>
              <td className="border px-2 py-1">{c.role}</td>
              <td className="border px-2 py-1">{c.experience}</td>
              <td className="border px-2 py-1">{c.city}</td>
              <td className="border px-2 py-1">{c.reference}</td>
              <td className="border px-2 py-1">
                <a href={c.linkedin} target="_blank" className="text-blue-600">View</a>
              </td>
              <td className="border px-2 py-1">
                <a href={c.portfolio} target="_blank" className="text-blue-600">View</a>
              </td>
              <td className="border px-2 py-1">
                {Array.isArray(c.skills) ? c.skills.join(", ") : ""}
              </td>
              <td className="border px-2 py-1">
                {c.resume ? (
                  <a href={c.resume} target="_blank" className="text-blue-600">Download</a>
                ) : "No Resume"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminLayout>
  );
}
