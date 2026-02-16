"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL_DEV is not defined");


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
      "Authorization": `Bearer ${authToken}`,
    },
    cache: "no-store",
  });
  console.log(res)

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch providers: ${res.statusText}`);
  }

  const response = await res.json();
  
  return response.data;
}