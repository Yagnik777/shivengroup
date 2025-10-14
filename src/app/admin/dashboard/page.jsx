// /app/admin/page.jsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || session?.user?.role !== "admin") {
      router.replace("/admin-login");
    }
  }, [status, session]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, Admin!</h1>
      <p className="mb-4">Email: {session.user.email}</p>
      <button
        onClick={() => signOut({ callbackUrl: "/admin-login" })}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
