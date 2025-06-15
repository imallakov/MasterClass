// "use client";
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";

// const PaymentContext = createContext();

// export const usePayment = () => {
//   const context = useContext(PaymentContext);
//   if (!context) {
//     throw new Error("usePayment must be used within a PaymentProvider");
//   }
//   return context;
// };

// export const PaymentProvider = ({ children }) => {
//   // Payment state
//   const [currentEnrollment, setCurrentEnrollment] = useState(null);
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const [isTrackingPayment, setIsTrackingPayment] = useState(false);
//   const [paymentError, setPaymentError] = useState(null);
//   const [eventSource, setEventSource] = useState(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [paymentUrl, setPaymentUrl] = useState(null);

//   // Helper function to get auth token
//   const getAuthToken = () => {
//     return localStorage.getItem("access_token");
//   };

//   // Helper function to get CSRF token
//   const getCsrfToken = () => {
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

//   // Make authenticated request
//   const makeAuthenticatedRequest = async (url, options = {}) => {
//     const token = getAuthToken();
//     const csrfToken = getCsrfToken();

//     const headers = {
//       Accept: "application/json",
//       ...options.headers,
//     };

//     if (!options.body || !(options.body instanceof FormData)) {
//       headers["Content-Type"] = "application/json";
//     }

//     if (token) {
//       headers["Authorization"] = `Bearer ${token}`;
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

//   // Start tracking payment status via SSE
//   const startPaymentTracking = useCallback(
//     async (enrollmentId) => {
//       if (isTrackingPayment || !enrollmentId) return;

//       try {
//         setIsTrackingPayment(true);
//         setPaymentError(null);

//         const token = getAuthToken();
//         if (!token) {
//           throw new Error("Необходима авторизация");
//         }

//         // Create SSE connection with auth token
//         const sseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/payments/status/${enrollmentId}/`;
//         const es = new EventSource(sseUrl);

//         es.onmessage = (event) => {
//           try {
//             const data = JSON.parse(event.data);
//             console.log("Payment status update:", data);

//             setPaymentStatus(data.status);

//             // Close connection when payment is final
//             if (data.status === "paid" || data.status === "cancelled") {
//               setIsTrackingPayment(false);
//               es.close();

//               // Clear enrollment data if payment is successful
//               if (data.status === "paid") {
//                 // Keep enrollment data for success display, but clear retry capability
//                 setCurrentEnrollment((prev) =>
//                   prev ? { ...prev, canRetry: false } : null
//                 );
//               } else if (data.status === "cancelled") {
//                 // Allow retry for cancelled payments
//                 setCurrentEnrollment((prev) =>
//                   prev ? { ...prev, canRetry: true } : null
//                 );
//               }
//             }
//           } catch (err) {
//             console.error("Error parsing SSE data:", err);
//           }
//         };

//         es.onerror = (error) => {
//           console.error("SSE error:", error);
//           setPaymentError("Ошибка получения статуса платежа");
//           setIsTrackingPayment(false);
//           es.close();
//         };

//         setEventSource(es);

//         // Cleanup function
//         return () => {
//           es.close();
//           setIsTrackingPayment(false);
//         };
//       } catch (error) {
//         console.error("Error starting payment tracking:", error);
//         setPaymentError(error.message);
//         setIsTrackingPayment(false);
//       }
//     },
//     [isTrackingPayment]
//   );

//   // Create payment
//   const createPayment = async (paymentData) => {
//     try {
//       setPaymentError(null);

//       // Prepare request data
//       const requestData = {
//         user_id: paymentData.user_id,
//         masterclass_id: paymentData.masterclass_id,
//         slot_id: paymentData.slot_id,
//         quantity: paymentData.quantity,
//         amount: parseFloat(paymentData.amount),
//         return_url: "/pages/payment-result",
//       };

//       // Add idempotency key for retry attempts
//       if (currentEnrollment?.idempotencyKey && currentEnrollment?.canRetry) {
//         requestData.idempotency_key = currentEnrollment.idempotencyKey;
//         console.log(
//           "Using existing idempotency key for retry:",
//           requestData.idempotency_key
//         );
//       }

//       console.log("Creating payment with data:", requestData);

//       const response = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/payments/create/`,
//         {
//           method: "POST",
//           body: JSON.stringify(requestData),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.detail || errorData.error || `HTTP ${response.status}`
//         );
//       }

