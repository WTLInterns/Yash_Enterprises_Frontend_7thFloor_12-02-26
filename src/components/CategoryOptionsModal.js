"use client";

import { useEffect, useState } from "react";
import { backendApi } from "@/services/api";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export default function CategoryOptionsModal({ isOpen, onClose, onUpdated }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (isOpen) {
      void load();
    }
  }, [isOpen]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await backendApi.get("/product-categories");
      const list = Array.isArray(res) ? res : res?.content || [];
      setItems(list.sort((a, b) => String(a.name).localeCompare(String(b.name))));
    } catch (e) {
      console.error("Failed to load product categories", e);
      toast.error("Failed to load category options");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) {
      toast.error("Category name cannot be empty");
      return;
    }
    if (items.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      toast.error("Category with this name already exists");
      return;
    }

    try {
      setSaving(true);
      const created = await backendApi.post("/product-categories", { name, active: true });
      setItems((prev) => [...prev, created]);
      setNewName("");
      toast.success("Category added");
      onUpdated?.();
    } catch (e) {
      console.error("Failed to add category", e);
      toast.error("Failed to add category");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (item, nextName) => {
    const name = nextName.trim();
    if (!name) {
      toast.error("Category name cannot be empty");
      return;
    }
    if (
      items.some(
        (c) => c.id !== item.id && c.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      toast.error("Category with this name already exists");
      return;
    }

    try {
      setSaving(true);
      const updated = await backendApi.put(`/product-categories/${item.id}`, {
        ...item,
        name,
      });
      setItems((prev) => prev.map((c) => (c.id === item.id ? updated : c)));
      toast.success("Category updated");
      onUpdated?.();
    } catch (e) {
      console.error("Failed to update category", e);
      toast.error("Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete category "${item.name}"?`)) return;

    try {
      setSaving(true);
      await backendApi.delete(`/product-categories/${item.id}`);
      setItems((prev) => prev.filter((c) => c.id !== item.id));
      toast.success("Category deleted");
      onUpdated?.();
    } catch (e) {
      console.error("Failed to delete category", e);
      toast.error("Failed to delete category");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 className="text-base font-semibold text-slate-900">Edit Category Options</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Add new category"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              Add
            </button>
          </div>

          {loading ? (
            <div className="py-6 text-center text-sm text-slate-500">Loading...</div>
          ) : items.length === 0 ? (
            <div className="py-6 text-center text-sm text-slate-500">
              No category options defined.
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 bg-slate-50"
                >
                  <input
                    type="text"
                    defaultValue={item.name}
                    onBlur={(e) => {
                      const next = e.target.value;
                      if (next !== item.name) {
                        handleUpdate(item, next);
                      }
                    }}
                    className="flex-1 bg-transparent text-sm text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={saving}
                    className="text-xs text-rose-600 hover:text-rose-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
