// "use client";
// import React, { useState, useEffect } from "react";
// import { useNavigation } from "../context/NavigationContext";

// const BookingPage = ({ masterclassId }) => {
//   const [masterclass, setMasterclass] = useState(null);
//   const [masterclasses, setMasterclasses] = useState([]);
//   // const [selectedMasterclassId, setSelectedMasterclassId] =
//   //   useState(masterclassId);
//   const { selectedMasterclassId, setSelectedMasterclassId } = useNavigation();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [participants, setParticipants] = useState(1);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [enrolling, setEnrolling] = useState(false);
//   const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
//   const [enrollmentError, setEnrollmentError] = useState(null);

//   // Helper function to get CSRF token from cookies
//   const getCsrfTokenFromCookie = () => {
//     if (typeof document === "undefined") return null;

//     const name = "csrftoken";
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== "") {
//       const cookies = document.cookie.split(";");
//       for (let i = 0; i < cookies.length; i++) {
//         const cookie = cookies[i].trim();
//         if (cookie.substring(0, name.length + 1) === name + "=") {
//           cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//           break;
//         }
//       }
//     }
//     return cookieValue;
//   };

//   // Authenticated request helper
//   const makeAuthenticatedRequest = async (url, options = {}) => {
//     const accessToken = localStorage.getItem("access_token");
//     const csrfToken = getCsrfTokenFromCookie();

//     const headers = {
//       Accept: "application/json",
//       ...options.headers,
//     };

//     if (!options.body || !(options.body instanceof FormData)) {
//       headers["Content-Type"] = "application/json";
//     }

//     if (accessToken) {
//       headers["Authorization"] = `Bearer ${accessToken}`;
//     }

//     if (csrfToken) {
//       headers["X-CSRFTOKEN"] = csrfToken;
//     }

//     const response = await fetch(url, {
//       ...options,
//       headers,
//       credentials: "include",
//     });

//     if (response.status === 401) {
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
//     }

//     return response;
//   };

//   // Fetch masterclasses list
//   const fetchMasterclasses = async () => {
//     try {
//       setLoading(true);
//       const response = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/`,
//         { method: "GET" }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setMasterclasses(data.results || data || []);
//       } else {
//         throw new Error(`Failed to fetch masterclasses: ${response.status}`);
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching masterclasses:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch specific masterclass data
//   const fetchMasterclass = async (id) => {
//     try {
//       setLoading(true);
//       const response = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/${id}/`,
//         { method: "GET" }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setMasterclass(data);
//         setAvailableSlots(data.slots || []);
//         setParticipants(1);
//       } else {
//         throw new Error(`Failed to fetch masterclass: ${response.status}`);
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching masterclass:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Use selectedMasterclassId if it's set, otherwise use the prop masterclassId
//     const idToUse = selectedMasterclassId || masterclassId;

//     if (idToUse) {
//       fetchMasterclass(idToUse);
//     } else {
//       fetchMasterclasses();
//     }
//   }, [selectedMasterclassId, masterclassId]);

//   // Also add this useEffect to handle prop changes:
//   useEffect(() => {
//     if (masterclassId && masterclassId !== selectedMasterclassId) {
//       setSelectedMasterclassId(masterclassId);
//     }
//   }, [masterclassId]);

//   // Handle masterclass selection
//   const handleMasterclassSelect = (id) => {
//     setSelectedMasterclassId(id);
//     setSelectedDate(null);
//     setSelectedTime(null);
//     setEnrollmentSuccess(false);
//     setEnrollmentError(null);
//   };

//   // Go back to masterclasses list
//   const handleBackToList = () => {
//     setSelectedMasterclassId(null);
//     setMasterclass(null);
//     setAvailableSlots([]);
//     setSelectedDate(null);
//     setSelectedTime(null);
//     setEnrollmentSuccess(false);
//     setEnrollmentError(null);
//     fetchMasterclasses();
//   };

//   const handleEnrollment = async () => {
//     if (!selectedTime || !participants) return;

//     try {
//       setEnrolling(true);
//       setEnrollmentError(null);

//       const response = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/enroll/`,
//         {
//           method: "POST",
//           body: JSON.stringify({
//             slot: selectedTime.id,
//             quantity: participants,
//           }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setEnrollmentSuccess(true);
//         console.log("Enrollment successful:", data);
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         console.error("Enrollment failed:", response.status, errorData);
//         throw new Error(
//           errorData.detail ||
//             errorData.message ||
//             `Ошибка записи: ${response.status}`
//         );
//       }
//     } catch (err) {
//       setEnrollmentError(err.message);
//       console.error("Error enrolling:", err);
//     } finally {
//       setEnrolling(false);
//     }
//   };

//   // Generate calendar for current month
//   const generateCalendar = (month, year) => {
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const startDate = new Date(firstDay);
//     startDate.setDate(startDate.getDate() - firstDay.getDay());

//     const calendar = [];
//     const currentDate = new Date(startDate);

//     for (let week = 0; week < 6; week++) {
//       const weekDays = [];
//       for (let day = 0; day < 7; day++) {
//         const date = new Date(currentDate);
//         weekDays.push({
//           date: date.getDate(),
//           month: date.getMonth(),
//           year: date.getFullYear(),
//           fullDate: new Date(date),
//           isCurrentMonth: date.getMonth() === month,
//         });
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
//       calendar.push(weekDays);
//     }
//     return calendar;
//   };

//   // Get slots for a specific date
//   const getSlotsForDate = (date) => {
//     if (!availableSlots) return [];

//     return availableSlots.filter((slot) => {
//       const slotDate = new Date(slot.start);
//       return (
//         slotDate.getDate() === date.getDate() &&
//         slotDate.getMonth() === date.getMonth() &&
//         slotDate.getFullYear() === date.getFullYear() &&
//         slot.free_places > 0
//       );
//     });
//   };

//   // Get date status
//   const getDateStatus = (dayInfo) => {
//     if (!dayInfo.isCurrentMonth) return "other-month";

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (dayInfo.fullDate < today) return "past";

//     const slotsForDate = getSlotsForDate(dayInfo.fullDate);
//     if (slotsForDate.length > 0) {
//       const hasLimitedAvailability = slotsForDate.some(
//         (slot) => slot.free_places <= masterclass?.participant_limit * 0.3
//       );
//       return hasLimitedAvailability ? "highlighted" : "available";
//     }

//     return "unavailable";
//   };

//   // Get date styling
//   const getDateClass = (dayInfo, status) => {
//     const baseClass =
//       "p-2 text-sm font-medium cursor-pointer rounded-full w-8 h-8 flex items-center justify-center";

//     if (!dayInfo.isCurrentMonth) {
//       return `${baseClass} text-gray-300`;
//     }

//     if (
//       selectedDate &&
//       selectedDate.getDate() === dayInfo.date &&
//       selectedDate.getMonth() === dayInfo.month &&
//       selectedDate.getFullYear() === dayInfo.year
//     ) {
//       return `${baseClass} bg-blue-500 text-white`;
//     }

//     switch (status) {
//       case "available":
//         return `${baseClass} text-green-500 hover:bg-green-50`;
//       case "highlighted":
//         return `${baseClass} text-green-400 hover:bg-green-50 font-bold`;
//       case "past":
//       case "unavailable":
//         return `${baseClass} text-gray-400 cursor-not-allowed`;
//       default:
//         return `${baseClass} text-gray-400`;
//     }
//   };

//   // Format time from ISO string
//   const formatTime = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleTimeString("ru-RU", {
//       hour: "2-digit",
//       minute: "2-digit",
//       timeZone: "UTC",
//     });
//   };

//   // Get available time slots for selected date
//   const getAvailableTimeSlotsForDate = () => {
//     if (!selectedDate) return [];
//     return getSlotsForDate(selectedDate);
//   };

//   // Month navigation
//   const navigateMonth = (direction) => {
//     if (direction === "prev") {
//       if (currentMonth === 0) {
//         setCurrentMonth(11);
//         setCurrentYear(currentYear - 1);
//       } else {
//         setCurrentMonth(currentMonth - 1);
//       }
//     } else {
//       if (currentMonth === 11) {
//         setCurrentMonth(0);
//         setCurrentYear(currentYear + 1);
//       } else {
//         setCurrentMonth(currentMonth + 1);
//       }
//     }
//     setSelectedDate(null);
//     setSelectedTime(null);
//   };

//   // Handle date click
//   const handleDateClick = (dayInfo, status) => {
//     if (status === "available" || status === "highlighted") {
//       setSelectedDate(dayInfo.fullDate);
//       setSelectedTime(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg text-gray-600">Загрузка...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg text-red-600">Ошибка: {error}</div>
//       </div>
//     );
//   }

//   // Show masterclasses list if no specific masterclass is selected
//   if (!selectedMasterclassId) {
//     return (
//       <div className="max-w-6xl">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">
//           Выберите мастер-класс
//         </h1>

//         {masterclasses.length === 0 ? (
//           <div className="text-center text-gray-600 py-12">
//             <p className="text-lg">Нет доступных мастер-классов</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {masterclasses.map((mc) => (
//               <div
//                 key={mc.id}
//                 className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
//                 onClick={() => handleMasterclassSelect(mc.id)}
//               >
//                 {mc.image && (
//                   <img
//                     src={mc.image}
//                     alt={mc.title}
//                     className="w-full h-48 object-cover rounded-t-lg"
//                   />
//                 )}
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                     {mc.title}
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-3">
//                     {mc.description}
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <div className="text-lg font-bold text-green-600">
//                       {parseFloat(mc.price).toLocaleString("ru-RU")} ₽
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       До {mc.participant_limit} участников
//                     </div>
//                   </div>
//                   {mc.slots && mc.slots.length > 0 && (
//                     <div className="mt-3 text-sm text-blue-600">
//                       Доступно{" "}
//                       {mc.slots.filter((slot) => slot.free_places > 0).length}{" "}
//                       слотов
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }

