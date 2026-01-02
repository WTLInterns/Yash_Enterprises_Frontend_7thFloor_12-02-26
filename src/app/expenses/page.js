'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { backendApi } from '@/services/api';

export default function ExpenseOverviewPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'requests') {
      let isMounted = true;
      async function loadExpenses() {
        try {
          setLoading(true);
          const data = await backendApi.get('/expenses');
          if (!isMounted) return;
          setExpenses(data || []);
        } catch (err) {
          console.error('Failed to load expenses', err);
        } finally {
          if (isMounted) setLoading(false);
        }
      }
      loadExpenses();
      return () => { isMounted = false; };
    }
  }, [activeTab]);

  async function handleDelete(id) {
    try {
      await backendApi.delete(`/expenses/${id}`);
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Failed to delete expense', err);
    }
  }

  const summary = {
    totalPending: expenses.filter(e => e.status === 'PENDING').length,
    approved: expenses.filter(e => e.status === 'APPROVED').length,
    overduePending: expenses.filter(e => e.status === 'PENDING' && new Date(e.dueDate) < new Date()).length,
    overdueApproved: expenses.filter(e => e.status === 'APPROVED' && new Date(e.dueDate) < new Date()).length,
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-100 p-3">
        {/* Top Tabs */}
        <div className="flex gap-6 border-b bg-white px-4 py-3 text-sm font-medium">
          <span
            onClick={() => setActiveTab('overview')}
            className={`cursor-pointer ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600 pb-2'
                : 'text-slate-500'
            }`}
          >
            Expense Overview
          </span>
          <span
            onClick={() => setActiveTab('conveyance')}
            className={`cursor-pointer ${
              activeTab === 'conveyance' ? 'text-blue-600 border-b-2 border-blue-600 pb-2' : 'text-slate-500'
            }`}
          >
            Conveyance Overview
          </span>
          <span
            onClick={() => setActiveTab('requests')}
            className={`cursor-pointer ${
              activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600 pb-2' : 'text-slate-500'
            }`}
          >
            Expense Requests
          </span>
          <span
            onClick={() => setActiveTab('conveyance-requests')}
            className={`cursor-pointer ${
              activeTab === 'conveyance-requests' ? 'text-blue-600 border-b-2 border-blue-600 pb-2' : 'text-slate-500'
            }`}
          >
            Conveyance Requests
          </span>
          <span
            onClick={() => setActiveTab('advance')}
            className={`cursor-pointer ${
              activeTab === 'advance' ? 'text-blue-600 border-b-2 border-blue-600 pb-2' : 'text-slate-500'
            }`}
          >
            Advance Requests
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 my-3">
          {[
            { title: 'Total Pending Expenses', value: summary.totalPending, color: 'text-yellow-600' },
            { title: 'Approved Expenses', value: summary.approved, color: 'text-green-600' },
            { title: 'Overdue Pending Requests', value: summary.overduePending, color: 'text-red-600' },
            { title: 'Overdue Approved Requests', value: summary.overdueApproved, color: 'text-red-600' },
          ].map(({ title, value, color }) => (
            <div key={title} className="bg-white border rounded-md p-3 text-sm">
              <div className="font-medium">{title}</div>
              <div className="mt-2 text-lg font-semibold">
                {value} <span className={`${color} ml-1`}>-x%</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">0 (₹0) Yesterday</div>
            </div>
          ))}
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Expenses Overview */}
          <div className="bg-white border rounded-md">
            <div className="flex justify-between items-center px-3 py-2 border-b">
              <div className="font-medium text-sm">Expenses Overview</div>
              <div className="flex gap-2">
                <select className="border rounded px-2 py-1 text-sm">
                  <option>Expense Quantity</option>
                </select>
                <select className="border rounded px-2 py-1 text-sm">
                  <option>This Week</option>
                </select>
              </div>
            </div>
            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
              Nothing To Show
            </div>
          </div>

          {/* Right Empty Panel */}
          <div className="bg-white border rounded-md flex flex-col">
            <div className="flex justify-between items-center px-3 py-2 border-b">
              <input placeholder="Search Here..." className="border rounded px-2 py-1 text-sm w-48" />
              <div className="flex gap-2">
                <select className="border rounded px-2 py-1 text-sm">
                  <option>Top Expenses by Teams</option>
                </select>
                <select className="border rounded px-2 py-1 text-sm">
                  <option>This Week</option>
                </select>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Nothing To Show
            </div>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="bg-white border rounded-md mt-3">
          <div className="flex justify-between items-center px-3 py-2 border-b">
            <div className="font-medium text-sm">Pie Chart</div>
            <div className="flex gap-2">
              <select className="border rounded px-2 py-1 text-sm">
                <option>Expense Quantity</option>
              </select>
              <select className="border rounded px-2 py-1 text-sm">
                <option>This Week</option>
              </select>
            </div>
          </div>
          <div className="h-36 flex items-center justify-center text-slate-400 text-sm">
            Nothing to show.
          </div>
        </div>

        {/* Expenses Table Section */}
        {activeTab === 'requests' && (
          <div className="bg-white border rounded-md mt-3">
            <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b gap-2">
              <div className="font-medium text-sm">Expenses ({expenses.length})</div>
              <div className="flex flex-wrap gap-2 items-center">
                <input placeholder="Search Here..." className="border rounded px-2 py-1 text-sm" />
                <input value="22-12-2025 to 28-12-2025" readOnly className="border rounded px-2 py-1 text-sm text-blue-600" />
                <button className="border rounded p-1 text-blue-600">🔍</button>
                <button className="border rounded p-1 text-blue-600">📊</button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 px-3 py-2 text-sm">
              {['Employee', 'Category', 'Teams', 'Claim Status'].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input type="checkbox" defaultChecked={item === 'Employee'} />
                  {item}
                </label>
              ))}
            </div>

            {/* Table */}
            {loading ? (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Loading...</div>
            ) : expenses.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No expenses found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-3 text-left">Employee</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(e => (
                      <tr key={e.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{e.employeeName || '-'}</td>
                        <td className="p-3">{e.category || '-'}</td>
                        <td className="p-3">{e.amount || '-'}</td>
                        <td className="p-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            e.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                            e.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {e.status}
                          </span>
                        </td>
                        <td className="p-3">{e.expenseDate || '-'}</td>
                        <td className="p-3">
                          <div className="flex justify-end gap-2">
                            <button className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => handleDelete(e.id)} className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab !== 'requests' && (
          <div className="bg-white border rounded-md mt-3">
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              Nothing To Show
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
