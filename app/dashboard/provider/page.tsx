import ProvidersClient from "@/components/providers/ProvidersClient";
import { getProviders } from "@/lib/api/provider";

export default async function Page() {
  const providers = await getProviders();
  if (!providers) return "Provider not found!";

  return <ProvidersClient providers={providers ?? []} />;
}
