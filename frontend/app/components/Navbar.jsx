// "use client";
// import Image from "next/image";
// import _Link from "next/link";
// import React, { useState, useEffect } from "react";

// const Navbar = ({ scrollToSection, refs }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       setIsScrolled(scrollTop > 50);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Prevent body scroll when mobile menu is open
//   useEffect(() => {
//     if (isMenuOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }

//     // Cleanup on unmount
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isMenuOpen]);

//   // Handle navigation clicks
//   const handleNavClick = (refKey) => {
//     if (scrollToSection && refs && refs[refKey]) {
//       scrollToSection(refs[refKey]);
//     }
//     // Close mobile menu after navigation
//     setIsMenuOpen(false);
//   };

//   // Navigation items - consistent between desktop and mobile
//   const navItems = [
//     { key: "home", label: "Главная" },
//     { key: "masterClasses", label: "Мастер-классы" },
//     { key: "catalog", label: "Каталог" },
//     { key: "aboutUs", label: "О Нас" },
//     { key: "schedule", label: "Расписание" },
//     { key: "contacts", label: "Контакты" },
//     { key: "stickers", label: "Наклейки" },
//   ];

//   const mobileNavItems = [
//     { key: "home", label: "Главная" },
//     { key: "masterClasses", label: "Мастер классы" },
//     { key: "aboutUs", label: "О нас" },
//     { key: "schedule", label: "Расписание" },
//     { key: "whyUs", label: "Почему мы?" },
//     { key: "reviews", label: "Отзывы" },
//     { key: "contacts", label: "Контакты" },
//     { key: "photoGallery", label: "Наша фотогалерея" },
//   ];

//   return (
//     <>
//       <nav
//         className={`fixed top-0 left-0 right-0 z-40 px-4 md:px-14 py-4 transition-all duration-300 ${
//           isScrolled ? "bg-white backdrop-blur-sm shadow-md" : "bg-transparent"
//         }`}
//       >
//         <div className="flex items-center justify-between max-w-7xl mx-auto">
//           <div className="flex items-center justify-start gap-12 w-2/3">
//             {/* Logo */}
//             <div className="w-12 h-12 flex-shrink-0">
//               <Image
//                 src="/images/logo.png"
//                 alt="Learning together"
//                 height={38}
//                 width={38}
//                 className="object-cover"
//               />
//             </div>

//             {/* Navigation Links - Hidden on mobile */}
//             <div className="hidden md:flex items-center space-x-8 w-full">
//               {navItems.map((item) => (
//                 <button
//                   key={item.key}
//                   onClick={() => handleNavClick(item.key)}
//                   className={`transition-colors cursor-pointer whitespace-nowrap ${
//                     isScrolled
//                       ? "text-gray-800 hover:text-[#E7717D]"
//                       : "text-[#EACCB9] hover:text-[#f6bc98]"
//                   }`}
//                 >
//                   {item.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Desktop Personal Cabinet Button */}
//           <button
//             className={`hidden md:block px-6 py-2 rounded-full transition-all duration-300 flex-shrink-0 ${
//               isScrolled
//                 ? "bg-[#E7717D] text-white hover:bg-[#C2937A]"
//                 : "bg-white/20 backdrop-blur-sm text-white hover:bg-[#C2B9B0]"
//             }`}
//           >
//             <a href="/auth/sign-in">Личный Кабинет</a>
//           </button>

//           {/* Mobile Hamburger Menu Button */}
//           <button
//             className="md:hidden bg-[#7E685A] p-3 rounded-full flex-shrink-0 z-50 relative"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             <div
//               className={`w-5 h-4 flex flex-col justify-between transition-all duration-300 ${
//                 isMenuOpen ? "rotate-45" : ""
//               }`}
//             >
//               <div
//                 className={`w-full h-0.5 bg-black rounded transition-all duration-300 ${
//                   isMenuOpen ? "rotate-90 translate-y-1.5" : ""
//                 }`}
//               ></div>
//               <div
//                 className={`w-full h-0.5 bg-black rounded transition-all duration-300 ${
//                   isMenuOpen ? "opacity-0" : ""
//                 }`}
//               ></div>
//               <div
//                 className={`w-full h-0.5 bg-black rounded transition-all duration-300 ${
//                   isMenuOpen ? "-rotate-90 -translate-y-1.5" : ""
//                 }`}
//               ></div>
//             </div>
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Menu Overlay */}
//       <div
//         className={`md:hidden fixed inset-0 bg-slate-700 z-50 flex flex-col items-center justify-center text-white transition-all duration-300 ${
//           isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//       >
//         {/* Close button */}
//         <button
//           className="absolute top-6 right-6 text-white text-3xl z-60 hover:text-[#f6bc98] transition-colors"
//           onClick={() => setIsMenuOpen(false)}
//         >
//           ✕
//         </button>

