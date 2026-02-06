"use client";

import React, { useState } from "react";
import { Lock, X } from "lucide-react";
import Cookies from "js-cookie";
import { getUserProfile } from "@/lib/api/userProfile";
import { changePassword } from "@/lib/api/changePassword";

export default function Page() {
  const userInfo = Cookies.get("user");
  const user = userInfo ? JSON.parse(userInfo) : null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");

      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Avatar Placeholder */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#5835C0] flex items-center justify-center text-white text-3xl sm:text-4xl font-bold ring-4 ring-gray-100">
              {user.email.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 break-words">
              {user.email}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mb-2">
              {user.role}
            </p>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {user.status.toUpperCase()}
              </span>
              {user.isEmailVerified && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  EMAIL VERIFIED
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Information Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Account Information
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#A78BFA] to-[#5835C0] hover:opacity-90 text-white px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-opacity w-full sm:w-auto"
          >
            <Lock size={18} />
            Change Password
          </button>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-12 lg:gap-y-8">
          {/* Email Address */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Email Address
            </label>
            <p className="text-base sm:text-lg font-medium text-gray-900 break-words">
              {user.email}
            </p>
          </div>

          {/* User Role */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              User Role
            </label>
            <p className="text-base sm:text-lg font-medium text-gray-900">
              {user.role}
            </p>
          </div>

          {/* Account Status */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Account Status
            </label>
            <p className="text-base sm:text-lg font-medium text-gray-900 capitalize">
              {user.status}
            </p>
          </div>

          {/* User ID */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="text-sm text-gray-500 mb-2 block">User ID</label>
            <p className="text-xs sm:text-sm font-mono text-gray-900 break-all">
              {user.id}
            </p>
          </div>

          {/* Account Created */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Account Created
            </label>
            <p className="text-base sm:text-lg font-medium text-gray-900">
              {formatDate(user.createdAt)}
            </p>
          </div>

          {/* Last Updated */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Last Updated
            </label>
            <p className="text-base sm:text-lg font-medium text-gray-900">
              {formatDate(user.updatedAt)}
            </p>
          </div>

          {/* Email Verification */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Email Verification
            </label>
            <p className="text-base sm:text-lg font-medium text-gray-900">
              {user.isEmailVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-r from-[#F5F3FF] via-[#EFF6FF] to-[#F0FDFA] rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setError("");
                setSuccess("");
                setCurrentPassword("");
                setNewPassword("");
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#5835C0] flex items-center justify-center mb-4">
                <Lock className="text-white" size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Change Password
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Enter your current password and choose a new one
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleChangePassword}>
              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 text-black py-2.5 sm:py-3 border border-[#E4DBFD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter current password"
                  required
                />
              </div>

              {/* New Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-black border border-[#E4DBFD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {success}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError("");
                    setSuccess("");
                    setCurrentPassword("");
                    setNewPassword("");
                  }}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-[#E4DBFD] rounded-lg font-medium text-[#8A5CF6] hover:bg-gray-50 transition-colors order-2 sm:order-1"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#A78BFA] to-[#5835C0] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                  disabled={loading}
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
