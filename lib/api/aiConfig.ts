"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL_DEV is not defined");

type AIConfigResponse = {
  success: boolean;
  message: string;
  data: any; 
};

type UpdateAIConfigPayload = {
  provider: string;
  model: string;
};


async function refreshToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return null;
    }

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    
    // Update cookies with new tokens
    cookieStore.set("auth_token", data.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 15, // 15 minutes
    });

    if (data.data.refreshToken) {
      cookieStore.set("refresh_token", data.data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return data.data.accessToken;
  } catch (error) {
    return null;
  }
}

async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  let authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    redirect("/login");
  }

  // First attempt
  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${authToken}`,
    },
  });

  // If 401, try to refresh and retry
  if (res.status === 401) {
    const newToken = await refreshToken();
    
    if (!newToken) {
      // Refresh failed, clear cookies and redirect
      cookieStore.delete("auth_token");
      cookieStore.delete("refresh_token");
      cookieStore.delete("user");
      redirect("/login");
    }

    // Retry with new token
    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Authorization": `Bearer ${newToken}`,
      },
    });
  }

  return res;
}

export async function getAIConfig(): Promise<any> {
  const res = await authenticatedFetch(`${BASE_URL}/admin/config`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch AI config: ${res.statusText}`);
  }

  const response: AIConfigResponse = await res.json();
  return response.data;
}

export async function updateAIConfig(payload: any): Promise<any> {
  const res = await authenticatedFetch(`${BASE_URL}/admin/ai-config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to update AI config: ${res.statusText}`);
  }

  const response: AIConfigResponse = await res.json();
  return response.data;
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