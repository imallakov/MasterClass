// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useState } from "react";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-15 px-14 py-4">
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
//           <div className="hidden md:flex items-center space-x-8 w-full text-white">
//             <a
//               href="#"
//               className="text-[#EACCB9] hover:text-[#f6bc98] transition-colors"
//             >
//               Главная
//             </a>
//             <a
//               href="#"
//               className="text-[#EACCB9] hover:text-[#f6bc98] transition-colors"
//             >
//               Мастер-классы
//             </a>
//             <a
//               href="#"
//               className="text-[#EACCB9] hover:text-[#f6bc98] transition-colors"
//             >
//               Каталог
//             </a>
//             <a
//               href="#"
//               className="text-[#EACCB9] hover:text-[#f6bc98] transition-colors"
//             >
//               О Нас
//             </a>
//             <a
//               href="#"
//               className="text-[#EACCB9] hover:text-[#f6bc98] transition-colors"
//             >
//               Расписание
//             </a>
//             <a
//               href="#"
//               className="text-[#EACCB9] hover:text-[#f6bc98] transition-colors"
//             >
//               Контакты
//             </a>
//             <a
//               href="#"
//               className="text-[#EACCB9] hover:text-[#f6bc98] transition-colors"
//             >
//               Наклейки
//             </a>
//           </div>
//         </div>

//         {/* Desktop Personal Cabinet Button */}
//         <button className="hidden md:block bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-[#C2B9B0] transition-all duration-300">
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
import Link from "next/link";
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Change background after scrolling 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-15 px-14 py-4 transition-all duration-300 ${
        isScrolled ? "bg-white backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-12 w-2/3">
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

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8 w-full">
            <a
              href="#"
              className={`transition-colors ${
                isScrolled
                  ? "text-gray-800 hover:text-[#E7717D]"
                  : "text-[#EACCB9] hover:text-[#f6bc98]"
              }`}
            >
              Главная
            </a>
            <a
              href="#"
              className={`transition-colors ${
                isScrolled
                  ? "text-gray-800 hover:text-[#E7717D]"
                  : "text-[#EACCB9] hover:text-[#f6bc98]"
              }`}
            >
              Мастер-классы
            </a>
            <a
              href="#"
              className={`transition-colors ${
                isScrolled
                  ? "text-gray-800 hover:text-[#E7717D]"
                  : "text-[#EACCB9] hover:text-[#f6bc98]"
              }`}
            >
              Каталог
            </a>
            <a
              href="#"
              className={`transition-colors ${
                isScrolled
                  ? "text-gray-800 hover:text-[#E7717D]"
                  : "text-[#EACCB9] hover:text-[#f6bc98]"
              }`}
            >
              О Нас
            </a>
            <a
              href="#"
              className={`transition-colors ${
                isScrolled
                  ? "text-gray-800 hover:text-[#E7717D]"
                  : "text-[#EACCB9] hover:text-[#f6bc98]"
              }`}
            >
              Расписание
            </a>
            <a
              href="#"
              className={`transition-colors ${
                isScrolled
                  ? "text-gray-800 hover:text-[#E7717D]"
                  : "text-[#EACCB9] hover:text-[#f6bc98]"
              }`}
            >
              Контакты
            </a>
            <a
              href="#"
              className={`transition-colors ${
                isScrolled
                  ? "text-gray-800 hover:text-[#E7717D]"
                  : "text-[#EACCB9] hover:text-[#f6bc98]"
              }`}
            >
              Наклейки
            </a>
          </div>
        </div>

        {/* Desktop Personal Cabinet Button */}
        <button
          className={`hidden md:block px-6 py-2 rounded-full transition-all duration-300 ${
            isScrolled
              ? "bg-[#E7717D] text-white hover:bg-[#C2937A]"
              : "bg-white/20 backdrop-blur-sm text-white hover:bg-[#C2B9B0]"
          }`}
        >
          <a href="/auth/sign-in">Личный Кабинет</a>
        </button>

        {/* Mobile Hamburger Menu Button */}
        <button
          className="md:hidden bg-[#7E685A] p-3 rounded-full"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <div className="w-full h-0.5 bg-black rounded"></div>
            <div className="w-full h-0.5 bg-black rounded"></div>
            <div className="w-full h-0.5 bg-black rounded"></div>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-700 z-50 flex flex-col items-center justify-center text-white text-xl space-y-8">
          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={() => setIsMenuOpen(false)}
          >
            ✕
          </button>

          {/* Mobile Menu Items */}
          <a
            href="#"
            className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Главная
          </a>
          <a
            href="#"
            className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Мастер классы
          </a>
          <a
            href="#"
            className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            О нас
          </a>
          <a
            href="#"
            className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Расписание
          </a>
          <a
            href="#"
            className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Почему мы?
          </a>
          <a
            href="#"
            className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Отзывы
          </a>
          <a
            href="#"
            className="text-white hover:text-[#f6bc98] text-3xl font-bold transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Наша фотогалерея
          </a>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col space-y-4 mt-8">
            <button className="bg-[#E7717D] text-white px-8 py-3 rounded-full hover:bg-[#B5825F] transition-all duration-300">
              <a href="/auth/sign-in">Авторизация</a>
            </button>
            <button className="border border-[#E7717D] text-white px-8 py-3 rounded-full hover:bg-[#C2937A] hover:text-white transition-all duration-300">
              <a href="/auth/sign-up">Регистрация</a>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
