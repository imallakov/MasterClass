// auth/email-verification/page.jsx
"use client";

import { useState, useEffect } from "react"; // Adjust path as needed
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function EmailVerificationPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Mock success state for demonstration
  const [isComplete, setIsComplete] = useState(false);

  const { requestEmailVerification, confirmEmailVerification, user } =
    useAuth();
  const router = useRouter();

  // If user is already verified, redirect them
  useEffect(() => {
    if (user?.is_email_verified) {
      router.push("/dashboard"); // or wherever verified users should go
    }
  }, [user, router]);

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const resetForm = () => {
    setError("");
    setSuccess("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRequestVerification = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Пожалуйста, введите ваш email адрес");
      return;
    }

    setLoading(true);
    resetForm();

    try {
      const result = await requestEmailVerification(email);

      if (result.success) {
        setSuccess("Код подтверждения отправлен на ваш email!");
        setStep(2);
        setCountdown(60);
      } else {
        setError(result.error?.message || "Произошла ошибка при отправке кода");
      }
    } catch (error) {
      setError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Пожалуйста, введите код подтверждения");
      return;
    }

    setLoading(true);
    resetForm();

    try {
      const result = await confirmEmailVerification(email, otp);

      if (result.success) {
        setSuccess("Email успешно подтвержден!");
        setIsComplete(true);
      } else {
        setError(result.error?.message || "Неверный код подтверждения");
      }
    } catch (error) {
      setError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setLoading(true);
    resetForm();

    try {
      const result = await requestEmailVerification(email);

      if (result.success) {
        setSuccess("Новый код отправлен на ваш email!");
        setCountdown(60);
      } else {
        setError(result.error?.message || "Произошла ошибка при отправке кода");
      }
    } catch (error) {
      setError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      resetForm();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (step === 1) handleRequestVerification(e);
      else if (step === 2) handleValidateOTP(e);
    }
  };

  // Success completion screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-cyan-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Email подтвержден!
            </h1>
            <p className="text-gray-600 text-lg">
              Ваш email адрес успешно подтвержден. Теперь у вас есть полный
              доступ к системе.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-green-500 hover:bg-green-600 text-white text-xl font-semibold py-4 px-8 rounded-2xl transition-colors duration-200 shadow-lg"
          >
            Перейти в панель управления
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-cyan-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {step === 1 && (
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            )}
            {step === 2 && (
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {step === 1 && "Подтверждение Email"}
            {step === 2 && "Введите код подтверждения"}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed px-4">
            {step === 1 &&
              "Подтвердите ваш email адрес для активации полного доступа к системе"}
            {step === 2 && "Мы отправили код подтверждения на ваш email адрес"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mb-12">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={`h-3 w-20 rounded-full transition-all duration-300 ${
                i <= step
                  ? "bg-gradient-to-r from-pink-300 to-blue-300"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center">
            {success}
          </div>
        )}

        <div className="space-y-8">
          {/* Step 1: Email */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Введите ваш email"
                  className="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-700 transition-colors duration-200"
                  disabled={loading || (user?.email && email === user.email)}
                />
                {loading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                  </div>
                )}
              </div>

              {user?.email && email === user.email && (
                <div className="text-center text-sm text-gray-500">
                  Используется email адрес вашего аккаунта
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleRequestVerification}
                  disabled={!email.trim() || loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-semibold py-4 px-8 rounded-2xl transition-colors duration-200 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Отправляем...
                    </div>
                  ) : (
                    "Отправить код"
                  )}
                </button>

                <button
                  onClick={() => {
                    if (!user?.email) {
                      setEmail("");
                    }
                    setError("");
                  }}
                  disabled={loading || (user?.email && email === user.email)}
                  className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Очистить
                </button>
              </div>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Введите код"
                  className="w-full px-6 py-4 text-2xl border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-center font-mono tracking-widest bg-gray-50 text-gray-700 transition-colors duration-200"
                  maxLength="6"
                  disabled={loading}
                />
                {loading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                  </div>
                )}
              </div>

              <div className="text-center text-gray-500 text-base">
                Код отправлен на:{" "}
                <span className="font-medium text-gray-700">{email}</span>
              </div>

              <div className="text-gray-500 text-base text-center">
                {countdown > 0 ? (
                  <span>
                    Отправить код заново через {formatTime(countdown)}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-green-500 hover:text-green-600 underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Отправляем..." : "Отправить код заново"}
                  </button>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleValidateOTP}
                  disabled={otp.length !== 6 || loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-semibold py-4 px-8 rounded-2xl transition-colors duration-200 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Проверяем...
                    </div>
                  ) : (
                    "Подтвердить"
                  )}
                </button>

                <button
                  onClick={() => {
                    setOtp("");
                    setError("");
                  }}
                  disabled={loading}
                  className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Очистить
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={goBack}
                  className="text-gray-500 hover:text-gray-700 underline text-base"
                >
                  ← Назад
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-sm text-gray-400 text-center">
            {step === 2 && "Код действителен в течение 10 минут"}
          </div>
        </div>
      </div>
    </div>
  );
}
