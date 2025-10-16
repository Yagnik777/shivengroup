"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check", { cache: "no-store" });
        const data = await res.json();

        if (!active) return;

        if (data.loggedIn) {
          setIsLoggedIn(true);
        } else {
          router.replace("/admin/login"); // ✅ redirect if not logged in
        }
      } catch (err) {
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Checking session...
      </div>
    );
  }

  return isLoggedIn ? <>{children}</> : null;
}
