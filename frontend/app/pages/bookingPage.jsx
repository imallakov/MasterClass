// "use client";
// import React, { useState, useEffect } from "react";

// const BookingPage = ({ masterclassId }) => {
//   const [masterclass, setMasterclass] = useState(null);
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

//   // Helper function to get CSRF token from cookies (same as AddMasterClassPage)
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

//   // Authenticated request helper (similar to AddMasterClassPage)
//   const makeAuthenticatedRequest = async (url, options = {}) => {
//     const accessToken = localStorage.getItem("access_token"); // Fixed: use "access_token" not "accessToken"
//     const csrfToken = getCsrfTokenFromCookie();

//     const headers = {
//       Accept: "application/json",
//       ...options.headers,
//     };

//     // Only set Content-Type to application/json if it's not a FormData upload
//     if (!options.body || !(options.body instanceof FormData)) {
//       headers["Content-Type"] = "application/json";
//     }

//     // Add authentication token
//     if (accessToken) {
//       headers["Authorization"] = `Bearer ${accessToken}`;
//     }

//     // Add CSRF token if available
//     if (csrfToken) {
//       headers["X-CSRFTOKEN"] = csrfToken;
//     }

//     const response = await fetch(url, {
//       ...options,
//       headers,
//       credentials: "include",
//     });

//     // Handle token expiration (same as AddMasterClassPage)
//     if (response.status === 401) {
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       // You might want to redirect to login or show login modal
//       throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
//     }

//     return response;
//   };

//   // Fetch masterclass data
//   useEffect(() => {
//     const fetchMasterclass = async () => {
//       try {
//         setLoading(true);

//         const response = await makeAuthenticatedRequest(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/${masterclassId}/`,
//           {
//             method: "GET",
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           setMasterclass(data);
//           setAvailableSlots(data.slots || []);
//           setParticipants(1); // Reset participants when new masterclass loads
//         } else {
//           throw new Error(`Failed to fetch masterclass: ${response.status}`);
//         }
//       } catch (err) {
//         setError(err.message);
//         console.error("Error fetching masterclass:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (masterclassId) {
//       fetchMasterclass();
//     }
//   }, [masterclassId]);

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

//         // Optionally refresh the masterclass data to update available slots
//         // You can call fetchMasterclass() here if needed
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
//       // Check if any slot has limited availability
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
//       setSelectedTime(null); // Reset selected time when date changes
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
//     <div className="flex gap-8">
//       {/* Left Side - Calendar and Time */}
//       <div className="flex-1">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Выбрать дату</h1>

//         {/* Calendar */}
//         <div className="mb-8">
//           <div className="border-2 border-blue-300 rounded-2xl p-6 bg-white">
//             {/* Month Navigation */}
//             <div className="flex items-center justify-between mb-6">
//               <button
//                 onClick={() => navigateMonth("prev")}
//                 className="p-2 hover:bg-gray-100 rounded"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 19l-7-7 7-7"
//                   />
//                 </svg>
//               </button>
//               <h2 className="text-lg font-semibold text-gray-900">
//                 {monthNames[currentMonth]} {currentYear}
//               </h2>
//               <button
//                 onClick={() => navigateMonth("next")}
//                 className="p-2 hover:bg-gray-100 rounded"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </button>
//             </div>

//             {/* Day Headers */}
//             <div className="grid grid-cols-7 gap-2 text-center mb-2">
//               {["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map((day) => (
//                 <div
//                   key={day}
//                   className="text-sm font-medium text-gray-500 p-2"
//                 >
//                   {day}
//                 </div>
//               ))}
//             </div>

