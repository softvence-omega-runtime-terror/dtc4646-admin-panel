"use client";

import { getAIConfigPresets, setAIConfigPreset } from "@/lib/api/aiConfigPresets";
import { Plus, Edit, Trash2, FileText, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Page() {
  const [presets, setPresets] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPresets = async () => {
      const data = await getAIConfigPresets();
      setPresets(data);
    };
    fetchPresets();
  }, []);

  if (!presets) return <div>Loading...</div>;

  // Convert presets object to array for easier mapping
  const presetsArray = Object.entries(presets.data).map(([name, prompt]) => ({
    name,
    prompt,
  }));

  const handleCreatePrompt = async () => {
    if (!selectedPrompt) {
      setError("Please select a prompt");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await setAIConfigPreset({ prompt_name: selectedPrompt });
      console.log("Preset set successfully:", result);
      setSuccess(`Prompt "${selectedPrompt}" activated successfully!`);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedPrompt("");
        setSuccess("");
      }, 2000);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Failed to set prompt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Prompt Presets
          </h1>
          <p className="text-gray-600">
            Manage your AI system prompt configurations
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A78BFA] to-[#5835C0] text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus size={20} />
          Activate Prompt
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Presets</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {presetsArray.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 gap-6">
        {presetsArray.map((preset, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#A78BFA] to-[#5835C0] px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {preset.name}
                </h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                    <Edit className="text-white" size={18} />
                  </button>
                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-red-500/50 transition-colors">
                    <Trash2 className="text-white" size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">
                System Prompt
              </label>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                {preset.prompt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {presetsArray.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Prompts Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first AI prompt preset
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#A78BFA] to-[#5835C0] text-white rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Activate First Prompt
          </button>
        </div>
      )}

      {/* Activate Prompt Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedPrompt("");
                setError("");
                setSuccess("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#5835C0] flex items-center justify-center mb-4">
                <Plus className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Activate Prompt
              </h3>
              <p className="text-gray-600 mt-2">
                Select a prompt preset to activate
              </p>
            </div>

            {/* Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Prompt
              </label>
              <select
                value={selectedPrompt}
                onChange={(e) => setSelectedPrompt(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent text-gray-900"
              >
                <option value="">Choose a prompt...</option>
                {presetsArray.map((preset, index) => (
                  <option key={index} value={preset.name}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview Selected Prompt */}
            {selectedPrompt && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {presetsArray.find((p) => p.name === selectedPrompt)?.prompt}
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPrompt("");
                  setError("");
                  setSuccess("");
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePrompt}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#A78BFA] to-[#5835C0] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !selectedPrompt}
              >
                {loading ? "Activating..." : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}