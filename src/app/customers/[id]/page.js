'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';

const mockCustomers = [
  { id: '1', name: 'Satpute Sar' },
  { id: '2', name: 'Rushali Pawar' },
];

const initialCases = {
  '1': [
    { id: 'case-1', name: 'Case One' },
    { id: 'case-2', name: 'Case Two' },
  ],
  '2': [
    { id: 'case-1', name: 'Case One' },
  ],
};

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params?.id;

  const customer = useMemo(
    () => mockCustomers.find((c) => c.id === customerId) || { id: customerId, name: 'Customer' },
    [customerId]
  );

  const [cases, setCases] = useState(initialCases[customerId] || []);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [caseName, setCaseName] = useState('');

  const handleAddCase = (e) => {
    e.preventDefault();
    if (!caseName.trim()) return;
    const newCase = { id: `case-${cases.length + 1}`, name: caseName.trim() };
    setCases((prev) => [...prev, newCase]);
    setCaseName('');
    setIsCaseModalOpen(false);
  };

  const handleRemoveCase = (id) => {
    setCases((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <DashboardLayout
      header={{
        project: 'Customer Details',
        user: { name: 'Admin User', role: 'Administrator' },
        notifications: [],
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">
              <Link href="/customers" className="text-indigo-600 hover:underline">
                Customers
              </Link>{' '}
              / {customer.name}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">{customer.name}</h1>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Cases &amp; Files</h2>
            <button
              onClick={() => setIsCaseModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <span className="text-lg leading-none">+</span>
              <span>Create New Case</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {cases.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100"
              >
                <Link
                  href={`/customers/${customerId}/cases/${item.id}`}
                  className="flex flex-1 items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-yellow-400 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M2 6a2 2 0 012-2h3.5a2 2 0 011.6.8l1.3 1.733A1 1 0 0011.5 7H16a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">{item.name}</div>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-blue-500 hover:text-blue-600"
                    title="Edit case"
                    // Placeholder for future edit
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-8.5 8.5L5 15l-.707-2.793 8.5-8.5z" />
                      <path d="M4 17h12v2H4z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveCase(item.id)}
                    className="text-red-500 hover:text-red-600"
                    title="Remove case"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM8 8a1 1 0 012 0v7a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v7a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {cases.length === 0 && (
              <p className="col-span-full text-sm text-slate-500">
                No cases yet. Click "Create New Case" to add one.
              </p>
            )}
          </div>
        </div>

        {isCaseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Create New Case</h2>
                <button
                  onClick={() => setIsCaseModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddCase} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Case Name</label>
                  <input
                    type="text"
                    value={caseName}
                    onChange={(e) => setCaseName(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Enter case name"
                    required
                  />
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCaseModalOpen(false)}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Add Case
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
