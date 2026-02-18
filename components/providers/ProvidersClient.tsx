"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createProvider, deleteProvider } from "@/lib/api/provider";
import toast from "react-hot-toast";

type Provider = {
  id: string;
  name: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
};

type Props = {
  providers: Provider[];
};

export default function ProvidersClient({ providers }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Provider | null>(null);

  const [providerName, setProviderName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingProvider, setSavingProvider] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Provider | null>(null);

  // ===== pagination =====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(providers.length / itemsPerPage);
  const paginatedProviders = providers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function openModal(p?: Provider) {
    setSelected(p ?? null);
    setProviderName(p?.name ?? "");
    setApiKey("");
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setSelected(null);
    setProviderName("");
    setApiKey("");
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();

    if (!providerName.trim() || !apiKey.trim()) {
      toast.error("Provider name and API key are required");
      return;
    }

    setSavingProvider(true);

    try {
      await createProvider({
        name: providerName,
        apiKey: apiKey,
      });

      toast.success("Provider created");

      closeModal();
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to create provider, wrong api key or name");
    } finally {
      setSavingProvider(false);
    }
  }

  async function onDeleteConfirmed() {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.id);

    try {
      await deleteProvider(deleteTarget.id);
      toast.success("Provider deleted");
      setDeleteTarget(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete provider");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen  p-6 md:p-10">
      <div className="">
        <div className="mb-6 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Providers
            </h1>
            <p className="mt-1 text-gray-500">
              Manage LLM connections and API keys
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="rounded-lg bg-gradient-to-r from-[#A78BFA] to-[#5835C0] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
          >
            + Add Provider
          </button>
        </div>

        {/* overflow-x-auto enables horizontal scroll on mobile */}
        <div className="overflow-x-auto">
          <div className="w-fit lg:w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* min-w wrapper stretches white bg with content */}
            <div className="min-w-[670px]">
              <div className="grid grid-cols-12 gap-3 border-b border-gray-200 px-2 pb-3  font-medium text-gray-500">
                <div className="col-span-4">Name</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-3">Type</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              <div className="divide-y divide-gray-100">
                {paginatedProviders.map((p) => (
                  <div
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openModal(p)}
                    onKeyDown={(e) => e.key === "Enter" && openModal(p)}
                    className="grid cursor-pointer grid-cols-12 items-center gap-3 px-2 py-4 transition hover:bg-gray-50"
                  >
                    <div className="col-span-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {p.name}
                      </span>
                    </div>

                    <div className="col-span-3">
                      {p.is_active ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          Active
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Inactive</span>
                      )}
                    </div>

                    <div className="col-span-3">
                      {p.is_default ? (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                          System Default
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          Custom
                        </span>
                      )}
                    </div>

                    <div
                      className="col-span-2 flex justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setDeleteTarget(p)}
                        disabled={
                          p.is_default || p.is_active || deletingId === p.id
                        }
                        className="rounded-lg bg-red-50 px-4 py-2 text-xs font-medium text-red-600 
             hover:bg-red-100 transition 
             disabled:opacity-40 disabled:cursor-not-allowed"
                        title={
                          p.is_default
                            ? "Default provider cannot be deleted"
                            : p.is_active
                              ? "Active provider cannot be deleted"
                              : "Delete"
                        }
                      >
                        {deletingId === p.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}

                {paginatedProviders.length === 0 && (
                  <div className="px-2 py-10 text-center text-sm text-gray-500">
                    No providers found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="mt-4 flex justify-end items-center gap-2">
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Provider
            </h2>

            <form onSubmit={onSave} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-gray-600">
                  Provider Name
                </label>

                <select
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  className="h-11 w-full rounded-xl border bg-white px-4 text-sm text-gray-900 outline-none border-[#967DE1] focus:ring-1 focus:ring-[#A78BFA] cursor-pointer"
                >
                  <option value="" disabled>
                    Select a provider
                  </option>
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="groq">Groq</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-600">
                  API Key
                </label>

                <input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="h-11 w-full rounded-xl border bg-white px-4 text-sm text-gray-900 border-[#967DE1] focus:ring-1 focus:ring-[#A78BFA] placeholder:text-gray-400 outline-none "
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                {/* ✅ Button colors adjusted */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 rounded-xl px-5 text-sm font-medium text-[#8A5CF6] hover:bg-[#dfd3ff] bg-[#E4DBFD] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProvider}
                  className="h-10 rounded-xl bg-gradient-to-r from-[#A78BFA] to-[#5835C0] px-5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingProvider ? "Saving..." : "Save Provider"}
                </button>
              </div>
            </form>

            {selected?.name && (
              <p className="mt-4 text-xs text-gray-500">
                Editing: <span className="text-gray-900">{selected.name}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* delete modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteTarget(null)}
          />

          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Provider
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
                className="px-4 py-2 text-sm text-[#8A5CF6] hover:bg-[#dfd3ff] bg-[#E4DBFD] transition-colors rounded-xl font-medium"
                disabled={deletingId === deleteTarget.id}
              >
                Cancel
              </button>

              <button
                onClick={onDeleteConfirmed}
                disabled={deletingId === deleteTarget.id}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {deletingId === deleteTarget.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
