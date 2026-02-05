"use client";

import React, { useState } from "react";
import { Camera, Edit, Lock, X } from "lucide-react";
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

  console.log("-------profile------", user);

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
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
        <div className="flex items-center gap-6">
          {/* Avatar Placeholder */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#5835C0] flex items-center justify-center text-white text-4xl font-bold ring-4 ring-gray-100">
              {user.email.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {user.email}
            </h1>
            <p className="text-gray-600 text-lg mb-2">{user.role}</p>

            {/* Status Badges */}
            <div className="flex gap-2 mt-3">
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
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Account Information
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#A78BFA] to-[#5835C0] hover:opacity-90 text-white px-6 py-2.5 rounded-lg font-medium transition-opacity"
          >
            <Lock size={18} />
            Change Password
          </button>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
          {/* Email Address */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Email Address
            </label>
            <p className="text-lg font-medium text-gray-900">{user.email}</p>
          </div>

          {/* User Role */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              User Role
            </label>
            <p className="text-lg font-medium text-gray-900">{user.role}</p>
          </div>

          {/* Account Status */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Account Status
            </label>
            <p className="text-lg font-medium text-gray-900 capitalize">
              {user.status}
            </p>
          </div>

          {/* User ID */}
          <div className="md:col-span-3">
            <label className="text-sm text-gray-500 mb-2 block">User ID</label>
            <p className="text-sm font-mono text-gray-900 break-all">
              {user.id}
            </p>
          </div>

          {/* Account Created */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Account Created
            </label>
            <p className="text-lg font-medium text-gray-900">
              {formatDate(user.createdAt)}
            </p>
          </div>

          {/* Last Updated */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Last Updated
            </label>
            <p className="text-lg font-medium text-gray-900">
              {formatDate(user.updatedAt)}
            </p>
          </div>

          {/* Email Verification */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Email Verification
            </label>
            <p className="text-lg font-medium text-gray-900">
              {user.isEmailVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-r from-[#F5F3FF] via-[#EFF6FF] to-[#F0FDFA] rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setError("");
                setSuccess("");
                setCurrentPassword("");
                setNewPassword("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#5835C0] flex items-center justify-center mb-4">
                <Lock className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Change Password
              </h3>
              <p className="text-gray-600 mt-2">
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
                  className="w-full px-4 text-black py-3 border border-[#E4DBFD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
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
                  className="w-full px-4 py-3 text-black border border-[#E4DBFD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
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
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError("");
                    setSuccess("");
                    setCurrentPassword("");
                    setNewPassword("");
                  }}
                  className="flex-1 px-4 py-3 bg-[#E4DBFD] rounded-lg font-medium text-[#8A5CF6] hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#A78BFA] to-[#5835C0] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
