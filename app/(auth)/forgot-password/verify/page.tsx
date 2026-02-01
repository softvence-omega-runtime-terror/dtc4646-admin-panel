'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Logo from '../../../../public/images/logo.png';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ForgetPasswordPage2: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const api = `${process.env.NEXT_PUBLIC_API_URL_DEV}/analyze/set-new-password`;
            const { data } = await axios.post(api, {
                email: "rezwanrahim99@gmail.com",
                newPassword: newPassword,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (data?.state) {
                router.push('/login');
                toast.success(data?.message || 'Password updated successfully!');
            } else {
                toast.error(data?.message || 'Failed to verify code.');
            }

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-8"
            style={{
                backgroundImage: 'url(/images/BG_Frame.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#0D1117',
            }}
        >
            <div className="w-[669px]">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Image
                            src={Logo}
                            alt='Polymath'
                            width={258}
                            height={64}
                            priority // Optional: if this is above the fold
                        />
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white/4 rounded-xl p-8 shadow-2xl border-[1px] border-white/4">
                    <h2 className="text-[#00FFFF] text-[32px] font-medium text-center mb-6">
                        Enter New Password
                    </h2>

                    <div className="mb-5 bg-white/8  h-[2px]" />

                    <div className="space-y-4">
                        {/* New Password */}
                        <label htmlFor="newPassword" className="block text-[#FFFFFF] text-[18px] font-normal mb-2">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            placeholder="**********"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full h-[55px] px-4 text-base bg-[#0D1117] text-[#FFFFFF] rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] placeholder-gray-500"
                        />

                        {/* Confirm Password */}
                        <label htmlFor="confirmPassword" className="block text-[#FFFFFF] text-[18px] font-normal mb-2">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="***********"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full h-[55px] px-4 text-base bg-[#0D1117] text-[#FFFFFF] rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] placeholder-gray-500"
                        />

                        {/* Confirm Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading || !newPassword || !confirmPassword}
                            className="w-full h-[55px] bg-gradient-to-r from-[#00FF7F] to-[#00E66B] text-[#0D1117] font-bold rounded-md hover:opacity-90 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-[#0D1117] border-t-transparent rounded-full animate-spin"></div>
                                    Confirming...
                                </div>
                            ) : (
                                'Confirm'
                            )}
                        </button>

                        {/* Remember Me */}
                        <div className="flex items-center text-[#FFFFFF] text-[18px] font-normal">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="mr-2"
                            />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPasswordPage2;