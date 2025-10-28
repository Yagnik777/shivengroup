"use client";
import { useEffect, useState } from "react";
import { Users, Briefcase, FileText, ClipboardList } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
    positions: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch Recent Activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/admin/activities");
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities);
        }
      } catch (err) {
        console.error("Error fetching activities:", err);
      } finally {
        setLoadingActivities(false);
      }
    };
    fetchActivities();
  }, []);

  const cards = [
    { title: "Total Users", value: stats.users, icon: <Users className="w-6 h-6 text-blue-600" /> },
    { title: "Total Jobs", value: stats.jobs, icon: <Briefcase className="w-6 h-6 text-green-600" /> },
    { title: "Applications", value: stats.applications, icon: <FileText className="w-6 h-6 text-purple-600" /> },
    
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome to the full admin panel 👋</p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="text-gray-500">Loading stats...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <h3 className="text-2xl font-semibold text-gray-800">{card.value}</h3>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">{card.icon}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
        {loadingActivities ? (
          <p className="text-gray-500">Loading recent activities...</p>
        ) : activities.length > 0 ? (
          <ul className="space-y-3 text-gray-600">
            {activities.slice(0, 5).map((a, i) => (
              <li key={i} className="border-b last:border-none pb-2">
                {a.message}{" "}
                <span className="text-xs text-gray-400">
                  ({new Date(a.createdAt).toLocaleString()})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent activities found.</p>
        )}
      </div>
    </div>
  );
}
