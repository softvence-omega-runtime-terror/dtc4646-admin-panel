"use client";

import React from "react";

interface SWRHandlerProps<T> {
  isLoading: boolean;
  error: Error | undefined;
  data: T | undefined;
  children: (data: T) => React.ReactNode;
}

export function SWRHandler<T>({
  isLoading,
  error,
  data,
  children,
}: SWRHandlerProps<T>) {
  if (isLoading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  if (!data) {
    return <p>No data found.</p>;
  }

  return <>{children(data)}</>;
}
