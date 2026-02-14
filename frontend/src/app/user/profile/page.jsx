// src/app/profile/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// lazy import so SSR not an issue (component is client-only)
const UserProfile = dynamic(() => import("@/components/UserProfile"), { ssr: false });

export default function ProfilePageWrapper() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      // adjust login path if yours is different
      router.replace("/admin/login"); // or "/admin-login" or "/api/auth/signin"
    }
  }, [status, router]);

  useEffect(() => {
    const load = async () => {
      if (status !== "authenticated") return;
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/candidates?email=${encodeURIComponent(session.user.email)}`);
        if (!res.ok) {
          setInitialData(null);
        } else {
          const data = await res.json();
          setInitialData(data);
        }
      } catch (err) {
        console.error("Failed to fetch candidate by email", err);
        setInitialData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status, session]);

  if (status === "loading" || loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div>
      {/* pass initialData prop to your UserProfile component (keeps its logic intact) */}
      <UserProfile initialData={initialData} />
    </div>
  );
}
