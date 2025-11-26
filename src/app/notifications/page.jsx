"use client";
import { useEffect } from "react";
import useNotifications from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const { notifications, refresh, loading } = useNotifications();

  // ✅ Mark all as read when page loads
  useEffect(() => {
    markAllAsRead();
  }, [refresh]);

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        credentials: "include",
      });

      if (res.status === 401) return; // user not authenticated
      await refresh();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        credentials: "include",
      });
      if (res.ok) refresh();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const groupByDate = (items) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const groups = { Today: [], Yesterday: [], Earlier: [] };

    items.forEach((n) => {
      const created = new Date(n.createdAt);
      if (
        created.getFullYear() === today.getFullYear() &&
        created.getMonth() === today.getMonth() &&
        created.getDate() === today.getDate()
      ) {
        groups.Today.push(n);
      } else if (
        created.getFullYear() === yesterday.getFullYear() &&
        created.getMonth() === yesterday.getMonth() &&
        created.getDate() === yesterday.getDate()
      ) {
        groups.Yesterday.push(n);
      } else {
        groups.Earlier.push(n);
      }
    });

    return groups;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 text-lg">Loading notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Notifications</h1>
        <p className="text-gray-500 text-lg">You have no notifications yet.</p>
      </div>
    );
  }

  const grouped = groupByDate(notifications);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        <div className="flex gap-3">
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Refresh
          </button>
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* GROUPED NOTIFICATIONS */}
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {Object.entries(grouped).map(([groupName, items]) =>
          items.length ? (
            <div key={groupName}>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">{groupName}</h2>
              <div className="space-y-3">
                {items.map((n) => (
                  <div
                    key={n._id}
                    className={`p-4 border rounded-lg shadow-sm transition hover:shadow-md ${
                      n.read ? "bg-white border-gray-200" : "bg-blue-50 border-blue-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">{n.title || "Notification"}</h3>
                      {!n.read && (
                        <button
                          onClick={() => handleMarkAsRead(n._id)}
                          className="text-xs text-blue-600 font-medium hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 mt-1">{n.message}</p>
                    <span className="text-xs text-gray-500 block mt-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
