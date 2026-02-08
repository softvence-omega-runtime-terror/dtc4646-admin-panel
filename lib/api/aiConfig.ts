"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL_DEV is not defined");

type AIConfigResponse = {
  success: boolean;
  message: string;
  data: any; // Using any for now since we don't know the structure yet
};

type UpdateAIConfigPayload = {
  provider: string;
  model: string;
};

export async function getAIConfig(): Promise<any> {
  const cookieStore = await cookies();
  
  const authToken = cookieStore.get("auth_token")?.value;
  
  console.log("-------auth token--------", authToken);

  if (!authToken) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${BASE_URL}/admin/ai-config`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  console.log("-------response status--------", res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.log("-------error response--------", res.status, errorText);
    throw new Error(`Failed to fetch AI config: ${res.statusText}`);
  }

  const response: AIConfigResponse = await res.json();
  console.log("-------AI config data--------", JSON.stringify(response, null, 2));
  
  return response.data;
}


// POST/UPDATE AI Config
export async function updateAIConfig(payload: UpdateAIConfigPayload): Promise<any> {
  const cookieStore = await cookies();
  
  const authToken = cookieStore.get("auth_token")?.value;
  
  if (!authToken) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${BASE_URL}/admin/ai-config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  console.log("-------response status--------", res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.log("-------error response--------", res.status, errorText);
    throw new Error(`Failed to update AI config: ${res.statusText}`);
  }

  const response: AIConfigResponse = await res.json();
  console.log("-------AI config update response--------", JSON.stringify(response, null, 2));
  
  return response.data;
}