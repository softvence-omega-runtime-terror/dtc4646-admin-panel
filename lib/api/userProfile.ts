"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;
if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL_DEV is not defined");

export type UserProfile = {
  id: string;
  email: string;
  role: "ADMIN" | "USER" | string;
  status: "active" | "inactive" | string;
  isEmailVerified: boolean;

  verificationCode: string | null;
  verificationCodeExpiry: string | null;

  // This should NOT be returned by profile API ideally,
  // but since your backend sends it, keep it typed.
  refreshToken: string;

  // Most likely an array in real systems
  fcmTokens: string[] | null;

  profileId: string | null;
  lastActiveAt: string | null;

  createdAt: string;
  updatedAt: string;
};

type UserProfileResponse = {
  success: boolean;
  message: string;
  data: UserProfile;
};

export async function getUserProfile(): Promise<UserProfile> {
  const cookieStore = cookies(); // ✅ no await
  const authToken = (await cookieStore).get("auth_token")?.value;

  if (!authToken) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${BASE_URL}/user/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch user profile: ${res.status} ${errorText}`);
  }

  const response = (await res.json()) as UserProfileResponse;
  return response.data;
}
