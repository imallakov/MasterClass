// "use client";
// import React, { useState, useRef, useCallback, useEffect } from "react";
// import Image from "next/image";

// const MasterClasses = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const scrollContainerRef = useRef(null);
//   const desktopScrollContainerRef = useRef(null);

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
//     {
//       id: 4,
//       title: "Макраме лист-пером",
//       price: "800 ₽",
//       image: "/images/masterclass3.jpg",
//     },
//     {
//       id: 5,
//       title: "Макраме кукла",
//       price: "1200 ₽",
//       image: "/images/masterclass2.png",
//     },
//     {
//       id: 6,
//       title: "Макраме ангел",
//       price: "800 ₽",
//       image: "/images/masterclass1.jpg",
//     },
//   ];

//   // Improved scroll logic with useCallback for better performance
//   const scrollToSlide = useCallback(
//     (direction) => {
//       const mobileContainer = scrollContainerRef.current;
//       const desktopContainer = desktopScrollContainerRef.current;
//       const container =
//         window.innerWidth >= 768 ? desktopContainer : mobileContainer;

//       if (!container) return;

//       const cardWidth = container.children[0]?.offsetWidth + 24; // card width + gap
//       if (!cardWidth) return;

//       const newSlide =
//         direction === "next"
//           ? Math.min(currentSlide + 1, classes.length - 1)
//           : Math.max(currentSlide - 1, 0);

//       // Only scroll if the slide actually changes
//       if (newSlide !== currentSlide) {
//         container.scrollTo({
//           left: newSlide * (cardWidth || 0),
//           behavior: "smooth",
//         });
//         setCurrentSlide(newSlide);
//       }
//     },
//     [currentSlide, classes.length]
//   );

//   // Handle scroll events to sync currentSlide with actual scroll position
//   const handleScroll = useCallback(
//     (containerRef) => {
//       return () => {
//         const container = containerRef.current;
//         if (!container) return;

//         const cardWidth = container.children[0]?.offsetWidth + 24;
//         if (!cardWidth) return;

//         const scrollLeft = container.scrollLeft;
//         const newSlide = Math.round(scrollLeft / cardWidth);

//         if (
//           newSlide !== currentSlide &&
//           newSlide >= 0 &&
//           newSlide < classes.length
//         ) {
//           setCurrentSlide(newSlide);
//         }
//       };
//     },
//     [currentSlide, classes.length]
//   );

//   // Add scroll event listeners for both mobile and desktop
//   useEffect(() => {
//     const mobileContainer = scrollContainerRef.current;
//     const desktopContainer = desktopScrollContainerRef.current;

//     const mobileScrollHandler = handleScroll(scrollContainerRef);
//     const desktopScrollHandler = handleScroll(desktopScrollContainerRef);

//     if (mobileContainer) {
//       mobileContainer.addEventListener("scroll", mobileScrollHandler, {
//         passive: true,
//       });
//     }

//     if (desktopContainer) {
//       desktopContainer.addEventListener("scroll", desktopScrollHandler, {
//         passive: true,
//       });
//     }

//     return () => {
//       if (mobileContainer) {
//         mobileContainer.removeEventListener("scroll", mobileScrollHandler);
//       }
//       if (desktopContainer) {
//         desktopContainer.removeEventListener("scroll", desktopScrollHandler);
//       }
//     };
//   }, [handleScroll]);

//   // Keyboard navigation
//   const handleKeyDown = useCallback(
//     (event) => {
//       if (event.key === "ArrowLeft") {
//         scrollToSlide("prev");
//       } else if (event.key === "ArrowRight") {
//         scrollToSlide("next");
//       }
//     },
//     [scrollToSlide]
//   );

//   // Navigate to specific slide (for potential dot click functionality)
//   const goToSlide = useCallback(
//     (slideIndex) => {
//       const mobileContainer = scrollContainerRef.current;
//       const desktopContainer = desktopScrollContainerRef.current;
//       const container =
//         window.innerWidth >= 768 ? desktopContainer : mobileContainer;

