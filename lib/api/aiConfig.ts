"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

if (!BASE_URL)
  throw new Error("AI config NEXT_PUBLIC_API_URL_DEV is not defined");

type APIResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; requiresLogin?: boolean };

async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
): Promise<APIResult<any>> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    return {
      success: false,
      error: "Authentication required",
      requiresLogin: true,
    };
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    return { success: false, error: `Request failed: ${res.statusText}` };
  }

  const data = await res.json();
  return { success: true, data };
}

export async function getAIConfig(): Promise<APIResult<any>> {
  const result = await authenticatedFetch(`${BASE_URL}/admin/config`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!result.success) return result;
  return { success: true, data: result.data.data };
}

export async function updateAIConfig(payload: any): Promise<APIResult<any>> {
  const result = await authenticatedFetch(`${BASE_URL}/admin/ai-config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!result.success) return result;
  return { success: true, data: result.data.data };
}
// export async function getAIConfig(): Promise<any> {
//   const cookieStore = await cookies();

//   const authToken = cookieStore.get("auth_token")?.value;

//   if (!authToken) {
//     throw new Error("No authentication token found");
//   }

//   const res = await fetch(`${BASE_URL}/admin/config`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${authToken}`,
//     },
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     throw new Error(`Failed to fetch AI config: ${res.statusText}`);
//   }

//   const response: AIConfigResponse = await res.json();

//   return response.data;
// }

// POST/UPDATE AI Config
// export async function updateAIConfig(payload: UpdateAIConfigPayload): Promise<any> {
//   const cookieStore = await cookies();

//   const authToken = cookieStore.get("auth_token")?.value;

//   if (!authToken) {
//     throw new Error("No authentication token found");
//   }

//   const res = await fetch(`${BASE_URL}/admin/ai-config`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${authToken}`,
//     },
//     body: JSON.stringify(payload),
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     const errorText = await res.text();
//     throw new Error(`Failed to update AI config: ${res.statusText}`);
//   }

//   const response: AIConfigResponse = await res.json();

//   return response.data;
// }
