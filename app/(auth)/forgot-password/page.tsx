'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from '../../../public/images/logo.png';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPasswordPage1 = () => {
    const [code, setCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [email] = useState('rezwanrahim99@gmail.com');
    const [countdown, setCountdown] = useState(120);
    const [showResend, setShowResend] = useState(false);
    const router = useRouter();

    // Countdown timer effect
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setShowResend(true);
        }
    }, [countdown]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const api = `${process.env.NEXT_PUBLIC_API_URL_DEV}/analyze/verify-forget-password`;
            const { data } = await axios.post(api, {
                email: "rezwanrahim99@gmail.com",
                code: code,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (data?.state) {
                router.push('/forgot-password/verify');
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

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
        if (value.length <= 10) {
            setCode(value);
        }
    };

    const handleResend = () => {
        setCountdown(60);
        setShowResend(false);
        setCode('');
        console.log('Resend code clicked');
        // Handle resend logic here
    };

    const handleBackToLogin = () => {
        router.push('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8"
            style={{
                backgroundImage: 'url(/images/BG_Frame.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#0D1117',
            }}>
            <div className="w-full max-w-[669px]">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Image
                            src={Logo}
                            alt='Polymath'
                            width={258}
                            height={64}
                            priority
                        />
                    </div>
                </div>

                {/* Forgot Password Form */}
                <div className="bg-white/4 rounded-xl p-8 shadow-2xl border-[1px] border-white/4">
                    <h2 className="text-[#00FFFF] text-[32px] font-semibold text-center mb-6">
                        Forgot Password
                    </h2>

                    <div className="mb-5 bg-white/8  h-[2px]" />

                    <div className="space-y-6">
                        {/* Information text */}
                        <p className="text-[#FFFFFF] text-[18px] font-normal text-center mb-6">
                            We will send a mail to the mail address you registered<br />
                            to regain your password
                        </p>

                        {/* Email display */}
                        <div className="text-center">
                            <p className="text-[#00FFFF] text-[18px] font-normal">
                                {email}
                            </p>
                        </div>

                        {/* Countdown or Resend */}
                        <div className="text-center">
                            {!showResend ? (
                                <p className="text-[#00FF7F] text-[24px] font-semibold">
                                    {formatTime(countdown)}
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-[#DC091E] text-[24px] font-semibold hover:underline cursor-pointer bg-transparent border-none"
                                >
                                    Resend it?
                                </button>
                            )}
                        </div>

                        {/* Code input field */}
                        <div className="flex justify-center">
                            <input
                                type="text"
                                maxLength={6}
                                value={code}
                                onChange={handleCodeChange}
                                placeholder="68567"
                                className="w-full h-[55px] px-4 text-center text-lg bg-[#0D1117] text-[#FFFFFF] rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent placeholder-gray-500"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading || code.length === 0}
                                className="w-full h-[55px] bg-[#00FF7F] text-lg text-[#0D1117] font-bold rounded-lg hover:bg-[#00E66B] focus:outline-none focus:ring-2 focus:ring-[#00FF7F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-[#0D1117] border-t-transparent rounded-full animate-spin"></div>
                                        Verifying...
                                    </div>
                                ) : (
                                    'Confirm'
                                )}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    className="text-[#00FFFF] text-[18px] font-normal cursor-pointer bg-transparent border-none flex items-center justify-center gap-2 mx-auto"
                                    onClick={handleBackToLogin}
                                >
                                    <span>←</span>
                                    Back to login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage1;