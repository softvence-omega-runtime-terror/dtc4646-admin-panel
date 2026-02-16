"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProviderModels } from "@/lib/api/provider";
import { updateGlobalAIConfig } from "@/lib/api/aiConfigPresets";

type Provider = { id: string; name: string };
type Prompt = { id: string; name: string; is_active: boolean };

type Props = {
  providers: Provider[];
  prompts: Prompt[];
};

export default function ConfigClient({ providers, prompts }: Props) {
  const [providerId, setProviderId] = useState(providers?.[0]?.id ?? "");
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState<string>("");

  const [promptId, setPromptId] = useState(
    prompts.find((p) => p.is_active)?.id ?? prompts?.[0]?.id ?? ""
  );

  const [loadingModels, setLoadingModels] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch models when provider changes
  useEffect(() => {
    if (!providerId) return;

    let cancelled = false;

    (async () => {
      setLoadingModels(true);
      try {
        const list = await getProviderModels(providerId);
        if (cancelled) return;

        setModels(list);

        // ✅ Keep current model if it exists in the new list
        setModel((prev) => {
          if (prev && list.includes(prev)) return prev;
          return list[0] ?? "";
        });
      } catch (err: any) {
        if (cancelled) return;

        setModels([]);
        setModel("");
        toast.error(err?.message || "Failed to load models");
      } finally {
        if (!cancelled) setLoadingModels(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [providerId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!providerId) return toast.error("Select a provider");
    if (!model) return toast.error("Select a model");
    if (!promptId) return toast.error("Select a prompt");

    setSaving(true);
    try {
      await updateGlobalAIConfig({
        provider_id: providerId,
        model,
        prompt_id: promptId,
      });

      toast.success("Configuration updated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update configuration");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AI Configuration</h1>
          <p className="mt-1 text-gray-600">
            Set global provider, model, and system prompt.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Provider */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Provider
              </label>
              <select
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-gray-900 outline-none focus:ring-2 focus:ring-[#A78BFA]"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={loadingModels || models.length === 0}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-gray-900 outline-none focus:ring-2 focus:ring-[#A78BFA] disabled:opacity-60"
              >
                {loadingModels ? (
                  <option value="">Loading models...</option>
                ) : models.length ? (
                  models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))
                ) : (
                  <option value="">No models found</option>
                )}
              </select>
            </div>

            {/* Prompt */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Prompt
              </label>
              <select
                value={promptId}
                onChange={(e) => setPromptId(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-gray-900 outline-none focus:ring-2 focus:ring-[#A78BFA]"
              >
                {prompts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.is_active ? " (Active)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-gradient-to-r from-[#A78BFA] to-[#5835C0] py-3 font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Updating..." : "Update Configuration"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
