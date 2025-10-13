"use client";

import { useEffect, useState } from "react";

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users from API
  const fetchCandidates = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();

      // Only keep registration fields
      const filtered = data.map(u => ({
        _id: u._id,
        fullName: u.fullName,
        email: u.email,
       
      }));

      setCandidates(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const deleteCandidate = async (id) => {
    if (!confirm("Are you sure you want to delete this candidate?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete candidate");
      setCandidates(candidates.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete candidate");
    }
  };

  if (loading) return <p className="p-6">Loading candidates...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registered Candidates</h1>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Full Name</th>
            <th className="border p-2">Email</th>
            
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(c => (
            <tr key={c._id} className="hover:bg-gray-100">
              <td className="border p-2">{c.fullName}</td>
              <td className="border p-2">{c.email}</td>
              
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => deleteCandidate(c._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {candidates.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No candidates registered yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
