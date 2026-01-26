"use client";
import { useEffect, useState } from "react";

export default function AdminDropdownManager() {
  const [dropdowns, setDropdowns] = useState([]);
  const [type, setType] = useState("profession");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDropdowns = async () => {
    try {
      const res = await fetch("/api/dropdowns");
      const data = await res.json();
      setDropdowns(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const handleAdd = async () => {
    if (!value) return alert("Enter value");
    try {
      const res = await fetch("/api/dropdowns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, value }),
      });
      const data = await res.json();
      if (res.ok) {
        setDropdowns((prev) => [...prev, data]);
        setValue("");
      } else alert(data.error || "Error adding");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this value?")) return;
    try {
      await fetch(`/api/dropdowns/${id}`, { method: "DELETE" });
      setDropdowns((prev) => prev.filter((d) => d._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <p>Loading...</p>;

  const filtered = dropdowns.filter((d) => d.type === type);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Dropdowns</h1>

      <div className="flex gap-3 mb-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          {/* Existing Dropdowns */}
          <option value="profession">Profession</option>
          <option value="position">Position</option>
          <option value="role">Role</option>
          <option value="experience">Experience</option>
          <option value="city">City</option>
          <option value="reference">Reference</option>
          <option value="skills">Skills</option>

          {/* ✅ Newly Added Dropdowns */}
          <option value="jobCategory">Job Category</option>
          <option value="experienceLevel">Experience Level</option>
          <option value="jobType">Job Type</option>
        </select>

        <input
          type="text"
          placeholder="Add new value..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border p-2 rounded flex-1"
        />

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Value</th>
            <th className="border px-2 py-1 w-20">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((d) => (
            <tr key={d._id}>
              <td className="border px-2 py-1">{d.value}</td>
              <td className="border px-2 py-1 text-center">
                <button
                  onClick={() => handleDelete(d._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td className="border px-2 py-1 text-center" colSpan="2">
                No values added yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
