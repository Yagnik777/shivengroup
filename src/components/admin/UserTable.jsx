import Link from "next/link";

export default function UserTable() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Fresher" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Junior" }
  ];

  return (
    <table className="w-full bg-white rounded shadow overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Email</th>
          <th className="p-3 text-left">Role</th>
          <th className="p-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} className="border-b">
            <td className="p-3">{user.name}</td>
            <td className="p-3">{user.email}</td>
            <td className="p-3">{user.role}</td>
            <td className="p-3">
              <Link href={`/admin/users/${user.id}`} className="text-blue-600 hover:underline">Edit</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
