"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Only check once on mount → tab switch safe
  useEffect(() => {
    let mounted = true;
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/admin/check");
        if (!mounted) return;
        const data = await res.json();
        if (!data.loggedIn) router.replace("/admin/login");
        else setIsLoggedIn(true);
      } catch {
        if (mounted) router.replace("/admin/login");
      }
    };
    checkAdmin();
    return () => { mounted = false; };
  }, []); // ✅ empty dependency array
  

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };


  if (!isLoggedIn) return null;

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Users", href: "/admin/users" },
    { name: "Jobs", href: "/admin/jobs" },
    { name: "Applications", href: "/admin/applications" },
    { name: "positions", href: "/admin/positions" },
    { name: "professions", href: "/admin/professions" },
    { name: "candidates", href: "/admin/candidates" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="bg-gray-800 text-white p-4 w-64">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`p-2 rounded hover:bg-gray-700 ${pathname === item.href ? "bg-gray-700 font-semibold" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-6 px-3 py-2 bg-red-600 rounded w-full">
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
