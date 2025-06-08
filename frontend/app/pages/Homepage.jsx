import React from "react";
import Navbar from "../components/Navbar";

const Homepage = () => {
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
                <button className="bg-[#E7717D] hover:bg-[#d65a6b] text-nowrap text-white px-2 py-2 rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-105">
                  Получить консультацию
                </button>
              </span>
            </div>

            {/* Desktop Catalog Button - Right Side */}
            <div className="hidden lg:block">
              <div className="relative">
                <button className="bg-white rounded-full w-32 h-32 flex items-center justify-center group hover:scale-105 transition-all duration-300 shadow-xl">
                  <div className="text-center">
                    <span className="text-[#3A6281] font-bold text-lg block mb-1">
                      <a href="/catalogpage">Каталог</a>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