//       const data = await response.json();
//       console.log("Payment created:", data);

//       // Store enrollment data
//       const enrollmentData = {
//         enrollmentId: data.enrollment_id,
//         idempotencyKey: data.idempotency_key,
//         canRetry: false, // Will be set to true if payment fails
//       };

//       setCurrentEnrollment(enrollmentData);
//       setPaymentStatus(data.status);

//       // Store in localStorage for persistence across page reloads
//       localStorage.setItem(
//         "current_enrollment",
//         JSON.stringify(enrollmentData)
//       );

//       // Start tracking payment status
//       if (data.enrollment_id) {
//         startPaymentTracking(data.enrollment_id);
//       }

//       return {
//         success: true,
//         confirmationUrl: data.confirmation_url,
//         enrollmentId: data.enrollment_id,
//         idempotencyKey: data.idempotency_key,
//       };
//     } catch (error) {
//       console.error("Payment creation error:", error);
//       setPaymentError(error.message);
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   };

//   // Clear payment state
//   const clearPaymentState = () => {
//     setCurrentEnrollment(null);
//     setPaymentStatus(null);
//     setPaymentError(null);
//     setIsTrackingPayment(false);

//     // Close SSE connection if active
//     if (eventSource) {
//       eventSource.close();
//       setEventSource(null);
//     }

//     // Clear localStorage
//     localStorage.removeItem("current_enrollment");
//   };

//   // Check if payment can be retried
//   const canRetryPayment = () => {
//     return (
//       currentEnrollment?.canRetry &&
//       (paymentStatus === "cancelled" || paymentError)
//     );
//   };

//   // Reset payment for retry
//   const resetPaymentForRetry = () => {
//     setPaymentStatus(null);
//     setPaymentError(null);
//     if (currentEnrollment) {
//       setCurrentEnrollment((prev) => ({ ...prev, canRetry: true }));
//     }
//   };

//   // Check for existing enrollment on mount/page reload
//   useEffect(() => {
//     const storedEnrollment = localStorage.getItem("current_enrollment");
//     if (storedEnrollment) {
//       try {
//         const enrollmentData = JSON.parse(storedEnrollment);
//         setCurrentEnrollment(enrollmentData);

//         // Check if we should resume payment tracking
//         if (enrollmentData.enrollmentId && !paymentStatus) {
//           startPaymentTracking(enrollmentData.enrollmentId);
//         }
//       } catch (error) {
//         console.error("Error parsing stored enrollment:", error);
//         localStorage.removeItem("current_enrollment");
//       }
//     }
//   }, []);

//   // Cleanup SSE on unmount
//   useEffect(() => {
//     return () => {
//       if (eventSource) {
//         eventSource.close();
//       }
//     };
//   }, [eventSource]);

//   const value = {
//     // State
//     currentEnrollment,
//     paymentStatus,
//     isTrackingPayment,
//     paymentError,

//     // Actions
//     createPayment,
//     clearPaymentState,
//     canRetryPayment: canRetryPayment(),
//     resetPaymentForRetry,
//     startPaymentTracking,
//   };

//   return (
//     <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
//   );
// };

// contexts/PaymentContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import EventSource from "eventsource"; // Use polyfill for headers
import { useNavigation } from "./NavigationContext";
// import { useRouter } from "next/navigation";