//   if (!masterclass) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg text-gray-600">Мастер-класс не найден</div>
//       </div>
//     );
//   }

//   const calendar = generateCalendar(currentMonth, currentYear);
//   const monthNames = [
//     "Январь",
//     "Февраль",
//     "Март",
//     "Апрель",
//     "Май",
//     "Июнь",
//     "Июль",
//     "Август",
//     "Сентябрь",
//     "Октябрь",
//     "Ноябрь",
//     "Декабрь",
//   ];
//   const availableTimeSlots = getAvailableTimeSlotsForDate();

//   return (
//     <div className="max-w-6xl">
//       {/* Back button */}
//       <button
//         onClick={handleBackToList}
//         className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium"
//       >
//         <svg
//           className="w-5 h-5 mr-2"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 19l-7-7 7-7"
//           />
//         </svg>
//         Назад к списку мастер-классов
//       </button>

//       <div className="flex gap-8">
//         {/* Left Side - Calendar and Time */}
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold text-gray-900 mb-8">
//             Выбрать дату
//           </h1>

//           {/* Calendar */}
//           <div className="mb-8">
//             <div className="border-2 border-blue-300 rounded-2xl p-6 bg-white">
//               {/* Month Navigation */}
//               <div className="flex items-center justify-between mb-6">
//                 <button
//                   onClick={() => navigateMonth("prev")}
//                   className="p-2 hover:bg-gray-100 rounded"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 19l-7-7 7-7"
//                     />
//                   </svg>
//                 </button>
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   {monthNames[currentMonth]} {currentYear}
//                 </h2>
//                 <button
//                   onClick={() => navigateMonth("next")}
//                   className="p-2 hover:bg-gray-100 rounded"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </button>
//               </div>

//               {/* Day Headers */}
//               <div className="grid grid-cols-7 gap-2 text-center mb-2">
//                 {["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map((day) => (
//                   <div
//                     key={day}
//                     className="text-sm font-medium text-gray-500 p-2"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>

//               {/* Calendar Grid */}
//               <div className="grid grid-cols-7 gap-2 text-center">
//                 {calendar.map((week, weekIndex) =>
//                   week.map((dayInfo, dayIndex) => {
//                     const status = getDateStatus(dayInfo);
//                     return (
//                       <div
//                         key={`${weekIndex}-${dayIndex}`}
//                         className={getDateClass(dayInfo, status)}
//                         onClick={() => handleDateClick(dayInfo, status)}
//                       >
//                         {dayInfo.date}
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Available Time Slots */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Доступное время:
//             </h3>
//             {selectedDate ? (
//               availableTimeSlots.length > 0 ? (
//                 <div className="flex flex-wrap gap-3">
//                   {availableTimeSlots.map((slot) => (
//                     <button
//                       key={slot.id}
//                       onClick={() => setSelectedTime(slot)}
//                       className={`px-4 py-2 rounded-lg font-medium ${
//                         selectedTime?.id === slot.id
//                           ? "bg-green-500 text-white"
//                           : "bg-gray-600 text-white hover:bg-gray-700"
//                       }`}
//                     >
//                       {formatTime(slot.start)}
//                       <span className="text-xs block">
//                         {slot.free_places} мест
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500">
//                   На выбранную дату нет доступного времени
//                 </p>
//               )
//             ) : (
//               <p className="text-gray-500">
//                 Выберите дату для просмотра доступного времени
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Right Side - Additional Info */}
//         <div className="w-80">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">
//             Дополнительные данные
//           </h2>

//           {/* Participants Counter */}
//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="font-medium text-gray-900">
//                 Количество участников
//               </span>
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={() => setParticipants(Math.max(1, participants - 1))}
//                   className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-400"
//                 >
//                   -
//                 </button>
//                 <span className="text-xl font-bold text-orange-500">
//                   {participants}/{masterclass.participant_limit}
//                 </span>
//                 <button
//                   onClick={() =>
//                     setParticipants(
//                       Math.min(
//                         selectedTime
//                           ? selectedTime.free_places
//                           : masterclass.participant_limit,
//                         participants + 1
//                       )
//                     )
//                   }
//                   className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//             {selectedTime && (
//               <p className="text-xs text-gray-600">
//                 Доступно мест в выбранное время: {selectedTime.free_places}
//               </p>
//             )}
//           </div>

//           {/* Master Class Description */}
//           <div className="mb-6">
//             <h3 className="font-semibold text-gray-900 mb-3">
//               {masterclass.title}
//             </h3>
//             <p className="text-gray-700 text-sm leading-relaxed mb-3">
//               {masterclass.description}
//             </p>
//             <div className="text-lg font-bold text-green-600">
//               {parseFloat(masterclass.price).toLocaleString("ru-RU")} ₽
//             </div>
//           </div>

//           {/* Privacy Notice */}
//           <div className="mb-6">
//             <p className="text-xs text-gray-600 mb-2">
//               Нажимая кнопку "Записаться", вы автоматически соглашаетесь с{" "}
//               <a href="#" className="text-blue-500 underline">
//                 обработкой ваших персональных данных
//               </a>
//             </p>
//           </div>

//           {/* Register Button */}
//           {enrollmentSuccess ? (
//             <div className="w-full bg-green-500 text-white py-3 rounded-full font-medium text-lg text-center">
//               ✓ Запись успешно оформлена!
//             </div>
//           ) : (
//             <button
//               onClick={handleEnrollment}
//               disabled={
//                 !selectedDate ||
//                 !selectedTime ||
//                 participants > (selectedTime?.free_places || 0) ||
//                 enrolling
//               }
//               className="w-full bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-full font-medium text-lg shadow-lg transition-colors"
//             >
//               {enrolling ? "Записываем..." : "Записаться"}
//             </button>
//           )}
//           {enrollmentError && (
//             <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//               Ошибка записи: {enrollmentError}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingPage;

// last but not really well works
// "use client";
// import React, { useState, useEffect } from "react";
// import { useNavigation } from "../context/NavigationContext";

// const BookingPage = ({ masterclassId }) => {
//   const [masterclass, setMasterclass] = useState(null);
//   const [masterclasses, setMasterclasses] = useState([]);
//   const { selectedMasterclassId, setSelectedMasterclassId } = useNavigation();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [participants, setParticipants] = useState(1);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [enrolling, setEnrolling] = useState(false);
//   const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
//   const [enrollmentError, setEnrollmentError] = useState(null);
//   const [paymentInProgress, setPaymentInProgress] = useState(false);
//   const [paymentStatusMessage, setPaymentStatusMessage] = useState("");

//   // Helper function to get CSRF token from cookies
//   const getCsrfTokenFromCookie = () => {
//     if (typeof document === "undefined") return null;