//         {/* Mobile Menu Items */}
//         <div className="flex flex-col items-center space-y-6 px-8">
//           {mobileNavItems.map((item) => (
//             <button
//               key={item.key}
//               onClick={() => handleNavClick(item.key)}
//               className="text-white hover:text-[#f6bc98] text-2xl md:text-3xl font-bold transition-colors text-center"
//             >
//               {item.label}
//             </button>
//           ))}
//         </div>

//         {/* Mobile Auth Buttons */}
//         <div className="flex flex-col space-y-4 mt-12 px-8">
//           <button className="bg-[#E7717D] text-white px-8 py-3 rounded-full hover:bg-[#B5825F] transition-all duration-300 min-w-[200px]">
//             <a href="/auth/sign-in" className="block w-full">
//               Авторизация
//             </a>
//           </button>
//           <button className="border border-[#E7717D] text-white px-8 py-3 rounded-full hover:bg-[#C2937A] hover:text-white transition-all duration-300 min-w-[200px]">
//             <a href="/auth/sign-up" className="block w-full">
//               Регистрация
//             </a>
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Navbar;

"use client";
import Image from "next/image";
import _Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ scrollToSection, refs }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [contactData, setContactData] = useState(null);
  const { user } = useAuth();
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
  const _address =
    contactData?.address || "Ул. Московская 60, 2 этаж, 218 студия";

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Handle navigation clicks
  const handleNavClick = (refKey) => {
    if (scrollToSection && refs && refs[refKey]) {
      // Calculate navbar height and add some padding
      const navbarHeight = 80; // Approximate navbar height
      const additionalOffset = 20; // Extra padding for better visual spacing
      const totalOffset = navbarHeight + additionalOffset;

      // Scroll to section with offset
      const element = refs[refKey].current;
      if (element) {
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - totalOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    // Close mobile menu after navigation
    setIsMenuOpen(false);
  };

  // Navigation items - consistent between desktop and mobile
  const navItems = [
    { key: "home", label: "Главная" },
    { key: "masterClasses", label: "Мастер-классы" },
    // { key: "catalog", label: "Каталог" },
    { key: "aboutUs", label: "О Нас" },
    { key: "schedule", label: "Расписание" },
    { key: "contacts", label: "Контакты" },
    { key: "reviews", label: "Отзывы" },
    { key: "catalog", label: "Наклейки" },
  ];

  const mobileNavItems = [
    { key: "home", label: "Главная" },
    { key: "masterClasses", label: "Мастер классы" },
    { key: "aboutUs", label: "О нас" },
    { key: "schedule", label: "Расписание" },
    { key: "whyUs", label: "Почему мы?" },
    { key: "reviews", label: "Отзывы" },
    { key: "contacts", label: "Контакты" },
    { key: "catalog", label: "Наклейки" },
    { key: "photoGallery", label: "Наша фотогалерея" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 px-4 md:px-14 py-4 transition-all duration-300 ${
          isScrolled ? "bg-white backdrop-blur-sm shadow-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center justify-start gap-12 w-2/3">
            {/* Logo */}
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Learning together"
                  height={38}
                  width={38}
                  className="object-cover"
                />
              </div>
              <div>
                <h3
                  className={`transition-colors text-md font-semibold cursor-pointer text-center whitespace-nowrap ${
                    isScrolled ? "text-[#c89c81]" : "text-[#EACCB9]"
                  }`}
                >
                  Дворец <br /> Мастеров
                </h3>
              </div>
            </div>

            {/* Navigation Links - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-8 w-full">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`transition-colors cursor-pointer whitespace-nowrap ${
                    isScrolled
                      ? "text-gray-800 hover:text-[#E7717D]"
                      : "text-[#EACCB9] hover:text-[#f6bc98]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Personal Cabinet Button */}
          <div className="hidden sm:block">
            {user ? (
              isScrolled ? (
                <button
                  className={`hidden md:block px-6 py-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                    isScrolled
                      ? "bg-[#E7717D] text-white hover:bg-[#C2937A]"
                      : "bg-white/20 backdrop-blur-sm text-white hover:bg-[#C2B9B0]"
                  }`}
                >
                  <a
                    href={
                      isScrolled
                        ? `tel:${phoneNumber.replace(/\s/g, "")}`
                        : "/auth/sign-in"
                    }
                  >
                    Получить консультацию
                  </a>
                </button>
              ) : (
                <a href="/user-account">
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    {/* User Avatar */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20 group-hover:ring-[#E7717D] transition-all duration-300">
                        {user.photo ? (
                          <img
                            src={user.photo}
                            alt={`${user.first_name} ${user.last_name || ""}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#E7717D] to-[#C2937A] flex items-center justify-center text-white font-semibold text-sm">
                            {user.first_name.charAt(0).toUpperCase()}
                            {user.last_name
                              ? user.last_name.charAt(0).toUpperCase()
                              : ""}
                          </div>
                        )}
                      </div>
                      {/* Online status indicator (optional) */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>

                    {/* User Info */}
                    <div className="hidden sm:block">
                      <div className="text-white font-medium text-sm group-hover:text-[#E7717D] transition-colors duration-300">
                        {user.first_name} {user.last_name || ""}
                      </div>
                      {user.email && (
                        <div className="text-white/70 text-xs">
                          {user.email}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              )
            ) : (
              <button
                className={`hidden md:block px-6 py-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                  isScrolled
                    ? "bg-[#E7717D] text-white hover:bg-[#C2937A]"
                    : "bg-white/20 backdrop-blur-sm text-white hover:bg-[#C2B9B0]"
                }`}
              >
                <a
                  href={
                    isScrolled
                      ? `tel:${phoneNumber.replace(/\s/g, "")}`
                      : "/auth/sign-in"
                  }
                >
                  {isScrolled ? "Получить консультацию" : "Личный Кабинет"}
                </a>
              </button>
            )}
          </div>
          {/* Mobile Hamburger Menu Button */}
          <button
            className="md:hidden bg-[#7E685A] p-3 rounded-full flex-shrink-0 z-50 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div
              className={`w-5 h-4 flex flex-col justify-between transition-all duration-300 ${
                isMenuOpen ? "rotate-45" : ""
              }`}
            >
              <div
                className={`w-full h-0.5 bg-black rounded transition-all duration-300 ${
                  isMenuOpen ? "rotate-90 translate-y-1.5" : ""
                }`}
              ></div>
              <div
                className={`w-full h-0.5 bg-black rounded transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></div>
              <div
                className={`w-full h-0.5 bg-black rounded transition-all duration-300 ${
                  isMenuOpen ? "-rotate-90 -translate-y-1.5" : ""
                }`}
              ></div>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-slate-700 z-50 flex flex-col items-center justify-center text-white transition-all duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Close button */}
        <button
          className="absolute top-6 right-6 text-white text-3xl z-60 hover:text-[#f6bc98] transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          ✕
        </button>

        {/* Mobile Menu Items */}
        <div className="flex flex-col items-center space-y-6 px-8">
          {mobileNavItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className="text-white hover:text-[#f6bc98] text-2xl md:text-3xl font-bold transition-colors text-center"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Auth Buttons */}
        {/* <div className="flex flex-col space-y-4 mt-12 px-8">
          <button className="bg-[#E7717D] text-white px-8 py-3 rounded-full hover:bg-[#B5825F] transition-all duration-300 min-w-[200px]">
            <a href="/auth/sign-in" className="block w-full">
              Авторизация
            </a>
          </button>
          <button className="border border-[#E7717D] text-white px-8 py-3 rounded-full hover:bg-[#C2937A] hover:text-white transition-all duration-300 min-w-[200px]">
            <a href="/auth/sign-up" className="block w-full">
              Регистрация
            </a>
          </button>
        </div> */}
        <div className="flex flex-col space-y-4 mt-12 px-8">
          {user ? (
            // Show user profile and account access when logged in
            <div className="flex flex-col items-center space-y-4">
              {/* User Profile Display */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#E7717D]">
                    {user.photo ? (
                      <img
                        src={user.photo}
                        alt={`${user.first_name} ${user.last_name || ""}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#E7717D] to-[#C2937A] flex items-center justify-center text-white font-semibold text-lg">
                        {user.first_name.charAt(0).toUpperCase()}
                        {user.last_name
                          ? user.last_name.charAt(0).toUpperCase()
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-700"></div>
                </div>
                <div className="text-center">
                  <div className="text-white font-medium text-lg">
                    {user.first_name} {user.last_name || ""}
                  </div>
                  {user.email && (
                    <div className="text-white/70 text-sm">{user.email}</div>
                  )}
                </div>
              </div>
              {/* Account Access Button */}
              <button className="bg-[#E7717D] text-white px-8 py-3 mt-6 rounded-full hover:bg-[#B5825F] transition-all duration-300 min-w-[200px]">
                <a href="/user-account" className="block w-full">
                  Личный Кабинет
                </a>
              </button>
            </div>
          ) : (
            // Show auth buttons when not logged in
            <>
              <button className="bg-[#E7717D] text-white px-8 py-3 rounded-full hover:bg-[#B5825F] transition-all duration-300 min-w-[200px]">
                <a href="/auth/sign-in" className="block w-full">
                  Авторизация
                </a>
              </button>
              <button className="border border-[#E7717D] text-white px-8 py-3 rounded-full hover:bg-[#C2937A] hover:text-white transition-all duration-300 min-w-[200px]">
                <a href="/auth/sign-up" className="block w-full">
                  Регистрация
                </a>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
