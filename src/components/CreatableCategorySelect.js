"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Select from "react-select";
import { backendApi } from "@/services/api";
import { toast } from "react-toastify";
import CategoryOptionsModal from "@/components/CategoryOptionsModal";

const EDIT_VALUE = "__EDIT_OPTIONS__";

export default function CreatableCategorySelect({ value, onChange, className, isAdmin = false }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await backendApi.get("/categories");
      const cats = Array.isArray(res) ? res : res?.content || [];
      setCategories(cats.map((cat) => ({ value: cat.id, label: cat.name })));
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      toast.error("Failed to load categories");
    }
  }, []);

  const handleCreate = useCallback(async (inputValue) => {
    if (!isAdmin) {
      // Non-admins cannot create new categories
      toast.error("Only admins can create new categories");
      return null;
    }

    const trimmed = inputValue.trim();
    if (!trimmed) {
      toast.error("Category name cannot be empty");
      return null;
    }

    // Prevent duplicates client-side
    if (
      categories.some(
        (c) => c.label.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      toast.error("Category with this name already exists");
      return null;
    }

    try {
      setLoading(true);
      const newCategory = await backendApi.post("/categories", {
        name: trimmed,
        active: true,
      });
      const newOption = { value: newCategory.id, label: newCategory.name };
      setCategories((prev) => [...prev, newOption]);
      onChange(newOption.value);
      toast.success("Category created successfully");
      return newOption;
    } catch (err) {
      console.error("Failed to create category:", err);
      toast.error("Failed to create category");
      return null;
    } finally {
      setLoading(false);
    }
  }, [categories, isAdmin, onChange]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const options = useMemo(() => {
    const base = [
      { value: "", label: "-None-" },
      ...categories,
    ];

    if (isAdmin) {
      return [
        ...base,
        { value: EDIT_VALUE, label: "Edit Options" },
      ];
    }

    return base;
  }, [categories, isAdmin]);

  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (option) => {
    if (!option) {
      onChange("");
      return;
    }

    if (option.value === EDIT_VALUE && isAdmin) {
      setShowOptionsModal(true);
      return;
    }

    onChange(option.value || "");
  };

  return (
    <>
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        onCreateOption={handleCreate}
        isLoading={loading}
        isClearable
        placeholder="Select category..."
        className={className}
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            minHeight: "42px",
            border: "1px solid #cbd5e1",
            "&:hover": { borderColor: "#3b82f6" },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 50,
          }),
        }}
      />

      <CategoryOptionsModal
        isOpen={showOptionsModal && isAdmin}
        onClose={() => setShowOptionsModal(false)}
        onUpdated={fetchCategories}
      />
    </>
  );
}
