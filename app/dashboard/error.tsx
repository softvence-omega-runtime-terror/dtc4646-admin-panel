// app/dashboard/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl text-red-500">Something went wrong!</h2>
      <p>{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 mt-4 text-white bg-blue-600 rounded"
      >
        Try Again
      </button>
    </div>
  );
}
