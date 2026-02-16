import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_DEV,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Call refresh endpoint
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/auth/refresh`,
          { refreshToken }
        );

        // Update tokens
        Cookies.set('auth_token', data.data.accessToken, {
          expires: 7,
          secure: true,
          sameSite: 'strict',
        });

        if (data.data.refreshToken) {
          Cookies.set('refresh_token', data.data.refreshToken, {
            expires: 7,
            secure: true,
            sameSite: 'strict',
          });
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Refresh failed, clear cookies and redirect
        Cookies.remove('auth_token');
        Cookies.remove('refresh_token');
        Cookies.remove('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;