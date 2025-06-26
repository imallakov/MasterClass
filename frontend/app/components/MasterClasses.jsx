// "use client";
// import React, { useState, useRef, useCallback, useEffect } from "react";
// import Image from "next/image";
// import { useNavigation } from "../context/NavigationContext";

// const MasterClasses = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalError, setModalError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const scrollContainerRef = useRef(null);
//   const desktopScrollContainerRef = useRef(null);
//   const { navigateToBooking } = useNavigation();

//   // Fetch masterclasses from backend
//   const fetchMasterclasses = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/`
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       // Transform the data to match the expected format
//       const transformedData = data.map((item) => ({
//         id: item.id,
//         title: item.title,
//         price: `${parseFloat(item.price).toLocaleString("ru-RU")} ₽`,
//         image: item.image,
//         description: item.description,
//         participantLimit: item.participant_limit,
//         participantMinAge: item.participant_min_age,
//         participantMaxAge: item.participant_max_age,
//         slots: item.slots,
//         createdAt: item.created_at,
//         updatedAt: item.updated_at,
//       }));

//       setClasses(transformedData);
//     } catch (err) {
//       console.error("Error fetching masterclasses:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch specific masterclass details
//   const fetchMasterclassDetails = useCallback(async (id) => {
//     try {
//       setModalLoading(true);
//       setModalError(null);

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/${id}/`
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       // Transform the detailed data
//       const transformedData = {
//         id: data.id,
//         title: data.title,
//         price: `${parseFloat(data.price).toLocaleString("ru-RU")} ₽`,
//         image: data.image,
//         description: data.description,
//         participantLimit: data.participant_limit,
//         participantMinAge: data.participant_min_age,
//         participantMaxAge: data.participant_max_age,
//         slots: data.slots,
//         createdAt: data.created_at,
//         updatedAt: data.updated_at,
//       };

//       setSelectedClass(transformedData);
//       setIsModalOpen(true);
//     } catch (err) {
//       console.error("Error fetching masterclass details:", err);
//       setModalError(err.message);
//     } finally {
//       setModalLoading(false);
//     }
//   }, []);

//   const navigateModal = useCallback(
//     (direction) => {
//       if (!selectedClass || classes.length === 0) return;

//       const currentIndex = classes.findIndex(
//         (cls) => cls.id === selectedClass.id
//       );
//       if (currentIndex === -1) return;

//       let newIndex;
//       if (direction === "next") {
//         newIndex = currentIndex === classes.length - 1 ? 0 : currentIndex + 1; // Loop to first
//       } else {
//         newIndex = currentIndex === 0 ? classes.length - 1 : currentIndex - 1; // Loop to last
//       }

//       const newClass = classes[newIndex];
//       fetchMasterclassDetails(newClass.id);
//     },
//     [selectedClass, classes, fetchMasterclassDetails]
//   );

//   const formatAgeRange = (minAge, maxAge) => {
//     if (!minAge && !maxAge) return null;
//     if (minAge && maxAge) {
//       if (minAge === maxAge) return `${minAge} лет`;
//       return `${minAge}-${maxAge} лет`;
//     }
//     if (minAge) return `от ${minAge} лет`;
//     if (maxAge) return `до ${maxAge} лет`;
//     return null;
//   };

//   // Handle masterclass card click
//   const handleClassClick = useCallback(
//     (classId) => {
//       fetchMasterclassDetails(classId);
//     },
//     [fetchMasterclassDetails]
//   );

//   // Close modal
//   const closeModal = useCallback(() => {
//     setIsModalOpen(false);
//     setSelectedClass(null);
//     setModalError(null);
//   }, []);

//   // Handle modal backdrop click
//   const handleModalBackdropClick = useCallback(
//     (e) => {
//       if (e.target === e.currentTarget) {
//         closeModal();
//       }
//     },
//     [closeModal]
//   );

//   // Handle escape key to close modal
//   useEffect(() => {
//     const handleEscapeKey = (e) => {
//       if (e.key === "Escape" && isModalOpen) {
//         closeModal();
//       }
//     };

//     if (isModalOpen) {
//       document.addEventListener("keydown", handleEscapeKey);
//       document.body.style.overflow = "hidden"; // Prevent background scroll
//     }

//     return () => {
//       document.removeEventListener("keydown", handleEscapeKey);
//       document.body.style.overflow = "unset";
//     };
//   }, [isModalOpen, closeModal]);

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchMasterclasses();
//   }, [fetchMasterclasses]);

//   // Improved scroll logic with useCallback for better performance
//   const scrollToSlide = useCallback(
//     (direction) => {
//       const mobileContainer = scrollContainerRef.current;
//       const desktopContainer = desktopScrollContainerRef.current;
//       const container =
//         window.innerWidth >= 768 ? desktopContainer : mobileContainer;

//       if (!container || classes.length === 0) return;

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
//         if (!container || classes.length === 0) return;

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
//     if (classes.length === 0) return;

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
//   }, [handleScroll, classes.length]);

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

//       if (!container || slideIndex === currentSlide || classes.length === 0)
//         return;

//       const cardWidth = container.children[0]?.offsetWidth + 24;
//       if (!cardWidth) return;

//       container.scrollTo({
//         left: slideIndex * cardWidth,
//         behavior: "smooth",
//       });
//       setCurrentSlide(slideIndex);
//     },
//     [currentSlide, classes.length]
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
//           ? "flex-shrink-0 w-[160px] snap-center cursor-pointer"
//           : "flex-shrink-0 w-76 snap-center mx-10 cursor-pointer"
//       } hover:transform hover:scale-105 transition-transform duration-200`}
//       onClick={() => handleClassClick(item.id)}
//     >
//       <div
//         className={`relative ${
//           isMobile ? "h-[200px]" : "h-[370px]"
//         } w-full mb-4 rounded-lg overflow-hidden`}
//       >
//         <img
//           src={item.image}
//           alt={item.title}
//           className="w-full h-full object-cover rounded-xl"
//           loading={item.id === 1 ? "eager" : "lazy"} // Priority loading for first image
//           onError={(e) => {
//             // Fallback image if the image fails to load
//             e.target.src = "/images/placeholder.jpg";
//           }}
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

