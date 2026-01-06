'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Pencil, Trash2, Plus, Search, Users, UserPlus, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { backendApi } from '@/services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTeams() {
      try {
        setLoading(true);
        const data = await backendApi.get('/teams');
        if (!isMounted) return;
        setTeams(data || []);
      } catch (err) {
        console.error('Failed to load teams', err);
        toast.error('Failed to load teams. Please try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTeams();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.teamLeadName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team?')) {
      return;
    }
    
    try {
      await backendApi.delete(`/teams/${id}`);
      setTeams((prev) => prev.filter((t) => t.id !== id));
      toast.success('Team deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err) {
      console.error('Failed to delete team', err);
      // Show user-friendly error message from backend
      const errorMessage = err.data?.message || err.message || 'Failed to delete team';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
          { key: "employees", label: "Employees", href: "/organization" },
          { key: "admins", label: "Admins", href: "/admins" },
          { key: "roles", label: "Roles", href: "/roles" },
          { key: "designation", label: "Designation", href: "/designation" },
          { key: "teams", label: "Teams", href: "/teams" },
        ],
        activeTabKey: "teams"
      }}
    >
      <div className="p-6 bg-[#f8fafc] min-h-screen">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border">
          {/* Header */}
          <div className="flex justify-between items-center p-4">
            <h2 className="font-semibold text-gray-800">Teams ({teams.length})</h2>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none w-64"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={() => router.push('/teams/add')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                <UserPlus size={16} /> Add Team
              </button>
              
              {/* View Hierarchy Button */}
              <button
                onClick={() => router.push('/teams/hierarchy')}
                className="flex items-center gap-2 border border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-purple-50"
              >
                <Eye size={16} /> View All Hierarchy
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
                  <th className="p-3">Team Name</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Team Lead</th>
                  <th className="p-3">Members</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right pr-8">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Loading teams...
                    </td>
                  </tr>
                )}
                {!loading && filteredTeams.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      {searchTerm ? 'No teams found matching your search.' : 'No teams found.'}
                    </td>
                  </tr>
                )}
                {!loading && filteredTeams.map((team) => (
                  <tr
                    key={team.id}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <input type="checkbox" />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users size={16} className="text-purple-600" />
                        </div>
                        <div className="font-medium text-gray-800">{team.name}</div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{team.description || 'No description'}</td>
                    <td className="p-3 text-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {team.teamLeadName?.split(' ').map(n => n[0]).join('') || 'TL'}
                          </span>
                        </div>
                        <span>{team.teamLeadName || 'No Team Lead'}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {team.memberCount || 0} members
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(team.status)}`}>
                        {team.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => router.push(`/teams/${team.id}/hierarchy`)}
                          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                          title="View Hierarchy"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => router.push(`/teams/${team.id}/edit`)}
                          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(team.id)}
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
              {filteredTeams.length > 0 ? `1–${filteredTeams.length} of ${filteredTeams.length}` : '0 of 0'}
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </DashboardLayout>
  );
}
