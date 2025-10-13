// components/admin/AdminLayout.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Users", href: "/admin/users" },
    { name: "Professions", href: "/admin/professions" },
    { name: "Positions", href: "/admin/positions" },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside
        className={`bg-gray-800 text-white p-4 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          {!collapsed && <h2 className="text-2xl font-bold">Admin Panel</h2>}
          
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`p-2 rounded hover:bg-gray-700 transition-colors ${
                pathname === item.href ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
