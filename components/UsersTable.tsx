"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  deleteAdminUsers,
  type AdminUser,
  type AdminUsersResponse,
} from "@/lib/api/adminUsers";
import toast from "react-hot-toast";

type Props = {
  data: AdminUsersResponse;
};

// ✅ local debounce helper (no extra file needed)
function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function UsersTable({ data }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);


  const [searchInput, setSearchInput] = useState(sp.get("search") ?? "");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedLimit = Number(sp.get("limit") ?? data.limit);
  const currentPage = Number(sp.get("page") ?? data.page);

  const debouncedSearch = useDebounce(searchInput, 500);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const buildUrl = (
    patch: Record<string, string | number | null | undefined>,
  ) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === undefined || v === "") next.delete(k);
      else next.set(k, String(v));
    });
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const go = (patch: Record<string, string | number | null | undefined>) => {
    startTransition(() => {
      router.push(buildUrl(patch));
    });
  };

  // ✅ Auto-search while typing (debounced)
  useEffect(() => {
    const nextSearch = debouncedSearch.trim();
    const currentSearch = (sp.get("search") ?? "").trim();

    // avoid unnecessary pushes
    if (nextSearch === currentSearch) return;

    // when search changes, reset page to 1
    startTransition(() => {
      router.push(buildUrl({ search: nextSearch, page: 1 }));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]); // intentionally only debouncedSearch

  const pageNumbers = useMemo(() => {
    const total = data.totalPages;
    const p = data.page;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const nums = new Set<number>([1, total, p, p - 1, p + 1, p - 2, p + 2]);
    const arr = Array.from(nums)
      .filter((n) => n >= 1 && n <= total)
      .sort((a, b) => a - b);

    const withGaps: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      withGaps.push(arr[i]);
      if (i < arr.length - 1 && arr[i + 1] - arr[i] > 1) withGaps.push(-1);
    }
    return withGaps;
  }, [data.page, data.totalPages]);

  // --- Selection helpers (for your Delete design) ---
  const visibleIds = useMemo(() => data.items.map((u) => u.id), [data.items]);

  const allVisibleSelected = useMemo(() => {
    return (
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedIds.includes(id))
    );
  }, [visibleIds, selectedIds]);

  const toggleAllVisible = () => {
    setSelectedIds((prev) => {
      const prevSet = new Set(prev);

      if (allVisibleSelected) {
        visibleIds.forEach((id) => prevSet.delete(id));
      } else {
        visibleIds.forEach((id) => prevSet.add(id));
      }

      return Array.from(prevSet);
    });
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // No delete operation now — just a placeholder
const handleDeleteSelected = async () => {
  if (selectedIds.length === 0) return;

  startTransition(async () => {
    try {
      const res = await deleteAdminUsers(selectedIds);

      toast.success(res.message || "Users deleted successfully.");

      setSelectedIds([]);
      setIsDeleteOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete users.");
    }
  });
};


  return (
    <div>
      {/* Controls Bar */}
      <div className="bg-white rounded-t-lg p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-600">Show</span>

          <select
            value={selectedLimit}
            onChange={(e) => go({ limit: e.target.value, page: 1 })}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#967DE1] text-black"
            disabled={isPending}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <span className="text-gray-600">entries</span>

          {/* ✅ Your Delete design */}
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            disabled={selectedIds.length === 0 || isPending}
            className="ml-4 flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded text-sm text-red-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} className="text-red-500 stroke-red-500" />
            Delete
            {selectedIds.length > 0 && (
              <span className="ml-1 text-xs font-semibold text-red-600">
                ({selectedIds.length})
              </span>
            )}
          </button>

          {isPending && (
            <span className="ml-3 text-xs text-gray-500">Loading…</span>
          )}
        </div>

        <div className="relative">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                go({ search: searchInput.trim(), page: 1 });
            }}
            type="text"
            placeholder="Search here..."
            className="pl-10 pr-24 py-2 border border-[#967DE1] placeholder:text-[#967DE1] rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#967DE1] w-72"
            disabled={isPending}
          />

          <svg
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="#967DE1"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <button
            type="button"
            onClick={() => go({ search: searchInput.trim(), page: 1 })}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-white bg-[#5835C0] rounded-md hover:opacity-90 disabled:opacity-50"
            disabled={isPending}
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white overflow-hidden">
         <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#967DE1]"
                  checked={allVisibleSelected}
                  onChange={toggleAllVisible}
                />
              </th>

              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Full Name
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Email
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Role
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Email Verified
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Last Active
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Created
              </th>
            </tr>
          </thead>

          <tbody>
            {data.items.map((user: AdminUser, index: number) => (
              <tr
                key={user.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#967DE1]"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleOne(user.id)}
                  />
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {user.profile?.fullName ?? (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                <td className="px-6 py-4 text-gray-700">{user.email}</td>
                <td className="px-6 py-4 text-gray-700">{user.role}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {user.isEmailVerified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-gray-400">Not Verified</span>
                  )}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {user.lastActiveAt ? (
                    formatDate(user.lastActiveAt)
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            ))}

            {data.items.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-b-lg px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing page{" "}
          <span className="font-medium text-gray-900">{data.page}</span> of{" "}
          <span className="font-medium text-gray-900">{data.totalPages}</span> •
          Total <span className="font-medium text-gray-900">{data.total}</span>{" "}
          users
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isPending || currentPage <= 1}
            onClick={() => go({ page: currentPage - 1 })}
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {pageNumbers.map((n, idx) =>
              n === -1 ? (
                <span key={`gap-${idx}`} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={n}
                  disabled={isPending}
                  onClick={() => go({ page: n })}
                  className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    n === data.page
                      ? "text-white bg-[#5835C0] border-[#5835C0]"
                      : "text-gray-700 bg-white border-gray-300 hover:bg-[#5835C0] hover:text-white"
                  }`}
                >
                  {n}
                </button>
              ),
            )}
          </div>

          <button
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-[#5835C0] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isPending || currentPage >= data.totalPages}
            onClick={() => go({ page: currentPage + 1 })}
          >
            Next
          </button>
        </div>
      </div>

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <button
            type="button"
            onClick={() => setIsDeleteOpen(false)}
            className="absolute inset-0 bg-black/40"
            aria-label="Close"
          />

          {/* Modal */}
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete users?
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedIds.length}</span>{" "}
                user(s)? This action cannot be undone.
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isPending}
                >
                  No, cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  disabled={isPending}
                >
                  {isPending ? "Deleting..." : "Yes, delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
