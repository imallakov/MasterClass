"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePayment } from "@/app/context/PaymentContext";

const PaymentResultPage = () => {
  const router = useRouter();
  const {
    currentEnrollment,
    paymentStatus,
    isTrackingPayment,
    paymentError,
    startPaymentTracking,
    clearPaymentState,
    canRetryPayment,
    resetPaymentForRetry,
    createPayment,
  } = usePayment();

  const [masterclassData, setMasterclassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  // Получаем данные мастер-класса для отображения
  const fetchMasterclassData = async (enrollmentId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/enrollments/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Находим конкретную запись по enrollmentId
        const enrollment = data.find(
          (item) => item.id === parseInt(enrollmentId)
        );
        if (enrollment) {
          // Преобразуем структуру данных для совместимости с существующим кодом
          const transformedData = {
            masterclass: enrollment.masterclass,
            slot: enrollment.slot,
            quantity: enrollment.quantity,
            amount: enrollment.masterclass.price,
            user_id: null, // Этого поля нет в ответе API
            status: enrollment.status,
          };
          setMasterclassData(transformedData);
        }
      }
    } catch (error) {
      console.error("Error fetching masterclass data:", error);
    }
  };

  useEffect(() => {
    // Проверяем, есть ли данные о текущем платеже
    if (currentEnrollment?.enrollmentId) {
      fetchMasterclassData(currentEnrollment.enrollmentId);

      // Если статус еще не определен, начинаем отслеживание
      if (!paymentStatus && !isTrackingPayment) {
        startPaymentTracking(currentEnrollment.enrollmentId);
      }
    } else {
      // Проверяем localStorage на случай перезагрузки страницы
      const storedEnrollment = localStorage.getItem("current_enrollment");
      if (storedEnrollment) {
        try {
          const enrollmentData = JSON.parse(storedEnrollment);
          if (enrollmentData.enrollmentId) {
            fetchMasterclassData(enrollmentData.enrollmentId);
            startPaymentTracking(enrollmentData.enrollmentId);
          }
        } catch (error) {
          console.error("Error parsing stored enrollment:", error);
        }
      }
    }

    setLoading(false);
  }, [
    currentEnrollment,
    paymentStatus,
    isTrackingPayment,
    startPaymentTracking,
  ]);

  const handleRetryPayment = async () => {
    if (!masterclassData) return;

    try {
      setRetrying(true);
      resetPaymentForRetry();

      const paymentData = {
        masterclass_id: masterclassData.masterclass.id,
        slot_id: masterclassData.slot.id,
        quantity: masterclassData.quantity,
        amount: masterclassData.amount,
        user_id: masterclassData.user_id,
      };

      const result = await createPayment(paymentData);

      if (result.success) {
        window.location.href = result.confirmationUrl;
      }
    } catch (error) {
      console.error("Error retrying payment:", error);
    } finally {
      setRetrying(false);
    }
  };

  const handleBackToBooking = () => {
    clearPaymentState();
    router.push("/user-account");
  };

  const handleGoToProfile = () => {
    clearPaymentState();
    router.push("/user-account");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если нет данных о платеже, перенаправляем на страницу бронирования
  if (!currentEnrollment && !localStorage.getItem("current_enrollment")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Платеж не найден
          </h1>
          <p className="text-gray-600 mb-6">
            Данные о платеже не найдены. Возможно, сессия истекла.
          </p>
          <button
            onClick={handleBackToBooking}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Вернуться к бронированию
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Статус платежа */}
          {paymentStatus === "paid" && (
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
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
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Оплата прошла успешно!
              </h1>
              <p className="text-gray-600">
                Вы успешно записаны на мастер-класс
              </p>
            </div>
          )}

          {paymentStatus === "pending" && isTrackingPayment && (
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Обработка платежа...
              </h1>
              <p className="text-gray-600">
                Ожидаем подтверждение оплаты. Не закрывайте страницу.
              </p>
            </div>
          )}

          {paymentStatus === "cancelled" && (
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Платеж отменен
              </h1>
              <p className="text-gray-600">
                Оплата была отменена или отклонена
              </p>
            </div>
          )}

          {paymentError && (
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Произошла ошибка
              </h1>
              <p className="text-gray-600">{paymentError}</p>
            </div>
          )}

          {/* Информация о мастер-классе */}
          {masterclassData && (
            <div className="border-t border-gray-200 pt-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Детали записи
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Мастер-класс:</span>
                  <span className="font-medium">
                    {masterclassData.masterclass?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Дата и время:</span>
                  <span className="font-medium">
                    {new Date(masterclassData.slot?.start).toLocaleString(
                      "ru-RU"
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Количество участников:</span>
                  <span className="font-medium">
                    {masterclassData.quantity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Сумма:</span>
                  <span className="font-medium text-lg">
                    {parseFloat(masterclassData.amount).toLocaleString("ru-RU")}{" "}
                    ₽
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Действия */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {paymentStatus === "paid" && (
              <>
                <button
                  onClick={handleGoToProfile}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Мои записи
                </button>
                <button
                  onClick={handleBackToBooking}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Записаться еще
                </button>
              </>
            )}

            {(paymentStatus === "cancelled" || paymentError) &&
              canRetryPayment && (
                <>
                  <button
                    onClick={handleRetryPayment}
                    disabled={retrying}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    {retrying ? "Повторяем..." : "Попробовать снова"}
                  </button>
                  <button
                    onClick={handleBackToBooking}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Выбрать другой мастер-класс
                  </button>
                </>
              )}

            {paymentStatus === "pending" && (
              <button
                onClick={handleBackToBooking}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Вернуться к бронированию
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;
