"use client";

import { createProvider } from "@/lib/api/provider";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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

  // form state
  const [providerName, setProviderName] = useState("");
  const [apiKey, setApiKey] = useState("");

  function openModal(p?: Provider) {
    setSelected(p ?? null);

    // Prefill provider name when clicking a row
    if (p?.name) setProviderName(p.name);
    else setProviderName("");

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
    console.error("Provider name and API key are required");
    return;
  }

  try {
    await createProvider({
      name: providerName,
      apiKey,
    });

    closeModal();
    router.refresh();
  } catch (err) {
    console.error(err);
  }
}


  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              AI Providers
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage LLM connections and API keys
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
          >
            + Add Provider
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-12 gap-3 border-b border-gray-200 px-2 pb-3 text-xs font-medium text-gray-500">
            <div className="col-span-4">Name</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3">Type</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-100">
            {providers.map((p) => (
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
                  <button className="rounded-lg bg-red-50 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {providers.length === 0 && (
              <div className="px-2 py-10 text-center text-sm text-gray-500">
                No providers found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          {/* panel */}
          <div className="relative w-full max-w-xl rounded-2xl bg-[#1F2A3A] p-6 shadow-2xl ring-1 ring-white/10">
            <h2 className="text-xl font-semibold text-white">
              Add New Provider
            </h2>

            <form onSubmit={onSave} className="mt-6 space-y-5">
              {/* Provider Name */}
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Provider Name
                </label>
                <input
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="OpenAI"
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#273449] px-4 text-sm text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-indigo-500/60"
                />
              </div>

              {/* API Key */}
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  API Key
                </label>
                <input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#273449] px-4 text-sm text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-indigo-500/60"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 rounded-xl border border-white/10 bg-transparent px-5 text-sm font-medium text-white/80 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Save Provider
                </button>
              </div>
            </form>

            {selected?.name && (
              <p className="mt-4 text-xs text-white/50">
                Editing: <span className="text-white/70">{selected.name}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