//       if (!container || slideIndex === currentSlide) return;

//       const cardWidth = container.children[0]?.offsetWidth + 24;
//       if (!cardWidth) return;

//       container.scrollTo({
//         left: slideIndex * cardWidth,
//         behavior: "smooth",
//       });
//       setCurrentSlide(slideIndex);
//     },
//     [currentSlide]
//   );

//   // Arrow button component to reduce duplication
//   const ArrowButton = ({ direction, disabled, onClick }) => (
//     <button
//       onClick={onClick}
//       onKeyDown={handleKeyDown}
//       className={`absolute ${
//         direction === "left" ? "left-0 -translate-x-4" : "right-0 translate-x-4"
//       } top-1/2 -translate-y-1/2 md:-translate-x-4 z-10 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
//       disabled={disabled}
//       aria-label={`${direction === "left" ? "Previous" : "Next"} slide`}
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-8 w-8 md:h-10 md:w-10"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={1.5}
//           d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
//         />
//       </svg>
//     </button>
//   );

//   // Class card component to reduce duplication
//   const ClassCard = ({ item, isMobile = false }) => (
//     <div
//       className={`${
//         isMobile
//           ? "flex-shrink-0 w-[160px] snap-center"
//           : "flex-shrink-0 w-76 snap-center"
//       }`}
//     >
//       <div
//         className={`relative ${
//           isMobile ? "h-[200px]" : "h-[370px]"
//         } w-full mb-4 rounded-lg overflow-hidden`}
//       >
//         <Image
//           src={item.image}
//           alt={item.title}
//           fill
//           sizes={isMobile ? "160px" : "304px"}
//           style={{ objectFit: "cover" }}
//           className="rounded-xl"
//           priority={item.id === 1} // Priority loading for first image
//         />

//         {/* Info Icon */}
//         <div
//           className={`absolute top-3 right-3 rounded-xl p-1 ${
//             isMobile ? "w-8 h-8" : "w-12 h-12"
//           } flex items-center justify-center bg-[#C2B9B0]/40 rotate-45`}
//         >
//           <span
//             className={`${
//               isMobile ? "text-xs px-[6px] border-1" : "text-xl px-3 border-3"
//             } -rotate-45 font-bold border-[#3A6281] text-[#3A6281] rounded-full`}
//           >
//             i
//           </span>
//         </div>
//       </div>

//       <div
//         className={`flex justify-between ${
//           isMobile ? "items-start" : "items-center"
//         } pb-2`}
//       >
//         <h3
//           className={`${
//             isMobile ? "text-md leading-tight mr-2" : "text-3xl"
//           } text-[#7E685A] font-light`}
//         >
//           {item.title}
//         </h3>
//         <p
//           className={`${
//             isMobile
//               ? "text-md text-[#0E820E] font-medium"
//               : "text-2xl text-[#EACCB9] font-light"
//           } text-nowrap`}
//         >
//           {item.price}
//         </p>
//       </div>
//     </div>
//   );

//   return (
//     <section className="w-full py-12 px-6 md:px-12 lg:px-16 bg-white">
//       <div className="container mx-auto">
//         <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-600 mb-8 md:mb-12">
//           Мастер-классы
//         </h2>

//         <div
//           className="relative"
//           role="region"
//           aria-label="Master classes carousel"
//         >
//           {/* Left Arrow */}
//           <ArrowButton
//             direction="left"
//             disabled={currentSlide === 0}
//             onClick={() => scrollToSlide("prev")}
//           />

