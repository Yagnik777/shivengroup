"use client";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="p-4 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to the full admin panel!</p>
      </div>
    </AdminLayout>
  );
}