//   // Fixed Modal component with proper button handler
//   const Modal = () => {
//     if (!isModalOpen) return null;

//     const handleBookingClick = () => {
//       console.log("Book button clicked for masterclass:", selectedClass?.id);
//       if (selectedClass?.id) {
//         navigateToBooking(selectedClass.id);
//         closeModal();
//       } else {
//         console.error("No selected class ID available");
//       }
//     };

//     // Get current masterclass position for navigation
//     const currentIndex = selectedClass
//       ? classes.findIndex((cls) => cls.id === selectedClass.id)
//       : -1;
//     const isFirstClass = currentIndex === 0;
//     const isLastClass = currentIndex === classes.length - 1;

//     return (
//       <div
//         className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4"
//         onClick={handleModalBackdropClick}
//       >
//         <div className="relative sm:max-w-2xl md:max-w-4xl w-full">
//           {/* Price tag */}
//           <div className="absolute -top-36 right-1/4 text-[#FFB283] text-2xl font-medium z-20">
//             {selectedClass?.price}
//           </div>

//           {/* Navigation arrows - Updated to navigate between masterclasses */}
//           <button
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             onClick={() => navigateModal("prev")}
//             disabled={modalLoading}
//             aria-label="Previous masterclass"
//           >
//             <svg
//               className="w-6 h-6 text-gray-600"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//           </button>

//           <button
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             onClick={() => navigateModal("next")}
//             disabled={modalLoading}
//             aria-label="Next masterclass"
//           >
//             <svg
//               className="w-6 h-6 text-gray-600"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5l7 7-7 7"
//               />
//             </svg>
//           </button>

