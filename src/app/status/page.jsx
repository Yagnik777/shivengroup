"use client";

import { useEffect, useState } from "react";

export default function UserStatusPage() {
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/user/applications");
        const data = await res.json();

        if (!res.ok) {
          console.error("Error:", data.error || "Unknown error");
          setLoading(false);
          return;
        }

        setApplications(data.applications || []);
        setSummary({
          total: data.total || 0,
          approved: data.approved || 0,
          pending: data.pending || 0,
          rejected: data.rejected || 0,
        });
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 animate-pulse">
          Loading your applications...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-10">
        {/* ✅ Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            My Applications
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track the status of all jobs you’ve applied for.
          </p>
        </div>

        {/* ✅ Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total" value={summary.total} color="text-blue-600" />
          <StatCard
            label="Approved"
            value={summary.approved}
            color="text-green-600"
          />
          <StatCard
            label="Pending"
            value={summary.pending}
            color="text-yellow-600"
          />
          <StatCard
            label="Rejected"
            value={summary.rejected}
            color="text-red-600"
          />
        </div>

        {/* ✅ Applications Table */}
        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">
                    #
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">
                    Job Title
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">
                    Type
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">
                    Experience
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">
                    Applied On
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, i) => (
                  <tr
                    key={app._id}
                    className="border-t hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-3 py-3 text-gray-600">{i + 1}</td>
                    <td className="px-3 py-3 font-medium text-gray-800">
                      {app.job?.title || "N/A"}
                    </td>
                    <td className="px-3 py-3 text-gray-600">
                      {app.job?.type || "N/A"}
                    </td>
                    <td className="px-3 py-3 text-gray-600">
                      {app.job?.experienceLevel || "N/A"}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-3 py-3 text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            You haven’t applied for any jobs yet.
          </p>
        )}
      </div>
    </div>
  );
}

/* ✅ Reusable Components */
function StatCard({ label, value, color }) {
  return (
    <div className="bg-gray-100 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`text-xl md:text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status = "" }) {
  const base = "px-3 py-1 text-xs font-semibold rounded-full";
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "approved":
      return <span className={`${base} bg-green-100 text-green-700`}>Approved</span>;
    case "rejected":
      return <span className={`${base} bg-red-100 text-red-700`}>Rejected</span>;
    case "pending":
    default:
      return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
  }
}