const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  const { makeAuthenticatedRequest, user, loading: authLoading } = useAuth();
  const [currentEnrollment, setCurrentEnrollment] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isTrackingPayment, setIsTrackingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [canRetryPayment, setCanRetryPayment] = useState(false);
  const { setCurrentPage } = useNavigation();
  //   const { router } = useRouter();

  const pollPaymentStatus = async (enrollmentId) => {
    if (authLoading || !user) {
      setPaymentError("User not authenticated");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setPaymentError("No access token available");
      return;
    }

    setIsTrackingPayment(true);
    setPaymentError(null);

    const interval = setInterval(async () => {
      try {
        const response = await makeAuthenticatedRequest(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/enrollments/`
        );
        if (response.ok) {
          const data = await response.json();
          const enrollment = data.find(
            (item) => item.id === parseInt(enrollmentId)
          );
          if (enrollment) {
            setPaymentStatus(enrollment.status);
            if (
              enrollment.status === "paid" ||
              enrollment.status === "cancelled" ||
              enrollment.status === "failed"
            ) {
              setIsTrackingPayment(false);
              setCanRetryPayment(
                enrollment.status === "cancelled" ||
                  enrollment.status === "failed"
              );
              clearInterval(interval);
            }
          } else {
            setPaymentError("Enrollment not found");
            setIsTrackingPayment(false);
            clearInterval(interval);
          }
        } else {
          setPaymentError("Failed to fetch payment status");
          setIsTrackingPayment(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Polling error:", error);
        setPaymentError("Failed to fetch payment status");
        setIsTrackingPayment(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  };

  const startPaymentTracking = (enrollmentId) => {
    if (
      authLoading ||
      !user ||
      !localStorage.getItem("access_token") ||
      !enrollmentId ||
      isNaN(parseInt(enrollmentId))
    ) {
      setPaymentError(
        "Cannot start tracking: invalid user, token, or enrollment ID"
      );
      setIsTrackingPayment(false);
      return;
    }

    setIsTrackingPayment(true);
    setPaymentError(null);

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/payments/status/${enrollmentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(
          `SSE: Received status ${data.status} for enrollment ${enrollmentId}`
        );
        setPaymentStatus(data.status);
        setPaymentError(null);
        if (
          data.status === "paid" ||
          data.status === "cancelled" ||
          data.status === "not_found" ||
          data.status === "failed"
        ) {
          setIsTrackingPayment(false);
          setCanRetryPayment(
            data.status === "cancelled" || data.status === "failed"
          );
          eventSource.close();
        }
      } catch (err) {
        console.error("SSE: Failed to parse event data:", err);
        setPaymentError(
          "Failed to process payment status update. Switching to polling."
        );
        eventSource.close();
        pollPaymentStatus(enrollmentId); // Fallback to polling
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE: Connection error:", err);
      setPaymentError(
        "Failed to connect to payment status updates. Switching to polling."
      );
      setPaymentStatus("error");
      setIsTrackingPayment(false);
      eventSource.close();
      pollPaymentStatus(enrollmentId); // Fallback to polling
    };

    return () => eventSource.close();
  };

  const clearPaymentState = () => {
    setCurrentEnrollment(null);
    setPaymentStatus(null);
    setIsTrackingPayment(false);
    setPaymentError(null);
    setCanRetryPayment(false);
    localStorage.removeItem("current_enrollment");
  };

  const resetPaymentForRetry = () => {
    setPaymentStatus(null);
    setPaymentError(null);
    setCanRetryPayment(false);
  };

  const createPayment = async (paymentData) => {
    try {
      // Ensure idempotency_key is included in the payload
      const payload = {
        enrollment_id: paymentData.enrollment_id,
        amount: paymentData.amount,
        idempotency_key:
          paymentData.idempotency_key ||
          `payment_${paymentData.enrollment_id}_${Date.now()}`,
        ...paymentData, // Include any other fields
      };

      console.log("Creating payment with data:", payload);

      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/payments/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCurrentEnrollment({ enrollmentId: data.enrollment_id });
        localStorage.setItem(
          "current_enrollment",
          JSON.stringify({ enrollmentId: data.enrollment_id })
        );
        return { success: true, confirmationUrl: data.confirmation_url };
      } else {
        console.error("Payment creation failed:", data);
        throw new Error(
          data.detail || data.message || "Payment creation failed"
        );
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      setPaymentError(error.message);
      throw error;
    }
  };

  // Persist currentEnrollment from localStorage on mount
  useEffect(() => {
    const storedEnrollment = localStorage.getItem("current_enrollment");
    if (storedEnrollment) {
      try {
        const enrollmentData = JSON.parse(storedEnrollment);
        if (enrollmentData.enrollmentId) {
          setCurrentEnrollment(enrollmentData);
        }
      } catch (error) {
        console.error("Error parsing stored enrollment:", error);
        localStorage.removeItem("current_enrollment");
      }
    }
  }, []);

  const value = {
    currentEnrollment,
    paymentStatus,
    isTrackingPayment,
    paymentError,
    canRetryPayment,
    startPaymentTracking,
    clearPaymentState,
    resetPaymentForRetry,
    createPayment,
    setCurrentEnrollment,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
}
