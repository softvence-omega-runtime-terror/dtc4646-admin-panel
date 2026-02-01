'use client';
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="text-center max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600 mb-4">
          404
        </div>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Oops! Page Not Found
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The page you're looking for doesn’t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" /> Go Home
          </Link>
        </div>

        {/* Optional: "Go Back" button*/}
        <button
          onClick={() => window.history.back()}
          className="mt-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Back to previous page
        </button>
      </div>
    </main>
  );
}