//           <div className="relative bg-[#F4F1F1] rounded-3xl overflow-hidden mx-16 z-20">
//             {/* Rest of your modal content remains the same */}
//             {modalLoading && (
//               <div className="flex justify-center items-center py-20">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-300"></div>
//               </div>
//             )}

//             {modalError && (
//               <div className="text-center py-8 px-6">
//                 <p className="text-red-500 mb-4">
//                   Ошибка при загрузке деталей: {modalError}
//                 </p>
//                 <button
//                   onClick={() => fetchMasterclassDetails(selectedClass?.id)}
//                   className="px-4 py-2 bg-orange-300 text-gray-800 rounded-lg hover:bg-orange-400 transition-colors"
//                 >
//                   Попробовать снова
//                 </button>
//               </div>
//             )}

//             {selectedClass && !modalLoading && !modalError && (
//               <>
//                 {/* Close button */}
//                 <button
//                   className="absolute top-0 text-sm font-light right-6 mt-8 bg-gray-200 rounded-md p-2 flex items-center justify-center hover:bg-gray-300 transition-colors z-20"
//                   onClick={closeModal}
//                   aria-label="Close modal"
//                 >
//                   назад
//                 </button>

//                 <div className="p-4 py-10 md:p-8 relative">
//                   {/* Title */}
//                   <h2 className="text-2xl font-bold text-[#3A6281] mb-4 leading-tight">
//                     {selectedClass.title
//                       .split(" ")
//                       .map((word, index, array) => (
//                         <span key={index}>
//                           {word}
//                           {index < array.length - 1 &&
//                           index === Math.floor(array.length / 2) - 1 ? (
//                             <br />
//                           ) : (
//                             " "
//                           )}
//                         </span>
//                       ))}
//                   </h2>

//                   {/* Description */}
//                   <p className="text-gray-700 text-sm leading-relaxed mb-4">
//                     {selectedClass.description}
//                   </p>

//                   {/* Additional info */}
//                   <div className="mb-6">
//                     {(selectedClass.participantMinAge ||
//                       selectedClass.participantMaxAge) && (
//                       <p className="text-pink-400 text-sm mb-1">
//                         Возраст участников:{" "}
//                         {formatAgeRange(
//                           selectedClass.participantMinAge,
//                           selectedClass.participantMaxAge
//                         )}
//                       </p>
//                     )}
//                   </div>

//                   {/* Stats */}
//                   {(selectedClass.participantLimit || selectedClass.slots) && (
//                     <div className="mb-4 text-xs text-gray-500 space-y-1">
//                       {selectedClass.participantLimit && (
//                         <p>
//                           Лимит участников: {selectedClass.participantLimit}
//                         </p>
//                       )}
//                     </div>
//                   )}

//                   {/* CTA Button */}
//                   <div className="flex justify-end">
//                     <button
//                       className="w-1/3 min-w-[160px] md:min-w-[200px] bg-[#E7717D] hover:bg-[#d26b75] text-white font-medium py-3 rounded-2xl text-base transition-colors"
//                       onClick={handleBookingClick}
//                     >
//                       Узнать расписание
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Loading component
//   const LoadingSpinner = () => (
//     <div className="flex justify-center items-center py-20">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-300"></div>
//     </div>
//   );

//   // Error component
//   const ErrorMessage = ({ message, onRetry }) => (
//     <div className="flex flex-col items-center justify-center py-20">
//       <div className="text-red-500 mb-4">
//         <svg
//           className="h-16 w-16"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//           />
//         </svg>
//       </div>
//       <p className="text-gray-600 mb-4 text-center">
//         Ошибка при загрузке мастер-классов: {message}
//       </p>
//       <button
//         onClick={onRetry}
//         className="px-4 py-2 bg-amber-300 text-gray-800 rounded-lg hover:bg-amber-400 transition-colors"
//       >
//         Попробовать снова
//       </button>
//     </div>
//   );