//     const name = "csrftoken";
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== "") {
//       const cookies = document.cookie.split(";");
//       for (let i = 0; i < cookies.length; i++) {
//         const cookie = cookies[i].trim();
//         if (cookie.substring(0, name.length + 1) === name + "=") {
//           cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//           break;
//         }
//       }
//     }
//     return cookieValue;
//   };

//   // Authenticated request helper
//   const makeAuthenticatedRequest = async (url, options = {}) => {
//     const accessToken = localStorage.getItem("access_token");
//     const csrfToken = getCsrfTokenFromCookie();

//     const headers = {
//       Accept: "application/json",
//       ...options.headers,
//     };

//     if (!options.body || !(options.body instanceof FormData)) {
//       headers["Content-Type"] = "application/json";
//     }

//     if (accessToken) {
//       headers["Authorization"] = `Bearer ${accessToken}`;
//     }

//     if (csrfToken) {
//       headers["X-CSRFTOKEN"] = csrfToken;
//     }

//     const response = await fetch(url, {
//       ...options,
//       headers,
//       credentials: "include",
//     });

//     if (response.status === 401) {
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
//     }

//     return response;
//   };

//   // Payment status checker (for when user returns from payment)
//   const checkPaymentStatusOnReturn = async () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const enrollmentId = localStorage.getItem("current_enrollment_id");

//     if (enrollmentId && urlParams.has("payment_return")) {
//       console.log("User returned from payment, checking status...");
//       setPaymentInProgress(true);
//       setPaymentStatusMessage("Проверяем статус платежа...");

//       // Start SSE connection immediately when user returns
//       startPaymentStatusTracking(enrollmentId);

//       // Clean up URL parameters
//       const newUrl = window.location.pathname;
//       window.history.replaceState({}, document.title, newUrl);
//     }
//   };

//   // Fetch masterclasses list
//   const fetchMasterclasses = async () => {
//     try {
//       setLoading(true);
//       const response = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/`,
//         { method: "GET" }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setMasterclasses(data.results || data || []);
//       } else {
//         throw new Error(`Failed to fetch masterclasses: ${response.status}`);
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching masterclasses:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch specific masterclass data
//   const fetchMasterclass = async (id) => {
//     try {
//       setLoading(true);
//       const response = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/${id}/`,
//         { method: "GET" }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setMasterclass(data);
//         setAvailableSlots(data.slots || []);
//         setParticipants(1);
//       } else {
//         throw new Error(`Failed to fetch masterclass: ${response.status}`);
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching masterclass:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check payment status on component mount
//   useEffect(() => {
//     checkPaymentStatusOnReturn();
//   }, []);

//   useEffect(() => {
//     // Use selectedMasterclassId if it's set, otherwise use the prop masterclassId
//     const idToUse = selectedMasterclassId || masterclassId;

//     if (idToUse) {
//       fetchMasterclass(idToUse);
//     } else {
//       fetchMasterclasses();
//     }
//   }, [selectedMasterclassId, masterclassId]);

//   // Also add this useEffect to handle prop changes:
//   useEffect(() => {
//     if (masterclassId && masterclassId !== selectedMasterclassId) {
//       setSelectedMasterclassId(masterclassId);
//     }
//   }, [masterclassId]);

//   // Handle masterclass selection
//   const handleMasterclassSelect = (id) => {
//     setSelectedMasterclassId(id);
//     setSelectedDate(null);
//     setSelectedTime(null);
//     setEnrollmentSuccess(false);
//     setEnrollmentError(null);
//   };

//   // Go back to masterclasses list
//   const handleBackToList = () => {
//     setSelectedMasterclassId(null);
//     setMasterclass(null);
//     setAvailableSlots([]);
//     setSelectedDate(null);
//     setSelectedTime(null);
//     setEnrollmentSuccess(false);
//     setEnrollmentError(null);
//     fetchMasterclasses();
//   };

//   const handlePaymentEnrollment = async () => {
//     if (!selectedTime || !participants || !masterclass) return;

//     try {
//       setEnrolling(true);
//       setEnrollmentError(null);
//       setEnrollmentSuccess(false);
//       setPaymentStatusMessage("");

//       // Calculate total amount
//       const totalAmount = parseFloat(masterclass.price) * participants;

//       const paymentData = {
//         masterclass_id: masterclass.id,
//         slot_id: selectedTime.id,
//         quantity: participants,
//         amount: totalAmount.toFixed(2),
//         user_id: 2,
//         return_url: `${window.location.origin}${window.location.pathname}?payment_return=true`,
//       };

//       console.log("Creating payment with data:", paymentData);

//       const response = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/payments/create/`,
//         {
//           method: "POST",
//           body: JSON.stringify(paymentData),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Payment creation successful:", data);

//         // Store enrollment info
//         localStorage.setItem("current_enrollment_id", data.enrollment_id);
//         localStorage.setItem("current_idempotency_key", data.idempotency_key);

//         // Set payment in progress state
//         setPaymentInProgress(true);
//         setPaymentStatusMessage("Перенаправляем на страницу оплаты...");

//         // Start payment status tracking immediately
//         startPaymentStatusTracking(data.enrollment_id);

//         // Open YooKassa payment page in new tab
//         if (data.confirmation_url) {
//           const paymentWindow = window.open(
//             data.confirmation_url,
//             "_blank",
//             "noopener,noreferrer"
//           );

//           // Check if popup was blocked (need to check after a brief delay)
//           setTimeout(() => {
//             if (!paymentWindow || paymentWindow.closed) {
//               // Fallback to same tab if popup is blocked
//               setPaymentStatusMessage(
//                 "Всплывающие окна заблокированы. Перенаправляем в текущей вкладке..."
//               );
//               setTimeout(() => {
//                 window.location.href = data.confirmation_url;
//               }, 2000);
//             } else {
//               setPaymentStatusMessage(
//                 "Окно оплаты открыто. После завершения платежа статус обновится автоматически."
//               );
//             }
//           }, 100);
//         } else {
//           throw new Error("URL для оплаты не получен");
//         }
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         console.error("Payment creation failed:", response.status, errorData);
//         throw new Error(
//           errorData.detail ||
//             errorData.message ||
//             `Ошибка создания платежа: ${response.status}`
//         );
//       }
//     } catch (err) {
//       setEnrollmentError(err.message);
//       console.error("Error creating payment:", err);
//       setPaymentInProgress(false);
//     } finally {
//       setEnrolling(false);
//     }
//   };

//   useEffect(() => {
//     // Cleanup function to close SSE connection when component unmounts
//     return () => {
//       if (window.currentPaymentSSE) {
//         console.log("Cleaning up SSE connection");
//         window.currentPaymentSSE.close();
//         window.currentPaymentSSE = null;
//       }
//     };
//   }, []);

//   const startPaymentStatusTracking = (enrollmentId) => {
//     console.log(
//       "Starting payment status tracking for enrollment:",
//       enrollmentId
//     );

//     const eventSource = new EventSource(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/payments/status/${enrollmentId}/`,
//       { withCredentials: true }
//     );

//     let retryCount = 0;
//     const maxRetries = 3;
//     let timeoutId = null;

//     // Set a maximum timeout for the entire process (2 minutes)
//     const maxTimeout = setTimeout(() => {
//       console.log("Payment tracking timeout reached");
//       setEnrollmentError(
//         "Время ожидания платежа истекло. Проверьте статус в личном кабинете."
//       );
//       setPaymentInProgress(false);
//       setPaymentStatusMessage("");
//       eventSource.close();

//       // Clean up storage
//       localStorage.removeItem("current_enrollment_id");
//       localStorage.removeItem("current_idempotency_key");
//     }, 120000); // 2 minutes

//     eventSource.onopen = function (event) {
//       console.log("SSE connection opened");
//       setPaymentStatusMessage(
//         "Подключились к серверу, ожидаем обновления статуса..."
//       );
//       retryCount = 0;
//     };

//     eventSource.onmessage = function (event) {
//       try {
//         const data = JSON.parse(event.data);
//         console.log("Payment status update received:", data);

//         // Clear the timeout since we got a response
//         if (timeoutId) {
//           clearTimeout(timeoutId);
//           timeoutId = null;
//         }

//         switch (data.status) {
//           case "paid":
//             setEnrollmentSuccess(true);
//             setEnrollmentError(null);
//             setPaymentInProgress(false);
//             setPaymentStatusMessage("Платеж успешно завершен!");

//             // Clean up storage
//             localStorage.removeItem("current_enrollment_id");
//             localStorage.removeItem("current_idempotency_key");

//             // Close connection and clear timeout
//             eventSource.close();
//             clearTimeout(maxTimeout);

//             // Hide success message after 5 seconds
//             setTimeout(() => setPaymentStatusMessage(""), 5000);
//             break;

//           case "cancelled":
//             setEnrollmentError("Платеж был отменен или не завершен");
//             setEnrollmentSuccess(false);
//             setPaymentInProgress(false);
//             setPaymentStatusMessage("");

//             // Clean up storage
//             localStorage.removeItem("current_enrollment_id");
//             localStorage.removeItem("current_idempotency_key");

//             eventSource.close();
//             clearTimeout(maxTimeout);
//             break;

//           case "pending":
//             setPaymentStatusMessage(
//               "Платеж обрабатывается, пожалуйста подождите..."
//             );

//             // Set a timeout for pending status (30 seconds)
//             if (timeoutId) clearTimeout(timeoutId);
//             timeoutId = setTimeout(() => {
//               setEnrollmentError(
//                 "Платеж не был завершен в установленное время"
//               );
//               setPaymentInProgress(false);
//               setPaymentStatusMessage("");
//               eventSource.close();

//               // Clean up storage
//               localStorage.removeItem("current_enrollment_id");
//               localStorage.removeItem("current_idempotency_key");
//             }, 30000);
//             break;

//           case "not_found":
//             setEnrollmentError("Запись о платеже не найдена");
//             setPaymentInProgress(false);
//             setPaymentStatusMessage("");
//             eventSource.close();
//             clearTimeout(maxTimeout);

//             // Clean up storage
//             localStorage.removeItem("current_enrollment_id");
//             localStorage.removeItem("current_idempotency_key");
//             break;

//           default:
//             console.log("Unknown payment status:", data.status);
//             setPaymentStatusMessage(`Неизвестный статус: ${data.status}`);
//         }
//       } catch (error) {
//         console.error("Error parsing SSE data:", error);
//       }
//     };

//     eventSource.onerror = function (event) {
//       console.error("SSE connection error:", event);

//       if (retryCount < maxRetries) {
//         retryCount++;
//         setPaymentStatusMessage(
//           `Переподключаемся к серверу (попытка ${retryCount}/${maxRetries})...`
//         );

//         // Retry after a delay
//         setTimeout(() => {
//           if (eventSource.readyState === EventSource.CLOSED) {
//             startPaymentStatusTracking(enrollmentId);
//           }
//         }, 2000 * retryCount);
//       } else {
//         setPaymentStatusMessage(
//           "Не удалось подключиться к серверу для отслеживания статуса"
//         );
//         setPaymentInProgress(false);
//         eventSource.close();
//         clearTimeout(maxTimeout);

//         // Fallback to manual status check
//         setTimeout(() => {
//           checkPaymentStatusManually(enrollmentId);
//         }, 1000);
//       }
//     };

//     // Store reference for cleanup
//     window.currentPaymentSSE = eventSource;

//     return eventSource;
//   };

//   // 4. Add fallback manual status check
//   const checkPaymentStatusManually = async (enrollmentId) => {
//     try {
//       console.log(
//         "Attempting manual status check for enrollment:",
//         enrollmentId
//       );
//       setPaymentStatusMessage("Проверяем статус платежа...");

//       // First, try to verify payment status with backend
//       const verifyResponse = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/payments/verify/${enrollmentId}/`,
//         { method: "GET" }
//       );

//       if (verifyResponse.ok) {
//         const verifyData = await verifyResponse.json();

//         if (verifyData.status === "paid") {
//           setEnrollmentSuccess(true);
//           setEnrollmentError(null);
//           setPaymentStatusMessage("Платеж успешно завершен!");
//           localStorage.removeItem("current_enrollment_id");
//           localStorage.removeItem("current_idempotency_key");
//           return;
//         } else if (verifyData.status === "cancelled") {
//           setEnrollmentError("Платеж был отменен");
//           localStorage.removeItem("current_enrollment_id");
//           localStorage.removeItem("current_idempotency_key");
//           setPaymentInProgress(false);
//           return;
//         }
//       }

//       // Fallback to user enrollments check
//       const response = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/user-enrollments/`,
//         { method: "GET" }
//       );

//       if (response.ok) {
//         const enrollments = await response.json();
//         const currentEnrollment = enrollments.find(
//           (e) => e.id.toString() === enrollmentId
//         );

//         if (currentEnrollment) {
//           if (currentEnrollment.status === "paid") {
//             setEnrollmentSuccess(true);
//             setEnrollmentError(null);
//             setPaymentStatusMessage("Платеж успешно завершен!");
//             localStorage.removeItem("current_enrollment_id");
//             localStorage.removeItem("current_idempotency_key");
//           } else if (currentEnrollment.status === "cancelled") {
//             setEnrollmentError("Платеж был отменен");
//             localStorage.removeItem("current_enrollment_id");
//             localStorage.removeItem("current_idempotency_key");
//           } else {
//             // Still pending - this is where the bug was
//             setEnrollmentError("Платеж не был завершен. Попробуйте еще раз.");
//             localStorage.removeItem("current_enrollment_id");
//             localStorage.removeItem("current_idempotency_key");
//           }
//         } else {
//           setEnrollmentError("Запись о платеже не найдена");
//           localStorage.removeItem("current_enrollment_id");
//           localStorage.removeItem("current_idempotency_key");
//         }
//       } else {
//         throw new Error("Не удалось получить информацию о записях");
//       }
//     } catch (error) {
//       console.error("Manual status check failed:", error);
//       setEnrollmentError(
//         "Ошибка при проверке статуса платежа. Проверьте запись в личном кабинете."
//       );
//       localStorage.removeItem("current_enrollment_id");
//       localStorage.removeItem("current_idempotency_key");
//     } finally {
//       setPaymentInProgress(false);
//       setPaymentStatusMessage("");
//     }
//   };

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const enrollmentId = localStorage.getItem("current_enrollment_id");

//     // Enhanced check for payment return
//     if (
//       enrollmentId &&
//       (urlParams.has("payment_return") ||
//         urlParams.get("payment") === "success" ||
//         window.location.pathname.includes("success"))
//     ) {
//       checkPaymentStatusOnReturn();
//     }
//   }, []);

//   // Generate calendar for current month
//   const generateCalendar = (month, year) => {
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const startDate = new Date(firstDay);
//     startDate.setDate(startDate.getDate() - firstDay.getDay());

//     const calendar = [];
//     const currentDate = new Date(startDate);

//     for (let week = 0; week < 6; week++) {
//       const weekDays = [];
//       for (let day = 0; day < 7; day++) {
//         const date = new Date(currentDate);
//         weekDays.push({
//           date: date.getDate(),
//           month: date.getMonth(),
//           year: date.getFullYear(),
//           fullDate: new Date(date),
//           isCurrentMonth: date.getMonth() === month,
//         });
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
//       calendar.push(weekDays);
//     }
//     return calendar;
//   };

//   // Get slots for a specific date
//   const getSlotsForDate = (date) => {
//     if (!availableSlots) return [];

//     return availableSlots.filter((slot) => {
//       const slotDate = new Date(slot.start);
//       return (
//         slotDate.getDate() === date.getDate() &&
//         slotDate.getMonth() === date.getMonth() &&
//         slotDate.getFullYear() === date.getFullYear() &&
//         slot.free_places > 0
//       );
//     });
//   };

//   // Get date status
//   const getDateStatus = (dayInfo) => {
//     if (!dayInfo.isCurrentMonth) return "other-month";

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (dayInfo.fullDate < today) return "past";

//     const slotsForDate = getSlotsForDate(dayInfo.fullDate);
//     if (slotsForDate.length > 0) {
//       const hasLimitedAvailability = slotsForDate.some(
//         (slot) => slot.free_places <= masterclass?.participant_limit * 0.3
//       );
//       return hasLimitedAvailability ? "highlighted" : "available";
//     }

//     return "unavailable";
//   };

//   // Get date styling
//   const getDateClass = (dayInfo, status) => {
//     const baseClass =
//       "p-2 text-sm font-medium cursor-pointer rounded-full w-8 h-8 flex items-center justify-center";

//     if (!dayInfo.isCurrentMonth) {
//       return `${baseClass} text-gray-300`;
//     }

//     if (
//       selectedDate &&
//       selectedDate.getDate() === dayInfo.date &&
//       selectedDate.getMonth() === dayInfo.month &&
//       selectedDate.getFullYear() === dayInfo.year
//     ) {
//       return `${baseClass} bg-blue-500 text-white`;
//     }

//     switch (status) {
//       case "available":
//         return `${baseClass} text-green-500 hover:bg-green-50`;
//       case "highlighted":
//         return `${baseClass} text-green-400 hover:bg-green-50 font-bold`;
//       case "past":
//       case "unavailable":
//         return `${baseClass} text-gray-400 cursor-not-allowed`;
//       default:
//         return `${baseClass} text-gray-400`;
//     }
//   };

//   // Format time from ISO string
//   const formatTime = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleTimeString("ru-RU", {
//       hour: "2-digit",
//       minute: "2-digit",
//       timeZone: "UTC",
//     });
//   };

//   // Get available time slots for selected date
//   const getAvailableTimeSlotsForDate = () => {
//     if (!selectedDate) return [];
//     return getSlotsForDate(selectedDate);
//   };

//   // Month navigation
//   const navigateMonth = (direction) => {
//     if (direction === "prev") {
//       if (currentMonth === 0) {
//         setCurrentMonth(11);
//         setCurrentYear(currentYear - 1);
//       } else {
//         setCurrentMonth(currentMonth - 1);
//       }
//     } else {
//       if (currentMonth === 11) {
//         setCurrentMonth(0);
//         setCurrentYear(currentYear + 1);
//       } else {
//         setCurrentMonth(currentMonth + 1);
//       }
//     }
//     setSelectedDate(null);
//     setSelectedTime(null);
//   };

//   // Handle date click
//   const handleDateClick = (dayInfo, status) => {
//     if (status === "available" || status === "highlighted") {
//       setSelectedDate(dayInfo.fullDate);
//       setSelectedTime(null);
//     }
//   };

//   // Calculate total price
//   const getTotalPrice = () => {
//     if (!masterclass) return 0;
//     return parseFloat(masterclass.price) * participants;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg text-gray-600">Загрузка...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg text-red-600">Ошибка: {error}</div>
//       </div>
//     );
//   }

//   // Show masterclasses list if no specific masterclass is selected
//   if (!selectedMasterclassId) {
//     return (
//       <div className="max-w-6xl">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">
//           Выберите мастер-класс
//         </h1>

//         {masterclasses.length === 0 ? (
//           <div className="text-center text-gray-600 py-12">
//             <p className="text-lg">Нет доступных мастер-классов</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {masterclasses.map((mc) => (
//               <div
//                 key={mc.id}
//                 className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
//                 onClick={() => handleMasterclassSelect(mc.id)}
//               >
//                 {mc.image && (
//                   <img
//                     src={mc.image}
//                     alt={mc.title}
//                     className="w-full h-48 object-cover rounded-t-lg"
//                   />
//                 )}
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                     {mc.title}
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-3">
//                     {mc.description}
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <div className="text-lg font-bold text-green-600">
//                       {parseFloat(mc.price).toLocaleString("ru-RU")} ₽
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       До {mc.participant_limit} участников
//                     </div>
//                   </div>
//                   {mc.slots && mc.slots.length > 0 && (
//                     <div className="mt-3 text-sm text-blue-600">
//                       Доступно{" "}
//                       {mc.slots.filter((slot) => slot.free_places > 0).length}{" "}
//                       слотов
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }

//   if (!masterclass) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg text-gray-600">Мастер-класс не найден</div>
//       </div>
//     );
//   }

//   const calendar = generateCalendar(currentMonth, currentYear);
//   const monthNames = [
//     "Январь",
//     "Февраль",
//     "Март",
//     "Апрель",
//     "Май",
//     "Июнь",
//     "Июль",
//     "Август",
//     "Сентябрь",
//     "Октябрь",
//     "Ноябрь",
//     "Декабрь",
//   ];
//   const availableTimeSlots = getAvailableTimeSlotsForDate();

//   return (
//     <div className="max-w-6xl">
//       {/* Back button */}
//       <button
//         onClick={handleBackToList}
//         className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium"
//       >
//         <svg
//           className="w-5 h-5 mr-2"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 19l-7-7 7-7"
//           />
//         </svg>
//         Назад к списку мастер-классов
//       </button>

//       <div className="flex gap-8">
//         {/* Left Side - Calendar and Time */}
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold text-gray-900 mb-8">
//             Выбрать дату
//           </h1>

//           {/* Calendar */}
//           <div className="mb-8">
//             <div className="border-2 border-blue-300 rounded-2xl p-6 bg-white">
//               {/* Month Navigation */}
//               <div className="flex items-center justify-between mb-6">
//                 <button
//                   onClick={() => navigateMonth("prev")}
//                   className="p-2 hover:bg-gray-100 rounded"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 19l-7-7 7-7"
//                     />
//                   </svg>
//                 </button>
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   {monthNames[currentMonth]} {currentYear}
//                 </h2>
//                 <button
//                   onClick={() => navigateMonth("next")}
//                   className="p-2 hover:bg-gray-100 rounded"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </button>
//               </div>

//               {/* Day Headers */}
//               <div className="grid grid-cols-7 gap-2 text-center mb-2">
//                 {["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map((day) => (
//                   <div
//                     key={day}
//                     className="text-sm font-medium text-gray-500 p-2"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>

