import React from "react";
import { MoreVertical, Trash2 } from "lucide-react";

export default function page() {
  const users = [
    {
      id: 138,
      firstName: "Sudhaka",
      lastName: "Sksms",
      email: "sudhakaranwordpress@gmail.com",
      lastLogin: "2 weeks ago",
      created: "2 weeks ago",
    },
    {
      id: 1,
      firstName: "Demo",
      lastName: "Admin",
      email: "admin@email.com",
      lastLogin: "15 minutes ago",
      created: "5 years ago",
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Mitchell",
      email: "sarah.mitchell@example.com",
      lastLogin: "1 hour ago",
      created: "1 year ago",
    },
    {
      id: 3,
      firstName: "James",
      lastName: "Chen",
      email: "james.chen@example.com",
      lastLogin: "3 days ago",
      created: "6 months ago",
    },
  ];

  return (
    <div className="p-8">
      <div className="">
        {/* Header */}
        <div className="flex justify-end mb-6">
          <button className="bg-gradient-to-r from-[#A78BFA] to-[#5835C0] text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
            Create User
          </button>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-t-lg p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Show</span>
            <select className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black">
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>

            <button className="ml-4 flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Trash2 size={16} />
              Delete
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 border border-gray-300 placeholder:text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
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
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  <div className="flex items-center gap-1">
                    ID
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 10l5-5 5 5H5z" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  <div className="flex items-center gap-1">
                    First Name
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 10l5-5 5 5H5z" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  <div className="flex items-center gap-1">
                    Last Name
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 10l5-5 5 5H5z" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  <div className="flex items-center gap-1">
                    Email
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 10l5-5 5 5H5z" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
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
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.firstName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.created}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-lg px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing 1 to {users.length} of {users.length} entries
          </div>

          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
              «
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
              ‹
            </button>
            <button className="px-3 py-1.5 text-sm bg-[#5835C0] text-white rounded">
              1
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
              ›
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}