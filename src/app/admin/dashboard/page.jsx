"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {session?.user?.name}</p>
    </div>
  );
}
