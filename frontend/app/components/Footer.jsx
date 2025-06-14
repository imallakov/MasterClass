// import Image from "next/image";
// import React from "react";

// const Footer = () => {
//   return (
//     <footer className="bg-white my-12 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto text-[#7E685A]">
//         {/* Desktop Layout */}
//         <div className="hidden md:flex justify-between items-start">
//           {/* Left Section - Contact Info */}
//           <div className="flex flex-col space-y-4">
//             <div className="text-3xl font-bold">+7 900 326 7660</div>
//             <div className="text-xs font-semibold">
//               Ул. Московская 60, 2 этаж, 218 студия
//             </div>
//             <div className="flex items-center space-x-3 mt-6">
//               {/* Logo */}
//               <div className="w-12 h-12">
//                 <Image
//                   src="/images/logo.png"
//                   alt="Learning together"
//                   height={38}
//                   width={38}
//                   className="object-cover"
//                 />
//               </div>
//               <div>
//                 <div className="text-lg font-medium ">Дворец Мастеров</div>
//               </div>
//             </div>
//           </div>

//           {/* Center Section - Main Navigation */}
//           <div className="flex flex-col space-y-6">
//             <div>
//               <h3 className="text-lg font-bold mb-3">Главная</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <a
//                     href="#"
//                     className=" hover:text-gray-800 transition-colors"
//                   >
//                     О Нас
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className=" hover:text-gray-800 transition-colors"
//                   >
//                     Фотогалерея
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className=" hover:text-gray-800 transition-colors"
//                   >
//                     Расписание
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Right Section - Master Classes */}
//           <div className="flex flex-col space-y-6">
//             <div>
//               <h3 className="text-lg font-bold  mb-3">Мастер - классы</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <a
//                     href="#"
//                     className=" hover:text-gray-800 transition-colors"
//                   >
//                     Перейти ко всем
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Far Right Section - Schedule */}
//           <div className="flex flex-col space-y-6">
//             <div>
//               <h3 className="text-lg font-bold mb-3">Расписание</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <a
//                     href="#"
//                     className=" hover:text-gray-800 transition-colors"
//                   >
//                     Время работы
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//         <div className="hidden md:flex text-xs py-4 font-semibold">
//           Дворец Мастеров © 2025
//         </div>
//         {/* Mobile Layout */}
//         <div className="md:hidden">
//           {/* Mobile Header */}
//           <div className="flex items-center space-x-3 mb-6">
//             <div className="w-12 h-12">
//               <Image
//                 src="/images/logo.png"
//                 alt="Learning together"
//                 height={38}
//                 width={38}
//                 className="object-cover"
//               />
//             </div>
//             <div className="text-xl w-full text-center font-medium">
//               Дворец Мастеров
//             </div>
//           </div>

//           {/* Mobile Contact Info */}
//           <div className="mb-8">
//             <a href="tel:+79003267660">
//               <div className="text-xl font-bold mb-2">+7 900 326 7660</div>
//             </a>
//             <div className="text-xs font-semibold">
//               Ул. Московская 60, 2 этаж, 218 студия
//             </div>
//           </div>

//           {/* Mobile Navigation Sections */}
//           <div className="space-y-8 flex items-start justify-between">
//             <div>
//               <h3 className="text-lg font-bold mb-3">Главная</h3>
//               <ul className="space-y-2 pl-0">
//                 <li>
//                   <a
//                     href="#"
//                     className=" hover:text-gray-800 transition-colors"
//                   >
//                     О нас
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className=" hover:text-gray-800 transition-colors"
//                   >
//                     Фотогалерея
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div className="">
//               <h3 className="text-lg font-bold mb-3">Мастер - Классы</h3>
//               <ul className="space-y-2 pl-0">
//                 <li>
//                   <a
//                     href="#"
//                     className=" hover:text-gray-800 transition-colors"
//                   >
//                     Перейти ко всем
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t flex justify-between items-end border-gray-200 pt-6">
//             <div>
//               <h3 className="text-lg font-bold mb-3">Расписание</h3>
//               <ul className="space-y-2 pl-0">
//                 <li>
//                   <a
//                     href="#"
//                     className=" hover:text-gray-800 transition-colors"
//                   >
//                     Время работы
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div className="text-xs font-semibold">Дворец Мастеров © 2025</div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

