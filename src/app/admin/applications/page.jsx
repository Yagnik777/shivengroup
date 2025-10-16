// shvengroup-frontend/src/app/admin/applications/page.jsx
"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import UserProfile from "@/components/UserProfile";
import { Dialog } from "@headlessui/react";

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch all applications
  const fetchApps = async () => {
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
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

  // Open user profile modal
  const openModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Delete application safely
  const deleteApplication = async (id) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });

      // Safely parse JSON (in case response is empty)
      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) throw new Error(data.message || "Failed to delete");

      setApps((prev) => prev.filter((app) => app._id !== id));
      alert("Application deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error deleting application");
    }
  };

  if (loading) return <p className="p-6">Loading applications...</p>;

  return (
    <AdminLayout>
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
            {apps.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  No applications found.
                </td>
              </tr>
            )}
            {apps.map((a) => (
              <tr key={a._id} className="hover:bg-gray-50">
                <td className="border p-2">
                  {a.name ? (
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() =>
                        openModal({
                          email: a.email,
                          fullName: a.name,
                          mobile: a.mobile || "",
                          dob: a.dob || "",
                          profession: a.profession || "",
                          position: a.position || "",
                          role: a.role || "",
                          experience: a.experience || "",
                          city: a.city || "",
                          reference: a.reference || "",
                          skills: a.skills || [],
                          linkedin: a.linkedin || "",
                          portfolio: a.portfolio || "",
                          resume: a.resume || null,
                        })
                      }
                    >
                      {a.name}
                    </button>
                  ) : "N/A"}
                </td>
                <td className="border p-2">{a.email || "N/A"}</td>
                <td className="border p-2 text-sm">{a.jobId}</td>
                <td className="border p-2">{a.pricing || "N/A"}</td>
                <td className="border p-2">{a.timeRequired || "N/A"}</td>
                <td className="border p-2">{a.additionalInfo || "N/A"}</td>
                <td className="border p-2">{a.status || "Pending"}</td>
                <td className="border p-2 flex flex-col gap-1">
                  {a.email && (
                    <a
                      className="text-green-600 hover:underline text-sm"
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(a.email)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Send Mail
                    </a>
                  )}
                  <button
                    className="text-red-600 hover:underline text-sm mt-1"
                    onClick={() => deleteApplication(a._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
          {/* Modal Content */}
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
    </AdminLayout>
  );
}
