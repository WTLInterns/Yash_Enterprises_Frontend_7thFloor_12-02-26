'use client';

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { backendApi } from "@/services/api";

export default function FormsPage() {
  const [forms, setForms] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState("bulk");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSchema, setEditSchema] = useState("");
  const [editError, setEditError] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const headerCheckboxRef = useRef(null);

  /* -------------------- FILTERING -------------------- */

  const filteredForms = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return forms;
    return forms.filter(f =>
      [f.name, f.schema].some(v =>
        (v || "").toLowerCase().includes(term)
      )
    );
  }, [forms, search]);

  const totalPages = Math.max(1, Math.ceil(filteredForms.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredForms.slice(start, start + pageSize);
  }, [filteredForms, currentPage, pageSize]);

  const allSelectedVisible =
    pageItems.length > 0 &&
    pageItems.every(f => selectedIds.includes(f.id));

  const someSelected =
    selectedIds.length > 0 &&
    pageItems.some(f => selectedIds.includes(f.id)) &&
    !allSelectedVisible;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  /* -------------------- SELECTION -------------------- */

  const handleToggleRow = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    const ids = pageItems.map(f => f.id);
    if (allSelectedVisible) {
      setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...ids])));
    }
  };

  /* -------------------- CRUD -------------------- */

  const openDeleteModal = (mode, id = null) => {
    setDeleteMode(mode);
    setPendingDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPendingDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      if (deleteMode === "single" && pendingDeleteId) {
        await backendApi.delete(`/forms/${pendingDeleteId}`);
        setForms(prev => prev.filter(f => f.id !== pendingDeleteId));
      } else {
        await backendApi.post("/forms/bulk-delete", selectedIds);
        setForms(prev => prev.filter(f => !selectedIds.includes(f.id)));
        setSelectedIds([]);
      }
      closeDeleteModal();
    } catch {
      alert("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = async (id) => {
    const dto = await backendApi.get(`/forms/${id}`);
    setEditingForm(dto);
    setEditName(dto.name);
    setEditSchema(dto.schema);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) return setEditError("Name required");
    setIsSavingEdit(true);
    try {
      const updated = await backendApi.put(`/forms/${editingForm.id}`, {
        ...editingForm,
        name: editName,
        schema: editSchema,
      });
      setForms(prev =>
        prev.map(f => f.id === updated.id ? updated : f)
      );
      setIsEditModalOpen(false);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleAddForm = async () => {
    const created = await backendApi.post("/forms", {
      name: "New Form",
      schema: "{}",
      isActive: true,
    });
    setForms(prev => [created, ...prev]);
  };

  useEffect(() => {
    backendApi.get("/forms").then(setForms);
  }, []);

  /* -------------------- UI -------------------- */

  return (
    <DashboardLayout>
      <div className="p-6 bg-slate-50 min-h-screen">

        {/* MAIN CARD */}
        <motion.div
          className="bg-white rounded-xl border border-slate-200 shadow-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >

          {/* CONTROLS */}
          <div className="p-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search here..."
                className="h-9 w-56 rounded-md border px-3 text-sm
                           focus:ring-1 focus:ring-blue-500"
              />
              <button className="h-9 w-9 rounded-md border flex items-center justify-center hover:bg-slate-100">
                🔍
              </button>
            </div>

            <button
              onClick={handleAddForm}
              className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Add
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      ref={headerCheckboxRef}
                      type="checkbox"
                      checked={allSelectedVisible}
                      onChange={handleToggleAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">Form Title</th>
                  <th className="px-4 py-3 text-left">Form Description</th>
                  <th className="px-4 py-3 text-left">Last Modified</th>
                  <th className="px-4 py-3 text-left">Created At</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {pageItems.map(form => (
                  <tr
                    key={form.id}
                    className={`border-t ${
                      selectedIds.includes(form.id)
                        ? "bg-blue-50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(form.id)}
                        onChange={() => handleToggleRow(form.id)}
                      />
                    </td>
                    <td className="px-4 py-3">{form.name}</td>
                    <td className="px-4 py-3 truncate max-w-xs">{form.schema}</td>
                    <td className="px-4 py-3">-</td>
                    <td className="px-4 py-3">-</td>
                    <td className="px-4 py-3 flex justify-center gap-3">
                      <button onClick={() => openEditModal(form.id)}>✏️</button>
                      <button onClick={() => openDeleteModal("single", form.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center px-4 py-3 border-t text-sm">
            <div>
              Rows per page:
              <select
                className="ml-2 border rounded"
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>◀</button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>▶</button>
            </div>
          </div>
        </motion.div>

        {/* BULK DELETE FLOAT */}
        {selectedIds.length > 0 && (
          <button
            onClick={() => openDeleteModal("bulk")}
            className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg"
          >
            🗑️ Delete ({selectedIds.length})
          </button>
        )}

        {/* DELETE MODAL */}
        <AnimatePresence>
          {isDeleteModalOpen && (
            <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-white rounded-xl p-5 w-80">
                <p className="mb-4 text-sm">
                  Are you sure you want to delete?
                </p>
                <div className="flex justify-end gap-2">
                  <button onClick={closeDeleteModal}>Cancel</button>
                  <button
                    onClick={handleConfirmDelete}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}
