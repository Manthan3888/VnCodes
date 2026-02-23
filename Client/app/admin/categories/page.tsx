"use client";

import { useState, useEffect } from "react";
import { Pagination } from "@/app/components/Pagination";
import * as categoriesApi from "@/lib/api/categories";

interface Category {
  id: string;
  label: string;
  icon: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "creator", label: "Creator", icon: "👤" },
  { id: "trending", label: "Trending", icon: "⭐" },
  { id: "wedding", label: "Wedding", icon: "💒" },
  { id: "community-event", label: "Community/Event", icon: "🎉" },
  { id: "import", label: "Import", icon: "📥" },
  { id: "favorites", label: "Favorites", icon: "❤️" },
  { id: "couple", label: "Couple", icon: "💑" },
  { id: "motivation", label: "Motivation", icon: "💪" },
  { id: "birthday", label: "Birthday", icon: "🎂" },
  { id: "anniversary", label: "Anniversary", icon: "🎊" },
  { id: "travel", label: "Travel", icon: "✈️" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    label: "",
    icon: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    categoriesApi
      .getCategories()
      .then((res) => setCategories(res.categories || []))
      .catch(() => setCategories(DEFAULT_CATEGORIES))
      .finally(() => setIsLoading(false));
  };

  const handleAdd = () => {
    if (!formData.label.trim()) {
      alert("Please enter a category label");
      return;
    }
    const id = formData.label.toLowerCase().replace(/\s+/g, "-");
    categoriesApi
      .createCategory({ id, label: formData.label, icon: formData.icon || "📁" })
      .then(() => {
        setFormData({ label: "", icon: "" });
        setIsAdding(false);
        loadCategories();
      })
      .catch((e: unknown) => {
        const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
        alert(msg || "Failed to create category.");
      });
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      label: category.label,
      icon: category.icon,
    });
  };

  const handleUpdate = () => {
    if (!editingId || !formData.label.trim()) return;
    categoriesApi
      .updateCategory(editingId, { label: formData.label, icon: formData.icon })
      .then(() => {
        setEditingId(null);
        setFormData({ label: "", icon: "" });
        loadCategories();
      })
      .catch((e: unknown) => {
        const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
        alert(msg || "Failed to update category.");
      });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This may affect templates using this category.")) return;
    categoriesApi
      .deleteCategory(id)
      .then(() => loadCategories())
      .catch(() => alert("Failed to delete category."));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Categories Management</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Add, edit, or remove categories for your templates
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Add Category
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/80">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            {editingId ? "Edit Category" : "Add New Category"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Category Label *
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
                placeholder="e.g., Festivals"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Icon (Emoji)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
                placeholder="🎉"
                maxLength={2}
              />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Enter an emoji icon for this category
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {editingId ? "Update" : "Add"} Category
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ label: "", icon: "" });
              }}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/80">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-200 dark:border-zinc-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Icon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Label
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  ID
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Actions
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {categories
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((category) => (
                <tr key={category.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                  <td className="whitespace-nowrap px-6 py-4 text-2xl">{category.icon}</td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                    {category.label}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{category.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => handleEdit(category)}
                      className="mr-2 rounded p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      aria-label={`Edit ${category.label}`}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="rounded p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      aria-label={`Delete ${category.label}`}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z M14 11v6 M10 11v6" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {categories.length > itemsPerPage && (
          <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(categories.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={categories.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}
