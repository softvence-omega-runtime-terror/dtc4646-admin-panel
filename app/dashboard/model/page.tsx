"use client";

import { updateAIConfig } from "@/lib/api/aiConfig";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [provider, setProvider] = useState("openai");
  const [model, setModel] = useState("gpt-4o-mini");
  const [loading, setLoading] = useState(false);

  // Model options based on provider
  const modelOptions = {
    openai: ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini"],
  };

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    setModel(modelOptions[newProvider as keyof typeof modelOptions][0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateAIConfig({ provider, model });
      toast.success("AI Config updated successfully!");
    } catch (err: any) {
      console.error("Error:", err);
      toast.error(err.message || "Failed to update AI config");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Configuration
          </h1>
          <p className="text-gray-600">
            Configure your AI provider and model settings
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Provider
              </label>
              <select
                value={provider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent text-gray-900"
              >
                <option value="openai">OpenAI</option>
              </select>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent text-gray-900"
              >
                {modelOptions[provider as keyof typeof modelOptions].map(
                  (modelOption) => (
                    <option key={modelOption} value={modelOption}>
                      {modelOption}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#A78BFA] to-[#5835C0] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Configuration"}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note:</span> Changing the AI
            configuration will affect all new conversations. Existing
            conversations will continue using their original settings.
          </p>
        </div>
      </div>
    </div>
  );
}