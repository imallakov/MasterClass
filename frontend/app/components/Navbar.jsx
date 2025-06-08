// "use client";
// import Image from "next/image";
// import _Link from "next/link";
// import React, { useState, useEffect } from "react";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       setIsScrolled(scrollTop > 50); // Change background after scrolling 50px
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-15 px-14 py-4 transition-all duration-300 ${
//         isScrolled ? "bg-white backdrop-blur-sm shadow-md" : "bg-transparent"
//       }`}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center justify-start gap-12 w-2/3">
//           {/* Logo */}
//           <div className="w-12 h-12">
//             <Image
//               src="/images/logo.png"
//               alt="Learning together"
//               height={38}
//               width={38}
//               className="object-cover"
//             />
//           </div>

//           {/* Navigation Links - Hidden on mobile */}
//           <div className="hidden md:flex items-center space-x-8 w-full">
//             <a
//               href="#"
//               className={`transition-colors ${
//                 isScrolled
//                   ? "text-gray-800 hover:text-[#E7717D]"
//                   : "text-[#EACCB9] hover:text-[#f6bc98]"
//               }`}
//             >
//               Главная
//             </a>
//             <a
//               href="#"
//               className={`transition-colors ${
//                 isScrolled
//                   ? "text-gray-800 hover:text-[#E7717D]"
//                   : "text-[#EACCB9] hover:text-[#f6bc98]"
//               }`}
//             >
//               Мастер-классы
//             </a>
//             <a
//               href="#"
//               className={`transition-colors ${
//                 isScrolled
//                   ? "text-gray-800 hover:text-[#E7717D]"
//                   : "text-[#EACCB9] hover:text-[#f6bc98]"
//               }`}
//             >
//               Каталог
//             </a>
//             <a
//               href="#"
//               className={`transition-colors ${
//                 isScrolled
//                   ? "text-gray-800 hover:text-[#E7717D]"
//                   : "text-[#EACCB9] hover:text-[#f6bc98]"
//               }`}
//             >
//               О Нас
//             </a>
//             <a
//               href="#"
//               className={`transition-colors ${
//                 isScrolled
//                   ? "text-gray-800 hover:text-[#E7717D]"
//                   : "text-[#EACCB9] hover:text-[#f6bc98]"
//               }`}
//             >
//               Расписание
//             </a>
//             <a
//               href="#"
//               className={`transition-colors ${
//                 isScrolled
//                   ? "text-gray-800 hover:text-[#E7717D]"
//                   : "text-[#EACCB9] hover:text-[#f6bc98]"
//               }`}
//             >
//               Контакты
//             </a>
//             <a
//               href="#"
//               className={`transition-colors ${
//                 isScrolled
//                   ? "text-gray-800 hover:text-[#E7717D]"
//                   : "text-[#EACCB9] hover:text-[#f6bc98]"
//               }`}
//             >
//               Наклейки
//             </a>
//           </div>
//         </div>

//         {/* Desktop Personal Cabinet Button */}
//         <button
//           className={`hidden md:block px-6 py-2 rounded-full transition-all duration-300 ${
//             isScrolled
//               ? "bg-[#E7717D] text-white hover:bg-[#C2937A]"
//               : "bg-white/20 backdrop-blur-sm text-white hover:bg-[#C2B9B0]"
//           }`}
//         >
//           <a href="/auth/sign-in">Личный Кабинет</a>
//         </button>

//         {/* Mobile Hamburger Menu Button */}
//         <button
//           className="md:hidden bg-[#7E685A] p-3 rounded-full"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           <div className="w-5 h-4 flex flex-col justify-between">
//             <div className="w-full h-0.5 bg-black rounded"></div>
//             <div className="w-full h-0.5 bg-black rounded"></div>
//             <div className="w-full h-0.5 bg-black rounded"></div>
//           </div>
//         </button>
//       </div>

//       {/* Mobile Menu Overlay */}
//       {isMenuOpen && (
//         <div className="md:hidden fixed inset-0 bg-slate-700 z-50 flex flex-col items-center justify-center text-white text-xl space-y-8">
//           {/* Close button */}
//           <button
//             className="absolute top-6 right-6 text-white text-3xl"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             ✕
//           </button>

//           {/* Mobile Menu Items */}
//           <a
//             href="#"
//             className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             Главная
//           </a>
//           <a
//             href="#"
//             className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             Мастер классы
//           </a>
//           <a
//             href="#"
//             className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             О нас
//           </a>
//           <a
//             href="#"
//             className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             Расписание
//           </a>
//           <a
//             href="#"
//             className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             Почему мы?
//           </a>
//           <a
//             href="#"
//             className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             Отзывы
//           </a>
//           <a
//             href="#"
//             className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             Наша фотогалерея
//           </a>

//           {/* Mobile Auth Buttons */}
//           <div className="flex flex-col space-y-4 mt-8">
//             <button className="bg-[#E7717D] text-white px-8 py-3 rounded-full hover:bg-[#B5825F] transition-all duration-300">
//               <a href="/auth/sign-in">Авторизация</a>
//             </button>
//             <button className="border border-[#E7717D] text-white px-8 py-3 rounded-full hover:bg-[#C2937A] hover:text-white transition-all duration-300">
//               <a href="/auth/sign-up">Регистрация</a>
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

"use client";
import Image from "next/image";
import _Link from "next/link";
import React, { useState, useEffect } from "react";

const Navbar = ({ scrollToSection, refs }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
      scrollToSection(refs[refKey]);
    }
    // Close mobile menu after navigation
    setIsMenuOpen(false);
  };

  // Navigation items - consistent between desktop and mobile
  const navItems = [
    { key: "home", label: "Главная" },
    { key: "masterClasses", label: "Мастер-классы" },
    { key: "catalog", label: "Каталог" },
    { key: "aboutUs", label: "О Нас" },
    { key: "schedule", label: "Расписание" },
    { key: "contacts", label: "Контакты" },
    { key: "stickers", label: "Наклейки" },
  ];

  const mobileNavItems = [
    { key: "home", label: "Главная" },
    { key: "masterClasses", label: "Мастер классы" },
    { key: "aboutUs", label: "О нас" },
    { key: "schedule", label: "Расписание" },
    { key: "whyUs", label: "Почему мы?" },
    { key: "reviews", label: "Отзывы" },
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
            <div className="w-12 h-12 flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Learning together"
                height={38}
                width={38}
                className="object-cover"
              />
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
          <button
            className={`hidden md:block px-6 py-2 rounded-full transition-all duration-300 flex-shrink-0 ${
              isScrolled
                ? "bg-[#E7717D] text-white hover:bg-[#C2937A]"
                : "bg-white/20 backdrop-blur-sm text-white hover:bg-[#C2B9B0]"
            }`}
          >
            <a href="/auth/sign-in">Личный Кабинет</a>
          </button>

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
        <div className="flex flex-col space-y-4 mt-12 px-8">
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
        </div>
      </div>
    </>
  );
};

