"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

if (!BASE_URL)
  throw new Error("Provider NEXT_PUBLIC_API_URL_DEV is not defined");

export async function getProviders(): Promise<any> {
  const cookieStore = await cookies();

  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${BASE_URL}/admin/providers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch providers: ${res.statusText}`);
  }

  const response = await res.json();

  return response?.data?.data;
}

// create providers
type CreateProviderPayload = {
  name: string;
  apiKey: string;
};

export async function createProvider(payload: CreateProviderPayload) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) throw new Error("No authentication token found");

  const res = await fetch(`${BASE_URL}/admin/providers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      name: payload.name.trim().toLowerCase(),
      apiKey: payload.apiKey.trim(),
    }),
    cache: "no-store",
  });

  const text = await res.text();

  let data: any;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(
      `Failed to create provider: ${res.status} ${res.statusText} - ${text}`,
    );
  }

  return data;
}

type ModelsResponse = {
  success: boolean;
  message: string;
  data: { data: { models: string[] } };
};

export async function getProviderModels(providerId: string): Promise<string[]> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) throw new Error("No authentication token found");
  if (!providerId) throw new Error("Provider id is required");

  const url = new URL(`${BASE_URL}/admin/providers/models`);
  url.searchParams.set("id", providerId);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `Failed to fetch models: ${res.status} ${res.statusText} - ${text}`,
    );
  }

  const json: ModelsResponse = JSON.parse(text);
  return json?.data?.data?.models ?? [];
}

export async function deleteProvider(id: string): Promise<any> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) throw new Error("No authentication token found");
  if (!id) throw new Error("Provider id is required");

  const res = await fetch(`${BASE_URL}/admin/providers/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(
      `Failed to delete provider: ${res.status} ${res.statusText} - ${text}`,
    );
  }

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}
