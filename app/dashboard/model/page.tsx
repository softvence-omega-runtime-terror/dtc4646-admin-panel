
import { getProviders } from "@/lib/api/provider";
import { getAIConfigPresets } from "@/lib/api/aiConfigPresets";
import { getAIConfig } from "@/lib/api/aiConfig"; // if you have it
import ConfigClient from "@/components/global-model/ConfigClient";

export default async function Page() {
  const [providersRes, promptsRes, configRes] = await Promise.all([
    getProviders(),          // returns array
    getAIConfigPresets(),    // returns { data: [...] }
    getAIConfig(),           // current selected config (optional)
  ]);

  const providers = Array.isArray(providersRes) ? providersRes : [];
  const prompts = Array.isArray(promptsRes?.data) ? promptsRes.data : [];

  return <ConfigClient providers={providers} prompts={prompts} />;
}
