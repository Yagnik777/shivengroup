"use client";

import { useEffect, useState } from "react";

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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Candidates</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Mobile</th>
            <th className="border px-2 py-1">Profession</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(c => (
            <tr key={c._id}>
              <td className="border px-2 py-1">{c.fullName}</td>
              <td className="border px-2 py-1">{c.email}</td>
              <td className="border px-2 py-1">{c.mobile}</td>
              <td className="border px-2 py-1">{c.profession}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
