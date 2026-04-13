import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";

function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  const banUser = async (userId: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.patch(
        `admin/ban-user/${userId}/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert(res.data.message);
      fetchUsers();
    } catch (err) {
      console.error("failed to ban user");
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("admin/users/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6">Users</h1>

      {users.map((u) => (
        <div
          key={u.id}
          className="bg-white p-4 mb-2 rounded shadow flex justify-between"
        >
          <div>
            <p className="font-semibold">{u.username}</p>
            <p className="text-sm text-gray-500">{u.email}</p>
          </div>

          {u.is_active ? (
            <button
              onClick={() => banUser(u.id)}
              className="text-red-500 text-sm px-2 py-1 border-red-500 rounded"
            >
              Ban
            </button>
          ) : (
            <button
              onClick={() => banUser(u.id)}
              className="text-green-600 text-sm px-2 py-1 border-green-600 rounded"
            >
              UnBan
            </button>
          )}
        </div>
      ))}
    </DashboardLayout>
  );
}

export default AdminUsers;
