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

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
//         <div className="flex gap-3">
//           <button
//             onClick={refresh}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             Refresh
//           </button>
//           <button
//             onClick={markAllAsRead}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//           >
//             Mark All as Read
//           </button>
//         </div>
//       </div>

//       {/* GROUPED NOTIFICATIONS */}
//       <div className="space-y-6 max-h-[70vh] overflow-y-auto">
//         {Object.entries(grouped).map(([groupName, items]) =>
//           items.length ? (
//             <div key={groupName}>
//               <h2 className="text-xl font-semibold text-gray-700 mb-3">{groupName}</h2>
//               <div className="space-y-3">
//                 {items.map((n) => (
//                   <div
//                     key={n._id}
//                     className={`p-4 border rounded-lg shadow-sm transition hover:shadow-md ${
//                       n.read ? "bg-white border-gray-200" : "bg-blue-50 border-blue-300"
//                     }`}
//                   >
//                     <div className="flex justify-between items-center">
//                       <h3 className="font-semibold text-gray-800">{n.title || "Notification"}</h3>
//                       {!n.read && (
//                         <button
//                           onClick={() => handleMarkAsRead(n._id)}
//                           className="text-xs text-blue-600 font-medium hover:underline"
//                         >
//                           Mark as read
//                         </button>
//                       )}
//                     </div>
//                     <p className="text-gray-700 mt-1">{n.message}</p>
//                     <span className="text-xs text-gray-500 block mt-2">
//                       {new Date(n.createdAt).toLocaleString()}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : null
//         )}
//       </div>
//     </div>
//   );
// }
return (
  <div className="max-w-3xl mx-auto p-6 font-sans py-12">
    {/* HEADER SECTION */}
    <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Stay updated with your job activities</p>
      </div>
      
      <div className="flex gap-3 w-full sm:w-auto">
        <button
          onClick={refresh}
          className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition shadow-sm active:scale-95"
        >
          🔄 Refresh
        </button>
        <button
          onClick={markAllAsRead}
          className="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 active:scale-95"
        >
          Check All
        </button>
      </div>
    </div>

    {/* NOTIFICATIONS LIST */}
    <div className="space-y-8 max-h-[75vh] pr-2 overflow-y-auto custom-scrollbar">
      {Object.entries(grouped).map(([groupName, items]) =>
        items.length ? (
          <div key={groupName} className="animate-in fade-in duration-500">
            {/* Group Title (Today, Yesterday, etc.) */}
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">
              {groupName}
            </h2>
            
            <div className="space-y-4">
              {items.map((n) => (
                <div
                  key={n._id}
                  className={`relative p-5 border rounded-[24px] transition-all duration-300 ${
                    n.read 
                    ? "bg-white border-slate-100 shadow-sm opacity-80" 
                    : "bg-white border-indigo-100 shadow-xl shadow-indigo-50 ring-1 ring-indigo-50"
                  }`}
                >
                  {/* Unread Indicator Dot */}
                  {!n.read && (
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                  )}

                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg leading-tight ${n.read ? "text-slate-700" : "text-indigo-900"}`}>
                        {n.title || "New Update"}
                      </h3>
                      <p className="text-slate-600 mt-1.5 leading-relaxed text-sm">
                        {n.message}
                      </p>
                    </div>

                    {!n.read && (
                      <button
                        onClick={() => handleMarkAsRead(n._id)}
                        className="text-[10px] uppercase tracking-wider bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-black hover:bg-indigo-600 hover:text-white transition-colors"
                      >
                        Read
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      • {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}

      {/* Empty State */}
      {Object.values(grouped).every(items => items.length === 0) && (
        <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
          <div className="text-5xl mb-4 text-slate-300">🔔</div>
          <p className="text-slate-800 text-lg font-bold">All clear!</p>
          <p className="text-slate-500 mt-1">No new notifications at the moment.</p>
        </div>
      )}
    </div>
  </div>
);
}