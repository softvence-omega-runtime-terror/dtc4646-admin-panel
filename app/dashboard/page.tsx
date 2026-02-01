"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";
import IssueModal from "@/components/IssueModal";
import { MetricCard } from "@/types";
import DashboardMetrics from "@/components/DashboardMetrics";
import DownloadIcon from "@/components/icons/Download";
import useSWR from "swr";
import Link from "next/link";
import DashboardLoadingScreen from "@/components/DashboardLoadingScreen";
import jsPDF from "jspdf";
import axios from "axios";

// Constants
const CACHE_KEY_PREFIX = "seoAnalysisCache";
const CACHE_EXPIRY = 3600000; // 1 hour in milliseconds

// Type definitions
type AnalysisData = {
  data?: any;
  errorData?: any;
  brokenLinksData?: any;
};

type CachedData = {
  data: any;
  timestamp: number;
};

type LoadingSteps = {
  crawl: boolean;
  brokenLinks: boolean;
  seoAnalysis: boolean;
  websiteAnalysis: boolean;
};

type LoadingState = {
  progress: number;
  currentStep: string;
  completedSteps: LoadingSteps;
};

const LOADING_STEPS = {
  INITIALIZING: { weight: 0.1, message: 'Initializing analysis...' },
  CRAWLING: { weight: 0.3, message: 'Crawling website...' },
  BROKEN_LINKS: { weight: 0.2, message: 'Checking broken links...' },
  SEO_ANALYSIS: { weight: 0.3, message: 'Analyzing SEO...' },
  FINALIZING: { weight: 0.1, message: 'Finalizing results...' },
};

