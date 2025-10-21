"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import UserProfile from "@/components/UserProfile";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");

      setUsers(users.filter((u) => u._id !== id));
      alert("User deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete user");
    }
  };

  // Open modal with user profile
  const openModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  if (loading) return <p className="p-6">Loading users...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registered Users</h1>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Full Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-gray-100">
              <td className="border p-2">
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() =>
                    openModal({
                      email: u.email,
                      fullName: u.name,
                      mobile: u.mobile || "",
                      dob: u.dob || "",
                      profession: u.profession || "",
                      position: u.position || "",
                      role: u.role || "",
                      experience: u.experience || "",
                      city: u.city || "",
                      reference: u.reference || "",
                      skills: u.skills || [],
                      linkedin: u.linkedin || "",
                      portfolio: u.portfolio || "",
                      resume: u.resume || null,
                    })
                  }
                >
                  {u.name}
                </button>
              </td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2 flex gap-2">
                <a
                  href={`/admin/users/${u._id}`}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </a>
                <button
                  onClick={() => deleteUser(u._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center p-4 text-gray-500">
                No users registered yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* User Profile Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 z-50 relative">
            <Dialog.Title className="text-xl font-bold mb-4">User Profile</Dialog.Title>
            {selectedUser && <UserProfile initialData={selectedUser} readOnly={true} />}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
