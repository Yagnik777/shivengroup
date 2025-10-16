//shvengroup-frontend/src/app/admin/layout.jsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "admin") {
      router.replace("/admin/login"); // 👈 Only admin can access
    }
  }, [session, status, router]);

  
  return <>{children}</>;
}