//               {/* Calendar Grid */}
//               <div className="grid grid-cols-7 gap-2 text-center">
//                 {calendar.map((week, weekIndex) =>
//                   week.map((dayInfo, dayIndex) => {
//                     const status = getDateStatus(dayInfo);
//                     return (
//                       <div
//                         key={`${weekIndex}-${dayIndex}`}
//                         className={getDateClass(dayInfo, status)}
//                         onClick={() => handleDateClick(dayInfo, status)}
//                       >
//                         {dayInfo.date}
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Available Time Slots */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Доступное время:
//             </h3>
//             {selectedDate ? (
//               availableTimeSlots.length > 0 ? (
//                 <div className="flex flex-wrap gap-3">
//                   {availableTimeSlots.map((slot) => (
//                     <button
//                       key={slot.id}
//                       onClick={() => setSelectedTime(slot)}
//                       className={`px-4 py-2 rounded-lg font-medium ${
//                         selectedTime?.id === slot.id
//                           ? "bg-green-500 text-white"
//                           : "bg-gray-600 text-white hover:bg-gray-700"
//                       }`}
//                     >
//                       {formatTime(slot.start)}
//                       <span className="text-xs block">
//                         {slot.free_places} мест
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500">
//                   На выбранную дату нет доступного времени
//                 </p>
//               )
//             ) : (
//               <p className="text-gray-500">
//                 Выберите дату для просмотра доступного времени
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Right Side - Additional Info */}
//         <div className="w-80">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">
//             Дополнительные данные
//           </h2>

//           {/* Participants Counter */}
//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="font-medium text-gray-900">
//                 Количество участников
//               </span>
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={() => setParticipants(Math.max(1, participants - 1))}
//                   className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-400"
//                 >
//                   -
//                 </button>
//                 <span className="text-xl font-bold text-orange-500">
//                   {participants}/{masterclass.participant_limit}
//                 </span>
//                 <button
//                   onClick={() =>
//                     setParticipants(
//                       Math.min(
//                         selectedTime
//                           ? selectedTime.free_places
//                           : masterclass.participant_limit,
//                         participants + 1
//                       )
//                     )
//                   }
//                   className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//             {selectedTime && (
//               <p className="text-xs text-gray-600">
//                 Доступно мест в выбранное время: {selectedTime.free_places}
//               </p>
//             )}
//           </div>

//           {/* Master Class Description */}
//           <div className="mb-6">
//             <h3 className="font-semibold text-gray-900 mb-3">
//               {masterclass.title}
//             </h3>
//             <p className="text-gray-700 text-sm leading-relaxed mb-3">
//               {masterclass.description}
//             </p>
//             <div className="text-lg font-bold text-green-600 mb-2">
//               {parseFloat(masterclass.price).toLocaleString("ru-RU")} ₽ за
//               участника
//             </div>
//             {participants > 1 && (
//               <div className="text-xl font-bold text-blue-600">
//                 Итого: {getTotalPrice().toLocaleString("ru-RU")} ₽
//               </div>
//             )}
//           </div>

//           {/* Privacy Notice */}
//           <div className="mb-6">
//             <p className="text-xs text-gray-600 mb-2">
//               Нажимая кнопку "Оплатить", вы автоматически соглашаетесь с{" "}
//               <a href="#" className="text-blue-500 underline">
//                 обработкой ваших персональных данных
//               </a>
//             </p>
//           </div>

//           {/* Payment Status Messages */}
//           {paymentInProgress && (
//             <div className="w-full mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <div className="flex items-center">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
//                 <div>
//                   <p className="text-blue-800 font-medium">Обработка платежа</p>
//                   <p className="text-blue-600 text-sm">
//                     {paymentStatusMessage}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Success Message */}
//           {enrollmentSuccess && (
//             <div className="w-full mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
//               <div className="flex items-center">
//                 <svg
//                   className="w-6 h-6 text-green-600 mr-3"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//                 <div>
//                   <p className="text-green-800 font-medium">
//                     Платеж успешно завершен!
//                   </p>
//                   <p className="text-green-600 text-sm">
//                     Вы успешно записаны на мастер-класс
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Error Message */}
//           {enrollmentError && (
//             <div className="w-full mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <div className="flex items-center">
//                 <svg
//                   className="w-6 h-6 text-red-600 mr-3"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 <div>
//                   <p className="text-red-800 font-medium">Ошибка платежа</p>
//                   <p className="text-red-600 text-sm">{enrollmentError}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Payment Button */}
//           {enrollmentSuccess ? (
//             <div className="w-full bg-green-500 text-white py-3 rounded-full font-medium text-lg text-center">
//               ✓ Вы записаны на мастер-класс!
//             </div>
//           ) : (
//             <button
//               onClick={handlePaymentEnrollment}
//               disabled={
//                 !selectedDate ||
//                 !selectedTime ||
//                 participants > (selectedTime?.free_places || 0) ||
//                 enrolling ||
//                 paymentInProgress
//               }
//               className="w-full bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-full font-medium text-lg shadow-lg transition-colors"
//             >
//               {enrolling
//                 ? "Создаём платёж..."
//                 : paymentInProgress
//                 ? "Обрабатываем платеж..."
//                 : `Оплатить ${getTotalPrice().toLocaleString("ru-RU")} ₽`}
//             </button>
//           )}

//           {/* Additional Status Message */}
//           {paymentStatusMessage &&
//             !paymentInProgress &&
//             !enrollmentSuccess &&
//             !enrollmentError && (
//               <div className="mt-3 p-3 bg-gray-100 border border-gray-300 text-gray-700 rounded text-center text-sm">
//                 {paymentStatusMessage}
//               </div>
//             )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingPage;

// last but not implemented payment
// "use client";
// import React, { useState, useEffect } from "react";
// import { useNavigation } from "../context/NavigationContext";

// const BookingPage = ({ masterclassId }) => {
//   const [masterclass, setMasterclass] = useState(null);
//   const [masterclasses, setMasterclasses] = useState([]);
//   const { selectedMasterclassId, setSelectedMasterclassId } = useNavigation();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [participants, setParticipants] = useState(1);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [enrolling, setEnrolling] = useState(false);
//   const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
//   const [enrollmentError, setEnrollmentError] = useState(null);

//   // Helper function to get CSRF token from cookies
//   const getCsrfTokenFromCookie = () => {
//     if (typeof document === "undefined") return null;