//             {/* Calendar Grid */}
//             <div className="grid grid-cols-7 gap-2 text-center">
//               {calendar.map((week, weekIndex) =>
//                 week.map((dayInfo, dayIndex) => {
//                   const status = getDateStatus(dayInfo);
//                   return (
//                     <div
//                       key={`${weekIndex}-${dayIndex}`}
//                       className={getDateClass(dayInfo, status)}
//                       onClick={() => handleDateClick(dayInfo, status)}
//                     >
//                       {dayInfo.date}
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Available Time Slots */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             Доступное время:
//           </h3>
//           {selectedDate ? (
//             availableTimeSlots.length > 0 ? (
//               <div className="flex flex-wrap gap-3">
//                 {availableTimeSlots.map((slot) => (
//                   <button
//                     key={slot.id}
//                     onClick={() => setSelectedTime(slot)}
//                     className={`px-4 py-2 rounded-lg font-medium ${
//                       selectedTime?.id === slot.id
//                         ? "bg-green-500 text-white"
//                         : "bg-gray-600 text-white hover:bg-gray-700"
//                     }`}
//                   >
//                     {formatTime(slot.start)}
//                     <span className="text-xs block">
//                       {slot.free_places} мест
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500">
//                 На выбранную дату нет доступного времени
//               </p>
//             )
//           ) : (
//             <p className="text-gray-500">
//               Выберите дату для просмотра доступного времени
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Right Side - Additional Info */}
//       <div className="w-80">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">
//           Дополнительные данные
//         </h2>

//         {/* Participants Counter */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between mb-2">
//             <span className="font-medium text-gray-900">
//               Количество участников
//             </span>
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={() => setParticipants(Math.max(1, participants - 1))}
//                 className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-400"
//               >
//                 -
//               </button>
//               <span className="text-xl font-bold text-orange-500">
//                 {participants}/{masterclass.participant_limit}
//               </span>
//               <button
//                 onClick={() =>
//                   setParticipants(
//                     Math.min(
//                       selectedTime
//                         ? selectedTime.free_places
//                         : masterclass.participant_limit,
//                       participants + 1
//                     )
//                   )
//                 }
//                 className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600"
//               >
//                 +
//               </button>
//             </div>
//           </div>
//           {selectedTime && (
//             <p className="text-xs text-gray-600">
//               Доступно мест в выбранное время: {selectedTime.free_places}
//             </p>
//           )}
//         </div>

//         {/* Master Class Description */}
//         <div className="mb-6">
//           <h3 className="font-semibold text-gray-900 mb-3">
//             {masterclass.title}
//           </h3>
//           <p className="text-gray-700 text-sm leading-relaxed mb-3">
//             {masterclass.description}
//           </p>
//           <div className="text-lg font-bold text-green-600">
//             {parseFloat(masterclass.price).toLocaleString("ru-RU")} ₽
//           </div>
//         </div>

//         {/* Privacy Notice */}
//         <div className="mb-6">
//           <p className="text-xs text-gray-600 mb-2">
//             Нажимая кнопку "Записаться", вы автоматически соглашаетесь с{" "}
//             <a href="#" className="text-blue-500 underline">
//               обработкой ваших персональных данных
//             </a>
//           </p>
//         </div>

//         {/* Register Button */}
//         {enrollmentSuccess ? (
//           <div className="w-full bg-green-500 text-white py-3 rounded-full font-medium text-lg text-center">
//             ✓ Запись успешно оформлена!
//           </div>
//         ) : (
//           <button
//             onClick={handleEnrollment}
//             disabled={
//               !selectedDate ||
//               !selectedTime ||
//               participants > (selectedTime?.free_places || 0) ||
//               enrolling
//             }
//             className="w-full bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-full font-medium text-lg shadow-lg transition-colors"
//           >
//             {enrolling ? "Записываем..." : "Записаться"}
//           </button>
//         )}
//         {enrollmentError && (
//           <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//             Ошибка записи: {enrollmentError}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookingPage;

"use client";
import React, { useState, useEffect } from "react";