const Footer = ({ scrollToSection, refs }) => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/configs/contacts/`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setContactData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching contact data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  // Navigation handlers
  const handleNavigation = (refName) => {
    if (scrollToSection && refs && refs[refName]) {
      scrollToSection(refs[refName]);
    }
  };

  // Fallback phone number in case of API failure
  const phoneNumber = contactData?.phone_number || "+7 900 326 7660";
  const address =
    contactData?.address || "Ул. Московская 60, 2 этаж, 218 студия";

  return (
    <footer className="bg-white my-12 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-[#7E685A]">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-start">
          {/* Left Section - Contact Info */}
          <div className="flex flex-col space-y-4">
            <div className="text-3xl font-bold">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-9 w-48 rounded"></div>
              ) : (
                <a href={`tel:${phoneNumber.replace(/\s/g, "")}`}>
                  {phoneNumber}
                </a>
              )}
            </div>
            <div className="text-xs font-semibold">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-64 rounded"></div>
              ) : (
                address
              )}
            </div>
            <div className="flex items-center space-x-3 mt-6">
              {/* Logo */}
              <div className="w-12 h-12">
                <Image
                  src="/images/logo.png"
                  alt="Learning together"
                  height={38}
                  width={38}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-lg font-medium ">Дворец Мастеров</div>
              </div>
            </div>
          </div>

          {/* Center Section - Main Navigation */}
          <div className="flex flex-col space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-3">Главная</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleNavigation("aboutUs")}
                    className="hover:text-gray-800 transition-colors cursor-pointer text-left"
                  >
                    О Нас
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("photoGallery")}
                    className="hover:text-gray-800 transition-colors cursor-pointer text-left"
                  >
                    Фотогалерея
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("schedule")}
                    className="hover:text-gray-800 transition-colors cursor-pointer text-left"
                  >
                    Расписание
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Section - Master Classes */}
          <div className="flex flex-col space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-3">Мастер - классы</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleNavigation("masterClasses")}
                    className="hover:text-gray-800 transition-colors cursor-pointer text-left"
                  >
                    Перейти ко всем
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Far Right Section - Schedule */}
          <div className="flex flex-col space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-3">Расписание</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleNavigation("schedule")}
                    className="hover:text-gray-800 transition-colors cursor-pointer text-left"
                  >
                    Время работы
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="hidden md:flex text-xs py-4 font-semibold">
          Дворец Мастеров © 2025
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12">
              <Image
                src="/images/logo.png"
                alt="Learning together"
                height={38}
                width={38}
                className="object-cover"
              />
            </div>
            <div className="text-xl w-full text-center font-medium">
              Дворец Мастеров
            </div>
          </div>

          {/* Mobile Contact Info */}
          <div className="mb-8">
            <a href={`tel:${phoneNumber.replace(/\s/g, "")}`}>
              <div className="text-xl font-bold mb-2">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-7 w-40 rounded"></div>
                ) : (
                  phoneNumber
                )}
              </div>
            </a>
            <div className="text-xs font-semibold">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-56 rounded"></div>
              ) : (
                address
              )}
            </div>
          </div>

          {/* Mobile Navigation Sections */}
          <div className="space-y-8 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold mb-3">Главная</h3>
              <ul className="space-y-2 pl-0">
                <li>
                  <button
                    onClick={() => handleNavigation("aboutUs")}
                    className="hover:text-gray-800 transition-colors cursor-pointer text-left"
                  >
                    О нас
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("photoGallery")}
                    className="hover:text-gray-800 transition-colors cursor-pointer text-left"
                  >
                    Фотогалерея
                  </button>
                </li>
              </ul>
            </div>
            <div className="">
              <h3 className="text-lg font-bold mb-3">Мастер - Классы</h3>
              <ul className="space-y-2 pl-0">
                <li>
                  <button
                    onClick={() => handleNavigation("masterClasses")}
                    className="hover:text-gray-800 transition-colors cursor-pointer text-left"
                  >
                    Перейти ко всем
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t flex justify-between items-end border-gray-200 pt-6">
            <div>
              <h3 className="text-lg font-bold mb-3">Расписание</h3>
              <ul className="space-y-2 pl-0">
                <li>
                  <button
                    onClick={() => handleNavigation("schedule")}
                    className="hover:text-gray-800 transition-colors cursor-pointer text-left"
                  >
                    Время работы
                  </button>
                </li>
              </ul>
            </div>
            <div className="text-xs font-semibold">Дворец Мастеров © 2025</div>
          </div>
        </div>

        {/* Error state (optional) */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            Failed to load contact information
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
