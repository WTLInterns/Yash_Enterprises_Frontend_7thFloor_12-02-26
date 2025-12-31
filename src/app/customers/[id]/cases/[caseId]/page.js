'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';

const documentTypes = ['Invoice', 'Agreement', 'KYC', 'Other'];

export default function CaseDetailPage() {
  const params = useParams();
  const customerId = params?.id;
  const caseId = params?.caseId;

  const [docs, setDocs] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [docType, setDocType] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== 'application/pdf') {
      alert('Please upload PDF files only.');
      return;
    }
    setFile(selected);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return;

    const newDoc = {
      id: `${Date.now()}`,
      name: file.name,
      type: docType || 'Document',
    };

    setDocs((prev) => [...prev, newDoc]);
    setDocType('');
    setFile(null);
    setIsUploadOpen(false);
  };

  const handleRemoveDoc = (id) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <DashboardLayout
      header={{
        project: 'Case Details',
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
              /{' '}
              <Link href={`/customers/${customerId}`} className="text-indigo-600 hover:underline">
                Customer
              </Link>{' '}
              / Case
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Case Files</h1>
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <span className="text-lg leading-none">+</span>
            <span>Upload Doc</span>
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Documents</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h8.586A2 2 0 0014 17.414L17.414 14A2 2 0 0018 12.586V4a2 2 0 00-2-2H4z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{doc.type}</p>
                    <p className="mt-1 truncate text-sm font-medium text-slate-900" title={doc.name}>
                      {doc.name}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="text-red-500 hover:text-red-600"
                    title="Remove document"
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

            {docs.length === 0 && (
              <p className="col-span-full text-sm text-slate-500">
                No documents uploaded. Click "Upload Doc" to add a PDF.
              </p>
            )}
          </div>
        </div>

        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Upload Document</h2>
                <button
                  onClick={() => {
                    setIsUploadOpen(false);
                    setDocType('');
                    setFile(null);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select type</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Document Upload (PDF)</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadOpen(false);
                      setDocType('');
                      setFile(null);
                    }}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    disabled={!file}
                  >
                    Upload
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