//           {/* Classes Container */}
//           <div className="block md:hidden">
//             {/* Mobile Horizontal Scroll */}
//             <div
//               ref={scrollContainerRef}
//               className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
//               style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//               role="tablist"
//               aria-label="Master classes"
//             >
//               {classes.map((item, index) => (
//                 <div
//                   key={item.id}
//                   role="tabpanel"
//                   aria-label={`Slide ${index + 1}`}
//                 >
//                   <ClassCard item={item} isMobile={true} />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Desktop Horizontal Scroll */}
//           <div className="hidden md:block">
//             <div
//               ref={desktopScrollContainerRef}
//               className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
//               style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//               role="tablist"
//               aria-label="Master classes"
//             >
//               {classes.map((item, index) => (
//                 <div
//                   key={item.id}
//                   role="tabpanel"
//                   aria-label={`Slide ${index + 1}`}
//                 >
//                   <ClassCard item={item} isMobile={false} />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right Arrow */}
//           <ArrowButton
//             direction="right"
//             disabled={currentSlide === classes.length - 1}
//             onClick={() => scrollToSlide("next")}
//           />
//         </div>

//         {/* Pagination Dots */}
//         <div
//           className="flex justify-center mt-6 md:mt-8 space-x-2"
//           role="tablist"
//         >
//           {classes.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => goToSlide(i)}
//               className={`w-2 h-2 rounded-full transition-colors duration-200 ${
//                 i === currentSlide ? "bg-amber-300" : "bg-gray-200"
//               }`}
//               role="tab"
//               aria-selected={i === currentSlide}
//               aria-label={`Go to slide ${i + 1}`}
//             />
//           ))}
//         </div>

//         {/* View All Button */}
//         <div className="flex justify-center mt-6 md:mt-8">
//           <button
//             className="flex flex-col items-center text-slate-700 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 rounded-lg p-2"
//             aria-label="View all master classes"
//           >
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

"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useNavigation } from "../context/NavigationContext";

