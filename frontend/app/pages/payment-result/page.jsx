// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { usePayment } from "@/app/context/PaymentContext";

// const PaymentResultPage = () => {
//   const router = useRouter();
//   const {
//     currentEnrollment,
//     paymentStatus,
//     isTrackingPayment,
//     paymentError,
//     startPaymentTracking,
//     clearPaymentState,
//     canRetryPayment,
//     resetPaymentForRetry,
//     createPayment,
//   } = usePayment();

//   const [masterclassData, setMasterclassData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [retrying, setRetrying] = useState(false);

//   // Получаем данные мастер-класса для отображения
//   const fetchMasterclassData = async (enrollmentId) => {
//     try {
//       const token = localStorage.getItem("access_token");
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/enrollments/`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         // Находим конкретную запись по enrollmentId
//         const enrollment = data.find(
//           (item) => item.id === parseInt(enrollmentId)
//         );
//         if (enrollment) {
//           // Преобразуем структуру данных для совместимости с существующим кодом
//           const transformedData = {
//             masterclass: enrollment.masterclass,
//             slot: enrollment.slot,
//             quantity: enrollment.quantity,
//             amount: enrollment.masterclass.price,
//             user_id: null, // Этого поля нет в ответе API
//             status: enrollment.status,
//           };
//           setMasterclassData(transformedData);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching masterclass data:", error);
//     }
//   };

//   useEffect(() => {
//     // Проверяем, есть ли данные о текущем платеже
//     if (currentEnrollment?.enrollmentId) {
//       fetchMasterclassData(currentEnrollment.enrollmentId);

//       // Если статус еще не определен, начинаем отслеживание
//       if (!paymentStatus && !isTrackingPayment) {
//         startPaymentTracking(currentEnrollment.enrollmentId);
//       }
//     } else {
//       // Проверяем localStorage на случай перезагрузки страницы
//       const storedEnrollment = localStorage.getItem("current_enrollment");
//       if (storedEnrollment) {
//         try {
//           const enrollmentData = JSON.parse(storedEnrollment);
//           if (enrollmentData.enrollmentId) {
//             fetchMasterclassData(enrollmentData.enrollmentId);
//             startPaymentTracking(enrollmentData.enrollmentId);
//           }
//         } catch (error) {
//           console.error("Error parsing stored enrollment:", error);
//         }
//       }
//     }

//     setLoading(false);
//   }, [
//     currentEnrollment,
//     paymentStatus,
//     isTrackingPayment,
//     startPaymentTracking,
//   ]);

//   const handleRetryPayment = async () => {
//     if (!masterclassData) return;

//     try {
//       setRetrying(true);
//       resetPaymentForRetry();

//       const paymentData = {
//         masterclass_id: masterclassData.masterclass.id,
//         slot_id: masterclassData.slot.id,
//         quantity: masterclassData.quantity,
//         amount: masterclassData.amount,
//         user_id: masterclassData.user_id,
//       };

//       const result = await createPayment(paymentData);

//       if (result.success) {
//         window.location.href = result.confirmationUrl;
//       }
//     } catch (error) {
//       console.error("Error retrying payment:", error);
//     } finally {
//       setRetrying(false);
//     }
//   };

//   const handleBackToBooking = () => {
//     clearPaymentState();
//     router.push("/user-account");
//   };

//   const handleGoToProfile = () => {
//     clearPaymentState();
//     router.push("/user-account");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Загрузка...</p>
//         </div>
//       </div>
//     );
//   }

//   // Если нет данных о платеже, перенаправляем на страницу бронирования
//   if (!currentEnrollment && !localStorage.getItem("current_enrollment")) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-6">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">
//             Платеж не найден
//           </h1>
//           <p className="text-gray-600 mb-6">
//             Данные о платеже не найдены. Возможно, сессия истекла.
//           </p>
//           <button
//             onClick={handleBackToBooking}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
//           >
//             Вернуться к бронированию
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-2xl mx-auto px-4">
//         <div className="bg-white rounded-lg shadow-lg p-8">
//           {/* Статус платежа */}
//           {paymentStatus === "paid" && (
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-8 h-8 text-green-500"
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
//               </div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Оплата прошла успешно!
//               </h1>
//               <p className="text-gray-600">
//                 Вы успешно записаны на мастер-класс
//               </p>
//             </div>
//           )}

//           {paymentStatus === "pending" && isTrackingPayment && (
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
//               </div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Обработка платежа...
//               </h1>
//               <p className="text-gray-600">
//                 Ожидаем подтверждение оплаты. Не закрывайте страницу.
//               </p>
//             </div>
//           )}

//           {paymentStatus === "cancelled" && (
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-8 h-8 text-red-500"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Платеж отменен
//               </h1>
//               <p className="text-gray-600">
//                 Оплата была отменена или отклонена
//               </p>
//             </div>
//           )}

//           {paymentError && (
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-8 h-8 text-red-500"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
//                   />
//                 </svg>
//               </div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Произошла ошибка
//               </h1>
//               <p className="text-gray-600">{paymentError}</p>
//             </div>
//           )}

//           {/* Информация о мастер-классе */}
//           {masterclassData && (
//             <div className="border-t border-gray-200 pt-6 mb-8">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                 Детали записи
//               </h2>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Мастер-класс:</span>
//                   <span className="font-medium">
//                     {masterclassData.masterclass?.title}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Дата и время:</span>
//                   <span className="font-medium">
//                     {new Date(masterclassData.slot?.start).toLocaleString(
//                       "ru-RU"
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Количество участников:</span>
//                   <span className="font-medium">
//                     {masterclassData.quantity}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Сумма:</span>
//                   <span className="font-medium text-lg">
//                     {parseFloat(masterclassData.amount).toLocaleString("ru-RU")}{" "}
//                     ₽
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Действия */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             {paymentStatus === "paid" && (
//               <>
//                 <button
//                   onClick={handleGoToProfile}
//                   className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
//                 >
//                   Мои записи
//                 </button>
//                 <button
//                   onClick={handleBackToBooking}
//                   className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
//                 >
//                   Записаться еще
//                 </button>
//               </>
//             )}

//             {(paymentStatus === "cancelled" || paymentError) &&
//               canRetryPayment && (
//                 <>
//                   <button
//                     onClick={handleRetryPayment}
//                     disabled={retrying}
//                     className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
//                   >
//                     {retrying ? "Повторяем..." : "Попробовать снова"}
//                   </button>
//                   <button
//                     onClick={handleBackToBooking}
//                     className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
//                   >
//                     Выбрать другой мастер-класс
//                   </button>
//                 </>
//               )}

//             {paymentStatus === "pending" && (
//               <button
//                 onClick={handleBackToBooking}
//                 className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
//               >
//                 Вернуться к бронированию
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentResultPage;

// pages/payment-result.jsx
// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { usePayment } from "@/app/context/PaymentContext";
// import { useAuth } from "@/app/context/AuthContext";

// const PaymentResultPage = () => {
//   const router = useRouter();
//   const {
//     currentEnrollment,
//     paymentStatus,
//     isTrackingPayment,
//     paymentError,
//     startPaymentTracking,
//     clearPaymentState,
//     canRetryPayment,
//     resetPaymentForRetry,
//     setCurrentEnrollment,
//     createPayment,
//   } = usePayment();
//   const { user, loading: authLoading } = useAuth();
//   const [masterclassData, setMasterclassData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [retrying, setRetrying] = useState(false);

//   // Fetch masterclass data for display
//   const fetchMasterclassData = async (enrollmentId) => {
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         console.error("No access token for fetching masterclass data");
//         return;
//       }
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/enrollments/`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         const enrollment = data.find(
//           (item) => item.id === parseInt(enrollmentId)
//         );
//         if (enrollment) {
//           const transformedData = {
//             masterclass: enrollment.masterclass,
//             slot: enrollment.slot,
//             quantity: enrollment.quantity,
//             amount: enrollment.masterclass.price,
//             user_id: null,
//             status: enrollment.status,
//           };
//           setMasterclassData(transformedData);
//         } else {
//           console.error("Enrollment not found in API response");
//         }
//       } else {
//         console.error("Failed to fetch masterclass data:", response.status);
//       }
//     } catch (error) {
//       console.error("Error fetching masterclass data:", error);
//     }
//   };

//   useEffect(() => {
//     console.log("PaymentResult useEffect:", {
//       currentEnrollment,
//       paymentStatus,
//       isTrackingPayment,
//       authLoading,
//       user,
//     });
//     if (authLoading) {
//       return; // Wait for auth to complete
//     }

//     if (!user) {
//       console.error("User not authenticated, redirecting to sign-in");
//       router.push("/auth/sign-in");
//       return;
//     }

//     if (currentEnrollment?.enrollmentId) {
//       fetchMasterclassData(currentEnrollment.enrollmentId);
//       if (!paymentStatus && !isTrackingPayment) {
//         console.log(
//           "Starting payment tracking for enrollment:",
//           currentEnrollment.enrollmentId
//         );
//         startPaymentTracking(currentEnrollment.enrollmentId);
//       }
//     } else {
//       const storedEnrollment = localStorage.getItem("current_enrollment");
//       if (storedEnrollment) {
//         try {
//           const enrollmentData = JSON.parse(storedEnrollment);
//           if (enrollmentData.enrollmentId) {
//             console.log(
//               "Starting payment tracking for stored enrollment:",
//               enrollmentData.enrollmentId
//             );
//             setCurrentEnrollment(enrollmentData);
//             fetchMasterclassData(enrollmentData.enrollmentId);
//             startPaymentTracking(enrollmentData.enrollmentId);
//           }
//         } catch (error) {
//           console.error("Error parsing stored enrollment:", error);
//           localStorage.removeItem("current_enrollment");
//         }
//       } else {
//         console.error("No enrollment data found");
//       }
//     }

//     setLoading(false);
//   }, [
//     currentEnrollment,
//     paymentStatus,
//     isTrackingPayment,
//     startPaymentTracking,
//     setCurrentEnrollment,
//     authLoading,
//     user,
//     router,
//   ]);

//   const handleRetryPayment = async () => {
//     if (!masterclassData) return;

//     try {
//       setRetrying(true);
//       resetPaymentForRetry();

//       const paymentData = {
//         masterclass_id: masterclassData.masterclass.id,
//         slot_id: masterclassData.slot.id,
//         quantity: masterclassData.quantity,
//         amount: masterclassData.amount,
//         user_id: masterclassData.user_id,
//       };

//       const result = await createPayment(paymentData);
//       if (result.success) {
//         window.location.href = result.confirmationUrl;
//       }
//     } catch (error) {
//       console.error("Error retrying payment:", error);
//     } finally {
//       setRetrying(false);
//     }
//   };

//   const handleBackToBooking = () => {
//     clearPaymentState();
//     router.push("/user-account");
//   };

//   const handleGoToProfile = () => {
//     clearPaymentState();
//     router.push("/user-account");
//   };

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Загрузка...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!currentEnrollment && !localStorage.getItem("current_enrollment")) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-6">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">
//             Платеж не найден
//           </h1>
//           <p className="text-gray-600 mb-6">
//             Данные о платеже не найдены. Возможно, сессия истекла.
//           </p>
//           <button
//             onClick={handleBackToBooking}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
//           >
//             Вернуться к бронированию
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-2xl mx-auto px-4">
//         <div className="bg-white rounded-lg shadow-lg p-8">
//           {paymentError && (
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-8 h-8 text-red-500"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
//                   />
//                 </svg>
//               </div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Произошла ошибка
//               </h1>
//               <p className="text-gray-600">{paymentError}</p>
//             </div>
//           )}