//   // Empty state component
//   const EmptyState = () => (
//     <div className="flex flex-col items-center justify-center py-20">
//       <div className="text-gray-400 mb-4">
//         <svg
//           className="h-16 w-16"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
//           />
//         </svg>
//       </div>
//       <p className="text-gray-600 text-center">
//         Пока нет доступных мастер-классов
//       </p>
//     </div>
//   );

//   return (
//     <>
//       <section className="w-full py-12 px-6 md:px-12 lg:px-16 bg-white">
//         <div className="container mx-auto">
//           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-600 mb-8 md:mb-12">
//             Мастер-классы
//           </h2>

//           {loading && <LoadingSpinner />}

//           {error && (
//             <ErrorMessage message={error} onRetry={fetchMasterclasses} />
//           )}

//           {!loading && !error && classes.length === 0 && <EmptyState />}

//           {!loading && !error && classes.length > 0 && (
//             <div
//               className="relative"
//               role="region"
//               aria-label="Master classes carousel"
//             >
//               {/* Left Arrow */}
//               <ArrowButton
//                 direction="left"
//                 disabled={currentSlide === 0}
//                 onClick={() => scrollToSlide("prev")}
//               />

//               {/* Classes Container */}
//               <div className="block md:hidden">
//                 {/* Mobile Horizontal Scroll */}
//                 <div
//                   ref={scrollContainerRef}
//                   className="flex gap-14 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
//                   style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//                   role="tablist"
//                   aria-label="Master classes"
//                 >
//                   {classes.map((item, index) => (
//                     <div
//                       key={item.id}
//                       role="tabpanel"
//                       aria-label={`Slide ${index + 1}`}
//                     >
//                       <ClassCard item={item} isMobile={true} />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Desktop Horizontal Scroll */}
//               <div className="hidden md:block">
//                 <div
//                   ref={desktopScrollContainerRef}
//                   className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
//                   style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//                   role="tablist"
//                   aria-label="Master classes"
//                 >
//                   {classes.map((item, index) => (
//                     <div
//                       key={item.id}
//                       role="tabpanel"
//                       aria-label={`Slide ${index + 1}`}
//                     >
//                       <ClassCard item={item} isMobile={false} />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Right Arrow */}
//               <ArrowButton
//                 direction="right"
//                 disabled={currentSlide === classes.length - 1}
//                 onClick={() => scrollToSlide("next")}
//               />
//             </div>
//           )}

//           {/* Pagination Dots - only show if there are classes */}
//           {!loading && !error && classes.length > 0 && (
//             <div
//               className="flex justify-center mt-6 md:mt-8 space-x-2"
//               role="tablist"
//             >
//               {classes.map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => goToSlide(i)}
//                   className={`w-2 h-2 rounded-full transition-colors duration-200 ${
//                     i === currentSlide ? "bg-amber-300" : "bg-gray-200"
//                   }`}
//                   role="tab"
//                   aria-selected={i === currentSlide}
//                   aria-label={`Go to slide ${i + 1}`}
//                 />
//               ))}
//             </div>
//           )}

