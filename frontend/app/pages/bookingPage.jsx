"use client";
import React, { useState, useEffect } from "react";
import { useNavigation } from "../context/NavigationContext";
import { usePayment } from "../context/PaymentContext";
import { useAuth } from "../context/AuthContext";

const BookingPage = ({ masterclassId }) => {
  const [masterclass, setMasterclass] = useState(null);
  const [masterclasses, setMasterclasses] = useState([]);
  const [masterclassesForDate, setMasterclassesForDate] = useState([]);
  const { selectedMasterclassId, setSelectedMasterclassId } = useNavigation();
  const [calendarData, setCalendarData] = useState(null);
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
  const { makeAuthenticatedRequest } = useAuth();

  // New state to track the current step
  const [currentStep, setCurrentStep] = useState("date"); // 'date', 'masterclass', 'booking'
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const fetchCalendarData = async (month, year) => {
    try {
      setLoading(true);
      setError(null);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error(
          "NEXT_PUBLIC_BACKEND_URL environment variable is not set"
        );
      }

      // Format date for API call (YYYY-MM)
      const dateParam = `${year}-${month + 1}`; // month is 0-indexed, API expects 1-indexed
      const apiUrl = `${backendUrl}/api/masterclasses/calendar/?date=${dateParam}`;
      console.log("Fetching calendar data from:", apiUrl);

      const response = await makeAuthenticatedRequest(apiUrl, {
        method: "GET",
      });

      const data = await response.json();
      console.log("Calendar data received:", data);

      setCalendarData(data);
    } catch (err) {
      console.error("Error fetching calendar data:", err);
      setError(`Ошибка загрузки календаря: ${err.message}`);
    } finally {
      setLoading(false);
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

  // New function to fetch masterclasses for a specific date
  const fetchMasterclassesForDate = async (date) => {
    try {
      setLoading(true);
      setError(null);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error(
          "NEXT_PUBLIC_BACKEND_URL environment variable is not set"
        );
      }

      // Format date for API call (YYYY-MM-DD)
      const dateStr = date.toISOString().split("T")[0];
      const apiUrl = `${backendUrl}/api/masterclasses/?date=${dateStr}`;
      console.log("Fetching masterclasses for date from:", apiUrl);

      const response = await makeAuthenticatedRequest(apiUrl, {
        method: "GET",
      });

      const data = await response.json();
      console.log("Masterclasses for date data received:", data);

      // Filter masterclasses that have slots on the selected date
      const masterclassesWithSlots = (data.results || data || []).filter(
        (mc) => {
          if (!mc.slots) return false;
          return mc.slots.some((slot) => {
            const slotDate = new Date(slot.start);
            return (
              slotDate.getDate() === date.getDate() &&
              slotDate.getMonth() === date.getMonth() &&
              slotDate.getFullYear() === date.getFullYear() &&
              slot.free_places > 0
            );
          });
        }
      );

      setMasterclassesForDate(masterclassesWithSlots);
    } catch (err) {
      console.error("Error fetching masterclasses for date:", err);
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
    if (masterclassId) {
      // If masterclassId is provided, go directly to booking step
      setCurrentStep("booking");
      fetchMasterclass(masterclassId);
      setSelectedMasterclassId(masterclassId);
    } else {
      // If no masterclassId, start with date selection and load calendar data
      setCurrentStep("date");
      fetchCalendarData(currentMonth, currentYear); // CHANGED: Use calendar API instead of all masterclasses
    }
  }, [masterclassId]);

  useEffect(() => {
    if (currentStep === "date") {
      fetchCalendarData(currentMonth, currentYear);
    }
  }, [currentMonth, currentYear, currentStep]);

  useEffect(() => {
    if (masterclassId && masterclassId !== selectedMasterclassId) {
      setSelectedMasterclassId(masterclassId);
    }
  }, [masterclassId]);

  useEffect(() => {
    if (selectedTime && participants > selectedTime.free_places) {
      setParticipants(Math.min(participants, selectedTime.free_places));
    }
  }, [selectedTime]);

  // Handle date selection when no masterclassId is provided
  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setCurrentStep("masterclass");

    // Get masterclasses for the selected date from calendar data
    if (calendarData) {
      const dayData = calendarData.days?.find(
        (day) => day.day === date.getDate()
      );
      const masterclassesForDate = dayData ? dayData.masterclasses : [];
      setMasterclassesForDate(masterclassesForDate);
    }
  };

  // Handle masterclass selection from date-filtered list
  const handleMasterclassSelect = (id) => {
    setSelectedMasterclassId(id);
    setCurrentStep("booking");
    fetchMasterclass(id);
    clearPaymentState();
  };

  // Go back to previous step
  const handleBackStep = () => {
    if (currentStep === "booking") {
      if (masterclassId) {
        // If masterclassId was provided as prop, can't go back
        return;
      }
      setCurrentStep("masterclass");
      setSelectedMasterclassId(null);
      setMasterclass(null);
      setAvailableSlots([]);
      setSelectedTime(null);
      clearPaymentState();
    } else if (currentStep === "masterclass") {
      setCurrentStep("date");
      setSelectedDate(null);
      setSelectedTime(null);
      setMasterclassesForDate([]);
    }
  };

  // Reset to initial state
  const handleResetToStart = () => {
    setCurrentStep("date");
    setSelectedMasterclassId(null);
    setMasterclass(null);
    setAvailableSlots([]);
    setSelectedDate(null);
    setSelectedTime(null);
    setMasterclassesForDate([]);
    clearPaymentState();
  };

  // Updated payment enrollment handler using context
  const handlePaymentEnrollment = async () => {
    if (!selectedTime || !participants || !masterclass) return;

    try {
      setEnrolling(true);

      const paymentData = {
        masterclass_id: masterclass.id,
        slot_id: selectedTime.id,
        quantity: participants,
        return_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-account`,
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

  // Get slots for a specific date from all masterclasses
  // const getSlotsForDate = (date) => {
  //   if (currentStep === "booking" && availableSlots) {
  //     // When in booking step, use the specific masterclass slots
  //     return availableSlots.filter((slot) => {
  //       const slotDate = new Date(slot.start);
  //       return (
  //         slotDate.getDate() === date.getDate() &&
  //         slotDate.getMonth() === date.getMonth() &&
  //         slotDate.getFullYear() === date.getFullYear() &&
  //         slot.free_places > 0
  //       );
  //     });
  //   } else {
  //     // When in date selection step, check all masterclasses
  //     const allSlots = [];
  //     masterclasses.forEach((mc) => {
  //       if (mc.slots) {
  //         mc.slots.forEach((slot) => {
  //           const slotDate = new Date(slot.start);
  //           if (
  //             slotDate.getDate() === date.getDate() &&
  //             slotDate.getMonth() === date.getMonth() &&
  //             slotDate.getFullYear() === date.getFullYear() &&
  //             slot.free_places > 0
  //           ) {
  //             allSlots.push(slot);
  //           }
  //         });
  //       }
  //     });
  //     return allSlots;
  //   }
  // };
  const getSlotsForDate = (date) => {
    if (currentStep === "booking" && availableSlots) {
      // When in booking step, use the specific masterclass slots
      return availableSlots.filter((slot) => {
        const slotDate = new Date(slot.start);
        return (
          slotDate.getDate() === date.getDate() &&
          slotDate.getMonth() === date.getMonth() &&
          slotDate.getFullYear() === date.getFullYear() &&
          slot.free_places > 0
        );
      });
    } else if (currentStep === "date" && calendarData) {
      // When in date selection step, use calendar API data
      const dayData = calendarData.days?.find(
        (day) => day.day === date.getDate()
      );
      return dayData ? dayData.masterclasses : [];
    }
    return [];
  };

  // Get date status
  const getDateStatus = (dayInfo) => {
    if (!dayInfo.isCurrentMonth) return "other-month";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dayInfo.fullDate < today) return "past";

    if (currentStep === "date" && calendarData) {
      // CHANGE THIS PART - Check if there are any masterclasses for this day
      const dayData = calendarData.days?.find(
        (day) => day.day === dayInfo.date
      );
      const hasClasses =
        dayData && dayData.masterclasses && dayData.masterclasses.length > 0;
      return hasClasses ? "available" : "unavailable";
    } else if (currentStep === "booking") {
      // Use slots data for booking step
      const slotsForDate = getSlotsForDate(dayInfo.fullDate);
      return slotsForDate.length > 0 ? "available" : "unavailable";
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

    if (currentStep === "date") {
      setSelectedDate(null);
      // Calendar data will be fetched by the useEffect above
    }
    if (currentStep === "booking") {
      setSelectedTime(null);
    }
  };

  // Handle date click
  const handleDateClick = (dayInfo, status) => {
    if (status === "available") {
      if (currentStep === "date") {
        handleDateSelection(dayInfo.fullDate);
      } else if (currentStep === "booking") {
        setSelectedDate(dayInfo.fullDate);
        setSelectedTime(null);
      }
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
            if (currentStep === "booking" && selectedMasterclassId) {
              fetchMasterclass(selectedMasterclassId);
            } else if (currentStep === "masterclass" && selectedDate) {
              // Re-fetch calendar data since we no longer have fetchMasterclassesForDate
              fetchCalendarData(currentMonth, currentYear);
            } else if (currentStep === "date") {
              fetchCalendarData(currentMonth, currentYear); // CHANGED: Use calendar API
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Попробовать снова
        </button>
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

  // Render based on current step
  if (currentStep === "date") {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Выберите дату</h1>

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

        <div className="text-center text-gray-600">
          <p>Выберите дату, чтобы увидеть доступные мастер-классы</p>
        </div>
      </div>
    );
  }

  if (currentStep === "masterclass") {
    return (
      <div className="max-w-6xl px-4 sm:px-6 lg:px-0">
        {/* Back button */}
        <button
          onClick={handleBackStep}
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
          Назад к выбору даты
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Мастер-классы на {selectedDate?.toLocaleDateString("ru-RU")}
        </h1>

        {masterclassesForDate.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <p className="text-lg">
              На выбранную дату нет доступных мастер-классов
            </p>
            <button
              onClick={handleBackStep}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Выбрать другую дату
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* {masterclassesForDate.map((mc) => {
              const slotsForDate = mc.slots.filter((slot) => {
                const slotDate = new Date(slot.start);
                return (
                  slotDate.getDate() === selectedDate.getDate() &&
                  slotDate.getMonth() === selectedDate.getMonth() &&
                  slotDate.getFullYear() === selectedDate.getFullYear() &&
                  slot.free_places > 0
                );
              }); */}
            {masterclassesForDate.map((mc) => {
              const slotsForDate = (mc.slots || []).filter((slot) => {
                const slotDate = new Date(slot.start);
                return (
                  slotDate.getDate() === selectedDate.getDate() &&
                  slotDate.getMonth() === selectedDate.getMonth() &&
                  slotDate.getFullYear() === selectedDate.getFullYear() &&
                  slot.free_places > 0
                );
              });

              return (
                <div
                  key={mc.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleMasterclassSelect(mc.id)}
                >
                  {mc.image && (
                    <img
                      src={process.env.NEXT_PUBLIC_BACKEND_URL + "/" + mc.image}
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
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-lg font-bold text-green-600">
                        {parseFloat(mc.price).toLocaleString("ru-RU")} ₽
                      </div>
                      <div className="text-sm text-gray-500">
                        До {mc.participant_limit} участников
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Booking step (currentStep === 'booking')
  if (!masterclass) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Мастер-класс не найден</div>
      </div>
    );
  }

  const availableTimeSlots = getAvailableTimeSlotsForDate();

  return (
    <div className="max-w-6xl">
      {/* Back button */}
      {!masterclassId && (
        <button
          onClick={handleBackStep}
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
          Назад к выбору мастер-класса
        </button>
      )}

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
            {selectedDate
              ? `Выбрать время на ${selectedDate.toLocaleDateString("ru-RU")}`
              : "Выбрать дату и время"}
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
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-2">
                {["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map((day) => (
                  <div
                    key={day}
                    className="text-xs sm:text-sm font-medium text-gray-500 p-1 sm:p-2"
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

          {/* Time Slots */}
          {selectedDate && availableTimeSlots.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Доступное время
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableTimeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedTime(slot)}
                    className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                      selectedTime?.id === slot.id
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div>{formatTime(slot.start)}</div>
                    <div className="text-xs opacity-75">
                      {slot.free_places} мест
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedDate && availableTimeSlots.length === 0 && (
            <div className="text-center text-gray-600 py-8">
              <p>На выбранную дату нет доступных слотов</p>
            </div>
          )}
        </div>

        {/* Right Side - Masterclass Info and Booking */}
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
                  disabled={participants <= 1}
                >
                  -
                </button>
                <span className="text-lg sm:text-xl font-bold text-orange-500">
                  {participants}/
                  {selectedTime
                    ? selectedTime.free_places
                    : masterclass.participant_limit}
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
                  disabled={
                    participants >=
                    (selectedTime?.free_places || masterclass.participant_limit)
                  }
                >
                  +
                </button>
              </div>
            </div>

            {/* Updated helper text */}
            {/* <div className="text-xs text-gray-600">
              {selectedTime ? (
                <p>
                  Доступно мест в выбранное время: {selectedTime.free_places}
                </p>
              ) : (
                <p>
                  Максимум участников для мастер-класса:{" "}
                  {masterclass.participant_limit}
                </p>
              )}
            </div> */}
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

          {/* Payment URL Banner */}
          {paymentUrl && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <p className="text-sm mb-2">
                Не удалось автоматически открыть страницу оплаты.
              </p>
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm inline-block"
                onClick={() => setPaymentUrl(null)}
              >
                Открыть страницу оплаты
              </a>
            </div>
          )}

          {/* Payment Tracking Status */}
          {isTrackingPayment && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                <span className="text-sm">Отслеживаем статус платежа...</span>
              </div>
            </div>
          )}

          {paymentStatus === "completed" && currentEnrollment && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <div className="font-medium">Оплата успешна!</div>
                  <div className="text-sm mt-1">
                    Запись подтверждена. ID: {currentEnrollment.id}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Notice and Terms Agreement */}
          <div className="mb-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms-agreement"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms-agreement"
                className="text-sm text-gray-700 leading-relaxed"
              >
                Нажимая кнопку "Оплатить", вы автоматически соглашаетесь с{" "}
                <a
                  href="/documents/Оферта_МК.docx"
                  download="Оферта_МК.docx"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  обработкой ваших персональных данных
                </a>{" "}
                и условиями оферты.
              </label>
            </div>
          </div>

          {/* Payment Button - Updated */}
          <button
            onClick={handlePaymentEnrollment}
            disabled={
              !selectedDate ||
              !selectedTime ||
              participants > (selectedTime?.free_places || 0) ||
              enrolling ||
              isTrackingPayment ||
              paymentStatus === "completed" ||
              !agreedToTerms // Add this condition
            }
            className={`w-full py-2.5 sm:py-3 rounded-full font-medium text-base sm:text-lg shadow-lg transition-colors ${
              !selectedDate ||
              !selectedTime ||
              participants > (selectedTime?.free_places || 0) ||
              enrolling ||
              isTrackingPayment ||
              paymentStatus === "completed" ||
              !agreedToTerms // Add this condition
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-400 hover:bg-blue-500 text-white"
            }`}
          >
            {paymentStatus === "completed"
              ? "✅ Запись подтверждена"
              : enrolling
              ? "Создаём платёж..."
              : isTrackingPayment
              ? "Ожидаем оплату..."
              : `Оплатить ${getTotalPrice().toLocaleString("ru-RU")} ₽`}
          </button>

          {/* Helper text for disabled state */}
          {(!selectedDate || !selectedTime || !agreedToTerms) && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              {!selectedDate && "Выберите дату. "}
              {!selectedTime && "Выберите время. "}
              {!agreedToTerms && "Согласитесь с условиями."}
            </p>
          )}

          {!masterclassId && (
            <button
              onClick={handleResetToStart}
              className="w-full mt-3 py-2 px-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              ← Начать заново
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