//           {paymentStatus === "paid" && (
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-8 h-8 text-green-500"
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
//               </div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Оплата прошла успешно!
//               </h1>
//               <p className="text-gray-600">
//                 Вы успешно записаны на мастер-класс
//               </p>
//             </div>
//           )}

//           {paymentStatus === "pending" && isTrackingPayment && (
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
//               </div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Обработка платежа...
//               </h1>
//               <p className="text-gray-600">
//                 Ожидаем подтверждение оплаты. Не закрывайте страницу.
//               </p>
//             </div>
//           )}

//           {paymentStatus === "cancelled" && (
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-8 h-8 text-red-500"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Платеж отменен
//               </h1>
//               <p className="text-gray-600">
//                 Оплата была отменена или отклонена
//               </p>
//             </div>
//           )}

//           {masterclassData && (
//             <div className="border-t border-gray-200 pt-6 mb-8">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                 Детали записи
//               </h2>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Мастер-класс:</span>
//                   <span className="font-medium">
//                     {masterclassData.masterclass?.title}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Дата и время:</span>
//                   <span className="font-medium">
//                     {new Date(masterclassData.slot?.start).toLocaleString(
//                       "ru-RU"
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Количество участников:</span>
//                   <span className="font-medium">
//                     {masterclassData.quantity}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Сумма:</span>
//                   <span className="font-medium text-lg">
//                     {parseFloat(masterclassData.amount).toLocaleString("ru-RU")}{" "}
//                     ₽
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             {paymentStatus === "paid" && (
//               <>
//                 <button
//                   onClick={handleGoToProfile}
//                   className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
//                 >
//                   Мои записи
//                 </button>
//                 <button
//                   onClick={handleBackToBooking}
//                   className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
//                 >
//                   Записаться еще
//                 </button>
//               </>
//             )}

//             {(paymentStatus === "cancelled" || paymentError) &&
//               canRetryPayment && (
//                 <>
//                   <button
//                     onClick={handleRetryPayment}
//                     disabled={retrying}
//                     className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
//                   >
//                     {retrying ? "Повторяем..." : "Попробовать снова"}
//                   </button>
//                   <button
//                     onClick={handleBackToBooking}
//                     className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
//                   >
//                     Выбрать другой мастер-класс
//                   </button>
//                 </>
//               )}

//             {paymentStatus === "pending" && (
//               <button
//                 onClick={handleBackToBooking}
//                 className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
//               >
//                 Вернуться к бронированию
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentResultPage;
"use client";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@/app/context/NavigationContext";
import { usePayment } from "@/app/context/PaymentContext";

const ResultPaymentStatus = () => {
  const {
    currentEnrollment,
    paymentStatus,
    isTrackingPayment,
    paymentError,
    canRetryPayment,
    resetPaymentForRetry,
    clearPaymentState,
    startPaymentTracking,
  } = usePayment();

  const { setCurrentPage, setSelectedMasterclassId } = useNavigation();

  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Enhanced authenticated request helper
  const makeAuthenticatedRequest = async (url, options = {}) => {
    try {
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

  // Fetch enrollment details
  const fetchEnrollmentDetails = async (enrollmentId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/enrollments/${enrollmentId}/`
      );

      const data = await response.json();
      setEnrollmentDetails(data);
    } catch (err) {
      console.error("Error fetching enrollment details:", err);
      setError(`Ошибка загрузки данных: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get enrollment ID from URL parameters or context
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const enrollmentIdFromUrl = urlParams.get("enrollment_id");

    let enrollmentId = null;

    if (enrollmentIdFromUrl) {
      enrollmentId = enrollmentIdFromUrl;
    } else if (currentEnrollment?.enrollmentId) {
      enrollmentId = currentEnrollment.enrollmentId;
    }

    if (enrollmentId) {
      fetchEnrollmentDetails(enrollmentId);
      // Start tracking if not already tracking
      if (!isTrackingPayment && !paymentStatus) {
        startPaymentTracking(enrollmentId);
      }
    } else {
      setLoading(false);
      setError("Идентификатор записи не найден");
    }
  }, []);

  // Handle navigation actions
  const handleBackToBooking = () => {
    if (enrollmentDetails?.masterclass?.id) {
      setSelectedMasterclassId(enrollmentDetails.masterclass.id);
    }
    setCurrentPage("booking");
  };

  const handleBackToMasterclasses = () => {
    clearPaymentState();
    setCurrentPage("masterclasses");
  };

  const handleRetryPayment = () => {
    resetPaymentForRetry();
    handleBackToBooking();
  };

  // Format date and time
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // Get status display info
  const getStatusInfo = (status) => {
    switch (status) {
      case "paid":
        return {
          icon: "✅",
          title: "Оплата успешна!",
          message: "Ваша запись на мастер-класс подтверждена",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
          titleColor: "text-green-900",
        };
      case "pending":
        return {
          icon: "⏳",
          title: "Ожидание оплаты",
          message: "Платеж обрабатывается. Это может занять несколько минут.",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-800",
          titleColor: "text-yellow-900",
        };
      case "cancelled":
        return {
          icon: "❌",
          title: "Оплата отменена",
          message: "Платеж был отменен. Вы можете попробовать оплатить снова.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          titleColor: "text-red-900",
        };
      case "failed":
        return {
          icon: "❌",
          title: "Ошибка оплаты",
          message: "Произошла ошибка при обработке платежа. Попробуйте снова.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          titleColor: "text-red-900",
        };
      default:
        return {
          icon: "⏳",
          title: "Проверяем статус платежа",
          message: "Пожалуйста, подождите...",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
          titleColor: "text-blue-900",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Загрузка данных о платеже...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ошибка</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackToMasterclasses}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Вернуться к мастер-классам
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(paymentStatus);
  const dateTime = enrollmentDetails?.slot?.start
    ? formatDateTime(enrollmentDetails.slot.start)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Status Card */}
        <div
          className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2 rounded-2xl p-8 mb-6`}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">{statusInfo.icon}</div>
            <h1 className={`text-3xl font-bold ${statusInfo.titleColor} mb-4`}>
              {statusInfo.title}
            </h1>
            <p className={`text-lg ${statusInfo.textColor} mb-6`}>
              {statusInfo.message}
            </p>

            {isTrackingPayment && (
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-600">
                  Отслеживаем статус платежа...
                </span>
              </div>
            )}

            {paymentError && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">{paymentError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Enrollment Details */}
        {enrollmentDetails && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Детали записи
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Мастер-класс:</span>
                <span className="font-medium text-gray-900 text-right max-w-xs">
                  {enrollmentDetails.masterclass?.title}
                </span>
              </div>

              {dateTime && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Дата:</span>
                    <span className="font-medium text-gray-900">
                      {dateTime.date}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Время:</span>
                    <span className="font-medium text-gray-900">
                      {dateTime.time}
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Участников:</span>
                <span className="font-medium text-gray-900">
                  {enrollmentDetails.quantity || 1}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Сумма:</span>
                <span className="font-bold text-green-600 text-lg">
                  {parseFloat(
                    enrollmentDetails.total_amount || 0
                  ).toLocaleString("ru-RU")}{" "}
                  ₽
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">ID записи:</span>
                <span className="font-mono text-sm text-gray-700">
                  #{enrollmentDetails.id}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {paymentStatus === "paid" && (
            <button
              onClick={handleBackToMasterclasses}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Перейти к моим записям
            </button>
          )}

          {(paymentStatus === "cancelled" || paymentStatus === "failed") &&
            canRetryPayment && (
              <button
                onClick={handleRetryPayment}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Попробовать оплатить снова
              </button>
            )}

          <button
            onClick={handleBackToBooking}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Вернуться к бронированию
          </button>

          <button
            onClick={handleBackToMasterclasses}
            className="w-full bg-white hover:bg-gray-50 text-gray-600 py-3 px-4 rounded-lg font-medium border border-gray-300 transition-colors"
          >
            Все мастер-классы
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Если у вас есть вопросы по оплате, свяжитесь с нашей службой
            поддержки
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultPaymentStatus;
