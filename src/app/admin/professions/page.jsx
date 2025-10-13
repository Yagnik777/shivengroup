//shvengroup-frontend/src/app/admin/professions/page.jsx
"use client";

import { useState, useEffect } from "react";

export default function AdminProfessions() {
  const [professions, setProfessions] = useState([]);
  const [newProfession, setNewProfession] = useState("");

  const fetchProfessions = async () => {
    const res = await fetch("/api/options/professions");
    const data = await res.json();
    setProfessions(data);
  };

  useEffect(() => { fetchProfessions(); }, []);

  const addProfession = async () => {
    if (!newProfession) return;
    await fetch("/api/options/professions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newProfession }),
    });
    setNewProfession("");
    fetchProfessions();
  };

  const deleteProfession = async (name) => {
    await fetch("/api/options/professions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    fetchProfessions();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Professions</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={newProfession}
          onChange={(e) => setNewProfession(e.target.value)}
          placeholder="New Profession"
          className="p-2 border rounded"
        />
        <button onClick={addProfession} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
      </div>

      <ul className="space-y-2">
        {professions.map(p => (
          <li key={p} className="flex justify-between bg-gray-100 p-2 rounded">
            {p}
            <button onClick={() => deleteProfession(p)} className="text-red-600 hover:underline">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
