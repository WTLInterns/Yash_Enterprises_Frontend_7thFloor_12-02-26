"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { backendApi } from "@/services/api";

export default function CaseDetailModalPage() {
  const params = useParams();
  const router = useRouter();

  const customerId = params?.id;
  const caseId = params?.caseId;

  const [caseData, setCaseData] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("");

  useEffect(() => {
    if (!caseId) return;

    let isMounted = true;

    async function loadCase() {
      try {
        const data = await backendApi.get(`/cases/${caseId}`);
        if (!isMounted) return;
        setCaseData(data || null);
      } catch (err) {
        console.error("Failed to load case", err);
      }
    }

    async function loadDocuments() {
      try {
        const list = await backendApi.get(`/case-documents/case/${caseId}`);
        if (!isMounted) return;
        setDocs(list || []);
      } catch (err) {
        console.error("Failed to load documents", err);
      }
    }

    (async () => {
      setLoading(true);
      await Promise.all([loadCase(), loadDocuments()]);
      if (isMounted) setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [caseId]);

  function closeModal() {
    if (customerId) {
      router.push(`/customers/${customerId}`);
    } else {
      router.push("/customers");
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file || !caseId) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("caseId", String(caseId));
      formData.append("documentName", docType || file.name);
      formData.append("description", "");

      const res = await fetch("http://localhost:8080/api/case-documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Upload failed", text);
        return;
      }

      const uploaded = await res.json();
      setDocs((prev) => [...prev, uploaded]);
      setFile(null);
      setDocType("");
    } catch (err) {
      console.error("Failed to upload document", err);
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveDoc(id) {
    if (!id) return;
    try {
      await backendApi.delete(`/case-documents/${id}`);
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  }

  function handleViewDoc(id) {
    if (!id) return;
    window.open(`http://localhost:8080/api/case-documents/download/${id}`, "_blank");
  }

  const caseTitle = caseData?.title || caseData?.caseNumber || `Case #${caseId}`;

  return (
    <DashboardLayout
      header={{
        project: "Case Details",
        user: { name: "Admin User", role: "Administrator" },
        notifications: [],
      }}
    >
      <div className="fixed inset-0 z-40 bg-black/40" />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500">
                <Link href="/customers" className="text-indigo-600 hover:underline">
                  Customers
                </Link>{" "}
                {customerId && (
                  <>
                    {"/ "}
                    <Link
                      href={`/customers/${customerId}`}
                      className="text-indigo-600 hover:underline"
                    >
                      Customer
                    </Link>{" "}
                  </>
                )}
                {"/ Case"}
              </p>
              <h1 className="mt-1 text-xl font-semibold text-slate-900">{caseTitle}</h1>
              {caseData && (
                <p className="mt-1 text-xs text-slate-500">
                  Case No: {caseData.caseNumber || "-"} | Status: {caseData.status || "-"} | Priority:{" "}
                  {caseData.priority || "-"}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              X
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-base font-semibold text-slate-900">Documents</h2>
            <form onSubmit={handleUpload} className="flex items-center gap-3">
              <select
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="AGREEMENT">Agreement</option>
                <option value="ID_PROOF">ID Proof</option>
                <option value="INVOICE">Invoice</option>
                <option value="OTHER">Other</option>
              </select>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-xs"
              />
              <button
                type="submit"
                disabled={uploading || !file}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
              >
                {uploading ? "Uploading..." : "+ Upload Doc"}
              </button>
            </form>
          </div>

          <div className="mt-4">
            {loading ? (
              <p className="text-sm text-slate-500">Loading documents...</p>
            ) : docs.length === 0 ? (
              <p className="text-sm text-slate-500">
                No documents uploaded. Click "Upload Doc" to add a PDF.
              </p>
            ) : (
              <div className="space-y-3">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-5 w-5"
                        >
                          <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h8.5a2 2 0 001.414-.586l3.5-3.5A2 2 0 0018 13.5V4a2 2 0 00-2-2H4z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          {doc.documentName || "Document"}
                        </div>
                        <div className="text-xs font-medium text-slate-900">
                          {doc.fileName || "File"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleViewDoc(doc.id)}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                        title="View document"
                      >
                        View
                      </button>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
