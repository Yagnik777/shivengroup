//shivengroup-frontend/src/app/admin/positions/page.jsx
"use client";

import { useState, useEffect } from "react";

export default function AdminPositions() {
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState("");

  const fetchPositions = async () => {
    try {
      const res = await fetch("/api/options/positions");
      if (!res.ok) throw new Error("Failed to fetch positions");
      const data = await res.json();
      setPositions(data);
    } catch (err) {
      console.error(err);
      setPositions([]);
    }
  };

  useEffect(() => { fetchPositions(); }, []);

  const addPosition = async () => {
    if (!newPosition) return;
    await fetch("/api/options/positions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newPosition }),
    });
    setNewPosition("");
    fetchPositions();
  };

  const deletePosition = async (name) => {
    await fetch("/api/options/positions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    fetchPositions();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Positions</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={newPosition}
          onChange={(e) => setNewPosition(e.target.value)}
          placeholder="New Position"
          className="p-2 border rounded"
        />
        <button onClick={addPosition} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {positions.map(p => (
          <li key={p} className="flex justify-between bg-gray-100 p-2 rounded">
            {p}
            <button onClick={() => deletePosition(p)} className="text-red-600 hover:underline">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