//     const name = "csrftoken";
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== "") {
//       const cookies = document.cookie.split(";");
//       for (let i = 0; i < cookies.length; i++) {
//         const cookie = cookies[i].trim();
//         if (cookie.substring(0, name.length + 1) === name + "=") {
//           cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//           break;
//         }
//       }
//     }
//     return cookieValue;
//   };

//   // Authenticated request helper
//   const makeAuthenticatedRequest = async (url, options = {}) => {
//     const accessToken = localStorage.getItem("access_token");
//     const csrfToken = getCsrfTokenFromCookie();

//     const headers = {
//       Accept: "application/json",
//       ...options.headers,
//     };

//     if (!options.body || !(options.body instanceof FormData)) {
//       headers["Content-Type"] = "application/json";
//     }

//     if (accessToken) {
//       headers["Authorization"] = `Bearer ${accessToken}`;
//     }

//     if (csrfToken) {
//       headers["X-CSRFTOKEN"] = csrfToken;
//     }

//     const response = await fetch(url, {
//       ...options,
//       headers,
//       credentials: "include",
//     });

//     if (response.status === 401) {
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
//     }

//     return response;
//   };

//   // Fetch masterclasses list
//   const fetchMasterclasses = async () => {
//     try {
//       setLoading(true);
//       const response = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/`,
//         { method: "GET" }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setMasterclasses(data.results || data || []);
//       } else {
//         throw new Error(`Failed to fetch masterclasses: ${response.status}`);
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching masterclasses:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch specific masterclass data
//   const fetchMasterclass = async (id) => {
//     try {
//       setLoading(true);
//       const response = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/${id}/`,
//         { method: "GET" }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setMasterclass(data);
//         setAvailableSlots(data.slots || []);
//         setParticipants(1);
//       } else {
//         throw new Error(`Failed to fetch masterclass: ${response.status}`);
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching masterclass:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Use selectedMasterclassId if it's set, otherwise use the prop masterclassId
//     const idToUse = selectedMasterclassId || masterclassId;

//     if (idToUse) {
//       fetchMasterclass(idToUse);
//     } else {
//       fetchMasterclasses();
//     }
//   }, [selectedMasterclassId, masterclassId]);

//   // Also add this useEffect to handle prop changes:
//   useEffect(() => {
//     if (masterclassId && masterclassId !== selectedMasterclassId) {
//       setSelectedMasterclassId(masterclassId);
//     }
//   }, [masterclassId]);

//   // Handle masterclass selection
//   const handleMasterclassSelect = (id) => {
//     setSelectedMasterclassId(id);
//     setSelectedDate(null);
//     setSelectedTime(null);
//     setEnrollmentSuccess(false);
//     setEnrollmentError(null);
//   };

//   // Go back to masterclasses list
//   const handleBackToList = () => {
//     setSelectedMasterclassId(null);
//     setMasterclass(null);
//     setAvailableSlots([]);
//     setSelectedDate(null);
//     setSelectedTime(null);
//     setEnrollmentSuccess(false);
//     setEnrollmentError(null);
//     fetchMasterclasses();
//   };

//   // Updated payment enrollment handler
//   const handlePaymentEnrollment = async () => {
//     if (!selectedTime || !participants || !masterclass) return;

//     try {
//       setEnrolling(true);
//       setEnrollmentError(null);

//       // Calculate total amount
//       const totalAmount = parseFloat(masterclass.price) * participants;

//       const paymentData = {
//         masterclass_id: masterclass.id,
//         slot_id: selectedTime.id,
//         quantity: participants,
//         amount: totalAmount.toFixed(2), // Ensure 2 decimal places
//         user_id: 2,
//         return_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-account/`,
//       };

//       console.log("Creating payment with data:", paymentData);

//       const response = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/payments/create/`,
//         {
//           method: "POST",
//           body: JSON.stringify(paymentData),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Payment creation successful:", data);

//         // Store enrollment info for potential status tracking
//         localStorage.setItem("current_enrollment_id", data.enrollment_id);
//         localStorage.setItem("current_idempotency_key", data.idempotency_key);

//         // Redirect to YooKassa payment page
//         if (data.confirmation_url) {
//           window.location.href = data.confirmation_url;
//         } else {
//           throw new Error("URL для оплаты не получен");
//         }
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         console.error("Payment creation failed:", response.status, errorData);
//         throw new Error(
//           errorData.detail ||
//             errorData.message ||
//             `Ошибка создания платежа: ${response.status}`
//         );
//       }
//     } catch (err) {
//       setEnrollmentError(err.message);
//       console.error("Error creating payment:", err);
//     } finally {
//       setEnrolling(false);
//     }
//   };

//   // Optional: Add payment status tracking
//   const trackPaymentStatus = (enrollmentId) => {
//     const eventSource = new EventSource(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/payments/status/${enrollmentId}/`
//     );

//     eventSource.onmessage = function (event) {
//       const data = JSON.parse(event.data);
//       console.log("Payment status update:", data);

//       if (data.status === "paid") {
//         setEnrollmentSuccess(true);
//         setEnrollmentError(null);
//         eventSource.close();
//         // Remove stored enrollment info
//         localStorage.removeItem("current_enrollment_id");
//         localStorage.removeItem("current_idempotency_key");
//       } else if (data.status === "cancelled") {
//         setEnrollmentError("Платеж был отменен");
//         eventSource.close();
//       } else if (data.status === "not_found") {
//         setEnrollmentError("Запись не найдена");
//         eventSource.close();
//       }
//     };

//     eventSource.onerror = function (event) {
//       console.error("Payment status tracking error:", event);
//       eventSource.close();
//     };

//     return eventSource;
//   };

//   // Check for successful payment return (optional)
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const enrollmentId = localStorage.getItem("current_enrollment_id");

//     // If user returned from payment and we have enrollment ID, track status
//     if (
//       enrollmentId &&
//       (urlParams.get("payment") === "success" ||
//         window.location.pathname.includes("success"))
//     ) {
//       const eventSource = trackPaymentStatus(enrollmentId);

//       // Cleanup function
//       return () => {
//         if (eventSource) {
//           eventSource.close();
//         }
//       };
//     }
//   }, []);

//   // Generate calendar for current month
//   const generateCalendar = (month, year) => {
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const startDate = new Date(firstDay);
//     startDate.setDate(startDate.getDate() - firstDay.getDay());

//     const calendar = [];
//     const currentDate = new Date(startDate);

//     for (let week = 0; week < 6; week++) {
//       const weekDays = [];
//       for (let day = 0; day < 7; day++) {
//         const date = new Date(currentDate);
//         weekDays.push({
//           date: date.getDate(),
//           month: date.getMonth(),
//           year: date.getFullYear(),
//           fullDate: new Date(date),
//           isCurrentMonth: date.getMonth() === month,
//         });
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
//       calendar.push(weekDays);
//     }
//     return calendar;
//   };

//   // Get slots for a specific date
//   const getSlotsForDate = (date) => {
//     if (!availableSlots) return [];

//     return availableSlots.filter((slot) => {
//       const slotDate = new Date(slot.start);
//       return (
//         slotDate.getDate() === date.getDate() &&
//         slotDate.getMonth() === date.getMonth() &&
//         slotDate.getFullYear() === date.getFullYear() &&
//         slot.free_places > 0
//       );
//     });
//   };

//   // Get date status
//   const getDateStatus = (dayInfo) => {
//     if (!dayInfo.isCurrentMonth) return "other-month";

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (dayInfo.fullDate < today) return "past";

//     const slotsForDate = getSlotsForDate(dayInfo.fullDate);
//     if (slotsForDate.length > 0) {
//       const hasLimitedAvailability = slotsForDate.some(
//         (slot) => slot.free_places <= masterclass?.participant_limit * 0.3
//       );
//       return hasLimitedAvailability ? "highlighted" : "available";
//     }

//     return "unavailable";
//   };

//   // Get date styling
//   const getDateClass = (dayInfo, status) => {
//     const baseClass =
//       "p-2 text-sm font-medium cursor-pointer rounded-full w-8 h-8 flex items-center justify-center";

//     if (!dayInfo.isCurrentMonth) {
//       return `${baseClass} text-gray-300`;
//     }

//     if (
//       selectedDate &&
//       selectedDate.getDate() === dayInfo.date &&
//       selectedDate.getMonth() === dayInfo.month &&
//       selectedDate.getFullYear() === dayInfo.year
//     ) {
//       return `${baseClass} bg-blue-500 text-white`;
//     }

//     switch (status) {
//       case "available":
//         return `${baseClass} text-green-500 hover:bg-green-50`;
//       case "highlighted":
//         return `${baseClass} text-green-400 hover:bg-green-50 font-bold`;
//       case "past":
//       case "unavailable":
//         return `${baseClass} text-gray-400 cursor-not-allowed`;
//       default:
//         return `${baseClass} text-gray-400`;
//     }
//   };

//   // Format time from ISO string
//   const formatTime = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleTimeString("ru-RU", {
//       hour: "2-digit",
//       minute: "2-digit",
//       timeZone: "UTC",
//     });
//   };

//   // Get available time slots for selected date
//   const getAvailableTimeSlotsForDate = () => {
//     if (!selectedDate) return [];
//     return getSlotsForDate(selectedDate);
//   };

//   // Month navigation
//   const navigateMonth = (direction) => {
//     if (direction === "prev") {
//       if (currentMonth === 0) {
//         setCurrentMonth(11);
//         setCurrentYear(currentYear - 1);
//       } else {
//         setCurrentMonth(currentMonth - 1);
//       }
//     } else {
//       if (currentMonth === 11) {
//         setCurrentMonth(0);
//         setCurrentYear(currentYear + 1);
//       } else {
//         setCurrentMonth(currentMonth + 1);
//       }
//     }
//     setSelectedDate(null);
//     setSelectedTime(null);
//   };

//   // Handle date click
//   const handleDateClick = (dayInfo, status) => {
//     if (status === "available" || status === "highlighted") {
//       setSelectedDate(dayInfo.fullDate);
//       setSelectedTime(null);
//     }
//   };

//   // Calculate total price
//   const getTotalPrice = () => {
//     if (!masterclass) return 0;
//     return parseFloat(masterclass.price) * participants;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg text-gray-600">Загрузка...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg text-red-600">Ошибка: {error}</div>
//       </div>
//     );
//   }

//   // Show masterclasses list if no specific masterclass is selected
//   if (!selectedMasterclassId) {
//     return (
//       <div className="max-w-6xl">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">
//           Выберите мастер-класс
//         </h1>

//         {masterclasses.length === 0 ? (
//           <div className="text-center text-gray-600 py-12">
//             <p className="text-lg">Нет доступных мастер-классов</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {masterclasses.map((mc) => (
//               <div
//                 key={mc.id}
//                 className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
//                 onClick={() => handleMasterclassSelect(mc.id)}
//               >
//                 {mc.image && (
//                   <img
//                     src={mc.image}
//                     alt={mc.title}
//                     className="w-full h-48 object-cover rounded-t-lg"
//                   />
//                 )}
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                     {mc.title}
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-3">
//                     {mc.description}
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <div className="text-lg font-bold text-green-600">
//                       {parseFloat(mc.price).toLocaleString("ru-RU")} ₽
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       До {mc.participant_limit} участников
//                     </div>
//                   </div>
//                   {mc.slots && mc.slots.length > 0 && (
//                     <div className="mt-3 text-sm text-blue-600">
//                       Доступно{" "}
//                       {mc.slots.filter((slot) => slot.free_places > 0).length}{" "}
//                       слотов
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }

//   if (!masterclass) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg text-gray-600">Мастер-класс не найден</div>
//       </div>
//     );
//   }

//   const calendar = generateCalendar(currentMonth, currentYear);
//   const monthNames = [
//     "Январь",
//     "Февраль",
//     "Март",
//     "Апрель",
//     "Май",
//     "Июнь",
//     "Июль",
//     "Август",
//     "Сентябрь",
//     "Октябрь",
//     "Ноябрь",
//     "Декабрь",
//   ];
//   const availableTimeSlots = getAvailableTimeSlotsForDate();

//   return (
//     <div className="max-w-6xl">
//       {/* Back button */}
//       <button
//         onClick={handleBackToList}
//         className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium"
//       >
//         <svg
//           className="w-5 h-5 mr-2"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 19l-7-7 7-7"
//           />
//         </svg>
//         Назад к списку мастер-классов
//       </button>

//       <div className="flex gap-8">
//         {/* Left Side - Calendar and Time */}
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold text-gray-900 mb-8">
//             Выбрать дату
//           </h1>

//           {/* Calendar */}
//           <div className="mb-8">
//             <div className="border-2 border-blue-300 rounded-2xl p-6 bg-white">
//               {/* Month Navigation */}
//               <div className="flex items-center justify-between mb-6">
//                 <button
//                   onClick={() => navigateMonth("prev")}
//                   className="p-2 hover:bg-gray-100 rounded"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 19l-7-7 7-7"
//                     />
//                   </svg>
//                 </button>
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   {monthNames[currentMonth]} {currentYear}
//                 </h2>
//                 <button
//                   onClick={() => navigateMonth("next")}
//                   className="p-2 hover:bg-gray-100 rounded"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </button>
//               </div>

