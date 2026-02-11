"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL_DEV is not defined");

type AIConfigPresetsResponse = {
  success: boolean;
  message: string;
  data: any;
};

type SetPresetPayload = {
  prompt_name: string;
};

type SetPresetResponse = {
  success: boolean;
  message: string;
  data: {
    data: {
      message: string;
      active_prompt_name: string;
      active_prompt: string;
    };
  };
};


export async function getAIConfigPresets(): Promise<any> {
  const cookieStore = await cookies();
  
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${BASE_URL}/admin/ai-config-presets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch AI config presets: ${res.statusText}`);
  }

  const response: AIConfigPresetsResponse = await res.json();
  
  return response.data;
}

// SET AI Config Preset
export async function setAIConfigPreset(payload: SetPresetPayload): Promise<any> {
  const cookieStore = await cookies();
  
  const authToken = cookieStore.get("auth_token")?.value;
  

  if (!authToken) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${BASE_URL}/admin/ai-config-set-preset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });


  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to set AI config preset: ${res.statusText}`);
  }

  const response: SetPresetResponse = await res.json();
  
  return response.data;
}