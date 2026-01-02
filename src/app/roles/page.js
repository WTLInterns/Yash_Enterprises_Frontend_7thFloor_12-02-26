'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { backendApi } from '@/services/api';

export default function RolesPage() {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadRoles() {
      try {
        setLoading(true);
        const data = await backendApi.get('/roles');
        if (!isMounted) return;
        setRoles(data || []);
      } catch (err) {
        console.error('Failed to load roles', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRoles();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await backendApi.delete(`/roles/${id}`);
      setRoles((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Failed to delete role', err);
    }
  };

  return (
     <DashboardLayout
                header={{
                    project: "Organization Management",
                    user: {
                        name: "Admin User",
                        role: "Administrator"
                    },
                    notifications: [],
                    tabs: [
                        { key: "employees", label: "Employees" },
                        { key: "admins", label: "Admins" },
                        { key: "roles", label: "Roles" },
                        { key: "designation", label: "Designation" },
                        { key: "teams", label: "Teams" },
                    ],
                    activeTabKey: "employees"
                }}
            >
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* Top Tabs */}
      <div className="flex gap-8 border-b mb-6 text-sm font-medium">
        {['Employees', 'Admins', 'Roles', 'Designation', 'Teams'].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => {
                if (tab === 'Roles') return;
                const routes = {
                  'Employees': '/employees',
                  'Admins': '/admins',
                  'Designation': '/designation',
                  'Teams': '/teams'
                };
                router.push(routes[tab]);
              }}
              className={`pb-3 ${
                tab === 'Roles'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h2 className="font-semibold text-gray-800">Roles (5)</h2>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                placeholder="Search Here..."
                className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none"
              />
            </div>

            {/* Add Button */}
           <button
  onClick={() => router.push('/roles/add')}
  className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
>
  <Plus size={16} /> Add
</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-y">
              <tr className="text-left text-gray-600">
                <th className="p-3 w-10">
                  <input type="checkbox" />
                </th>
                <th className="p-3">Role Name</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right pr-8">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Loading roles...
                  </td>
                </tr>
              )}
              {!loading && roles.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No roles found.
                  </td>
                </tr>
              )}
              {!loading && roles.map((role) => (
                <tr
                  key={role.id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3 text-gray-800">{role.name}</td>
                  <td className="p-3 text-gray-600">
                    {role.description}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-3">
                      <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex justify-end items-center gap-6 p-4 text-sm text-gray-600 border-t">
          <div>
            Rows per page:
            <select className="ml-2 border rounded px-2 py-1">
              <option>20</option>
            </select>
          </div>
          <div>
            {roles.length > 0 ? `1–${roles.length} of ${roles.length}` : '0 of 0'}
          </div>

          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400">
              ‹
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