//               {/* Day Headers */}
//               <div className="grid grid-cols-7 gap-2 text-center mb-2">
//                 {["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map((day) => (
//                   <div
//                     key={day}
//                     className="text-sm font-medium text-gray-500 p-2"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>

//               {/* Calendar Grid */}
//               <div className="grid grid-cols-7 gap-2 text-center">
//                 {calendar.map((week, weekIndex) =>
//                   week.map((dayInfo, dayIndex) => {
//                     const status = getDateStatus(dayInfo);
//                     return (
//                       <div
//                         key={`${weekIndex}-${dayIndex}`}
//                         className={getDateClass(dayInfo, status)}
//                         onClick={() => handleDateClick(dayInfo, status)}
//                       >
//                         {dayInfo.date}
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Available Time Slots */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Доступное время:
//             </h3>
//             {selectedDate ? (
//               availableTimeSlots.length > 0 ? (
//                 <div className="flex flex-wrap gap-3">
//                   {availableTimeSlots.map((slot) => (
//                     <button
//                       key={slot.id}
//                       onClick={() => setSelectedTime(slot)}
//                       className={`px-4 py-2 rounded-lg font-medium ${
//                         selectedTime?.id === slot.id
//                           ? "bg-green-500 text-white"
//                           : "bg-gray-600 text-white hover:bg-gray-700"
//                       }`}
//                     >
//                       {formatTime(slot.start)}
//                       <span className="text-xs block">
//                         {slot.free_places} мест
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500">
//                   На выбранную дату нет доступного времени
//                 </p>
//               )
//             ) : (
//               <p className="text-gray-500">
//                 Выберите дату для просмотра доступного времени
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Right Side - Additional Info */}
//         <div className="w-80">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">
//             Дополнительные данные
//           </h2>

//           {/* Participants Counter */}
//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="font-medium text-gray-900">
//                 Количество участников
//               </span>
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={() => setParticipants(Math.max(1, participants - 1))}
//                   className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-400"
//                 >
//                   -
//                 </button>
//                 <span className="text-xl font-bold text-orange-500">
//                   {participants}/{masterclass.participant_limit}
//                 </span>
//                 <button
//                   onClick={() =>
//                     setParticipants(
//                       Math.min(
//                         selectedTime
//                           ? selectedTime.free_places
//                           : masterclass.participant_limit,
//                         participants + 1
//                       )
//                     )
//                   }
//                   className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//             {selectedTime && (
//               <p className="text-xs text-gray-600">
//                 Доступно мест в выбранное время: {selectedTime.free_places}
//               </p>
//             )}
//           </div>

//           {/* Master Class Description */}
//           <div className="mb-6">
//             <h3 className="font-semibold text-gray-900 mb-3">
//               {masterclass.title}
//             </h3>
//             <p className="text-gray-700 text-sm leading-relaxed mb-3">
//               {masterclass.description}
//             </p>
//             <div className="text-lg font-bold text-green-600 mb-2">
//               {parseFloat(masterclass.price).toLocaleString("ru-RU")} ₽ за
//               участника
//             </div>
//             {participants > 1 && (
//               <div className="text-xl font-bold text-blue-600">
//                 Итого: {getTotalPrice().toLocaleString("ru-RU")} ₽
//               </div>
//             )}
//           </div>

//           {/* Privacy Notice */}
//           <div className="mb-6">
//             <p className="text-xs text-gray-600 mb-2">
//               Нажимая кнопку "Оплатить", вы автоматически соглашаетесь с{" "}
//               <a href="#" className="text-blue-500 underline">
//                 обработкой ваших персональных данных
//               </a>
//             </p>
//           </div>

//           {/* Payment Button */}
//           {enrollmentSuccess ? (
//             <div className="w-full bg-green-500 text-white py-3 rounded-full font-medium text-lg text-center">
//               ✓ Оплата прошла успешно!
//             </div>
//           ) : (
//             <button
//               onClick={handlePaymentEnrollment}
//               disabled={
//                 !selectedDate ||
//                 !selectedTime ||
//                 participants > (selectedTime?.free_places || 0) ||
//                 enrolling
//               }
//               className="w-full bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-full font-medium text-lg shadow-lg transition-colors"
//             >
//               {enrolling
//                 ? "Создаём платёж..."
//                 : `Оплатить ${getTotalPrice().toLocaleString("ru-RU")} ₽`}
//             </button>
//           )}
//           {enrollmentError && (
//             <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//               {enrollmentError}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingPage;

"use client";
import React, { useState, useEffect } from "react";
import { useNavigation } from "../context/NavigationContext";
import { usePayment } from "../context/PaymentContext";

