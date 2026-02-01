"use client";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface HistoryData {
  id: number;
  title: string;
  date: string;
  status: string;
  niche: string;
}

const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [nicheFilter, setNicheFilter] = useState("");
  const router = useRouter();

  // Updated history data based on the image
  const historyData: HistoryData[] = [
    {
      id: 1,
      title: "google",
      date: "20-July-2025",
      status: "Refined",
      niche: "Tech",
    },
    {
      id: 2,
      title: "google.com",
      date: "20-July-2025",
      status: "Analyzed",
      niche: "Health",
    },
    {
      id: 3,
      title: "www.google.com",
      date: "20-July-2025",
      status: "Generated",
      niche: "Travel",
    },
    {
      id: 4,
      title: "google image",
      date: "20-July-2025",
      status: "Refined",
      niche: "Podcast",
    },
    {
      id: 5,
      title: "google Key",
      date: "20-July-2025",
      status: "Analyzed",
      niche: "Technology",
    },
    {
      id: 6,
      title: "google Keyword",
      date: "20-July-2025",
      status: "Generated",
      niche: "Gadget",
    },
    {
      id: 7,
      title: "Keyword google",
      date: "20-July-2025",
      status: "Refined",
      niche: "Body",
    },
  ];

  // Get unique values for filter options
  const uniqueStatuses = [...new Set(historyData.map((item) => item.status))];
  const uniqueNiches = [...new Set(historyData.map((item) => item.niche))];

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return historyData.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "" || item.status === statusFilter;
      const matchesNiche = nicheFilter === "" || item.niche === nicheFilter;

      return matchesSearch && matchesStatus && matchesNiche;
    });
  }, [searchTerm, statusFilter, nicheFilter, historyData]);

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const baseClasses =
      "px-2 py-1 rounded-full text-xs font-medium inline-block";
    switch (status) {
      case "Refined":
        return `${baseClasses} bg-green-500/20 text-green-400`;
      case "Analyzed":
        return `${baseClasses} bg-yellow-500/20 text-yellow-400`;
      case "Generated":
        return `${baseClasses} bg-blue-500/20 text-blue-400`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400`;
    }
  };

  // Handle preview action
  const handlePreview = (id: number) => {
    router.push(`/dashboard/history/preview`);
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to proceed? Deleting your history is a permanent action and cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
         
        toast.success("Delete Success!");
      }
    });
  };

  return (
    <div className="w-full min-h-screen p-2 sm:p-4 lg:p-6">
      <div className="w-full">
        {/* Filter Section */}
        <div className="bg-white/5 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          {/* Mobile: Stack all filters */}
          <div className="block sm:hidden space-y-3">
            <input
              id="search"
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border bg-[#0D1117] border-gray-600 rounded w-full h-[48px] py-2 px-3 text-white placeholder-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search by title"
            />
            <select
              id="status-mobile"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block appearance-none w-full bg-[#0D1117] h-[48px] border border-gray-600 text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by Status"
            >
              <option value="">Filter by Status</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              id="niche-mobile"
              value={nicheFilter}
              onChange={(e) => setNicheFilter(e.target.value)}
              className="block appearance-none w-full bg-[#0D1117] h-[48px] border border-gray-600 text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by Niche"
            >
              <option value="">Filter by Niche</option>
              {uniqueNiches.map((niche) => (
                <option key={niche} value={niche}>
                  {niche}
                </option>
              ))}
            </select>
          </div>

          {/* Tablet and Desktop: Grid layout */}
          <div className="hidden sm:grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                id="search-desktop"
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border bg-[#0D1117] border-gray-600 rounded w-full h-[52px] py-2 px-3 text-white placeholder-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search by title"
              />
            </div>

            <div>
              <select
                id="status-desktop"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block appearance-none w-full bg-[#0D1117] h-[52px] border border-gray-600 text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filter by Status"
              >
                <option value="">Filter by Status</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                id="niche-desktop"
                value={nicheFilter}
                onChange={(e) => setNicheFilter(e.target.value)}
                className="block appearance-none w-full bg-[#0D1117] h-[52px] border border-gray-600 text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filter by Niche"
              >
                <option value="">Filter by Niche</option>
                {uniqueNiches.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm px-2">
            Showing {filteredData.length} of {historyData.length} results
          </p>
        </div>

        {/* Desktop and Tablet Table View */}
        <div className="hidden sm:block mb-8">
          <div className="rounded-lg overflow-hidden ">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#21262D]">
                  <tr>
                    <th className="text-left py-3 px-3 lg:px-6 text-gray-300 font-medium text-sm">
                      Title
                    </th>
                    <th className="text-left py-3 px-3 lg:px-6 text-gray-300 font-medium text-sm">
                      Date
                    </th>
                    <th className="text-left py-3 px-3 lg:px-6 text-gray-300 font-medium text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-3 lg:px-6 text-gray-300 font-medium text-sm">
                      Niche
                    </th>
                    <th className="text-left py-3 px-3 lg:px-6 text-gray-300 font-medium text-sm">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((history, index) => (
                      <tr
                        key={history.id}
                        className={` hover:bg-gray-700/30 transition-colors`}
                      >
                        <td className="py-3 px-3 lg:px-6">
                          <div className="flex items-center space-x-3">
                            <span className="text-white font-medium text-sm lg:text-base truncate max-w-[150px] lg:max-w-none">
                              {history.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 lg:px-6">
                          <span className="text-gray-300 text-sm lg:text-base">
                            {history.date}
                          </span>
                        </td>
                        <td className="py-3 px-3 lg:px-6">
                          <span className={getStatusBadge(history.status)}>
                            {history.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 lg:px-6">
                          <span className="text-gray-300 text-sm lg:text-base">
                            {history.niche}
                          </span>
                        </td>
                        <td className="py-3 px-3 lg:px-6">
                          <div className="flex space-x-1 lg:space-x-2">
                            <button
                              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors font-normal py-1.5 px-2 lg:py-2 lg:px-4 rounded-full text-xs lg:text-sm cursor-pointer"
                              onClick={() => handlePreview(history.id)}
                            >
                              View
                            </button>
                            <button
                              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-normal py-1.5 px-2 lg:py-2 lg:px-4 rounded-full text-xs lg:text-sm cursor-pointer"
                              onClick={() => {
                                handleDelete(history.id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 px-6 text-center text-gray-400"
                      >
                        No results found. Try adjusting your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden">
          <div className="space-y-3">
            {filteredData.length > 0 ? (
              filteredData.map((history) => (
                <div
                  key={history.id}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-white font-medium text-base flex-1 pr-2">
                      {history.title}
                    </h3>
                    <span className={getStatusBadge(history.status)}>
                      {history.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-400 mb-4">
                    <div>
                      <span className="font-medium text-gray-300">Date:</span>
                      <br />
                      <span>{history.date}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Niche:</span>
                      <br />
                      <span>{history.niche}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors font-normal py-2 px-4 rounded-full text-sm flex-1 cursor-pointer"
                      onClick={() => handlePreview(history.id)}
                    >
                      View
                    </button>
                    <button
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-normal py-2 px-4 rounded-full text-sm flex-1 cursor-pointer"
                      onClick={() => {
                        handleDelete(history.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
                No results found. Try adjusting your search or filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
