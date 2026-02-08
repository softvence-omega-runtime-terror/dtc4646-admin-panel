"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL_DEV is not defined");

export type AdminUser = {
  id: string;
  email: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  lastActiveAt: string | null;
  createdAt: string;
  updatedAt: string;

  profile: null | {
    fullName?: string | null;
    currentRole?: string | null;
    targetRole?: string | null;
  };
};

export type AdminUsersResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  items: AdminUser[];
};

type DeleteUsersResponse = {
  success: boolean;
  message: string;
  deletedCount?: number;
};


type GetAdminUsersParams = {
  page?: number;
  limit?: number;
  search?: string; // adjust param name if your backend uses q or keyword
};


type AdminUsersCountResponse = {
  success: boolean;
  message: string;
  data: {
    total: number;
  };
};

export async function getAdminUsersCount(): Promise<number> {
  const cookieStore = await cookies();

  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${BASE_URL}/admin/users/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch users count: ${res.statusText}`);
  }

  const response: AdminUsersCountResponse = await res.json();

  return response.data.total;
}


export async function getAdminUsers(params: GetAdminUsersParams = {}): Promise<AdminUsersResponse> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  if (!authToken) throw new Error("No authentication token found");

  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const search = (params.search ?? "").trim();

  const url = new URL(`${BASE_URL}/admin/users`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (search) url.searchParams.set("search", search); // ✅ change "search" if your API uses a different key

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch users: ${res.status} ${errorText}`);
  }

  const json = await res.json();
  return json.data as AdminUsersResponse;
}


export async function deleteAdminUsers(userIds: string[]): Promise<DeleteUsersResponse> {
  if (!userIds.length) {
    return { success: false, message: "No users selected." };
  }

  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  if (!authToken) throw new Error("No authentication token found");

  const res = await fetch(`${BASE_URL}/admin/users`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    // ✅ Swagger says: { "userIds": [...] }
    body: JSON.stringify({ userIds }),
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      json?.message ||
      json?.error ||
      `Failed to delete users (${res.status})`;
    throw new Error(msg);
  }

  // Swagger example: { success, message, deletedCount }
  return json as DeleteUsersResponse;
}