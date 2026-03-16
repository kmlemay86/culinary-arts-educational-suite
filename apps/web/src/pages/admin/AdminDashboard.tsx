import { useEffect, useState } from 'react';
import client from '../../api/client';
import type { PublicUser, UserRole } from '@culinary/shared';

export default function AdminDashboard() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/users').then(res => {
      setUsers(res.data.data);
      setLoading(false);
    });
  }, []);

  const changeRole = async (userId: string, role: UserRole) => {
    await client.put(`/users/${userId}/role`, { role });
    setUsers(us => us.map(u => u._id === userId ? { ...u, role } : u));
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Delete this user?')) return;
    await client.delete(`/users/${userId}`);
    setUsers(us => us.filter(u => u._id !== userId));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-culinary-brown">⚙️ Admin Dashboard</h1>
      <div>
        <h2 className="text-xl font-bold mb-4">User Management</h2>
        {loading ? <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"/></div> : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Joined</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{u.name}</td>
                    <td className="py-3 px-4 text-gray-500">{u.email}</td>
                    <td className="py-3 px-4">
                      <select value={u.role} onChange={e => changeRole(u._id, e.target.value as UserRole)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none">
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => deleteUser(u._id)} className="text-red-500 text-xs hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