//           {/* View All Button - only show if there are classes */}
//           {!loading && !error && classes.length > 0 && (
//             <div className="flex justify-center mt-6 md:mt-8">
//               <button
//                 className="flex flex-col items-center text-slate-700 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 rounded-lg p-2"
//                 aria-label="View all master classes"
//               >
//                 <span className="text-base md:text-lg mb-2 text-center px-4">
//                   Перейти ко всем мастер-классам
//                 </span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6 text-amber-300"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Modal */}
//       <Modal />
//     </>
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
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    current_page: 1,
    total_pages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [viewMode, setViewMode] = useState("carousel");

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "carousel" ? "grid" : "carousel"));
  };

  // Fetch masterclasses from backend
  const fetchMasterclasses = useCallback(async (page = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/?page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update pagination info
      setPagination(data.meta);
      setCurrentPage(data.meta.current_page);
      setHasMore(data.meta.next !== null);

      // Transform the data to match the expected format
      const transformedData = data.results.map((item) => ({
        id: item.id,
        title: item.title,
        price: `${parseFloat(item.price).toLocaleString("ru-RU")} ₽`,
        image: item.image,
        description: item.description,
        participantLimit: item.participant_limit,
        participantMinAge: item.participant_min_age,
        participantMaxAge: item.participant_max_age,
        slots: item.slots,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      // Either append to existing classes or replace them
      if (append) {
        setClasses((prevClasses) => [...prevClasses, ...transformedData]);
      } else {
        setClasses(transformedData);
      }
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/${id}/`
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
        participantMinAge: data.participant_min_age,
        participantMaxAge: data.participant_max_age,
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

  const formatAgeRange = (minAge, maxAge) => {
    if (!minAge && !maxAge) return null;
    if (minAge && maxAge) {
      if (minAge === maxAge) return `${minAge} лет`;
      return `${minAge}-${maxAge} лет`;
    }
    if (minAge) return `от ${minAge} лет`;
    if (maxAge) return `до ${maxAge} лет`;
    return null;
  };

  // Add this function to format dates:
  const formatSlotDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadMoreClasses = useCallback(() => {
    if (hasMore && !loading) {
      fetchMasterclasses(currentPage + 1, true);
    }
  }, [hasMore, loading, currentPage, fetchMasterclasses]);

  const navigateModal = useCallback(
    (direction) => {
      if (!selectedClass || classes.length === 0) return;

      const currentIndex = classes.findIndex(
        (cls) => cls.id === selectedClass.id
      );
      if (currentIndex === -1) return;

      let newIndex;
      if (direction === "next") {
        newIndex = currentIndex === classes.length - 1 ? 0 : currentIndex + 1; // Loop to first
      } else {
        newIndex = currentIndex === 0 ? classes.length - 1 : currentIndex - 1; // Loop to last
      }

      const newClass = classes[newIndex];
      fetchMasterclassDetails(newClass.id);
    },
    [selectedClass, classes, fetchMasterclassDetails]
  );

  {
    /* Additional info */
  }
  <div className="mb-6">
    {selectedClass &&
      (selectedClass.participantMinAge || selectedClass.participantMaxAge) && (
        <p className="text-pink-400 text-sm mb-1">
          Возраст участников:{" "}
          {formatAgeRange(
            selectedClass.participantMinAge,
            selectedClass.participantMaxAge
          )}
        </p>
      )}

    {/* Display available slots */}
    {/* {selectedClass && selectedClass.slots && selectedClass.slots.length > 0 && (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Доступные слоты:
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {selectedClass.slots.map((slot) => (
            <div
              key={slot.id}
              className="text-xs text-gray-600 p-2 bg-gray-50 rounded"
            >
              <p>
                <strong>Начало:</strong> {formatSlotDate(slot.start)}
              </p>
              <p>
                <strong>Окончание:</strong> {formatSlotDate(slot.end)}
              </p>
              <p className="text-green-600">
                <strong>Свободных мест:</strong> {slot.free_places}
              </p>
            </div>
          ))}
        </div>
      </div>
    )} */}
  </div>;

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
    fetchMasterclasses(1, false); // Start from page 1, don't append
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

  // Fixed Modal component with proper button handler
  const Modal = () => {
    if (!isModalOpen) return null;

    const handleBookingClick = () => {
      console.log("Book button clicked for masterclass:", selectedClass?.id);
      if (selectedClass?.id) {
        navigateToBooking(selectedClass.id);
        closeModal();
      } else {
        console.error("No selected class ID available");
      }
    };

    // Get current masterclass position for navigation
    const currentIndex = selectedClass
      ? classes.findIndex((cls) => cls.id === selectedClass.id)
      : -1;
    const isFirstClass = currentIndex === 0;
    const isLastClass = currentIndex === classes.length - 1;

    return (
      <div
        className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
        onClick={handleModalBackdropClick}
      >
        <div className="relative w-full max-w-sm sm:max-w-2xl md:max-w-4xl">
          {/* Price tag */}
          <div className="absolute -top-8 sm:-top-36 right-4 sm:right-1/4 text-[#FFB283] text-lg sm:text-2xl font-medium z-20">
            {selectedClass?.price}
          </div>

          {/* Navigation arrows - Hidden on mobile, visible on larger screens */}
          <button
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => navigateModal("prev")}
            disabled={modalLoading}
            aria-label="Previous masterclass"
          >
            <svg
              className="w-6 h-6 text-[#EACCB9]"
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
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => navigateModal("next")}
            disabled={modalLoading}
            aria-label="Next masterclass"
          >
            <svg
              className="w-6 h-6 text-[#EACCB9]"
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

          <div className="relative bg-[#F4F1F1] rounded-2xl sm:rounded-3xl overflow-hidden mx-2 sm:mx-16 z-20 max-h-[90vh] overflow-y-auto">
            {/* Rest of your modal content remains the same */}
            {modalLoading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-300"></div>
              </div>
            )}

            {modalError && (
              <div className="text-center py-8 px-6">
                <p className="text-red-500 mb-4 text-sm sm:text-base">
                  Ошибка при загрузке деталей: {modalError}
                </p>
                <button
                  onClick={() => fetchMasterclassDetails(selectedClass?.id)}
                  className="px-4 py-2 bg-orange-300 text-gray-800 rounded-lg hover:bg-orange-400 transition-colors text-sm sm:text-base"
                >
                  Попробовать снова
                </button>
              </div>
            )}

            {selectedClass && !modalLoading && !modalError && (
              <>
                {/* Close button */}
                <button
                  className="absolute top-4 sm:top-0 text-xs sm:text-sm font-light right-4 sm:right-6 sm:mt-8 bg-gray-200 rounded-md p-2 flex items-center justify-center hover:bg-gray-300 transition-colors z-20"
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  назад
                </button>

                {/* Mobile navigation arrows - Visible only on mobile */}
                <div className="flex sm:hidden justify-between items-center px-4 pt-16 pb-2">
                  <button
                    className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => navigateModal("prev")}
                    disabled={modalLoading}
                    aria-label="Previous masterclass"
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => navigateModal("next")}
                    disabled={modalLoading}
                    aria-label="Next masterclass"
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-4 pt-2 sm:pt-10 sm:p-8 pb-6 sm:py-10 md:p-8 relative">
                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-bold text-[#3A6281] mb-3 sm:mb-4 leading-tight">
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
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre">
                    {selectedClass.description}
                  </p>

                  {/* Additional info */}
                  <div className="mb-4 sm:mb-6">
                    {selectedClass &&
                      (selectedClass.participantMinAge ||
                        selectedClass.participantMaxAge) && (
                        <p className="text-pink-400 text-sm mb-1">
                          Возраст участников:{" "}
                          {formatAgeRange(
                            selectedClass.participantMinAge,
                            selectedClass.participantMaxAge
                          )}
                        </p>
                      )}

                    {/* Display available slots */}
                    {/* {selectedClass &&
                      selectedClass.slots &&
                      selectedClass.slots.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Доступные слоты:
                          </h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {selectedClass.slots.map((slot) => (
                              <div
                                key={slot.id}
                                className="text-xs text-gray-600 p-2 bg-gray-50 rounded"
                              >
                                <p>
                                  <strong>Начало:</strong>{" "}
                                  {formatSlotDate(slot.start)}
                                </p>
                                <p>
                                  <strong>Окончание:</strong>{" "}
                                  {formatSlotDate(slot.end)}
                                </p>
                                <p className="text-green-600">
                                  <strong>Свободных мест:</strong>{" "}
                                  {slot.free_places}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )} */}
                  </div>

                  {/* Stats */}
                  {selectedClass &&
                    (selectedClass.participantLimit || selectedClass.slots) && (
                      <div className="mb-4 text-xs text-gray-500 space-y-1">
                        {selectedClass.participantLimit && (
                          <p>
                            Лимит участников: {selectedClass.participantLimit}
                          </p>
                        )}
                      </div>
                    )}

                  {/* CTA Button */}
                  <div className="flex justify-end">
                    {selectedClass &&
                    selectedClass.slots &&
                    selectedClass.slots.length > 0 ? (
                      // Show "Узнать расписание" button if slots exist
                      <button
                        className="w-full sm:w-1/3 min-w-[160px] md:min-w-[200px] bg-[#E7717D] hover:bg-[#d26b75] text-white font-medium py-3 rounded-2xl text-sm sm:text-base transition-colors"
                        onClick={handleBookingClick}
                      >
                        Узнать расписание
                      </button>
                    ) : (
                      // Show WhatsApp button if no slots available
                      <a
                        href={`https://wa.me/79003267660?text=${encodeURIComponent(
                          `Здравствуйте! Хочу записаться на мастер-класс "${selectedClass?.title}"`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-1/3 min-w-[160px] md:min-w-[200px] bg-[#25D366] hover:bg-[#1eb855] text-white font-medium py-3 rounded-2xl text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                        </svg>
                        Связаться в WhatsApp
                      </a>
                    )}
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
            <>
              {viewMode === "carousel" ? (
                // Carousel View (existing code)
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
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
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
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
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
              ) : (
                // Grid View (new)
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {classes.map((item) => (
                    <div
                      key={item.id}
                      className="cursor-pointer hover:transform hover:scale-105 transition-transform duration-200"
                      onClick={() => handleClassClick(item.id)}
                    >
                      <div className="relative h-[250px] sm:h-[300px] w-full mb-4 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-xl"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "/images/placeholder.jpg";
                          }}
                        />

                        {/* Info Icon */}
                        <div className="absolute top-3 right-3 rounded-xl p-1 w-10 h-10 flex items-center justify-center bg-[#C2B9B0]/40 rotate-45">
                          <span className="text-sm px-2 border-2 -rotate-45 font-bold border-[#3A6281] text-[#3A6281] rounded-full">
                            i
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-start pb-2">
                        <h3 className="text-lg sm:text-xl text-[#7E685A] font-light leading-tight mr-2">
                          {item.title}
                        </h3>
                        <p className="text-lg sm:text-xl text-[#0E820E] font-medium text-nowrap">
                          {item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pagination Dots - only show if there are classes */}
          {!loading && !error && classes.length > 0 && (
            <div className="flex flex-col items-center mt-6 md:mt-8 space-y-4">
              {/* Pagination Dots - only show in carousel mode */}
              {viewMode === "carousel" && (
                <div className="flex justify-center space-x-2" role="tablist">
                  {classes.slice(0, -2).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        i === currentSlide ? "bg-[#7E685A]" : "bg-gray-200"
                      }`}
                      role="tab"
                      aria-selected={i === currentSlide}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
              {/* View Mode Toggle Button */}
              <button
                onClick={toggleViewMode}
                className="flex items-center justify-center space-x-3 text-[#7E685A] font-light py-4 px-8 rounded-2xl transition-all duration-200 focus:outline-none"
              >
                {viewMode === "carousel" ? (
                  <>
                    <span className="text-lg font-bold">
                      Перейти ко всем мастер-классам
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 transform rotate-90"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <span className="text-lg font-bold">Показать карусель</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 transform -rotate-90"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Load More Button - only show if there are more classes to load */}
          {!loading && !error && classes.length > 0 && hasMore && (
            <div className="flex justify-center mt-6 md:mt-8">
              <button
                onClick={loadMoreClasses}
                disabled={loading}
                className="flex flex-col items-center text-slate-700 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 rounded-lg p-2 disabled:opacity-50"
                aria-label="Load more master classes"
              >
                <span className="text-base md:text-lg mb-2 text-center px-4">
                  {loading ? "Загрузка..." : "Загрузить ещё"}
                </span>
                {!loading && (
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
                )}
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
