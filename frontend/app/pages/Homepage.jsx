"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const Homepage = () => {
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/configs/contacts/`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setContactData(data);
      } catch (err) {
        console.error("Error fetching contact data:", err);
      } finally {
        console.log("loaded");
      }
    };

    fetchContactData();
  }, []);

  // Fallback phone number in case of API failure
  const phoneNumber = contactData?.phone_number || "+7 900 326 7660";

  return (
    <div className="relative min-h-[70vh] md:min-h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/hero1.png')`,
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      <div className="relative z-5 flex flex-col min-h-[70vh] md:min-h-screen">
        {/* Main Content Container */}
        <div className="flex-1 flex items-end pb-12">
          <div className="container mx-auto px-4 flex items-end justify-between w-full">
            {/* Left Content - Main Heading */}
            <div className="max-w-xl flex justify-between w-full items-center">
              <h1 className="text-2xl sm:text-2xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-8">
                Пробуди свое
                <br />
                волшебство
              </h1>

              {/* Mobile CTA Button */}
              <span className="lg:hidden">
                <a
                  href={`tel:${phoneNumber}`}
                  className="bg-[#E7717D] hover:bg-[#d65a6b] text-nowrap text-white px-2 py-2 rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-105"
                >
                  Получить консультацию
                </a>
              </span>
            </div>

            {/* Desktop Catalog Button - Right Side */}
            <div className="hidden lg:block">
              <div className="relative">
                <a href="/pages/catalogpage">
                  <button className="bg-white rounded-full w-32 h-32 flex items-center justify-center group hover:scale-105 transition-all duration-300 shadow-xl">
                    <div className="text-center">
                      <span className="text-[#3A6281] font-bold text-lg block mb-1">
                        Каталог
                      </span>
                      <svg
                        className="w-14 h-14 text-[#E7717D] mx-auto transform group-hover:translate-x-1 transition-transform rotate-25"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
