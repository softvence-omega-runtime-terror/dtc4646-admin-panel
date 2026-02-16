"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Edit, Plus, X } from "lucide-react";
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

  // ===== Activate form =====
  const [selectedPromptId, setSelectedPromptId] = useState("");
  const [activating, setActivating] = useState(false);

  // ===== edit form ====
  const [editOpen, setEditOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Preset | null>(null);

  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editActivate, setEditActivate] = useState(false);
  const [updating, setUpdating] = useState(false);

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

      // ✅ Instant UI update
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

  function closeActivate() {
    setActivateOpen(false);
    setSelectedPromptId("");
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

  async function handleActivatePrompt() {
    if (!selectedPromptId) return toast.error("Please select a prompt");

    const target = prompts.find((p) => p.id === selectedPromptId);
    if (!target) return toast.error("Selected prompt not found");

    setActivating(true);
    try {
      // ✅ your backend expects prompt_name
      await setAIConfigPreset({ prompt_name: target.name });

      // instant UI update
      setPrompts((prev) =>
        prev.map((p) => ({ ...p, is_active: p.id === target.id })),
      );

      toast.success(`"${target.name}" activated`);
      closeActivate();

      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to activate prompt");
    } finally {
      setActivating(false);
    }
  }

  function canDelete(p: Preset) {
    // based on your rules
    return !p.is_active && !p.is_default;
  }

  async function handleDeletePrompt(id: string) {
    const p = prompts.find((x) => x.id === id);
    if (!p) return;

    if (p.is_active) return toast.error("You cannot delete the active prompt");
    if (p.is_default) return toast.error("You cannot delete a default prompt");

    const ok = confirm(`Delete "${p.name}"?`);
    if (!ok) return;

    try {
      // ✅ instant UI update
      setPrompts((prev) => prev.filter((x) => x.id !== id));

      // ✅ server call
      await deletePrompt(id);

      toast.success("Prompt deleted");
      router.refresh();
    } catch (err: any) {
      // rollback if delete fails
      setPrompts((prev) =>
        prev.some((x) => x.id === p.id) ? prev : [p, ...prev],
      );
      toast.error(err?.message || "Failed to delete prompt");
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1220] p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              System Prompts
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Persona library for AI interviews
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivateOpen(true)}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Activate Prompt
            </button>

            <button
              onClick={() => setCreateOpen(true)}
              className="rounded-lg bg-[#5B5FEA] px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
            >
              + Create Prompt
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-white/10 bg-white/5 shadow-sm backdrop-blur">
          <div className="grid grid-cols-12 gap-3 border-b border-white/10 px-5 py-3 text-xs font-medium text-white/60">
            <div className="col-span-6">Prompt Name</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          <div className="divide-y divide-white/10">
            {prompts.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-12 items-center gap-3 px-5 py-4 hover:bg-white/[0.04] transition"
              >
                <div className="col-span-6">
                  <p className="text-sm font-semibold text-white">{p.name}</p>
                </div>

                <div className="col-span-3">
                  {p.is_active ? (
                    <span className="inline-flex items-center rounded-full bg-[#3B82F6]/15 px-3 py-1 text-xs font-semibold text-[#93C5FD]">
                      Active
                    </span>
                  ) : (
                    <span className="text-sm text-white/50">-</span>
                  )}
                </div>

                <div className="col-span-3 flex justify-end gap-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="rounded-lg bg-white/5 p-2 text-white/70 hover:bg-white/10"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleDeletePrompt(p.id)}
                    disabled={!canDelete(p)}
                    className="rounded-lg bg-[#EF4444]/15 px-4 py-2 text-xs font-semibold text-[#FCA5A5]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {prompts.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-white/60">
                No prompts found.
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-xs text-white/50">
          Active prompt:{" "}
          <span className="text-white/70">{activePrompt?.name ?? "None"}</span>
        </div>
      </div>

      {/* Create Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeCreate} />

          <div className="relative w-full max-w-xl rounded-2xl bg-[#1F2A3A] p-6 shadow-2xl ring-1 ring-white/10">
            <button
              onClick={closeCreate}
              className="absolute right-4 top-4 text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-white">Create Prompt</h2>
            <p className="mt-1 text-sm text-white/60">
              Create a new system prompt preset.
            </p>

            <form onSubmit={handleCreatePrompt} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Prompt Name
                </label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="career-coach-preset"
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#273449] px-4 text-sm text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-[#5B5FEA]/60"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Content
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Your preset content here..."
                  rows={6}
                  className="w-full rounded-xl border border-white/10 bg-[#273449] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-[#5B5FEA]/60"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={newActivate}
                  onChange={(e) => setNewActivate(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-transparent"
                />
                Activate immediately
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeCreate}
                  className="h-10 rounded-xl border border-white/10 bg-transparent px-5 text-sm font-medium text-white/80 hover:bg-white/5"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-xl bg-[#5B5FEA] px-5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? "Creating..." : "Create Prompt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activate Modal */}
      {activateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeActivate}
          />

          <div className="relative w-full max-w-lg rounded-2xl bg-[#1F2A3A] p-6 shadow-2xl ring-1 ring-white/10">
            <button
              onClick={closeActivate}
              className="absolute right-4 top-4 text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-white">
              Activate Prompt
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Select a prompt to set as active.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Prompt
                </label>
                <select
                  value={selectedPromptId}
                  onChange={(e) => setSelectedPromptId(e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#273449] px-4 text-sm text-white outline-none focus:ring-2 focus:ring-[#5B5FEA]/60"
                >
                  <option value="">Choose a prompt...</option>
                  {prompts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPromptId && (
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Preview
                  </label>
                  <div className="rounded-xl border border-white/10 bg-[#273449] p-4 text-sm text-white/80">
                    {prompts.find((p) => p.id === selectedPromptId)?.content}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeActivate}
                  className="h-10 rounded-xl border border-white/10 bg-transparent px-5 text-sm font-medium text-white/80 hover:bg-white/5"
                  disabled={activating}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleActivatePrompt}
                  className="h-10 rounded-xl bg-[#5B5FEA] px-5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                  disabled={activating || !selectedPromptId}
                >
                  {activating ? "Activating..." : "Activate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal  */}
      {editOpen && editingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeEditModal}
          />

          <div className="relative w-full max-w-xl rounded-2xl bg-[#1F2A3A] p-6 shadow-2xl">
            <button
              onClick={closeEditModal}
              className="absolute right-4 top-4 text-white/60"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-white">Edit Prompt</h2>

            <form onSubmit={handleUpdatePrompt} className="mt-6 space-y-5">
              <div>
                <label className="text-sm text-white/70">Prompt Name</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-11 w-full rounded-xl bg-[#273449] px-4 text-white"
                />
              </div>

              <div>
                <label className="text-sm text-white/70">Content</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl bg-[#273449] px-4 py-3 text-white"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={editActivate}
                  onChange={(e) => setEditActivate(e.target.checked)}
                />
                Set as Active
              </label>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-white/70"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-indigo-600 rounded-lg text-white"
                >
                  {updating ? "Updating..." : "Update Prompt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
