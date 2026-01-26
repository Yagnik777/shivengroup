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

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
//       <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-10">
//         {/* ✅ Header */}
//         <div className="mb-8 text-center">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
//             My Applications
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Track the status of all jobs you’ve applied for.
//           </p>
//         </div>

//         {/* ✅ Summary Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           <StatCard label="Total" value={summary.total} color="text-blue-600" />
//           <StatCard
//             label="Approved"
//             value={summary.approved}
//             color="text-green-600"
//           />
//           <StatCard
//             label="Pending"
//             value={summary.pending}
//             color="text-yellow-600"
//           />
//           <StatCard
//             label="Rejected"
//             value={summary.rejected}
//             color="text-red-600"
//           />
//         </div>

//         {/* ✅ Applications Table */}
//         {applications.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-3 py-3 text-left font-semibold text-gray-600">
//                     #
//                   </th>
//                   <th className="px-3 py-3 text-left font-semibold text-gray-600">
//                     Job Title
//                   </th>
//                   <th className="px-3 py-3 text-left font-semibold text-gray-600">
//                     Type
//                   </th>
//                   <th className="px-3 py-3 text-left font-semibold text-gray-600">
//                     Experience
//                   </th>
//                   <th className="px-3 py-3 text-left font-semibold text-gray-600">
//                     Status
//                   </th>
//                   <th className="px-3 py-3 text-left font-semibold text-gray-600">
//                     Applied On
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {applications.map((app, i) => (
//                   <tr
//                     key={app._id}
//                     className="border-t hover:bg-gray-50 transition duration-150"
//                   >
//                     <td className="px-3 py-3 text-gray-600">{i + 1}</td>
//                     <td className="px-3 py-3 font-medium text-gray-800">
//                       {app.job?.title || "N/A"}
//                     </td>
//                     <td className="px-3 py-3 text-gray-600">
//                       {app.job?.type || "N/A"}
//                     </td>
//                     <td className="px-3 py-3 text-gray-600">
//                       {app.job?.experienceLevel || "N/A"}
//                     </td>
//                     <td className="px-3 py-3">
//                       <StatusBadge status={app.status} />
//                     </td>
//                     <td className="px-3 py-3 text-gray-600">
//                       {new Date(app.createdAt).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-center text-gray-500 mt-10">
//             You haven’t applied for any jobs yet.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ✅ Reusable Components */
// function StatCard({ label, value, color }) {
//   return (
//     <div className="bg-gray-100 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition">
//       <p className="text-sm text-gray-600">{label}</p>
//       <p className={`text-xl md:text-2xl font-bold ${color}`}>{value}</p>
//     </div>
//   );
// }

// function StatusBadge({ status = "" }) {
//   const base = "px-3 py-1 text-xs font-semibold rounded-full";
//   const normalized = status.toLowerCase();

//   switch (normalized) {
//     case "approved":
//       return <span className={`${base} bg-green-100 text-green-700`}>Approved</span>;
//     case "rejected":
//       return <span className={`${base} bg-red-100 text-red-700`}>Rejected</span>;
//     case "pending":
//     default:
//       return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
//   }
// }
return (
  <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-10 font-sans">
    <div className="max-w-6xl mx-auto bg-white rounded-[32px] shadow-2xl shadow-indigo-100/50 p-6 sm:p-8 md:p-12 border border-slate-100">
      
      {/* ✅ Header */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Applications
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Track and manage the status of all your job applications in one place.
          </p>
        </div>
        <div className="hidden md:block">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
             User Dashboard
           </span>
        </div>
      </div>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Applied" value={summary.total} color="text-indigo-600" bgColor="bg-indigo-50" />
        <StatCard label="Approved" value={summary.approved} color="text-emerald-600" bgColor="bg-emerald-50" />
        <StatCard label="Pending" value={summary.pending} color="text-amber-600" bgColor="bg-amber-50" />
        <StatCard label="Rejected" value={summary.rejected} color="text-rose-600" bgColor="bg-rose-50" />
      </div>

      {/* ✅ Applications Table */}
      {applications.length > 0 ? (
        <div className="overflow-hidden border border-slate-100 rounded-[24px] shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applied On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applications.map((app, i) => (
                  <tr
                    key={app._id}
                    className="hover:bg-indigo-50/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-slate-400 font-medium">{i + 1}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-base">{app.job?.title || "N/A"}</p>
                      <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-tighter">JobConnect Verified</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-bold text-[11px]">
                        {app.job?.type || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-semibold italic">
                      {app.job?.experienceLevel || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
          <div className="text-5xl mb-4">📁</div>
          <p className="text-slate-800 text-xl font-bold">No applications found</p>
          <p className="text-slate-500 mt-1">Start applying for jobs to see them listed here.</p>
        </div>
      )}
    </div>
  </div>
);

/* ✅ Reusable Components with New Theme */
function StatCard({ label, value, color, bgColor }) {
  return (
    <div className={`${bgColor} rounded-3xl p-6 text-center transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-100/50`}>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-3xl md:text-4xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status = "" }) {
  const base = "px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-full shadow-sm";
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "approved":
      return <span className={`${base} bg-emerald-100 text-emerald-700 border border-emerald-200`}>Approved</span>;
    case "rejected":
      return <span className={`${base} bg-rose-100 text-rose-700 border border-rose-200`}>Rejected</span>;
    case "pending":
    default:
      return <span className={`${base} bg-amber-100 text-amber-700 border border-amber-200`}>Pending</span>;
  }
}
}