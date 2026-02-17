"use server";

import Cookies from "js-cookie";

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

type ChangePasswordResponse = {
  message?: string;
};

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> {
  const authToken = Cookies.get("auth_token");

  if (!authToken) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_DEV}/auth/change-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to change password");
  }

  return data;
}
