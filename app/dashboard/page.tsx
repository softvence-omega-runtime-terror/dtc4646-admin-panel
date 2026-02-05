import { getAdminUsersCount } from "@/lib/api/adminUsers";
import { getAIConfig } from "@/lib/api/aiConfig";
import { Bot, Cpu, FileText, Sparkles, ChevronRight } from "lucide-react";

export default async function Page() {
  const config = await getAIConfig();
  const total = await getAdminUsersCount();

  // Assuming your API will return multiple AI configs in an array
  // For now, we'll create an array with the single config
  const aiConfigs = Array.isArray(config.data) ? config.data : [config.data];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your AI configurations</p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-900">{total}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Sparkles className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">AI Providers</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {aiConfigs.length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bot className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Model</p>
              <h3 className="text-lg font-bold text-gray-900">
                {aiConfigs[0]?.ai_model || "N/A"}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Cpu className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Configurations</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {aiConfigs.length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Configurations Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">AI Configurations</h2>
        <button className="px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#5835C0] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
          + Add New AI
        </button>
      </div>

      {/* AI Config Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiConfigs.map((aiConfig, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#A78BFA] to-[#5835C0] p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Bot className="text-white" size={24} />
                </div>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white capitalize">
                {aiConfig.ai_provider}
              </h3>
              <p className="text-purple-100 text-sm mt-1">
                {aiConfig.system_prompt_name}
              </p>
            </div>

            {/* Card Body */}
            <div className="p-6">
              {/* Model Info */}
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                  Model
                </label>
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {aiConfig.ai_model}
                  </span>
                </div>
              </div>

              {/* Prompt Name */}
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                  Prompt Configuration
                </label>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {aiConfig.system_prompt_name}
                  </span>
                </div>
              </div>

              {/* System Prompt Preview */}
              <div className="mb-6">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                  System Prompt
                </label>
                <p className="text-sm text-gray-600 line-clamp-3 bg-gray-50 p-3 rounded-lg">
                  {aiConfig.system_prompt}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                  Edit
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#5835C0] text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-1">
                  View Details
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (if no configs) */}
      {aiConfigs.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No AI Configurations Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first AI configuration
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-[#A78BFA] to-[#5835C0] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            + Add AI Configuration
          </button>
        </div>
      )}
    </div>
  );
}