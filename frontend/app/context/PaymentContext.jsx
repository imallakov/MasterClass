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
      //   const payload = {
      //     enrollment_id: paymentData.enrollment_id,
      //     amount: paymentData.amount,
      //     idempotency_key:
      //       paymentData.idempotency_key ||
      //       `payment_${paymentData.enrollment_id}_${Date.now()}`,
      //     ...paymentData, // Include any other fields
      //   };

      //   console.log("Creating payment with data:", payload);

      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/payments/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
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
