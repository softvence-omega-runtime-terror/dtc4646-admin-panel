// app/dashboard/ai-config/page.tsx (SERVER)
import PromptPage from "@/components/PromptPage";
import { getAIConfigPresets } from "@/lib/api/aiConfigPresets";

export default async function Page() {
  const prompts = await getAIConfigPresets();

  console.log()

  return <PromptPage presets={prompts} />;
}