const BookingPage = ({ masterclassId }) => {
  const [masterclass, setMasterclass] = useState(null);
  const [masterclasses, setMasterclasses] = useState([]);
  const [selectedMasterclassId, setSelectedMasterclassId] =
    useState(masterclassId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [participants, setParticipants] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState(null);

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

  // Authenticated request helper
  const makeAuthenticatedRequest = async (url, options = {}) => {
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

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
    }

    return response;
  };

  // Fetch masterclasses list
  const fetchMasterclasses = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/`,
        { method: "GET" }
      );

      if (response.ok) {
        const data = await response.json();
        setMasterclasses(data.results || data || []);
      } else {
        throw new Error(`Failed to fetch masterclasses: ${response.status}`);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching masterclasses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific masterclass data
  const fetchMasterclass = async (id) => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/${id}/`,
        { method: "GET" }
      );

      if (response.ok) {
        const data = await response.json();
        setMasterclass(data);
        setAvailableSlots(data.slots || []);
        setParticipants(1);
      } else {
        throw new Error(`Failed to fetch masterclass: ${response.status}`);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching masterclass:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (selectedMasterclassId) {
      fetchMasterclass(selectedMasterclassId);
    } else {
      fetchMasterclasses();
    }
  }, [selectedMasterclassId]);

  // Handle masterclass selection
  const handleMasterclassSelect = (id) => {
    setSelectedMasterclassId(id);
    setSelectedDate(null);
    setSelectedTime(null);
    setEnrollmentSuccess(false);
    setEnrollmentError(null);
  };

  // Go back to masterclasses list
  const handleBackToList = () => {
    setSelectedMasterclassId(null);
    setMasterclass(null);
    setAvailableSlots([]);
    setSelectedDate(null);
    setSelectedTime(null);
    setEnrollmentSuccess(false);
    setEnrollmentError(null);
    fetchMasterclasses();
  };

  const handleEnrollment = async () => {
    if (!selectedTime || !participants) return;

    try {
      setEnrolling(true);
      setEnrollmentError(null);

      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/enroll/`,
        {
          method: "POST",
          body: JSON.stringify({
            slot: selectedTime.id,
            quantity: participants,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEnrollmentSuccess(true);
        console.log("Enrollment successful:", data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Enrollment failed:", response.status, errorData);
        throw new Error(
          errorData.detail ||
            errorData.message ||
            `Ошибка записи: ${response.status}`
        );
      }
    } catch (err) {
      setEnrollmentError(err.message);
      console.error("Error enrolling:", err);
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
      "p-2 text-sm font-medium cursor-pointer rounded-full w-8 h-8 flex items-center justify-center";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Ошибка: {error}</div>
      </div>
    );
  }

  // Show masterclasses list if no specific masterclass is selected
  if (!selectedMasterclassId) {
    return (
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Выберите мастер-класс
        </h1>

        {masterclasses.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <p className="text-lg">Нет доступных мастер-классов</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium"
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

      <div className="flex gap-8">
        {/* Left Side - Calendar and Time */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Выбрать дату
          </h1>

          {/* Calendar */}
          <div className="mb-8">
            <div className="border-2 border-blue-300 rounded-2xl p-6 bg-white">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
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
                <h2 className="text-lg font-semibold text-gray-900">
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
              <div className="grid grid-cols-7 gap-2 text-center">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Доступное время:
            </h3>
            {selectedDate ? (
              availableTimeSlots.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedTime(slot)}
                      className={`px-4 py-2 rounded-lg font-medium ${
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
        <div className="w-80">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
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
                  className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-400"
                >
                  -
                </button>
                <span className="text-xl font-bold text-orange-500">
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
                  className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600"
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
            <h3 className="font-semibold text-gray-900 mb-3">
              {masterclass.title}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {masterclass.description}
            </p>
            <div className="text-lg font-bold text-green-600">
              {parseFloat(masterclass.price).toLocaleString("ru-RU")} ₽
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mb-6">
            <p className="text-xs text-gray-600 mb-2">
              Нажимая кнопку "Записаться", вы автоматически соглашаетесь с{" "}
              <a href="#" className="text-blue-500 underline">
                обработкой ваших персональных данных
              </a>
            </p>
          </div>

          {/* Register Button */}
          {enrollmentSuccess ? (
            <div className="w-full bg-green-500 text-white py-3 rounded-full font-medium text-lg text-center">
              ✓ Запись успешно оформлена!
            </div>
          ) : (
            <button
              onClick={handleEnrollment}
              disabled={
                !selectedDate ||
                !selectedTime ||
                participants > (selectedTime?.free_places || 0) ||
                enrolling
              }
              className="w-full bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-full font-medium text-lg shadow-lg transition-colors"
            >
              {enrolling ? "Записываем..." : "Записаться"}
            </button>
          )}
          {enrollmentError && (
            <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Ошибка записи: {enrollmentError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
