'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Logo from '../../../public/images/logo.png';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import LoadingSpinner from '@/components/LoadingSpinner';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgetPasswordLoading, setForgetPasswordLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

    else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const formatApiData = {
      email: formData.email,
      password: formData.password,
    }

    // API call
    try {
      const api = `${process.env.NEXT_PUBLIC_API_URL_DEV}/auth/admin/login`;
      const { data } = await axios.post(api, formatApiData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (data?.success) {
        // Store token in cookies
        Cookies.set('auth_token', data?.data?.accessToken, {
          expires: 7,
          secure: true,
          sameSite: 'strict',
        })

        Cookies.set('user', JSON.stringify(data?.data?.user), {
          expires: 7,
          secure: true,
          sameSite: 'strict',
        });

        // Redirect to dashboard
        router.push('/dashboard');
        toast.success(data?.message || 'Login successful!');
      } else {
        toast.error(data?.message || 'Login failed. Please try again.');
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-r from-[#F5F3FF] via-[#EFF6FF] to-[#F0FDFA]"
      // style={{
      //   backgroundImage: 'url(/images/BG_Frame.png)',
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      //   backgroundRepeat: 'no-repeat',
      //   backgroundColor: '#0D1117',
      // }}
    >
      <div className="w-[669px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">

            <h1 className='text-[#7D68BC] text-4xl font-bold'>InterviewFIo</h1>

          </div>
        </div>

        {/* Login Form */}

        <div className="relative">
          <div className="relative min-h-[500px]">
            {isForgetPasswordLoading ? <LoadingSpinner size="lg" text="Please wait.... Sending verification code to your email." /> :
              <form
                onSubmit={handleSubmit}
                className="bg-white/4 rounded-xl p-8 shadow-2xl border-[1px] border-white/4 "
              >
                <h2 className="text-[#111827] text-[24px] font-semibold text-center mb-6">Admin Login</h2>
                <div className="mb-5 bg-white/8  h-[2px]" />
                <div className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-[#111827] text-[18px] font-normal mb-2">
                      Enter mail
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="yourmail@mailhere"
                      className={`w-full h-[56px] px-4 py-3 text-[#111827] rounded-lg border ${errors.email ? 'border-red-500' : 'border-[#E4DBFD]'
                        } focus:outline-none focus:ring-2 focus:ring-[#E4DBFD] focus:border-transparent placeholder-[#967DE1]transition-colors`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-[#111827] text-[18px] font-normal mb-2">
                      Enter Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••••••••"
                        className={`w-full h-[56px] px-4 py-3 pr-12 text-[#111827] rounded-lg border ${errors.password ? 'border-red-500' : 'border-[#E4DBFD]'
                          } focus:outline-none focus:ring-2 focus:ring-[#E4DBFD] focus:border-transparent placeholder-[#967DE1] transition-colors`}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#967DE1] hover:text-[#967DE1] transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[55px] py-3 text-lg bg-gradient-to-r from-[#A78BFA] to-[#5835C0] text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF7F] focus:ring-offset-2 focus:ring-offset-[#1a2332] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-[#0D1117] border-t-transparent rounded-full animate-spin"></div>
                        Logging in...
                      </div>
                    ) : (
                      'Login'
                    )}
                  </button>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[#111827] text-[18px]  font-normal cursor-pointer">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[#967DE1] bg-[#0D1117] border-gray-600 rounded cursor-pointer"
                      />
                      Remember me
                    </label>
                  </div>
                </div>
              </form>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;