const BookingPage = ({ masterclassId }) => {
  const [masterclass, setMasterclass] = useState(null);
  const [masterclasses, setMasterclasses] = useState([]);
  const { selectedMasterclassId, setSelectedMasterclassId } = useNavigation();
  const {
    currentEnrollment,
    paymentStatus,
    isTrackingPayment,
    paymentError,
    createPayment,
    clearPaymentState,
    canRetryPayment,
    resetPaymentForRetry,
    startPaymentTracking,
  } = usePayment();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [participants, setParticipants] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [enrolling, setEnrolling] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  // Helper function to get CSRF token from cookies
  const getCsrfTokenFromCookie = () => {
    if (typeof document === "undefined") return null;

    const name = "csrftoken";
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  // Enhanced authenticated request helper with better error handling
  const makeAuthenticatedRequest = async (url, options = {}) => {
    try {
      console.log("Making request to:", url);

      const accessToken = localStorage.getItem("access_token");
      const csrfToken = getCsrfTokenFromCookie();

      const headers = {
        Accept: "application/json",
        ...options.headers,
      };

      if (!options.body || !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      if (csrfToken) {
        headers["X-CSRFTOKEN"] = csrfToken;
      }

      console.log("Request headers:", headers);

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (!isJson) {
        // Log the actual response text for debugging
        const responseText = await response.text();
        console.error("Non-JSON response received:", responseText);
        throw new Error(
          `Server returned ${response.status}: Expected JSON but received ${
            contentType || "unknown content type"
          }`
        );
      }

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  };

  // Enhanced fetch masterclasses list with better error handling
  const fetchMasterclasses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate environment variable
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error(
          "NEXT_PUBLIC_BACKEND_URL environment variable is not set"
        );
      }

      const apiUrl = `${backendUrl}/api/masterclasses/`;
      console.log("Fetching masterclasses from:", apiUrl);

      const response = await makeAuthenticatedRequest(apiUrl, {
        method: "GET",
      });

      const data = await response.json();
      console.log("Masterclasses data received:", data);

      setMasterclasses(data.results || data || []);
    } catch (err) {
      console.error("Error fetching masterclasses:", err);
      setError(`Ошибка загрузки мастер-классов: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced fetch specific masterclass data with better error handling
  const fetchMasterclass = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error(
          "NEXT_PUBLIC_BACKEND_URL environment variable is not set"
        );
      }

      const apiUrl = `${backendUrl}/api/masterclasses/${id}/`;
      console.log("Fetching masterclass from:", apiUrl);

      const response = await makeAuthenticatedRequest(apiUrl, {
        method: "GET",
      });

      const data = await response.json();
      console.log("Masterclass data received:", data);

      setMasterclass(data);
      setAvailableSlots(data.slots || []);
      setParticipants(1);
    } catch (err) {
      console.error("Error fetching masterclass:", err);
      setError(`Ошибка загрузки мастер-класса: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idToUse = selectedMasterclassId || masterclassId;

    if (idToUse) {
      fetchMasterclass(idToUse);
    } else {
      fetchMasterclasses();
    }
  }, [selectedMasterclassId, masterclassId]);

  useEffect(() => {
    if (masterclassId && masterclassId !== selectedMasterclassId) {
      setSelectedMasterclassId(masterclassId);
    }
  }, [masterclassId]);

  // Handle masterclass selection
  const handleMasterclassSelect = (id) => {
    setSelectedMasterclassId(id);
    setSelectedDate(null);
    setSelectedTime(null);
    clearPaymentState();
  };

  // Go back to masterclasses list
  const handleBackToList = () => {
    setSelectedMasterclassId(null);
    setMasterclass(null);
    setAvailableSlots([]);
    setSelectedDate(null);
    setSelectedTime(null);
    clearPaymentState();
    fetchMasterclasses();
  };

  // Updated payment enrollment handler using context
  const handlePaymentEnrollment = async () => {
    if (!selectedTime || !participants || !masterclass) return;

    try {
      setEnrolling(true);

      // const userId = localStorage.getItem("user_id") || 2;
      // const totalAmount = parseFloat(masterclass.price) * participants;

      const paymentData = {
        masterclass_id: masterclass.id,
        slot_id: selectedTime.id,
        quantity: participants,
        // amount: totalAmount.toFixed(2),
        // user_id: parseInt(userId),
        return_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/pages/payment-result`,
      };

      console.log("Creating payment with data:", paymentData);

      const result = await createPayment(paymentData);

      if (result.success) {
        console.log("Opening payment in new tab:", result.confirmationUrl);

        const paymentWindow = window.open(
          result.confirmationUrl,
          "_blank",
          "noopener,noreferrer"
        );

        if (!paymentWindow) {
          setPaymentUrl(result.confirmationUrl);
        } else {
          alert(
            "Страница оплаты открыта в новой вкладке. После завершения оплаты статус обновится автоматически."
          );
        }

        if (result.enrollmentId) {
          startPaymentTracking(result.enrollmentId);
        }
      } else {
        console.error("Payment creation failed:", result.error);
      }
    } catch (err) {
      console.error("Error creating payment:", err);
    } finally {
      setEnrolling(false);
    }
  };

  // Generate calendar for current month
  const generateCalendar = (month, year) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendar = [];
    const currentDate = new Date(startDate);

    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(currentDate);
        weekDays.push({
          date: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          fullDate: new Date(date),
          isCurrentMonth: date.getMonth() === month,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      calendar.push(weekDays);
    }
    return calendar;
  };

  // Get slots for a specific date
  const getSlotsForDate = (date) => {
    if (!availableSlots) return [];

    return availableSlots.filter((slot) => {
      const slotDate = new Date(slot.start);
      return (
        slotDate.getDate() === date.getDate() &&
        slotDate.getMonth() === date.getMonth() &&
        slotDate.getFullYear() === date.getFullYear() &&
        slot.free_places > 0
      );
    });
  };

  // Get date status
  const getDateStatus = (dayInfo) => {
    if (!dayInfo.isCurrentMonth) return "other-month";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dayInfo.fullDate < today) return "past";

    const slotsForDate = getSlotsForDate(dayInfo.fullDate);
    if (slotsForDate.length > 0) {
      const hasLimitedAvailability = slotsForDate.some(
        (slot) => slot.free_places <= masterclass?.participant_limit * 0.3
      );
      return hasLimitedAvailability ? "highlighted" : "available";
    }

    return "unavailable";
  };

  // Get date styling
  const getDateClass = (dayInfo, status) => {
    const baseClass =
      "p-1 sm:p-2 text-xs sm:text-sm font-medium cursor-pointer rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center";

    if (!dayInfo.isCurrentMonth) {
      return `${baseClass} text-gray-300`;
    }

    if (
      selectedDate &&
      selectedDate.getDate() === dayInfo.date &&
      selectedDate.getMonth() === dayInfo.month &&
      selectedDate.getFullYear() === dayInfo.year
    ) {
      return `${baseClass} bg-blue-500 text-white`;
    }

    switch (status) {
      case "available":
        return `${baseClass} text-green-500 hover:bg-green-50`;
      case "highlighted":
        return `${baseClass} text-green-400 hover:bg-green-50 font-bold`;
      case "past":
      case "unavailable":
        return `${baseClass} text-gray-400 cursor-not-allowed`;
      default:
        return `${baseClass} text-gray-400`;
    }
  };

  // Format time from ISO string
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  };

  // Get available time slots for selected date
  const getAvailableTimeSlotsForDate = () => {
    if (!selectedDate) return [];
    return getSlotsForDate(selectedDate);
  };

  // Month navigation
  const navigateMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Handle date click
  const handleDateClick = (dayInfo, status) => {
    if (status === "available" || status === "highlighted") {
      setSelectedDate(dayInfo.fullDate);
      setSelectedTime(null);
    }
  };

  // Calculate total price
  const getTotalPrice = () => {
    if (!masterclass) return 0;
    return parseFloat(masterclass.price) * participants;
  };

  // Enhanced error display with retry functionality
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-red-600 text-center max-w-md">{error}</div>
        <button
          onClick={() => {
            if (selectedMasterclassId) {
              fetchMasterclass(selectedMasterclassId);
            } else {
              fetchMasterclasses();
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Попробовать снова
        </button>
        <div className="text-sm text-gray-600 text-center max-w-md">
          <p>Проверьте:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-left">
            <li>Переменная NEXT_PUBLIC_BACKEND_URL настроена правильно</li>
            <li>Backend сервер запущен и доступен</li>
            <li>API endpoints возвращают JSON, а не HTML</li>
            <li>Нет проблем с CORS или аутентификацией</li>
          </ul>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    );
  }

  // Show masterclasses list if no specific masterclass is selected
  if (!selectedMasterclassId) {
    return (
      <div className="max-w-6xl px-4 sm:px-6 lg:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Выберите мастер-класс
        </h1>

        {masterclasses.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <p className="text-lg">Нет доступных мастер-классов</p>
            <button
              onClick={fetchMasterclasses}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Обновить
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {masterclasses.map((mc) => (
              <div
                key={mc.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleMasterclassSelect(mc.id)}
              >
                {mc.image && (
                  <img
                    src={mc.image}
                    alt={mc.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {mc.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {mc.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-green-600">
                      {parseFloat(mc.price).toLocaleString("ru-RU")} ₽
                    </div>
                    <div className="text-sm text-gray-500">
                      До {mc.participant_limit} участников
                    </div>
                  </div>
                  {mc.slots && mc.slots.length > 0 && (
                    <div className="mt-3 text-sm text-blue-600">
                      Доступно{" "}
                      {mc.slots.filter((slot) => slot.free_places > 0).length}{" "}
                      слотов
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!masterclass) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Мастер-класс не найден</div>
      </div>
    );
  }

  const calendar = generateCalendar(currentMonth, currentYear);
  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];
  const availableTimeSlots = getAvailableTimeSlotsForDate();

  return (
    <div className="max-w-6xl">
      {/* Back button */}
      <button
        onClick={handleBackToList}
        className="mb-4 sm:mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
      >
        <svg
          className="w-5 h-5 mr-2"
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
        Назад к списку мастер-классов
      </button>

      {/* Payment Status Banner */}
      {paymentStatus === "cancelled" && canRetryPayment && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center justify-between">
            <span>❌ Платеж был отменен. Вы можете попробовать снова.</span>
            <button
              onClick={() => {
                resetPaymentForRetry();
                handlePaymentEnrollment();
              }}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              disabled={enrolling}
            >
              {enrolling ? "Создаём платёж..." : "Повторить оплату"}
            </button>
          </div>
        </div>
      )}

      {paymentError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center justify-between">
            <span>❌ Ошибка: {paymentError}</span>
            {canRetryPayment && (
              <button
                onClick={() => {
                  resetPaymentForRetry();
                  handlePaymentEnrollment();
                }}
                className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                disabled={enrolling}
              >
                Попробовать снова
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Side - Calendar and Time */}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Выбрать дату
          </h1>

          {/* Calendar */}
          <div className="mb-8">
            <div className="border-2 border-blue-300 rounded-2xl p-4 sm:p-6 bg-white">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <svg
                    className="w-5 h-5"
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
                </button>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <button
                  onClick={() => navigateMonth("next")}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map((day) => (
                  <div
                    key={day}
                    className="text-sm font-medium text-gray-500 p-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
                {calendar.map((week, weekIndex) =>
                  week.map((dayInfo, dayIndex) => {
                    const status = getDateStatus(dayInfo);
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={getDateClass(dayInfo, status)}
                        onClick={() => handleDateClick(dayInfo, status)}
                      >
                        {dayInfo.date}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Available Time Slots */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Доступное время:
            </h3>
            {selectedDate ? (
              availableTimeSlots.length > 0 ? (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedTime(slot)}
                      className={`px-3 py-2 sm:px-4 rounded-lg font-medium text-sm sm:text-base ${
                        selectedTime?.id === slot.id
                          ? "bg-green-500 text-white"
                          : "bg-gray-600 text-white hover:bg-gray-700"
                      }`}
                    >
                      {formatTime(slot.start)}
                      <span className="text-xs block">
                        {slot.free_places} мест
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  На выбранную дату нет доступного времени
                </p>
              )
            ) : (
              <p className="text-gray-500">
                Выберите дату для просмотра доступного времени
              </p>
            )}
          </div>
        </div>

        {/* Right Side - Additional Info */}
        <div className="w-full lg:w-80">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            Дополнительные данные
          </h2>

          {/* Participants Counter */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">
                Количество участников
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setParticipants(Math.max(1, participants - 1))}
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-400 text-sm sm:text-base"
                >
                  -
                </button>
                <span className="text-lg sm:text-xl font-bold text-orange-500">
                  {participants}/{masterclass.participant_limit}
                </span>
                <button
                  onClick={() =>
                    setParticipants(
                      Math.min(
                        selectedTime
                          ? selectedTime.free_places
                          : masterclass.participant_limit,
                        participants + 1
                      )
                    )
                  }
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 text-sm sm:text-base"
                >
                  +
                </button>
              </div>
            </div>
            {selectedTime && (
              <p className="text-xs text-gray-600">
                Доступно мест в выбранное время: {selectedTime.free_places}
              </p>
            )}
          </div>

          {/* Master Class Description */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
              {masterclass.title}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {masterclass.description}
            </p>
            <div className="text-base sm:text-lg font-bold text-green-600 mb-2">
              {parseFloat(masterclass.price).toLocaleString("ru-RU")} ₽ за
              участника
            </div>
            {participants > 1 && (
              <div className="text-lg sm:text-xl font-bold text-blue-600">
                Итого: {getTotalPrice().toLocaleString("ru-RU")} ₽
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="mb-6">
            <p className="text-xs text-gray-600 mb-2">
              Нажимая кнопку "Оплатить", вы автоматически соглашаетесь с{" "}
              <a
                href="/documents/Оферта_МК.docx"
                download="Оферта_МК.docx"
                className="text-blue-500 underline"
              >
                обработкой ваших персональных данных
              </a>
            </p>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePaymentEnrollment}
            disabled={
              !selectedDate ||
              !selectedTime ||
              participants > (selectedTime?.free_places || 0) ||
              enrolling
            }
            className="w-full bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 rounded-full font-medium text-base sm:text-lg shadow-lg transition-colors"
          >
            {enrolling
              ? "Создаём платёж..."
              : `Оплатить ${getTotalPrice().toLocaleString("ru-RU")} ₽`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
