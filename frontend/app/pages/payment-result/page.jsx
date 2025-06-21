// "use client";
// import React, { useState, useEffect } from "react";
// import { useNavigation } from "@/app/context/NavigationContext";
// import { usePayment } from "@/app/context/PaymentContext";

// const ResultPaymentStatus = () => {
//   const {
//     currentEnrollment,
//     paymentStatus,
//     isTrackingPayment,
//     paymentError,
//     canRetryPayment,
//     resetPaymentForRetry,
//     clearPaymentState,
//     startPaymentTracking,
//   } = usePayment();

//   const { setCurrentPage, setSelectedMasterclassId } = useNavigation();

//   const [enrollmentDetails, setEnrollmentDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

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

//   // Enhanced authenticated request helper
//   const makeAuthenticatedRequest = async (url, options = {}) => {
//     try {
//       const accessToken = localStorage.getItem("access_token");
//       const csrfToken = getCsrfTokenFromCookie();

//       const headers = {
//         Accept: "application/json",
//         ...options.headers,
//       };

//       if (!options.body || !(options.body instanceof FormData)) {
//         headers["Content-Type"] = "application/json";
//       }

//       if (accessToken) {
//         headers["Authorization"] = `Bearer ${accessToken}`;
//       }

//       if (csrfToken) {
//         headers["X-CSRFTOKEN"] = csrfToken;
//       }

//       const response = await fetch(url, {
//         ...options,
//         headers,
//         credentials: "include",
//       });

//       if (response.status === 401) {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
//       }

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message || `HTTP ${response.status}: ${response.statusText}`
//         );
//       }

//       return response;
//     } catch (error) {
//       console.error("Request failed:", error);
//       throw error;
//     }
//   };

//   // Fetch enrollment details
//   const fetchEnrollmentDetails = async (enrollmentId) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/enrollments/${enrollmentId}/`
//       );

//       const data = await response.json();
//       setEnrollmentDetails(data);
//     } catch (err) {
//       console.error("Error fetching enrollment details:", err);
//       setError(`Ошибка загрузки данных: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get enrollment ID from URL parameters or context
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const enrollmentIdFromUrl = urlParams.get("enrollment_id");

//     let enrollmentId = null;

//     if (enrollmentIdFromUrl) {
//       enrollmentId = enrollmentIdFromUrl;
//     } else if (currentEnrollment?.enrollmentId) {
//       enrollmentId = currentEnrollment.enrollmentId;
//     }

//     if (enrollmentId) {
//       fetchEnrollmentDetails(enrollmentId);
//       // Start tracking if not already tracking
//       if (!isTrackingPayment && !paymentStatus) {
//         startPaymentTracking(enrollmentId);
//       }
//     } else {
//       setLoading(false);
//       setError("Идентификатор записи не найден");
//     }
//   }, []);

//   // Handle navigation actions
//   const handleBackToBooking = () => {
//     if (enrollmentDetails?.masterclass?.id) {
//       setSelectedMasterclassId(enrollmentDetails.masterclass.id);
//     }
//     setCurrentPage("booking");
//   };

//   const handleBackToMasterclasses = () => {
//     clearPaymentState();
//     setCurrentPage("masterclasses");
//   };

//   const handleRetryPayment = () => {
//     resetPaymentForRetry();
//     handleBackToBooking();
//   };

//   // Format date and time
//   const formatDateTime = (isoString) => {
//     const date = new Date(isoString);
//     return {
//       date: date.toLocaleDateString("ru-RU", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       }),
//       time: date.toLocaleTimeString("ru-RU", {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };
//   };

