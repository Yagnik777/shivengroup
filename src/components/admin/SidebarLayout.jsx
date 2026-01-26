// src/components/admin/SidebarLayout.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function SidebarLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Users", href: "/admin/users" },
    { name: "Jobs", href: "/admin/jobs" },
    { name: "Applications", href: "/admin/applications" },
    { name: "Candidates", href: "/admin/candidates" },
    { name: "Notifications", href: "/admin/notifications" },
    { name: "Dropdown Manager", href: "/admin/dropdownManager" },
    { name: "Mail-manager", href: "/admin/mail-manager" },
    { name: "Excel-candidates", href: "/admin/excel-candidates" },
   
  ];

  const handleLogout = async () => {
    // Proper way to sign out
    await signOut({ redirect: false });
    // then navigate to login
    router.replace("/admin/login");
  };

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
        <button
          onClick={() => signOut({ redirect: true, callbackUrl: "/login", cookieName: "next-auth.admin-token" })}
          className="mt-6 px-3 py-2 bg-red-600 rounded w-full"
        >
          Logout
        </button>
                
      </aside>

      <main className="flex-1 p-6 bg-gray-100 overflow-auto h-screen">{children}</main>
    </div>
  );
}
