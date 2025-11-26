"use client";

import { useEffect, useState } from "react";
import useNotifications from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const { notifications, refresh } = useNotifications();
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // ✅ On mount: mark notifications read + check admin role
  useEffect(() => {
    const init = async () => {
      await fetch("/api/notifications", { method: "PATCH" });
      refresh();

      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data?.user?.role === "admin") setIsAdmin(true);
      } catch (err) {
        console.error("Error fetching admin session:", err);
      }
    };
    init();
  }, []);

  // ✅ Send Broadcast Notification to All Users
  const handleSend = async () => {
    if (!message.trim()) return alert("Please enter a message!");

    try {
      setSending(true);
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          broadcast: true, // 👈 always broadcast to all users
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send notification");

      alert("✅ Notification sent to all users!");
      setMessage("");
      refresh();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {/* ---------- Admin Broadcast Section ---------- */}
      {isAdmin && (
        <div className="mb-8 border-b pb-6">
          <h2 className="text-lg font-semibold mb-2">
            Send Notification to All Users
          </h2>

          <textarea
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your notification message..."
            className="border rounded w-full p-2 mb-3"
          />

          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Notification"}
          </button>
        </div>
      )}

      {/* ---------- Notifications List ---------- */}
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-4 border rounded-lg ${
                n.read ? "bg-gray-50" : "bg-blue-50"
              }`}
            >
              <h2 className="font-semibold">{n.title || "Notification"}</h2>
              <p>{n.message}</p>
              <span className="text-sm text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
