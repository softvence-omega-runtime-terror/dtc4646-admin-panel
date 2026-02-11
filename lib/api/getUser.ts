
"use server"
import { cookies } from "next/headers";

export type User = {
  id: string;
  email: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userInfo = cookieStore.get("user");
  
  if (!userInfo) {
    return null;
  }

  try {
    return JSON.parse(userInfo.value);
  } catch {
    return null;
  }
}