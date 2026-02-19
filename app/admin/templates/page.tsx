"use client";

import { useState, useEffect } from "react";
import { Pagination } from "@/app/components/Pagination";

interface Template {
  id: number;
  title: string;
  originalPrice: number;
  price: number;
  category: string;
  videoUrl?: string;
  videoData?: string; // Base64 encoded video data
  videoFileName?: string; // Original filename
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    title: "",
    originalPrice: "",
    price: "",
    category: "",
    videoUrl: "",
    videoFile: null as File | null,
    videoPreview: null as string | null,
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    // Load from localStorage or use mock data
    const stored = localStorage.getItem("admin_templates");
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load templates", e);
        setTemplates(getMockTemplates());
      }
    } else {
      setTemplates(getMockTemplates());
    }
    setIsLoading(false);
  };

  const getMockTemplates = (): Template[] => {
    return [
      { id: 1, title: "Doornas Devarem - Girl...", originalPrice: 200, price: 99, category: "Creator", videoUrl: "https://example.com/videos/template1.mp4" },
      { id: 2, title: "Bora Kamdeo - Mahade...", originalPrice: 200, price: 99, category: "Trending", videoUrl: "https://example.com/videos/template2.mp4" },
      { id: 3, title: "Tu Chaleye - Couple...", originalPrice: 200, price: 99, category: "Couple", videoUrl: "https://example.com/videos/template3.mp4" },
      { id: 4, title: "They call this Love L...", originalPrice: 200, price: 99, category: "Couple", videoUrl: "https://example.com/videos/template4.mp4" },
      { id: 5, title: "Wedding Highlights...", originalPrice: 249, price: 149, category: "Wedding", videoUrl: "https://example.com/videos/template5.mp4" },
      { id: 6, title: "Birthday Wishes...", originalPrice: 199, price: 79, category: "Birthday", videoUrl: "https://example.com/videos/template6.mp4" },
      { id: 7, title: "Travel Memories...", originalPrice: 299, price: 129, category: "Travel", videoUrl: "https://example.com/videos/template7.mp4" },
      { id: 8, title: "Anniversary Special...", originalPrice: 220, price: 99, category: "Anniversary", videoUrl: "https://example.com/videos/template8.mp4" },
    ];
  };

  const saveTemplates = (newTemplates: Template[]) => {
    localStorage.setItem("admin_templates", JSON.stringify(newTemplates));
    setTemplates(newTemplates);
    // Dispatch custom event for same-tab updates
    globalThis.dispatchEvent(new Event("storage"));
    // Also dispatch a custom event specifically for templates
    globalThis.dispatchEvent(new CustomEvent("templatesUpdated"));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("video/")) {
        alert("Please select a valid video file");
        return;
      }
      // Validate file size (max 50MB for localStorage)
      if (file.size > 50 * 1024 * 1024) {
        alert("Video file is too large. Maximum size is 50MB.");
        return;
      }
      setFormData({ ...formData, videoFile: file });
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, videoPreview: previewUrl }));
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAdd = async () => {
    if (!formData.title || !formData.price || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    let videoData: string | undefined;
    let videoFileName: string | undefined;

    if (formData.videoFile) {
      try {
        videoData = await convertFileToBase64(formData.videoFile);
        videoFileName = formData.videoFile.name;
      } catch (error) {
        alert("Failed to process video file. Please try again.");
        return;
      }
    }

    const newTemplate: Template = {
      id: templates.length > 0 ? Math.max(...templates.map((t) => t.id)) + 1 : 1,
      title: formData.title,
      originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
      price: parseFloat(formData.price),
      category: formData.category,
      videoUrl: formData.videoUrl || undefined,
      videoData,
      videoFileName,
    };

    saveTemplates([...templates, newTemplate]);
    // Clean up preview URL
    if (formData.videoPreview) {
      URL.revokeObjectURL(formData.videoPreview);
    }
    setFormData({ title: "", originalPrice: "", price: "", category: "", videoUrl: "", videoFile: null, videoPreview: null });
    setIsAdding(false);
  };

  const handleEdit = (template: Template) => {
    setEditingId(template.id);
    setFormData({
      title: template.title,
      originalPrice: template.originalPrice.toString(),
      price: template.price.toString(),
      category: template.category,
      videoUrl: template.videoUrl || "",
      videoFile: null,
      videoPreview: template.videoData || null,
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    let videoData: string | undefined;
    let videoFileName: string | undefined;

    if (formData.videoFile) {
      try {
        videoData = await convertFileToBase64(formData.videoFile);
        videoFileName = formData.videoFile.name;
      } catch (error) {
        alert("Failed to process video file. Please try again.");
        return;
      }
    } else if (formData.videoPreview && formData.videoPreview.startsWith("data:")) {
      // Keep existing video data if no new file is selected
      const existingTemplate = templates.find((t) => t.id === editingId);
      videoData = existingTemplate?.videoData;
      videoFileName = existingTemplate?.videoFileName;
    }

    const updated = templates.map((t) =>
      t.id === editingId
        ? {
            ...t,
            title: formData.title,
            originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
            price: parseFloat(formData.price),
            category: formData.category,
            videoUrl: formData.videoUrl || undefined,
            videoData,
            videoFileName,
          }
        : t
    );

    saveTemplates(updated);
    // Clean up preview URL if it was a new file
    if (formData.videoPreview && formData.videoFile) {
      URL.revokeObjectURL(formData.videoPreview);
    }
    setEditingId(null);
    setFormData({ title: "", originalPrice: "", price: "", category: "", videoUrl: "", videoFile: null, videoPreview: null });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this template?")) {
      saveTemplates(templates.filter((t) => t.id !== id));
    }
  };

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Load categories from localStorage
    const stored = localStorage.getItem("admin_categories");
    if (stored) {
      try {
        const cats = JSON.parse(stored);
        setCategories(cats.map((cat: { label: string }) => cat.label));
      } catch (e) {
        setCategories([
          "Creator",
          "Trending",
          "Wedding",
          "Community/Event",
          "Import",
          "Favorites",
          "Couple",
          "Motivation",
          "Birthday",
          "Anniversary",
          "Travel",
        ]);
      }
    } else {
      setCategories([
        "Creator",
        "Trending",
        "Wedding",
        "Community/Event",
        "Import",
        "Favorites",
        "Couple",
        "Motivation",
        "Birthday",
        "Anniversary",
        "Travel",
      ]);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Templates Management</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manage your video templates and products
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Add Template
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/80">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            {editingId ? "Edit Template" : "Add New Template"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
                placeholder="Template title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
                placeholder="200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
                placeholder="99"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Video File *
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:file:bg-blue-500 dark:hover:file:bg-blue-600"
              />
              {formData.videoPreview && (
                <div className="mt-3">
                  <video
                    src={formData.videoPreview}
                    controls
                    className="max-h-64 w-full rounded-lg border border-zinc-300 dark:border-zinc-700"
                    aria-label="Video preview"
                  >
                    <track kind="captions" />
                    Your browser does not support the video tag.
                  </video>
                  {formData.videoFile && (
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Selected: {formData.videoFile.name} ({(formData.videoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              )}
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Upload a video file (Max 50MB). Supported formats: MP4, WebM, MOV, etc.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {editingId ? "Update" : "Add"} Template
            </button>
            <button
              onClick={() => {
                // Clean up preview URL if exists
                if (formData.videoPreview && formData.videoFile) {
                  URL.revokeObjectURL(formData.videoPreview);
                }
                setIsAdding(false);
                setEditingId(null);
                setFormData({ title: "", originalPrice: "", price: "", category: "", videoUrl: "", videoFile: null, videoPreview: null });
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
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Original Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Video file
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {templates
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((template) => (
                <tr key={template.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">
                    {template.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                    {template.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {template.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    ₹{template.originalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white">
                    ₹{template.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {template.videoData || template.videoUrl ? (
                      <span className="text-green-600 dark:text-green-400">
                        {template.videoFileName || "Video uploaded"}
                      </span>
                    ) : (
                      <span className="text-zinc-400 dark:text-zinc-500">No video</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => handleEdit(template)}
                      className="mr-2 rounded p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      aria-label={`Edit ${template.title}`}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="rounded p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      aria-label={`Delete ${template.title}`}
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
        {templates.length > itemsPerPage && (
          <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(templates.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={templates.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}
