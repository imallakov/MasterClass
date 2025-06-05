"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

const MasterClasses = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);
  const desktopScrollContainerRef = useRef(null);

  const classes = [
    {
      id: 1,
      title: "Макраме лист-пером",
      price: "800 ₽",
      image: "/images/masterclass3.jpg",
    },
    {
      id: 2,
      title: "Макраме кукла",
      price: "1200 ₽",
      image: "/images/masterclass2.png",
    },
    {
      id: 3,
      title: "Макраме ангел",
      price: "800 ₽",
      image: "/images/masterclass1.jpg",
    },
    {
      id: 4,
      title: "Макраме лист-пером",
      price: "800 ₽",
      image: "/images/masterclass3.jpg",
    },
    {
      id: 5,
      title: "Макраме кукла",
      price: "1200 ₽",
      image: "/images/masterclass2.png",
    },
    {
      id: 6,
      title: "Макраме ангел",
      price: "800 ₽",
      image: "/images/masterclass1.jpg",
    },
  ];

  // Improved scroll logic with useCallback for better performance
  const scrollToSlide = useCallback(
    (direction) => {
      const mobileContainer = scrollContainerRef.current;
      const desktopContainer = desktopScrollContainerRef.current;
      const container =
        window.innerWidth >= 768 ? desktopContainer : mobileContainer;

      if (!container) return;

      const cardWidth = container.children[0]?.offsetWidth + 24; // card width + gap
      if (!cardWidth) return;

      const newSlide =
        direction === "next"
          ? Math.min(currentSlide + 1, classes.length - 1)
          : Math.max(currentSlide - 1, 0);

      // Only scroll if the slide actually changes
      if (newSlide !== currentSlide) {
        container.scrollTo({
          left: newSlide * (cardWidth || 0),
          behavior: "smooth",
        });
        setCurrentSlide(newSlide);
      }
    },
    [currentSlide, classes.length]
  );

  // Handle scroll events to sync currentSlide with actual scroll position
  const handleScroll = useCallback(
    (containerRef) => {
      return () => {
        const container = containerRef.current;
        if (!container) return;

        const cardWidth = container.children[0]?.offsetWidth + 24;
        if (!cardWidth) return;

        const scrollLeft = container.scrollLeft;
        const newSlide = Math.round(scrollLeft / cardWidth);

        if (
          newSlide !== currentSlide &&
          newSlide >= 0 &&
          newSlide < classes.length
        ) {
          setCurrentSlide(newSlide);
        }
      };
    },
    [currentSlide, classes.length]
  );

  // Add scroll event listeners for both mobile and desktop
  useEffect(() => {
    const mobileContainer = scrollContainerRef.current;
    const desktopContainer = desktopScrollContainerRef.current;

    const mobileScrollHandler = handleScroll(scrollContainerRef);
    const desktopScrollHandler = handleScroll(desktopScrollContainerRef);

    if (mobileContainer) {
      mobileContainer.addEventListener("scroll", mobileScrollHandler, {
        passive: true,
      });
    }

    if (desktopContainer) {
      desktopContainer.addEventListener("scroll", desktopScrollHandler, {
        passive: true,
      });
    }

    return () => {
      if (mobileContainer) {
        mobileContainer.removeEventListener("scroll", mobileScrollHandler);
      }
      if (desktopContainer) {
        desktopContainer.removeEventListener("scroll", desktopScrollHandler);
      }
    };
  }, [handleScroll]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        scrollToSlide("prev");
      } else if (event.key === "ArrowRight") {
        scrollToSlide("next");
      }
    },
    [scrollToSlide]
  );

  // Navigate to specific slide (for potential dot click functionality)
  const goToSlide = useCallback(
    (slideIndex) => {
      const mobileContainer = scrollContainerRef.current;
      const desktopContainer = desktopScrollContainerRef.current;
      const container =
        window.innerWidth >= 768 ? desktopContainer : mobileContainer;

      if (!container || slideIndex === currentSlide) return;

      const cardWidth = container.children[0]?.offsetWidth + 24;
      if (!cardWidth) return;

      container.scrollTo({
        left: slideIndex * cardWidth,
        behavior: "smooth",
      });
      setCurrentSlide(slideIndex);
    },
    [currentSlide]
  );

  // Arrow button component to reduce duplication
  const ArrowButton = ({ direction, disabled, onClick }) => (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`absolute ${
        direction === "left" ? "left-0 -translate-x-4" : "right-0 translate-x-4"
      } top-1/2 -translate-y-1/2 md:-translate-x-4 z-10 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={disabled}
      aria-label={`${direction === "left" ? "Previous" : "Next"} slide`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 md:h-10 md:w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );

  // Class card component to reduce duplication
  const ClassCard = ({ item, isMobile = false }) => (
    <div
      className={`${
        isMobile
          ? "flex-shrink-0 w-[160px] snap-center"
          : "flex-shrink-0 w-76 snap-center"
      }`}
    >
      <div
        className={`relative ${
          isMobile ? "h-[200px]" : "h-[370px]"
        } w-full mb-4 rounded-lg overflow-hidden`}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes={isMobile ? "160px" : "304px"}
          style={{ objectFit: "cover" }}
          className="rounded-xl"
          priority={item.id === 1} // Priority loading for first image
        />

        {/* Info Icon */}
        <div
          className={`absolute top-3 right-3 rounded-xl p-1 ${
            isMobile ? "w-8 h-8" : "w-12 h-12"
          } flex items-center justify-center bg-[#C2B9B0]/40 rotate-45`}
        >
          <span
            className={`${
              isMobile ? "text-xs px-[6px] border-1" : "text-xl px-3 border-3"
            } -rotate-45 font-bold border-[#3A6281] text-[#3A6281] rounded-full`}
          >
            i
          </span>
        </div>
      </div>

      <div
        className={`flex justify-between ${
          isMobile ? "items-start" : "items-center"
        } pb-2`}
      >
        <h3
          className={`${
            isMobile ? "text-md leading-tight mr-2" : "text-3xl"
          } text-[#7E685A] font-light`}
        >
          {item.title}
        </h3>
        <p
          className={`${
            isMobile
              ? "text-md text-[#0E820E] font-medium"
              : "text-2xl text-[#EACCB9] font-light"
          } text-nowrap`}
        >
          {item.price}
        </p>
      </div>
    </div>
  );

  return (
    <section className="w-full py-12 px-6 md:px-12 lg:px-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-600 mb-8 md:mb-12">
          Мастер-классы
        </h2>

        <div
          className="relative"
          role="region"
          aria-label="Master classes carousel"
        >
          {/* Left Arrow */}
          <ArrowButton
            direction="left"
            disabled={currentSlide === 0}
            onClick={() => scrollToSlide("prev")}
          />

          {/* Classes Container */}
          <div className="block md:hidden">
            {/* Mobile Horizontal Scroll */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              role="tablist"
              aria-label="Master classes"
            >
              {classes.map((item, index) => (
                <div
                  key={item.id}
                  role="tabpanel"
                  aria-label={`Slide ${index + 1}`}
                >
                  <ClassCard item={item} isMobile={true} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Horizontal Scroll */}
          <div className="hidden md:block">
            <div
              ref={desktopScrollContainerRef}
              className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              role="tablist"
              aria-label="Master classes"
            >
              {classes.map((item, index) => (
                <div
                  key={item.id}
                  role="tabpanel"
                  aria-label={`Slide ${index + 1}`}
                >
                  <ClassCard item={item} isMobile={false} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <ArrowButton
            direction="right"
            disabled={currentSlide === classes.length - 1}
            onClick={() => scrollToSlide("next")}
          />
        </div>

        {/* Pagination Dots */}
        <div
          className="flex justify-center mt-6 md:mt-8 space-x-2"
          role="tablist"
        >
          {classes.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                i === currentSlide ? "bg-amber-300" : "bg-gray-200"
              }`}
              role="tab"
              aria-selected={i === currentSlide}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-6 md:mt-8">
          <button
            className="flex flex-col items-center text-slate-700 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 rounded-lg p-2"
            aria-label="View all master classes"
          >
            <span className="text-base md:text-lg mb-2 text-center px-4">
              Перейти ко всем мастер-классам
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-amber-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MasterClasses;

// "use client";
// import React, { useState, useRef } from "react";
// import Image from "next/image";

// const MasterClasses = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const scrollContainerRef = useRef(null);

//   const classes = [
//     {
//       id: 1,
//       title: "Макраме лист-пером",
//       price: "800 ₽",
//       image: "/images/masterclass3.jpg",
//     },
//     {
//       id: 2,
//       title: "Макраме кукла",
//       price: "1200 ₽",
//       image: "/images/masterclass2.png",
//     },
//     {
//       id: 3,
//       title: "Макраме ангел",
//       price: "800 ₽",
//       image: "/images/masterclass1.jpg",
//     },
//   ];

//   const scrollToSlide = (direction) => {
//     if (scrollContainerRef.current) {
//       const container = scrollContainerRef.current;
//       const cardWidth = container.children[0].offsetWidth + 24; // card width + gap
//       const newSlide =
//         direction === "next"
//           ? Math.min(currentSlide + 1, classes.length - 1)
//           : Math.max(currentSlide - 1, 0);

//       container.scrollTo({
//         left: newSlide * cardWidth,
//         behavior: "smooth",
//       });
//       setCurrentSlide(newSlide);
//     }
//   };

//   return (
//     <section className="w-full py-12 px-6 md:px-12 lg:px-16 bg-white">
//       <div className="container mx-auto">
//         <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-600 mb-8 md:mb-12">
//           Мастер-классы
//         </h2>

//         <div className="relative">
//           {/* Left Arrow */}
//           <button
//             onClick={() => scrollToSlide("prev")}
//             className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
//             disabled={currentSlide === 0}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-8 w-8 md:h-10 md:w-10"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//           </button>

//           {/* Classes Container */}
//           <div className="block md:hidden">
//             {/* Mobile Horizontal Scroll */}
//             <div
//               ref={scrollContainerRef}
//               className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
//               style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//             >
//               {classes.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex-shrink-0 w-[160px] snap-center"
//                 >
//                   <div className="relative h-[200px] w-full mb-4 rounded-lg overflow-hidden">
//                     <Image
//                       src={item.image}
//                       alt={item.title}
//                       layout="fill"
//                       style={{ objectFit: "cover" }}
//                       className="rounded-xl"
//                     />

//                     {/* Info Icon */}
//                     <div className="absolute top-3 right-3 rounded-xl p-1 w-8 h-8 flex items-center justify-center bg-[#C2B9B0]/40 rotate-45">
//                       <span className="text-xs -rotate-45 px-[6px] border-1 font-bold border-[#3A6281] text-[#3A6281] rounded-full">
//                         i
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-start pb-2">
//                     <h3 className="text-md text-[#7E685A] font-light leading-tight mr-2">
//                       {item.title}
//                     </h3>
//                     <p className="text-md text-[#0E820E] font-medium text-nowrap">
//                       {item.price}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Desktop Grid */}
//           <div className="hidden md:grid grid-cols-3 gap-2 place-items-center items-start">
//             {classes.map((item) => (
//               <div
//                 key={item.id}
//                 className="relative rounded-lg overflow-hidden w-76"
//               >
//                 <div className="relative h-[370px] w-full mb-4 rounded-lg overflow-hidden">
//                   <Image
//                     src={item.image}
//                     alt={item.title}
//                     layout="fill"
//                     style={{ objectFit: "cover" }}
//                     className="rounded-xl"
//                   />

//                   {/* Info Icon */}
//                   <div className="absolute top-3 right-3 rounded-xl p-1 w-12 h-12 flex items-center justify-center bg-[#C2B9B0]/40 rotate-45">
//                     <span className="text-xl -rotate-45 px-3 border-3 font-bold border-[#3A6281] text-[#3A6281] rounded-full">
//                       i
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center pb-2">
//                   <h3 className="text-3xl text-[#7E685A] font-light">
//                     {item.title}
//                   </h3>
//                   <p className="text-2xl text-[#EACCB9] font-light text-nowrap">
//                     {item.price}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Right Arrow */}
//           <button
//             onClick={() => scrollToSlide("next")}
//             className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
//             disabled={currentSlide === classes.length - 1}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-8 w-8 md:h-10 md:w-10"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M9 5l7 7-7 7"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Pagination Dots */}
//         <div className="flex justify-center mt-6 md:mt-8 space-x-2">
//           {classes.map((_, i) => (
//             <div
//               key={i}
//               className={`w-2 h-2 rounded-full transition-colors duration-200 ${
//                 i === currentSlide ? "bg-amber-300" : "bg-gray-200"
//               }`}
//             ></div>
//           ))}
//           {/* Additional dots for desktop to match original design */}
//           <div className="hidden md:flex space-x-2">
//             {[...Array(5)].map((_, i) => (
//               <div
//                 key={i + 3}
//                 className={`w-2 h-2 rounded-full ${
//                   i === 1 ? "bg-amber-300" : "bg-gray-200"
//                 }`}
//               ></div>
//             ))}
//           </div>
//         </div>

//         {/* View All Button */}
//         <div className="flex justify-center mt-6 md:mt-8">
//           <button className="flex flex-col items-center text-slate-700 hover:text-slate-600 transition-colors">
//             <span className="text-base md:text-lg mb-2 text-center px-4">
//               Перейти ко всем мастер-классам
//             </span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 text-amber-300"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M19 9l-7 7-7-7"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MasterClasses;
