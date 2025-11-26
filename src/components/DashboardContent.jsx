"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 1️⃣ Utility Component: File Text Icon (Inline SVG)
const FileTextIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-file-text"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);

// 2️⃣ Hero Section Component
const HeroSection = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // ✔️ Check login status from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // ✔️ Button click handler
  const handleStart = () => {
    if (user) {
      router.push("/jobs"); // Logged in → Jobs page
    } else {
      router.push("/login"); // Not logged in → Login page
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
        {/* Left: Text */}
        <div className="mb-12 lg:mb-0">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Streamline Your{" "}
            <span className="text-blue-600">Job Application Process</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-lg">
            Vaccancies helps you prepare and submit your application materials
            quickly and effectively. Get job-ready with our streamlined process.
          </p>

          <div className="mt-10">
            <button
              onClick={handleStart}
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-xl shadow-xl text-white bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out transform hover:scale-[1.02]"
            >
              Get Started - It's Free
            </button>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="flex justify-center items-center h-full min-h-[300px] bg-white lg:bg-gray-50 rounded-2xl p-8 shadow-inner border border-gray-100">
          <div className="text-center p-8">
            <div className="mx-auto flex items-center justify-center h-28 w-28 rounded-full bg-blue-50 border-4 border-blue-200 shadow-lg">
              <FileTextIcon className="h-12 w-12 text-blue-600" />
            </div>
            <p className="mt-6 text-xl font-semibold text-gray-700">
              Your Application Journey Starts Here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4️⃣ Main Dashboard Page (Default Export)
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main>
        <HeroSection />

        {/* Additional content placeholder */}
      </main>
    </div>
  );
}