const MasterClasses = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef(null);
  const desktopScrollContainerRef = useRef(null);
  const { navigateToBooking } = useNavigation();
  // Fetch masterclasses from backend
  const fetchMasterclasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8000/api/masterclasses/");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform the data to match the expected format
      const transformedData = data.map((item) => ({
        id: item.id,
        title: item.title,
        price: `${parseFloat(item.price).toLocaleString("ru-RU")} ₽`,
        image: item.image,
        description: item.description,
        participantLimit: item.participant_limit,
        slots: item.slots,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      setClasses(transformedData);
    } catch (err) {
      console.error("Error fetching masterclasses:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch specific masterclass details
  const fetchMasterclassDetails = useCallback(async (id) => {
    try {
      setModalLoading(true);
      setModalError(null);

      const response = await fetch(
        `http://localhost:8000/api/masterclasses/${id}/`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform the detailed data
      const transformedData = {
        id: data.id,
        title: data.title,
        price: `${parseFloat(data.price).toLocaleString("ru-RU")} ₽`,
        image: data.image,
        description: data.description,
        participantLimit: data.participant_limit,
        slots: data.slots,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setSelectedClass(transformedData);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching masterclass details:", err);
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  }, []);

  // Handle masterclass card click
  const handleClassClick = useCallback(
    (classId) => {
      fetchMasterclassDetails(classId);
    },
    [fetchMasterclassDetails]
  );

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedClass(null);
    setModalError(null);
  }, []);

  // Handle modal backdrop click
  const handleModalBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    },
    [closeModal]
  );

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, closeModal]);

  // Fetch data on component mount
  useEffect(() => {
    fetchMasterclasses();
  }, [fetchMasterclasses]);

  // Improved scroll logic with useCallback for better performance
  const scrollToSlide = useCallback(
    (direction) => {
      const mobileContainer = scrollContainerRef.current;
      const desktopContainer = desktopScrollContainerRef.current;
      const container =
        window.innerWidth >= 768 ? desktopContainer : mobileContainer;

      if (!container || classes.length === 0) return;

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
        if (!container || classes.length === 0) return;

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
    if (classes.length === 0) return;

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
  }, [handleScroll, classes.length]);

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

      if (!container || slideIndex === currentSlide || classes.length === 0)
        return;

      const cardWidth = container.children[0]?.offsetWidth + 24;
      if (!cardWidth) return;

      container.scrollTo({
        left: slideIndex * cardWidth,
        behavior: "smooth",
      });
      setCurrentSlide(slideIndex);
    },
    [currentSlide, classes.length]
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
          ? "flex-shrink-0 w-[160px] snap-center cursor-pointer"
          : "flex-shrink-0 w-76 snap-center mx-10 cursor-pointer"
      } hover:transform hover:scale-105 transition-transform duration-200`}
      onClick={() => handleClassClick(item.id)}
    >
      <div
        className={`relative ${
          isMobile ? "h-[200px]" : "h-[370px]"
        } w-full mb-4 rounded-lg overflow-hidden`}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover rounded-xl"
          loading={item.id === 1 ? "eager" : "lazy"} // Priority loading for first image
          onError={(e) => {
            // Fallback image if the image fails to load
            e.target.src = "/images/placeholder.jpg";
          }}
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

  // Modal component - replace the existing Modal component with this version
  // const Modal = () => {
  //   if (!isModalOpen) return null;

  //   return (
  //     <div
  //       className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4"
  //       onClick={handleModalBackdropClick}
  //     >
  //       <div className="relative sm:max-w-2xl md:max-w-4xl w-full">
  //         <div className="absolute -top-10 left-4 items-center gap-3 mb-6">
  //           <div className="flex justify-center gap-2">
  //             <div className="w-20 h-20 rounded-full border border-green-600 flex items-center justify-center z-10">
  //               <img src="/images/paper.png" alt="paper" />
  //             </div>
  //             <span className="text-green-600 text-sm font-medium">
  //               Экологически чистый
  //               <br />
  //               материал
  //             </span>
  //           </div>
  //         </div>

  //         {/* Price tag */}
  //         <div className="absolute -top-36 right-1/4 text-[#FFB283] text-2xl font-medium z-20">
  //           {selectedClass.price}
  //         </div>
  //         {/* Navigation arrows */}
  //         <button
  //           className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
  //           onClick={() => scrollToSlide("prev")}
  //           disabled={currentSlide === 0}
  //         >
  //           <svg
  //             className="w-6 h-6 text-gray-600"
  //             fill="none"
  //             viewBox="0 0 24 24"
  //             stroke="currentColor"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth={2}
  //               d="M15 19l-7-7 7-7"
  //             />
  //           </svg>
  //         </button>
  //         <button
  //           className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
  //           onClick={() => scrollToSlide("next")}
  //           disabled={currentSlide === classes.length - 1}
  //         >
  //           <svg
  //             className="w-6 h-6 text-gray-600"
  //             fill="none"
  //             viewBox="0 0 24 24"
  //             stroke="currentColor"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth={2}
  //               d="M9 5l7 7-7 7"
  //             />
  //           </svg>
  //         </button>

  //         <div className="relative bg-[#F4F1F1] rounded-3xl overflow-hidden mx-16 z-20">
  //           {modalLoading && (
  //             <div className="flex justify-center items-center py-20">
  //               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-300"></div>
  //             </div>
  //           )}

  //           {modalError && (
  //             <div className="text-center py-8 px-6">
  //               <p className="text-red-500 mb-4">
  //                 Ошибка при загрузке деталей: {modalError}
  //               </p>
  //               <button
  //                 onClick={() => fetchMasterclassDetails(selectedClass?.id)}
  //                 className="px-4 py-2 bg-orange-300 text-gray-800 rounded-lg hover:bg-orange-400 transition-colors"
  //               >
  //                 Попробовать снова
  //               </button>
  //             </div>
  //           )}

  //           {selectedClass && !modalLoading && !modalError && (
  //             <>
  //               {/* Info icon */}
  //               <button
  //                 className="absolute top-6 right-6 mt-8 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors z-20"
  //                 onClick={closeModal}
  //                 aria-label="Close modal"
  //               >
  //                 <svg
  //                   className="w-4 h-4 text-gray-600"
  //                   fill="none"
  //                   viewBox="0 0 24 24"
  //                   stroke="currentColor"
  //                 >
  //                   <path
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     strokeWidth={2}
  //                     d="M6 18L18 6M6 6l12 12"
  //                   />
  //                 </svg>
  //               </button>

  //               <div className="p-8 relative">
  //                 {/* Eco badge */}
  //                 {/* Title */}
  //                 <h2 className="text-2xl font-bold text-[#3A6281] mb-4 leading-tight">
  //                   {selectedClass.title
  //                     .split(" ")
  //                     .map((word, index, array) => (
  //                       <span key={index}>
  //                         {word}
  //                         {index < array.length - 1 &&
  //                         index === Math.floor(array.length / 2) - 1 ? (
  //                           <br />
  //                         ) : (
  //                           " "
  //                         )}
  //                       </span>
  //                     ))}
  //                 </h2>

  //                 {/* Description */}
  //                 <p className="text-gray-700 text-sm leading-relaxed mb-4">
  //                   {selectedClass.description}
  //                 </p>

  //                 {/* Additional info */}
  //                 {/* <div className="mb-6">
  //                   <p className="text-blue-600 text-sm italic mb-1">
  //                     Возможность выбрать цвет
  //                   </p>
  //                   <p className="text-pink-400 text-sm">
  //                     Мастер-класс рассчитан на взрослых и детей 7+
  //                   </p>
  //                 </div> */}

  //                 {/* Stats - Optional, only show if you want */}
  //                 {(selectedClass.participantLimit || selectedClass.slots) && (
  //                   <div className="mb-4 text-xs text-gray-500 space-y-1">
  //                     {selectedClass.participantLimit && (
  //                       <p>
  //                         Лимит участников: {selectedClass.participantLimit}
  //                       </p>
  //                     )}
  //                     {selectedClass.slots && (
  //                       <p>
  //                         Доступные места:{" "}
  //                         {Array.isArray(selectedClass.slots)
  //                           ? selectedClass.slots.length
  //                           : typeof selectedClass.slots === "object" &&
  //                             selectedClass.slots?.free_places !== undefined
  //                           ? selectedClass.slots.free_places
  //                           : selectedClass.slots || 0}
  //                       </p>
  //                     )}
  //                   </div>
  //                 )}

  //                 {/* CTA Button */}
  //                 <div className="flex justify-end">
  //                   <button
  //                     className="w-1/3 min-w-[200px] bg-[#E7717D] hover:bg-[#d26b75] text-white font-medium py-3 rounded-2xl text-base transition-colors"
  //                     onClick={() => {
  //                       navigateToBooking(selectedClass.id);
  //                       closeModal(); // Close the modal after navigation
  //                     }}
  //                   >
  //                     Узнать расписание
  //                   </button>
  //                 </div>
  //               </div>
  //             </>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // Fixed Modal component with proper button handler
  const Modal = () => {
    if (!isModalOpen) return null;

    const handleBookingClick = () => {
      console.log("Book button clicked for masterclass:", selectedClass?.id); // Debug log
      if (selectedClass?.id) {
        navigateToBooking(selectedClass.id);
        closeModal();
      } else {
        console.error("No selected class ID available");
      }
    };

    return (
      <div
        className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleModalBackdropClick}
      >
        <div className="relative sm:max-w-2xl md:max-w-4xl w-full">
          <div className="absolute -top-10 left-4 items-center gap-3 mb-6">
            <div className="flex justify-center gap-2">
              <div className="w-20 h-20 rounded-full border border-green-600 flex items-center justify-center z-10">
                <img src="/images/paper.png" alt="paper" />
              </div>
              <span className="text-green-600 text-sm font-medium">
                Экологически чистый
                <br />
                материал
              </span>
            </div>
          </div>

          {/* Price tag */}
          <div className="absolute -top-36 right-1/4 text-[#FFB283] text-2xl font-medium z-20">
            {selectedClass?.price}
          </div>

          {/* Navigation arrows */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={() => scrollToSlide("prev")}
            disabled={currentSlide === 0}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={() => scrollToSlide("next")}
            disabled={currentSlide === classes.length - 1}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="relative bg-[#F4F1F1] rounded-3xl overflow-hidden mx-16 z-20">
            {modalLoading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-300"></div>
              </div>
            )}

            {modalError && (
              <div className="text-center py-8 px-6">
                <p className="text-red-500 mb-4">
                  Ошибка при загрузке деталей: {modalError}
                </p>
                <button
                  onClick={() => fetchMasterclassDetails(selectedClass?.id)}
                  className="px-4 py-2 bg-orange-300 text-gray-800 rounded-lg hover:bg-orange-400 transition-colors"
                >
                  Попробовать снова
                </button>
              </div>
            )}

            {selectedClass && !modalLoading && !modalError && (
              <>
                {/* Close button */}
                <button
                  className="absolute top-6 right-6 mt-8 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors z-20"
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="p-8 relative">
                  {/* Title */}
                  <h2 className="text-2xl font-bold text-[#3A6281] mb-4 leading-tight">
                    {selectedClass.title
                      .split(" ")
                      .map((word, index, array) => (
                        <span key={index}>
                          {word}
                          {index < array.length - 1 &&
                          index === Math.floor(array.length / 2) - 1 ? (
                            <br />
                          ) : (
                            " "
                          )}
                        </span>
                      ))}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {selectedClass.description}
                  </p>

                  {/* Stats */}
                  {(selectedClass.participantLimit || selectedClass.slots) && (
                    <div className="mb-4 text-xs text-gray-500 space-y-1">
                      {selectedClass.participantLimit && (
                        <p>
                          Лимит участников: {selectedClass.participantLimit}
                        </p>
                      )}
                      {selectedClass.slots && (
                        <p>
                          Доступные места:{" "}
                          {Array.isArray(selectedClass.slots)
                            ? selectedClass.slots.length
                            : typeof selectedClass.slots === "object" &&
                              selectedClass.slots?.free_places !== undefined
                            ? selectedClass.slots.free_places
                            : selectedClass.slots || 0}
                        </p>
                      )}
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="flex justify-end">
                    <button
                      className="w-1/3 min-w-[200px] bg-[#E7717D] hover:bg-[#d26b75] text-white font-medium py-3 rounded-2xl text-base transition-colors"
                      onClick={handleBookingClick}
                    >
                      Узнать расписание
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-300"></div>
    </div>
  );

  // Error component
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-red-500 mb-4">
        <svg
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-gray-600 mb-4 text-center">
        Ошибка при загрузке мастер-классов: {message}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-amber-300 text-gray-800 rounded-lg hover:bg-amber-400 transition-colors"
      >
        Попробовать снова
      </button>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-gray-400 mb-4">
        <svg
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <p className="text-gray-600 text-center">
        Пока нет доступных мастер-классов
      </p>
    </div>
  );

  return (
    <>
      <section className="w-full py-12 px-6 md:px-12 lg:px-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-600 mb-8 md:mb-12">
            Мастер-классы
          </h2>

          {loading && <LoadingSpinner />}

          {error && (
            <ErrorMessage message={error} onRetry={fetchMasterclasses} />
          )}

          {!loading && !error && classes.length === 0 && <EmptyState />}

          {!loading && !error && classes.length > 0 && (
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
                  className="flex gap-14 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
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
          )}

          {/* Pagination Dots - only show if there are classes */}
          {!loading && !error && classes.length > 0 && (
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
          )}

          {/* View All Button - only show if there are classes */}
          {!loading && !error && classes.length > 0 && (
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
          )}
        </div>
      </section>

      {/* Modal */}
      <Modal />
    </>
  );
};

export default MasterClasses;