export default Navbar;

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
//       setIsScrolled(scrollTop > 50); // Change background after scrolling 50px
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Handle navigation clicks
//   const handleNavClick = (refKey) => {
//     if (scrollToSection && refs && refs[refKey]) {
//       scrollToSection(refs[refKey]);
//     }
//   };

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-15 px-14 py-4 transition-all duration-300 ${
//         isScrolled ? "bg-white backdrop-blur-sm shadow-md" : "bg-transparent"
//       }`}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center justify-start gap-12 w-2/3">
//           {/* Logo */}
//           <div className="w-12 h-12">
//             <Image
//               src="/images/logo.png"
//               alt="Learning together"
//               height={38}
//               width={38}
//               className="object-cover"
//             />
//           </div>

//           {/* Navigation Links - Hidden on mobile */}
//           <div className="hidden md:flex items-center space-x-8 w-full">
//             <button
//               onClick={() => handleNavClick("home")}
//               className={`transition-colors cursor-pointer ${
//                 isScrolled
//                   ? "text-gray-800 hover:text-[#E7717D]"
//                   : "text-[#EACCB9] hover:text-[#f6bc98]"
//               }`}
//             >
//               Главная
//             </button>
//             <button
//               onClick={() => handleNavClick("masterClasses")}
//               className={`transition-colors cursor-pointer ${
//                 isScrolled
//                   ? "text-gray-800 hover:text-[#E7717D]"
//                   : "text-[#EACCB9] hover:text-[#f6bc98]"
//               }`}
//             >
//               Мастер-классы
//             </button>
//             <button
//               onClick={() => handleNavClick("catalog")}
//               className={`transition-colors cursor-pointer ${
//                 isScrolled
//                   ? "text-gray-800 hover:text-[#E7717D]"
//                   : "text-[#EACCB9] hover:text-[#f6bc98]"
//               }`}
//             >
//               Каталог
//             </button>
//             <button
//               onClick={() => handleNavClick("aboutUs")}
//               className={`transition-colors cursor-pointer ${
//                 isScrolled
//                   ? "text-gray-800 hover:text-[#E7717D]"
//                   : "text-[#EACCB9] hover:text-[#f6bc98]"
//               }`}
//             >
//               О Нас
//             </button>
//             <button
//               onClick={() => handleNavClick("schedule")}
//               className={`transition-colors cursor-pointer ${
//                 isScrolled
//                   ? "text-gray-800 hover:text-[#E7717D]"
//                   : "text-[#EACCB9] hover:text-[#f6bc98]"
//               }`}
//             >
//               Расписание
//             </button>
//             <button
//               onClick={() => handleNavClick("contacts")}
//               className={`transition-colors cursor-pointer ${
//                 isScrolled
//                   ? "text-gray-800 hover:text-[#E7717D]"
//                   : "text-[#EACCB9] hover:text-[#f6bc98]"
//               }`}
//             >
//               Контакты
//             </button>
//             <button
//               onClick={() => handleNavClick("stickers")}
//               className={`transition-colors cursor-pointer ${
//                 isScrolled
//                   ? "text-gray-800 hover:text-[#E7717D]"
//                   : "text-[#EACCB9] hover:text-[#f6bc98]"
//               }`}
//             >
//               Наклейки
//             </button>
//           </div>
//         </div>

//         {/* Desktop Personal Cabinet Button */}
//         <button
//           className={`hidden md:block px-6 py-2 rounded-full transition-all duration-300 ${
//             isScrolled
//               ? "bg-[#E7717D] text-white hover:bg-[#C2937A]"
//               : "bg-white/20 backdrop-blur-sm text-white hover:bg-[#C2B9B0]"
//           }`}
//         >
//           <a href="/auth/sign-in">Личный Кабинет</a>
//         </button>

//         {/* Mobile Hamburger Menu Button */}
//         <button
//           className="md:hidden bg-[#7E685A] p-3 rounded-full"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           <div className="w-5 h-4 flex flex-col justify-between">
//             <div className="w-full h-0.5 bg-black rounded"></div>
//             <div className="w-full h-0.5 bg-black rounded"></div>
//             <div className="w-full h-0.5 bg-black rounded"></div>
//           </div>
//         </button>
//       </div>

//       {/* Mobile Menu Overlay */}
//       {isMenuOpen && (
//         <div className="md:hidden fixed top-0 left-0 w-full h-full bg-slate-700 z-50 flex flex-col items-center justify-center text-white text-xl space-y-8">
//           {/* Close button */}
//           <button
//             className="absolute top-6 right-6 text-white text-3xl"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             ✕
//           </button>

//           {/* Mobile Menu Items */}
//           <button
//             onClick={() => {
//               handleNavClick("home");
//               setIsMenuOpen(false);
//             }}
//             className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
//           >
//             Главная
//           </button>
//           <button
//             onClick={() => {
//               handleNavClick("masterClasses");
//               setIsMenuOpen(false);
//             }}
//             className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
//           >
//             Мастер классы
//           </button>
//           <button
//             onClick={() => {
//               handleNavClick("aboutUs");
//               setIsMenuOpen(false);
//             }}
//             className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
//           >
//             О нас
//           </button>
//           <button
//             onClick={() => {
//               handleNavClick("schedule");
//               setIsMenuOpen(false);
//             }}
//             className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
//           >
//             Расписание
//           </button>
//           <button
//             onClick={() => {
//               handleNavClick("whyUs");
//               setIsMenuOpen(false);
//             }}
//             className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
//           >
//             Почему мы?
//           </button>
//           <button
//             onClick={() => {
//               handleNavClick("reviews");
//               setIsMenuOpen(false);
//             }}
//             className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
//           >
//             Отзывы
//           </button>
//           <button
//             onClick={() => {
//               handleNavClick("photoGallery");
//               setIsMenuOpen(false);
//             }}
//             className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
//           >
//             Наша фотогалерея
//           </button>

//           {/* Mobile Auth Buttons */}
//           <div className="flex flex-col space-y-4 mt-8">
//             <button className="bg-[#E7717D] text-white px-8 py-3 rounded-full hover:bg-[#B5825F] transition-all duration-300">
//               <a href="/auth/sign-in">Авторизация</a>
//             </button>
//             <button className="border border-[#E7717D] text-white px-8 py-3 rounded-full hover:bg-[#C2937A] hover:text-white transition-all duration-300">
//               <a href="/auth/sign-up">Регистрация</a>
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