const MainContent: React.FC = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<{
    type: "image" | "content" | "keyword";
    data: any;
  } | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [errorData, setErrorData] = useState<any>(null);
  const [brokenLinksData, setBrokenLinksData] = useState<any>(null);
  const [apiErrors, setApiErrors] = useState<{
    analysisError?: Error;
    seoError?: Error;
    brokenLinksError?: Error;
  }>({});
  const [showingCachedData, setShowingCachedData] = useState(false);
  const previousUrlRef = useRef<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    progress: 0,
    currentStep: 'Initializing analysis...',
    completedSteps: {
      crawl: false,
      brokenLinks: false,
      seoAnalysis: false,
      websiteAnalysis: false,
    },
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV || '';

  // Helper function to get cache key for a specific endpoint and URL
  const getCacheKey = (endpoint: string, url: string) => {
    return `${CACHE_KEY_PREFIX}:${endpoint}:${url.toLowerCase()}`; // Normalize URL to lowercase
  };

  // Get cached data with expiry check
  const getCachedData = (key: string): any | null => {
    if (typeof window === "undefined") return null;

    const cached = localStorage.getItem(key);
    if (!cached) return null;

    try {
      const { data, timestamp }: CachedData = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
      // Remove expired cache
      localStorage.removeItem(key);
      return null;
    } catch (e) {
      console.error("Error parsing cached data:", e);
      localStorage.removeItem(key);
      return null;
    }
  };

  // Set data to cache with current timestamp
  const setCachedData = (key: string, data: any) => {
    if (typeof window === "undefined") return;
    const cacheItem: CachedData = {
      data,
      timestamp: Date.now()
    };
    localStorage.removeItem(key); // Clear existing cache first
    localStorage.setItem(key, JSON.stringify(cacheItem));
  };


  // Clear all cached data for a specific URL
  const clearUrlCache = (url: string) => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`${CACHE_KEY_PREFIX}:`) && key.endsWith(`:${url}`)) {
        localStorage.removeItem(key);
      }
    });
  };

  // Check if we have complete cached data for a URL
  const hasCompleteCachedData = (url: string): boolean => {
    const requiredKeys = [
      getCacheKey("analyze/website", url),
      getCacheKey("seo-analyzer/analyze", url),
      getCacheKey("broken-links", url)
    ];

    return requiredKeys.every(key => {
      const cached = getCachedData(key);
      return cached !== null;
    });
  };

  // Get all cached data for a URL
  const getCompleteCachedData = (url: string): AnalysisData | null => {
    if (!hasCompleteCachedData(url)) return null;

    return {
      data: getCachedData(getCacheKey("analyze/website", url)),
      errorData: getCachedData(getCacheKey("seo-analyzer/analyze", url)),
      brokenLinksData: getCachedData(getCacheKey("broken-links", url))
    };
  };

  // API call functions with caching
  const callPostApi = async (endpoint: string, urlParam: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}?url=${encodeURIComponent(urlParam)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API post error (${endpoint}):`, error);
      throw error;
    }
  };

  const callGetApi = async (endpoint: string, urlParam: string) => {
    const cacheKey = getCacheKey(endpoint, urlParam);

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}?url=${encodeURIComponent(urlParam)}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      // Cache the response
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`API get error (${endpoint}):`, error);
      throw error;
    }
  };

  // Analysis handler with caching support
  const handleAnalyze = async () => {
    if (!url.trim()) return;

    const currentUrl = url.trim();
    previousUrlRef.current = currentUrl;

    // Check if we have complete cached data
    const cachedData = getCompleteCachedData(currentUrl);
    if (cachedData) {
      setAnalysisData(cachedData.data);
      setErrorData(cachedData.errorData);
      setBrokenLinksData(cachedData.brokenLinksData);
      setSubmittedUrl(currentUrl);
      setShowingCachedData(true);
      return;
    }

    try {
      setLoading(true);
      setSubmittedUrl(currentUrl);
      setActiveTab("overview");
      setShowingCachedData(false);

      // Reset loading state
      setLoadingState({
        progress: 0,
        currentStep: LOADING_STEPS.INITIALIZING.message,
        completedSteps: {
          crawl: false,
          brokenLinks: false,
          seoAnalysis: false,
          websiteAnalysis: false,
        },
      });

      // Step 1: Initialization (10%)
      await animateProgress(10, LOADING_STEPS.INITIALIZING.message);

      // Step 2: Start crawler (30%)
      await animateProgress(30, LOADING_STEPS.CRAWLING.message);
      const crawlResult = await callPostApi("crawler/start", currentUrl);

      if (!crawlResult?.status) {
        throw new Error('Crawler failed to start');
      }

      setLoadingState(prev => ({
        ...prev,
        completedSteps: { ...prev.completedSteps, crawl: true }
      }));

      // Step 3: Broken links check (50%)
      await animateProgress(50, LOADING_STEPS.BROKEN_LINKS.message);
      await callPostApi("broken-links/crawl", currentUrl);

      setLoadingState(prev => ({
        ...prev,
        completedSteps: { ...prev.completedSteps, brokenLinks: true }
      }));

      // Step 4: Fetch analysis data (70%)
      await animateProgress(70, LOADING_STEPS.SEO_ANALYSIS.message);

      // Call GET APIs sequentially and cache results
      const [analysisRes, errorRes, brokenLinksRes] = await Promise.all([
        callGetApi("analyze/website", currentUrl),
        callGetApi("seo-analyzer/analyze", currentUrl),
        callGetApi("broken-links", currentUrl)
      ]);

      setAnalysisData(analysisRes);
      setErrorData(errorRes);
      setBrokenLinksData(brokenLinksRes);

      setLoadingState(prev => ({
        ...prev,
        completedSteps: {
          ...prev.completedSteps,
          seoAnalysis: true,
          websiteAnalysis: true
        }
      }));

      // Finalize (100%)
      await animateProgress(100, LOADING_STEPS.FINALIZING.message);

    } catch (error) {
      console.error("Analysis error:", error);
      setLoadingState(prev => ({
        ...prev,
        currentStep: 'Analysis failed. Please try again.'
      }));

      if (error instanceof Error) {
        setApiErrors(prev => ({ ...prev, analysisError: error }));
      }
    } finally {
      setLoading(false);
    }
  };


  // Rest of your component code remains the same...
  // (animateProgress, pollApiStatus, render methods, etc.)

  // Processed data - uses cached data if showingCachedData is true
  const data = showingCachedData
    ? analysisData?.data
    : analysisData?.data;

  const effectiveErrorData = showingCachedData
    ? { ...errorData, ...brokenLinksData }
    : errorData && brokenLinksData
      ? { ...errorData, ...brokenLinksData }
      : null;

  console.log('Effective Error Data:', effectiveErrorData);
  // Error state check
  const hasError = apiErrors.analysisError || apiErrors.seoError || apiErrors.brokenLinksError;


  // Progress animation helper
  const animateProgress = async (targetProgress: number, stepMessage: string) => {
    return new Promise<void>((resolve) => {
      const duration = 500; // Animation duration in ms
      const startTime = performance.now();
      const startProgress = loadingState.progress;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentProgress = startProgress + (targetProgress - startProgress) * progress;

        setLoadingState(prev => ({
          ...prev,
          progress: currentProgress,
          currentStep: stepMessage
        }));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  };

  // Polling function to check API status
  const pollApiStatus = async (url: string, checkFn: (data: any) => boolean, interval = 1000, timeout = 30000) => {
    const startTime = Date.now();

    return new Promise<void>((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const response = await fetch(url);
          const data = await response.json();

          if (checkFn(data)) {
            resolve();
          } else if (Date.now() - startTime > timeout) {
            reject(new Error('Polling timeout'));
          } else {
            setTimeout(checkStatus, interval);
          }
        } catch (error) {
          reject(error);
        }
      };

      checkStatus();
    });
  };


  // Event handlers
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAnalyze();
  };

  const handleDownloadPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`SEO Analysis Report - ${data.url}`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Analysis Date: ${data.analysisDate}`, 10, 30);
    doc.text(`SEO Score: ${data.seoScore}`, 10, 40);
    doc.text(`Site Health: ${data.siteHealth}`, 10, 50);
    doc.save(`seo-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleOpenModal = (issueType: "image" | "content" | "keyword") => {
    if (!data) return;
    setCurrentIssue({ type: issueType, data: data.issues });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentIssue(null);
  };

  const staticChartData = [
    { month: "SEP", health: 25, issues: 5 },
    { month: "OCT", health: 50, issues: 5 },
    { month: "NOV", health: 90, issues: 5 },
    { month: "DEC", health: 85, issues: 10 },
    { month: "JAN", health: 60, issues: 15 },
    { month: "FEB", health: 80, issues: 20 },
    { month: "MAR", health: 80, issues: 25 },
    { month: "APR", health: 95, issues: 30 },
    { month: "MAY", health: 65, issues: 35 },
    { month: "JUN", health: 80, issues: 40 },
    { month: "JUL", health: 90, issues: 50 },
    { month: "AUG", health: 70, issues: 60 },
  ];


  const getChartData = () => staticChartData;


  const getPieChartData = () => {
    if (!data) return [];
    return [
      { name: "Health", value: data.siteHealth, color: "#00ff00" },
      { name: "Issues", value: 100 - data.siteHealth || 0, color: "#ff0000" },
    ];
  };

  // Render helpers
  const renderIssueGroup = (title: string, issues: any[]) => (
    <div className="mb-8">
      <h3 className="mb-8 text-lg font-medium text-white">{title}</h3>
      <div className="space-y-4 w-full">
        {issues?.length > 0 ? issues?.map((item, index) => (
          <div
            key={index}
            className="w-full pb-4 border-b border-gray-600 md:flex md:justify-between"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center space-x-2 w-full">
                <svg
                  width="22"
                  height="23"
                  viewBox="0 0 22 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="11"
                    cy="11.5"
                    r="10"
                    stroke="#C8081B"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10.992 14.5H11.001"
                    stroke="#C8081B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 11.5L11 7.5"
                    stroke="#C8081B"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* ✅ Truncation wrapper */}
                <div className="w-0 flex-1">
                  <Link
                    href={item}
                    target="_blank"
                    className="block truncate text-base text-white underline cursor-pointer hover:text-blue-300"
                    title={item} // optional: show full URL on hover
                  >
                    {item}
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end w-full gap-6">
              <button
                onClick={() => handleOpenModal("image")}
                className="px-4 py-2 rounded-xl cursor-pointer text-normal font-normal border border-[#00FF7F] text-[#00FF7F] bg-[#00FF7F]/8"
              >
                Solution
              </button>
            </div>
          </div>
        )) : <h1 className="text-xl font-medium text-white font-mono">No {title} Issues Found!</h1>}
      </div>
    </div>
  );


  const BrokenLinkrenderIssue = (title: string, issues: any[]) => {
    const getStatusColor = (status: number) => {
      if (status >= 400 && status < 500) return 'text-red-400'; // Client errors
      if (status >= 500) return 'text-red-500'; // Server errorsj
      if (status >= 300 && status < 400) return 'text-yellow-400'; // Redirects
      return 'text-yellow-400'; // Success (200s)
    };

    const filteredIssues = issues?.filter(item => item.status === 404 || item.status === 'Request Failed');

    return (
      <div className="mb-8">
        <h3 className="mb-8 text-lg font-medium text-white bg-red-500 w-fit p-2 rounded">{title}</h3>
        <div className="space-y-4 w-full">
          {filteredIssues?.length > 0 ? filteredIssues?.map((item) => (
            <div key={item.url} className="w-full pb-4 border-b border-gray-600 md:flex md:justify-between">
              <div className="flex flex-col w-full mb-3 md:flex-row md:items-center md:gap-4">
                <div className="flex items-center gap-2 w-full flex-wrap">
                  <svg width="22" height="23" viewBox="0 0 22 23" fill="none" className="flex-shrink-0">
                    <circle cx="11" cy="11.5" r="10" stroke="#C8081B" strokeWidth="1.5" />
                    <path d="M10.992 14.5H11.001" stroke="#C8081B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 11.5L11 7.5" stroke="#C8081B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-white underline hover:text-blue-300 break-all"
                  >
                    {item.url}
                  </Link>

                  <span className="text-lg text-gray-400">
                    Status:
                    <span className={`ml-1 font-bold ${getStatusColor(item.status)} bg-gray-800 px-2 py-1 rounded`}>
                      {item.status}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex justify-end w-full mt-3 md:mt-0 md:w-auto">
                <button className="px-4 py-2 rounded-xl font-normal border border-[#00FF7F] text-[#00FF7F] bg-[#00FF7F]/8 hover:bg-[#00FF7F]/20 transition-colors" onClick={() => handleOpenModal("image")}>
                  Solution
                </button>
              </div>
            </div>
          )) : <h1 className="text-xl font-medium text-white font-mono">No {title} Issues Found!</h1>}
        </div>
      </div>
    );
  };

  const totalIssues =
    (effectiveErrorData?.data?.brokenLinks?.length || 0) +
    (effectiveErrorData?.oversizedImages?.length || 0) +
    (effectiveErrorData?.blurryImages?.length || 0) +
    (effectiveErrorData?.websiteLink?.length || 0);


  const renderErrorContent = () => {
    if (!effectiveErrorData?.data?.brokenLinks?.length && !effectiveErrorData?.data?.oversizedImages?.length && !effectiveErrorData?.data?.blurryImages?.length) return <div className="p-4 md:p-6 max-w-full text-white text-center text-2xl font-bold">No Issues Found!</div>;

    return (
      <div className="p-4 md:p-6 max-w-full">
        {effectiveErrorData?.data?.brokenLinks?.length > 0 && <div className="p-8 mb-6 rounded-lg bg-white/5 max-w-full">
          {BrokenLinkrenderIssue("Broken Links", effectiveErrorData?.data?.brokenLinks)}
        </div>}

        <div className="p-8 mb-6 rounded-lg bg-white/5 max-w-full">
          {renderIssueGroup("Oversized Images", effectiveErrorData?.oversizedImages || [])}
        </div>

        <div className="p-8 mb-6 rounded-lg bg-white/5 max-w-full">
          {renderIssueGroup("Blurry Images", effectiveErrorData?.blurryImages || [])}
        </div>

        <div className="p-8 mb-6 rounded-lg bg-white/5 max-w-full">
          {renderIssueGroup("Website Links", effectiveErrorData?.websiteLink || [])}
        </div>
      </div >
    );
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLoadingScreen
        progress={Math.floor(loadingState.progress)}
        currentStep={loadingState.currentStep}
      />
    );
  }

  // Error state
  if ((hasError) && !showingCachedData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1117]">
        <div className="p-6 text-center bg-[#161B22] rounded-lg">
          <h3 className="mb-4 text-xl font-medium text-[#DC091E]">Analysis Failed</h3>
          <p className="text-gray-300">Please try again or check the URL</p>
          <button
            onClick={() => setSubmittedUrl(null)}
            className="px-4 py-2 mt-4 text-white bg-[#00FFFF] rounded-lg hover:bg-[#00C260]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Initial state
  if (!submittedUrl && !showingCachedData && !analysisData) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white">
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-full">
            <h2 className="text-2xl md:text-3xl lg:text-[32px] font-medium text-[#00FFFF] mb-4">
              Optimize Your Website for Maximum Reach
            </h2>
            <p className="text-[#FFFFFF] text-base md:text-lg font-normal mb-6 md:mb-8 leading-relaxed">
              Unlock your website's full potential with SEO Insights. Identify
              issues, get actionable recommendations, and improve visibility
              across search engines to attract more visitors and grow your online
              presence.
            </p>

            {/* URL Input Section */}
            <div className="flex items-center w-full mb-8 md:mb-12">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.1002 3.5C7.45057 3.50657 5.53942 3.59617 4.31806 4.81754C3 6.13559 3 8.25698 3 12.4997C3 16.7425 3 18.8639 4.31806 20.1819C5.63611 21.5 7.7575 21.5 12.0003 21.5C16.243 21.5 18.3644 21.5 19.6825 20.1819C20.9038 18.9606 20.9934 17.0494 21 13.3998" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21.0705 4.53235C21.3645 4.24058 21.3663 3.76571 21.0745 3.4717C20.7827 3.17769 20.3079 3.17588 20.0139 3.46765L21.0705 4.53235ZM14.4717 8.96765C14.1777 9.25942 14.1759 9.73429 14.4676 10.0283C14.7594 10.3223 15.2343 10.3241 15.5283 10.0324L14.4717 8.96765ZM20.0285 3.72706L19.8977 4.46557L20.0285 3.72706ZM15.9999 2.75C15.5857 2.75004 15.25 3.08585 15.25 3.50007C15.25 3.91428 15.5859 4.25004 16.0001 4.25L15.9999 2.75ZM20.25 8.5C20.25 8.91421 20.5858 9.25 21 9.25C21.4142 9.25 21.75 8.91421 21.75 8.5H20.25ZM20.7729 4.47175L21.5115 4.34109V4.34109L20.7729 4.47175ZM20.5422 4L20.0139 3.46765L14.4717 8.96765L15 9.5L15.5283 10.0324L21.0705 4.53235L20.5422 4Z" fill="white" />
                  </svg>
                </div>
                <input
                  type="url"
                  placeholder="Paste website URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full h-[60px] md:h-[50px] bg-transparent border border-gray-600 rounded-lg py-3 pl-12 pr-4 md:pr-48 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={!url.trim()}
                  className={`absolute inset-y-0 right-0 hidden md:flex items-center justify-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 m-2 w-[130px] h-[35px] text-black font-normal cursor-pointer ${!url.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
                  style={{
                    background: "linear-gradient(to right, #00FF7F, #00C260)",
                  }}
                >
                  <span className="text-[20px]">Analyze</span>
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.1666 14.6667L16.875 17.375" stroke="#0D1117" strokeWidth="2.16667" strokeLinejoin="round" />
                    <path d="M16.8027 19.5689C16.1769 18.9431 16.1769 17.9285 16.8027 17.3027C17.4285 16.6769 18.4432 16.6769 19.069 17.3027L22.364 20.5977C22.9898 21.2235 22.9898 22.2382 22.364 22.864C21.7382 23.4898 20.7236 23.4898 20.0978 22.864/L16.8027 19.5689Z" stroke="#0D1117" strokeWidth="2.16667" strokeLinecap="round" />
                    <path d="M16.3333 9.25001C16.3333 5.06185 12.9381 1.66667 8.74996 1.66667C4.5618 1.66667 1.16663 5.06185 1.16663 9.25001C1.16663 13.4382 4.5618 16.8333 8.74996 16.8333C12.9381 16.8333 16.3333 13.4382 16.3333 9.25001Z" stroke="#0D1117" strokeWidth="2.16667" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Analyze Button */}
            <div className="mb-8 md:hidden">
              <button
                onClick={handleAnalyze}
                disabled={!url.trim()}
                className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 h-[55px] text-black font-normal ${!url.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
                style={{
                  background: "linear-gradient(to right, #00FF7F, #00C260)",
                }}
              >
                <span className="text-[20px]">Analyze</span>
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.1666 14.6667L16.875 17.375" stroke="#0D1117" strokeWidth="2.16667" strokeLinejoin="round" />
                  <path d="M16.8027 19.5689C16.1769 18.9431 16.1769 17.9285 16.8027 17.3027C17.4285 16.6769 18.4432 16.6769 19.069 17.3027L22.364 20.5977C22.9898 21.2235 22.9898 22.2382 22.364 22.864C21.7382 23.4898 20.7236 23.4898 20.0978 22.864/L16.8027 19.5689Z" stroke="#0D1117" strokeWidth="2.16667" strokeLinecap="round" />
                  <path d="M16.3333 9.25001C16.3333 5.06185 12.9381 1.66667 8.74996 1.66667C4.5618 1.66667 1.16663 5.06185 1.16663 9.25001C1.16663 13.4382 4.5618 16.8333 8.74996 16.8333C12.9381 16.8333 16.3333 13.4382 16.3333 9.25001Z" stroke="#0D1117" strokeWidth="2.16667" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main content when data is available
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-full">
          <h2 className="text-2xl md:text-3xl lg:text-[32px] font-medium text-[#00FFFF] mb-4">
            Optimize Your Website for Maximum Reach
          </h2>
          <p className="text-[#FFFFFF] text-base md:text-lg font-normal mb-6 md:mb-8 leading-relaxed">
            Unlock your website's full potential with SEO Insights. Identify
            issues, get actionable recommendations, and improve visibility
            across search engines to attract more visitors and grow your online
            presence.
          </p>

          {/* URL Input Section (repeated for consistency) */}
          <div className="flex items-center w-full mb-8 md:mb-12">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.1002 3.5C7.45057 3.50657 5.53942 3.59617 4.31806 4.81754C3 6.13559 3 8.25698 3 12.4997C3 16.7425 3 18.8639 4.31806 20.1819C5.63611 21.5 7.7575 21.5 12.0003 21.5C16.243 21.5 18.3644 21.5 19.6825 20.1819C20.9038 18.9606 20.9934 17.0494 21 13.3998" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21.0705 4.53235C21.3645 4.24058 21.3663 3.76571 21.0745 3.4717C20.7827 3.17769 20.3079 3.17588 20.0139 3.46765L21.0705 4.53235ZM14.4717 8.96765C14.1777 9.25942 14.1759 9.73429 14.4676 10.0283C14.7594 10.3223 15.2343 10.3241 15.5283 10.0324L14.4717 8.96765ZM20.0285 3.72706L19.8977 4.46557L20.0285 3.72706ZM15.9999 2.75C15.5857 2.75004 15.25 3.08585 15.25 3.50007C15.25 3.91428 15.5859 4.25004 16.0001 4.25L15.9999 2.75ZM20.25 8.5C20.25 8.91421 20.5858 9.25 21 9.25C21.4142 9.25 21.75 8.91421 21.75 8.5H20.25ZM20.7729 4.47175L21.5115 4.34109V4.34109L20.7729 4.47175ZM20.5422 4L20.0139 3.46765L14.4717 8.96765L15 9.5L15.5283 10.0324L21.0705 4.53235L20.5422 4Z" fill="white" />
                </svg>
              </div>
              <input
                type="url"
                placeholder="Paste website URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full h-[60px] md:h-[50px] bg-transparent border border-gray-600 rounded-lg py-3 pl-12 pr-4 md:pr-48 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAnalyze}
                disabled={!url.trim()}
                className={`absolute inset-y-0 right-0 hidden md:flex items-center justify-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 m-2 w-[130px] h-[35px] text-black font-normal cursor-pointer ${!url.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
                style={{
                  background: "linear-gradient(to right, #00FF7F, #00C260)",
                }}
              >
                <span className="text-[20px]">Analyze</span>
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.1666 14.6667L16.875 17.375" stroke="#0D1117" strokeWidth="2.16667" strokeLinejoin="round" />
                  <path d="M16.8027 19.5689C16.1769 18.9431 16.1769 17.9285 16.8027 17.3027C17.4285 16.6769 18.4432 16.6769 19.069 17.3027L22.364 20.5977C22.9898 21.2235 22.9898 22.2382 22.364 22.864C21.7382 23.4898 20.7236 23.4898 20.0978 22.864/L16.8027 19.5689Z" stroke="#0D1117" strokeWidth="2.16667" strokeLinecap="round" />
                  <path d="M16.3333 9.25001C16.3333 5.06185 12.9381 1.66667 8.74996 1.66667C4.5618 1.66667 1.16663 5.06185 1.16663 9.25001C1.16663 13.4382 4.5618 16.8333 8.74996 16.8333C12.9381 16.8333 16.3333 13.4382 16.3333 9.25001Z" stroke="#0D1117" strokeWidth="2.16667" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Analyze Button */}
          <div className="mb-8 md:hidden">
            <button
              onClick={handleAnalyze}
              disabled={!url.trim()}
              className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 h-[55px] text-black font-normal ${!url.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{
                background: "linear-gradient(to right, #00FF7F, #00C260)",
              }}
            >
              <span className="text-[20px]">Analyze</span>
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.1666 14.6667L16.875 17.375" stroke="#0D1117" strokeWidth="2.16667" strokeLinejoin="round" />
                <path d="M16.8027 19.5689C16.1769 18.9431 16.1769 17.9285 16.8027 17.3027C17.4285 16.6769 18.4432 16.6769 19.069 17.3027L22.364 20.5977C22.9898 21.2235 22.9898 22.2382 22.364 22.864C21.7382 23.4898 20.7236 23.4898 20.0978 22.864/L16.8027 19.5689Z" stroke="#0D1117" strokeWidth="2.16667" strokeLinecap="round" />
                <path d="M16.3333 9.25001C16.3333 5.06185 12.9381 1.66667 8.74996 1.66667C4.5618 1.66667 1.16663 5.06185 1.16663 9.25001C1.16663 13.4382 4.5618 16.8333 8.74996 16.8333C12.9381 16.8333 16.3333 13.4382 16.3333 9.25001Z" stroke="#0D1117" strokeWidth="2.16667" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Analysis Results */}
          {(data || analysisData.analysisData) && submittedUrl && (
            <div className="mb-8">
              <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                <h3 className="text-[#00FFFF] text-xl md:text-2xl font-medium">
                  Analysis Reports
                </h3>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center justify-center px-4 py-2 space-x-2 transition-colors rounded-lg md:justify-start bg-white/5 hover:bg-white/10"
                  disabled={!data}
                >
                  <span className="text-lg text-[#00FFFF]">Download Report</span>
                  <DownloadIcon />
                </button>
              </div>

              <p className="mb-6 text-sm text-gray-300 md:text-base">
                Clear, concise reports showing your website's SEO issues,
                performance metrics, and improvement tips.
              </p>

              {/* Tabs */}
              <div className="flex mb-6 space-x-4 overflow-x-auto border-b border-gray-700 md:space-x-8 md:mb-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-3 border-b-2 whitespace-nowrap ${activeTab === "overview" ? "border-[#00FFFF] text-[#00FFFF]" : "border-transparent text-gray-400 hover:text-white"}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("error")}
                  className={`pb-3 border-b-2 whitespace-nowrap ${activeTab === "error" ? "border-[#00FFFF] text-[#00FFFF]" : "border-transparent text-gray-400 hover:text-white"}`}
                >
                  Error ({totalIssues})
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "overview" ? (
                <div className="bg-[#161B22] rounded-lg p-4 md:p-6 mb-8">
                  {/* Header */}
                  <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-1 flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-6">
                      {/* SEO Score Circle */}
                      <div className="flex flex-col justify-center text-center md:justify-start">
                        <div className="relative w-24 h-24 mx-auto mb-2 md:w-32 md:h-32">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="50" stroke="#374151" strokeWidth="10" fill="none" />
                            <circle cx="60" cy="60" r="50" stroke="#00FF7F" strokeWidth="10" fill="none" strokeDasharray={`${data?.seoScore * 3.14159} ${100 * 3.14159}`} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-white md:text-3xl">{data?.seoScore ?? "N/A"}</span>
                          </div>
                        </div>
                        <p className="text-white text-medium md:text-lg">SEO Score</p>
                      </div>

                      {/* Website Info */}
                      <div className="text-center md:text-left">
                        <h4 className="mb-2 text-xl font-medium text-white md:text-2xl">{data?.url}</h4>
                        <p className="text-[#00FFFF] text-base md:text-lg mb-2">Analysis Reports</p>
                        <p className="text-sm leading-relaxed text-gray-300 md:text-base w-full word-wrap">{data?.metaDescription}</p>
                      </div>
                    </div>

                    {/* Analysis Date */}
                    <div className="text-center lg:text-right w-content flex-1">
                      <p className="text-sm text-gray-300 md:text-base">
                        Analysis Date: {data?.analysisDate}
                      </p>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <DashboardMetrics metrics={data} />

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Site Health Pie Chart */}
                    <div className="p-4 rounded-lg bg-white/5 lg:p-6">
                      <h4 className="mb-4 text-lg font-medium text-white">Site Health</h4>
                      <div className="flex flex-col md:flex-row">
                        <div className="mb-4">
                          <PieChart width={350} height={200}>
                            <Pie
                              dataKey="value"
                              startAngle={180}
                              endAngle={0}
                              data={getPieChartData()}
                              cx={175}
                              cy={150}
                              innerRadius={50}
                              outerRadius={90}
                              fill="#8884d8"
                              stroke="none"
                            >
                              {getPieChartData()?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Label
                              value={data?.siteHealth?.toString()}
                              position="bottom"
                              offset={-50}
                              style={{
                                fontSize: "32px",
                                fontWeight: "bold",
                                fill: "#00FFFF",
                                textAnchor: "middle",
                              }}
                            />
                          </PieChart>
                        </div>
                        <div className="flex flex-row items-center justify-center gap-4 space-y-2 md:flex-col">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-3 h-3 bg-[#00FF7F] rounded-full"></div>
                            <span className="text-sm text-gray-400">Health</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-gray-400">Issues</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trend Line Chart */}
                    <div className="p-4 rounded-lg bg-white/5 lg:p-6 lg:col-span-2">
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={getChartData()}>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                            <Line type="monotone" dataKey="health" stroke="#00FF7F" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="issues" stroke="#EF4444" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                renderErrorContent()
              )}
            </div>
          )}
        </div>
      </div>

      {/* Issue Modal */}
      {currentIssue && (
        <IssueModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          issueType={currentIssue.type}
          issueData={effectiveErrorData}
        />
      )}
    </div>
  );
};

export default MainContent;