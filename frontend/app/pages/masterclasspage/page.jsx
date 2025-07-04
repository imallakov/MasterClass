// app/pages/masterclasspage/page.jsx
"use client";
import React from "react";
import Footer from "/app/components/Footer";
import MasterClasses from "/app/components/MasterClasses";
import { useRouter } from "next/navigation";

const MasterclassPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Back Button */}
        <div className="mb-3 sm:mb-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Назад
          </button>
        </div>
        <MasterClasses />
        <Footer />
      </div>
    </div>
  );
};

export default MasterclassPage;
