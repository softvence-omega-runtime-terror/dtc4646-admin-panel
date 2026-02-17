"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Edit, Eye, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  setAIConfigPreset,
  // ✅ you must implement this in your server file: POST /admin/prompts
  createPrompt,
  deletePrompt,
  updatePrompt,
} from "@/lib/api/aiConfigPresets";

type Preset = {
  id: string;
  name: string;
  content: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
};

type Props = {
  presets: { data: Preset[] } | any;
};

export default function PromptPage({ presets }: Props) {
  const router = useRouter();

  // normalize incoming data
  const incomingPrompts = useMemo<Preset[]>(() => {
    const arr = Array.isArray(presets?.data) ? presets.data : [];
    return arr;
  }, [presets]);

  // local list for instant UI updates
  const [prompts, setPrompts] = useState<Preset[]>(incomingPrompts);

  // keep local list in sync after router.refresh()
  useEffect(() => {
    setPrompts(incomingPrompts);
  }, [incomingPrompts]);

  // ===== Modals =====
  const [createOpen, setCreateOpen] = useState(false);
  const [activateOpen, setActivateOpen] = useState(false);

  // ===== Create form =====
  const [newName, setNewName] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newActivate, setNewActivate] = useState(false);
  const [saving, setSaving] = useState(false);

  // ===== edit form ====
  const [editOpen, setEditOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Preset | null>(null);

  // ====== delete modal ====
  const [deleteTarget, setDeleteTarget] = useState<Preset | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ====== see prompt====
  const [viewOpen, setViewOpen] = useState(false);
  const [viewPrompt, setViewPrompt] = useState<Preset | null>(null);

  // ===== pagination ====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(prompts.length / itemsPerPage);
  const paginatedPrompts = prompts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editActivate, setEditActivate] = useState(false);
  const [updating, setUpdating] = useState(false);

  function openViewModal(prompt: Preset) {
    setViewPrompt(prompt);
    setViewOpen(true);
  }

  function closeViewModal() {
    setViewOpen(false);
    setViewPrompt(null);
  }

  function openEditModal(prompt: Preset) {
    setEditingPrompt(prompt);
    setEditName(prompt.name);
    setEditContent(prompt.content);
    setEditActivate(prompt.is_active);
    setEditOpen(true);
  }

  function closeEditModal() {
    setEditOpen(false);
    setEditingPrompt(null);
    setEditName("");
    setEditContent("");
    setEditActivate(false);
  }

  async function handleUpdatePrompt(e: React.FormEvent) {
    e.preventDefault();

    if (!editingPrompt) return;
    if (!editName.trim()) return toast.error("Prompt name required");
    if (!editContent.trim()) return toast.error("Prompt content required");

    setUpdating(true);
    try {
      const payload = {
        name: editName,
        content: editContent,
        activate: editActivate,
      };

      await updatePrompt(editingPrompt.id, payload);

      setPrompts((prev) =>
        prev.map((p) =>
          p.id === editingPrompt.id
            ? {
                ...p,
                name: payload.name,
                content: payload.content,
                is_active: payload.activate,
              }
            : payload.activate
              ? { ...p, is_active: false } // deactivate others if activated
              : p,
        ),
      );

      toast.success("Prompt updated");
      closeEditModal();
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update");
    } finally {
      setUpdating(false);
    }
  }

  const activePrompt = prompts.find((p) => p.is_active);

  function closeCreate() {
    setCreateOpen(false);
    setNewName("");
    setNewContent("");
    setNewActivate(false);
  }

  async function handleCreatePrompt(e: React.FormEvent) {
    e.preventDefault();

    const name = newName.trim();
    const content = newContent.trim();

    if (!name) return toast.error("Prompt name is required");
    if (!content) return toast.error("Prompt content is required");

    setSaving(true);
    try {
      const payload = { name, content, activate: newActivate };

      // server action
      const res = await createPrompt(payload);

      // optimistic UI insert
      const created: Preset = {
        id: res?.data?.id ?? crypto.randomUUID(),
        name,
        content,
        is_active: !!newActivate,
        is_default: false,
        created_at: res?.data?.created_at ?? new Date().toISOString(),
      };

      setPrompts((prev) => {
        // if activate=true, mark others inactive locally
        const next = prev.map((p) =>
          newActivate ? { ...p, is_active: false } : p,
        );
        return [created, ...next];
      });

      toast.success("Prompt created");
      closeCreate();

      // sync with server truth (no reload)
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create prompt");
    } finally {
      setSaving(false);
    }
  }

  function canDelete(p: Preset) {
    // based on your rules
    return !p.is_active && !p.is_default;
  }

  async function handleDeletePromptConfirmed() {
    if (!deleteTarget) return;

    const prompt = deleteTarget;
    setDeletingId(prompt.id);

    // optimistic UI removal
    setPrompts((prev) => prev.filter((p) => p.id !== prompt.id));

    try {
      await deletePrompt(prompt.id);
      toast.success("Prompt deleted");
      setDeleteTarget(null);
      router.refresh();
    } catch (err: any) {
      // rollback if failed
      setPrompts((prev) => [prompt, ...prev]);
      toast.error(err?.message || "Failed to delete prompt");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen  p-6 md:p-10">
      <div className="">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              System Prompts
            </h1>
            <p className="mt-1 text-gray-500">
              Persona library for AI interviews
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCreateOpen(true)}
              className="rounded-lg bg-gradient-to-r from-[#A78BFA] to-[#5835C0] px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
            >
              + Create Prompt
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm w-fit lg:w-full">
            <div className="min-w-[580px]">
              <div className="grid grid-cols-12 gap-3 border-b border-gray-200 px-5 py-3 font-medium text-gray-500">
                <div className="col-span-6">Prompt Name</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-3 text-center">Actions</div>
              </div>

              <div className="divide-y divide-gray-100">
                {paginatedPrompts.map((p) => (
                  <div
                    key={p.id}
                    className="min-w-[480px] grid grid-cols-12 items-center gap-3 px-5 py-4 hover:bg-gray-50 transition"
                  >
                    <div className="col-span-6">
                      <p className="text-sm font-semibold text-gray-900">
                        {p.name}
                      </p>
                    </div>

                    <div className="col-span-3">
                      {p.is_active ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          Active
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </div>

                    <div className="col-span-3 flex justify-center gap-2 ">
                      <button
                        onClick={() => openViewModal(p)}
                        className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => openEditModal(p)}
                        disabled={p.is_default}
                        className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(p)}
                        disabled={!canDelete(p)}
                        className="rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {paginatedPrompts.length === 0 && (
                  <div className="px-5 py-10 text-center text-sm text-gray-500">
                    No prompts found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Active prompt:{" "}
            <span className="text-gray-900">
              {activePrompt?.name ?? "None"}
            </span>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              <span className="rounded-lg border border-[#A78BFA] bg-white px-3 py-1.5 text-sm font-semibold text-[#5835C0]">
                {currentPage}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeCreate} />

          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
            <button
              onClick={closeCreate}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-900">
              Create Prompt
            </h2>


            <form onSubmit={handleCreatePrompt} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-gray-600">
                  Prompt Name
                </label>

                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="career-coach-preset"
                  className="h-11 w-full rounded-xl border border-[#967DE1] bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-[#967DE1]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-600">
                  Content
                </label>

                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Your preset content here..."
                  rows={6}
                  className="w-full rounded-xl border border-[#967DE1] bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-[#967DE1]"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={newActivate}
                  onChange={(e) => setNewActivate(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-[#5835C0]"
                />
                Activate immediately
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeCreate}
                  className="h-10 rounded-xl bg-[#E4DBFD]  text-[#8A5CF6] hover:bg-[#dfd3ff] transition-colors cursor-pointer px-5 text-sm font-medium "
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-10 rounded-xl bg-gradient-to-r from-[#A78BFA] to-[#5835C0] px-5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? "Creating..." : "Create Prompt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal  */}
      {editOpen && editingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay stays dark */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeEditModal}
          />

          {/* ✅ Modal Card → White */}
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
            <button
              onClick={closeEditModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-900">Edit Prompt</h2>

            <form onSubmit={handleUpdatePrompt} className="mt-6 space-y-5">
              <div>
                <label className="text-sm text-gray-600">Prompt Name</label>

                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#967DE1] bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-[#967DE1]"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Content</label>

                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-[#967DE1] bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-[#967DE1]"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={editActivate}
                  onChange={(e) => setEditActivate(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-[#5835C0]"
                />
                Set as Active
              </label>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-xl bg-[#E4DBFD] text-[#8A5CF6] hover:bg-[#dfd3ff] transition-colors cursor-pointer font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-gradient-to-r from-[#A78BFA] to-[#5835C0] rounded-lg text-white hover:opacity-90 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update Prompt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteTarget(null)}
          />

          {/* modal */}
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Prompt
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {deleteTarget.name}
              </span>
              ?
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm rounded-xl bg-[#E4DBFD] text-[#8A5CF6] hover:bg-[#dfd3ff] font-bold"
                disabled={deletingId === deleteTarget.id}
              >
                Cancel
              </button>

              <button
                onClick={handleDeletePromptConfirmed}
                disabled={deletingId === deleteTarget.id}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {deletingId === deleteTarget.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewOpen && viewPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeViewModal}
          />

          {/* modal */}
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-gray-200">
            <button
              onClick={closeViewModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold text-gray-900">
              {viewPrompt.name}
            </h3>

            <p className="mt-1 text-sm text-gray-500">Prompt Content</p>

            <div className="mt-4 max-h-[300px] overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-wrap">
              {viewPrompt.content || "No content"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