//   // Get status display info
//   const getStatusInfo = (status) => {
//     switch (status) {
//       case "paid":
//         return {
//           icon: "✅",
//           title: "Оплата успешна!",
//           message: "Ваша запись на мастер-класс подтверждена",
//           bgColor: "bg-green-50",
//           borderColor: "border-green-200",
//           textColor: "text-green-800",
//           titleColor: "text-green-900",
//         };
//       case "pending":
//         return {
//           icon: "⏳",
//           title: "Ожидание оплаты",
//           message: "Платеж обрабатывается. Это может занять несколько минут.",
//           bgColor: "bg-yellow-50",
//           borderColor: "border-yellow-200",
//           textColor: "text-yellow-800",
//           titleColor: "text-yellow-900",
//         };
//       case "cancelled":
//         return {
//           icon: "❌",
//           title: "Оплата отменена",
//           message: "Платеж был отменен. Вы можете попробовать оплатить снова.",
//           bgColor: "bg-red-50",
//           borderColor: "border-red-200",
//           textColor: "text-red-800",
//           titleColor: "text-red-900",
//         };
//       case "failed":
//         return {
//           icon: "❌",
//           title: "Ошибка оплаты",
//           message: "Произошла ошибка при обработке платежа. Попробуйте снова.",
//           bgColor: "bg-red-50",
//           borderColor: "border-red-200",
//           textColor: "text-red-800",
//           titleColor: "text-red-900",
//         };
//       default:
//         return {
//           icon: "⏳",
//           title: "Проверяем статус платежа",
//           message: "Пожалуйста, подождите...",
//           bgColor: "bg-blue-50",
//           borderColor: "border-blue-200",
//           textColor: "text-blue-800",
//           titleColor: "text-blue-900",
//         };
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-lg text-gray-600">Загрузка данных о платеже...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//         <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
//           <div className="text-6xl mb-4">❌</div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Ошибка</h1>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={handleBackToMasterclasses}
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
//           >
//             Вернуться к мастер-классам
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const statusInfo = getStatusInfo(paymentStatus);
//   const dateTime = enrollmentDetails?.slot?.start
//     ? formatDateTime(enrollmentDetails.slot.start)
//     : null;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-2xl mx-auto">
//         {/* Status Card */}
//         <div
//           className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2 rounded-2xl p-8 mb-6`}
//         >
//           <div className="text-center">
//             <div className="text-6xl mb-4">{statusInfo.icon}</div>
//             <h1 className={`text-3xl font-bold ${statusInfo.titleColor} mb-4`}>
//               {statusInfo.title}
//             </h1>
//             <p className={`text-lg ${statusInfo.textColor} mb-6`}>
//               {statusInfo.message}
//             </p>

//             {isTrackingPayment && (
//               <div className="flex items-center justify-center space-x-2 mb-4">
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
//                 <span className="text-sm text-gray-600">
//                   Отслеживаем статус платежа...
//                 </span>
//               </div>
//             )}

//             {paymentError && (
//               <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
//                 <p className="text-sm">{paymentError}</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Enrollment Details */}
//         {enrollmentDetails && (
//           <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">
//               Детали записи
//             </h2>

//             <div className="space-y-4">
//               <div className="flex justify-between items-start">
//                 <span className="text-gray-600">Мастер-класс:</span>
//                 <span className="font-medium text-gray-900 text-right max-w-xs">
//                   {enrollmentDetails.masterclass?.title}
//                 </span>
//               </div>

//               {dateTime && (
//                 <>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Дата:</span>
//                     <span className="font-medium text-gray-900">
//                       {dateTime.date}
//                     </span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Время:</span>
//                     <span className="font-medium text-gray-900">
//                       {dateTime.time}
//                     </span>
//                   </div>
//                 </>
//               )}

//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Участников:</span>
//                 <span className="font-medium text-gray-900">
//                   {enrollmentDetails.quantity || 1}
//                 </span>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Сумма:</span>
//                 <span className="font-bold text-green-600 text-lg">
//                   {parseFloat(
//                     enrollmentDetails.total_amount || 0
//                   ).toLocaleString("ru-RU")}{" "}
//                   ₽
//                 </span>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">ID записи:</span>
//                 <span className="font-mono text-sm text-gray-700">
//                   #{enrollmentDetails.id}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="space-y-3">
//           {paymentStatus === "paid" && (
//             <button
//               onClick={handleBackToMasterclasses}
//               className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
//             >
//               Перейти к моим записям
//             </button>
//           )}

//           {(paymentStatus === "cancelled" || paymentStatus === "failed") &&
//             canRetryPayment && (
//               <button
//                 onClick={handleRetryPayment}
//                 className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
//               >
//                 Попробовать оплатить снова
//               </button>
//             )}

//           <button
//             onClick={handleBackToBooking}
//             className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
//           >
//             Вернуться к бронированию
//           </button>

//           <button
//             onClick={handleBackToMasterclasses}
//             className="w-full bg-white hover:bg-gray-50 text-gray-600 py-3 px-4 rounded-lg font-medium border border-gray-300 transition-colors"
//           >
//             Все мастер-классы
//           </button>
//         </div>

//         {/* Additional Info */}
//         <div className="mt-8 text-center text-sm text-gray-500">
//           <p>
//             Если у вас есть вопросы по оплате, свяжитесь с нашей службой
//             поддержки
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultPaymentStatus;
