"use client"

import React from "react";
import { Camera, Edit } from "lucide-react";
import Cookies from "js-cookie";

export default function page() {
  const userInfo = Cookies.get("user");
  const user = userInfo ? JSON.parse(userInfo) : null;

  console.log("-------profile------", user);


  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className='p-8 bg-gray-50 min-h-screen'>
      {/* Profile Header Card */}
      <div className='bg-white rounded-2xl p-8 mb-6 shadow-sm'>
        <div className='flex items-center gap-6'>
          {/* Avatar Placeholder */}
          <div className='relative'>
            <div className='w-32 h-32 rounded-full bg-gradient-to-br from-#A78BFA to-[#5835C0] flex items-center justify-center text-white text-4xl font-bold ring-4 ring-gray-100'>
              {user.email.charAt(0).toUpperCase()}
            </div>
            <button className='absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors'>
              <Camera size={16} className='text-gray-600' />
            </button>
          </div>

          {/* User Info */}
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-1'>
              {user.email}
            </h1>
            <p className='text-gray-600 text-lg mb-2'>{user.role}</p>
            
            {/* Status Badges */}
            <div className='flex gap-2 mt-3'>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {user.status.toUpperCase()}
              </span>
              {user.isEmailVerified && (
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700'>
                  EMAIL VERIFIED
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Information Card */}
      <div className='bg-white rounded-2xl p-8 shadow-sm'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-2xl font-bold text-gray-900'>Account Information</h2>
          <button className='flex items-center gap-2 bg-gradient-to-r from-[#A78BFA] to-[#5835C0] hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors'>
            <Edit size={18} />
            Edit
          </button>
        </div>

        {/* Information Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8'>
          {/* Email Address */}
          <div>
            <label className='text-sm text-gray-500 mb-2 block'>Email Address</label>
            <p className='text-lg font-medium text-gray-900'>{user.email}</p>
          </div>

          {/* User Role */}
          <div>
            <label className='text-sm text-gray-500 mb-2 block'>User Role</label>
            <p className='text-lg font-medium text-gray-900'>{user.role}</p>
          </div>

          {/* Account Status */}
          <div>
            <label className='text-sm text-gray-500 mb-2 block'>Account Status</label>
            <p className='text-lg font-medium text-gray-900 capitalize'>{user.status}</p>
          </div>

          {/* User ID */}
          <div className='md:col-span-3'>
            <label className='text-sm text-gray-500 mb-2 block'>User ID</label>
            <p className='text-sm font-mono text-gray-900 break-all'>{user.id}</p>
          </div>

          {/* Account Created */}
          <div>
            <label className='text-sm text-gray-500 mb-2 block'>Account Created</label>
            <p className='text-lg font-medium text-gray-900'>{formatDate(user.createdAt)}</p>
          </div>

          {/* Last Updated */}
          <div>
            <label className='text-sm text-gray-500 mb-2 block'>Last Updated</label>
            <p className='text-lg font-medium text-gray-900'>{formatDate(user.updatedAt)}</p>
          </div>

          {/* Email Verification */}
          <div>
            <label className='text-sm text-gray-500 mb-2 block'>Email Verification</label>
            <p className='text-lg font-medium text-gray-900'>
              {user.isEmailVerified ? 'Verified' : 'Not Verified'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}