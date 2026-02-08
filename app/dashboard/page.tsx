import { getAdminUsersCount } from "@/lib/api/adminUsers";
import { getAIConfig } from "@/lib/api/aiConfig";
import { Bot, Cpu, FileText, Sparkles } from "lucide-react";

export default async function Page() {
  const config = await getAIConfig();
  const total = await getAdminUsersCount();

  const aiConfig = config.data;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your AI configuration</p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <p className="text-sm text-gray-600 mb-1">AI Provider</p>
              <h3 className="text-2xl font-bold text-gray-900 capitalize">
                {aiConfig?.ai_provider || "N/A"}
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
                {aiConfig?.ai_model || "N/A"}
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
              <p className="text-sm text-gray-600 mb-1">Prompt Type</p>
              <h3 className="text-lg font-bold text-gray-900">
                {aiConfig?.system_prompt_name || "N/A"}
              </h3>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Configuration Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AI Configuration</h2>
      </div>

      {/* AI Config Card - Full Width */}
      {aiConfig ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#A78BFA] to-[#5835C0] p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white capitalize">
                    {aiConfig.ai_provider}
                  </h3>
                  <p className="text-purple-100 text-sm md:text-base mt-1">
                    {aiConfig.system_prompt_name}
                  </p>
                </div>
              </div>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium self-start sm:self-auto">
                Active
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
              {/* Model Info */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">
                  Model
                </label>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <Cpu size={20} className="text-gray-400 flex-shrink-0" />
                  <span className="text-base font-medium text-gray-900">
                    {aiConfig.ai_model}
                  </span>
                </div>
              </div>

              {/* Prompt Name */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">
                  Prompt Configuration
                </label>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <FileText size={20} className="text-gray-400 flex-shrink-0" />
                  <span className="text-base font-medium text-gray-900">
                    {aiConfig.system_prompt_name}
                  </span>
                </div>
              </div>
            </div>

            {/* System Prompt */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">
                System Prompt
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6">
                <p className="text-gray-700 leading-relaxed">
                  {aiConfig.system_prompt}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No AI Configuration Found
          </h3>
          <p className="text-gray-600">
            Please set up your AI configuration to get started
          </p>
        </div>
      )}
    </div>
  );
}