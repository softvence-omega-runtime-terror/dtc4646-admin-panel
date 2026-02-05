import React from "react";
import { MoreVertical, Trash2 } from "lucide-react";

export default function page() {
  const users = [
    {
      id: "51b1d636-155e-40b9-a11c-4eb44f3d4f11",
      username: "admin_user",
      email: "admin@gmail.com",
      role: "ADMIN",
      status: "active",
      isEmailVerified: true,
      createdAt: "2026-01-31T05:27:43.484Z",
      updatedAt: "2026-02-03T10:59:55.107Z",
    },
    {
      id: "a2c5f789-245b-41a7-b22d-5fc55e4e5e22",
      username: "john_doe",
      email: "john.doe@example.com",
      role: "USER",
      status: "active",
      isEmailVerified: true,
      createdAt: "2026-01-15T08:30:22.123Z",
      updatedAt: "2026-02-01T14:22:33.456Z",
    },
    {
      id: "b3d6g890-356c-52b8-c33e-6gd66f5f6f33",
      username: "jane_smith",
      email: "jane.smith@example.com",
      role: "USER",
      status: "inactive",
      isEmailVerified: false,
      createdAt: "2025-12-20T10:15:44.789Z",
      updatedAt: "2026-01-28T16:45:55.890Z",
    },
    {
      id: "c4e7h901-467d-63c9-d44f-7he77g6g7g44",
      username: "mike_wilson",
      email: "mike.wilson@example.com",
      role: "USER",
      status: "active",
      isEmailVerified: true,
      createdAt: "2026-01-10T12:45:11.234Z",
      updatedAt: "2026-02-02T09:30:22.567Z",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-8">
      <div>
        {/* Header */}
        {/* <div className="flex justify-end mb-6">
          <button className="bg-gradient-to-r from-[#A78BFA] to-[#5835C0] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors">
            Create User
          </button>
        </div> */}

        {/* Controls Bar */}
        <div className="bg-white rounded-t-lg p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">Show</span>
            <select className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#967DE1] text-black">
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="text-gray-600">entries</span>

            <button className="ml-4 flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded text-sm text-red-600 hover:bg-gray-50 transition-colors cursor-pointer">
              <Trash2 size={16} className="text-red-500 stroke-red-500" />
              Delete
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 border border-[#967DE1] placeholder:text-[#967DE1] rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#967DE1] w-64"
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
          </div>
        </div>

        {/* Table */}
        <div className="bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="w-4 h-4 accent-[#967DE1]" />
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">
                  Username
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
                  Created
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
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
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-700">{user.username}</td>
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
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-lg px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium text-gray-900">1</span> to{" "}
            <span className="font-medium text-gray-900">{users.length}</span> of{" "}
            <span className="font-medium text-gray-900">{users.length}</span>{" "}
            results
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              <button className="min-w-[40px] px-3 py-2 text-sm font-medium text-white bg-[#5835C0] border border-[#5835C0] rounded-lg">
                1
              </button>
              <button className="min-w-[40px] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-[#5835C0] hover:text-white transition-colors">
                2
              </button>
              <button className="min-w-[40px] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-[#5835C0] hover:text-white transition-colors">
                3
              </button>
              <span className="px-2 text-gray-500">...</span>
              <button className="min-w-[40px] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-[#5835C0] hover:text-white transition-colors">
                10
              </button>
            </div>

            <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-[#5835C0] hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
