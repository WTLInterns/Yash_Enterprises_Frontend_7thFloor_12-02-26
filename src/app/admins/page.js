'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Pencil, Trash2, Plus, Search, Eye, Shield, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { backendApi } from '@/services/api';

export default function AdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAdmins() {
      try {
        setLoading(true);
        const data = await backendApi.get('/employees?role=admin');
        if (!isMounted) return;

        const mapped = (data || []).map((e) => {
          const adminName = e.firstName
            ? `${e.firstName} ${e.lastName || ""}`.trim()
            : e.employeeId || e.userId || "-";

          return {
            id: e.id,
            adminName,
            name: adminName,
            adminId: e.employeeId || e.userId || "-",
            role: e.roleName || "Admin",
            email: e.email,
            phone: e.phone,
            department: e.department?.name || 'N/A',
            employeeVisibility: "All",
            reportsTo: e.reportingManagerName || "-",
            directReportees: 0,
            totalReportees: 0,
            status: e.status || 'active'
          };
        });

        setAdmins(mapped);
      } catch (err) {
        console.error('Failed to load admins', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAdmins();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAdmins = admins.filter(admin =>
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.adminId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await backendApi.delete(`/employees/${id}`);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to delete admin', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        activeTabKey: "admins"
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
                  if (tab === 'Admins') return;
                  const routes = {
                    'Employees': '/employees',
                    'Roles': '/roles',
                    'Designation': '/designation',
                    'Teams': '/teams'
                  };
                  router.push(routes[tab]);
                }}
                className={`pb-3 ${
                  tab === 'Admins'
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
            <h2 className="font-semibold text-gray-800">Admins ({admins.length})</h2>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  placeholder="Search admins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none w-64"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={() => router.push('/admins/add')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                <Shield size={16} /> Add Admin
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
                  <th className="p-3">Admin ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right pr-8">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      Loading admins...
                    </td>
                  </tr>
                )}
                {!loading && filteredAdmins.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      {searchTerm ? 'No admins found matching your search.' : 'No admins found.'}
                    </td>
                  </tr>
                )}
                {!loading && filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <input type="checkbox" />
                    </td>
                    <td className="p-3 text-gray-800 font-medium">{admin.adminId}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{admin.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{admin.email}</td>
                    <td className="p-3 text-gray-600">{admin.phone || 'N/A'}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {admin.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(admin.status)}`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => router.push(`/admins/${admin.id}`)}
                          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => router.push(`/admins/${admin.id}/edit`)}
                          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                          title="Delete"
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
                <option>50</option>
                <option>100</option>
              </select>
            </div>
            <div>
              {filteredAdmins.length > 0 ? `1–${filteredAdmins.length} of ${filteredAdmins.length}` : '0 of 0'}
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
