// app/dashboard/error.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Handle auth errors
    if (error.message === "AUTH_REQUIRED") {
      // Clear cookies
      Cookies.remove("auth_token");
      Cookies.remove("refresh_token");
      Cookies.remove("user");
      
      // Redirect to login
      router.push("/login");
    }
  }, [error, router]);

  // Don't show error page for auth issues
  if (error.message === "AUTH_REQUIRED") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl text-red-500">Something went wrong!</h2>
      <p className="text-black">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 mt-4 text-white bg-blue-600 rounded"
      >
        Try Again
      </button>
    </div>
  );
}