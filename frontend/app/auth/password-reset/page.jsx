"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  KeyRound,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function PasswordResetPage() {
  const router = useRouter();
  const {
    requestPasswordReset,
    validatePasswordResetOTP,
    confirmPasswordReset,
  } = useAuth();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

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

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Пожалуйста, введите ваш email адрес");
      return;
    }

    setLoading(true);
    resetForm();

    try {
      const result = await requestPasswordReset(email);
      if (result.success) {
        setSuccess("Код восстановления отправлен на ваш email!");
        setStep(2);
        setCountdown(60); // 60 second countdown for resend
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
      const result = await validatePasswordResetOTP(email, otp);
      if (result.success) {
        setTempToken(result.data?.temp_token || result.data?.data?.temp_token);
        setSuccess("Код подтвержден успешно!");
        setStep(3);
      } else {
        setError(result.error?.message || "Неверный код подтверждения");
      }
    } catch (error) {
      setError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Пожалуйста, введите новый пароль");
      return;
    }

    if (password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    resetForm();

    try {
      const result = await confirmPasswordReset(tempToken, password);
      if (result.success) {
        setSuccess(
          "Пароль успешно изменен! Перенаправляем на страницу входа..."
        );
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 2000);
      } else {
        setError(result.error?.message || "Ошибка при изменении пароля");
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
      const result = await requestPasswordReset(email);
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
    } else {
      router.push("/auth/sign-in");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (step === 1) handleRequestReset(e);
      else if (step === 2) handleValidateOTP(e);
      else if (step === 3) handleConfirmReset(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-cyan-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {step === 1 && <Lock className="w-10 h-10 text-blue-600" />}
            {step === 2 && <KeyRound className="w-10 h-10 text-blue-600" />}
            {step === 3 && <Lock className="w-10 h-10 text-blue-600" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {step === 1 && "Восстановление пароля"}
            {step === 2 && "Введите код подтверждения"}
            {step === 3 && "Новый пароль"}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed px-4">
            {step === 1 &&
              "Введите ваш email адрес для получения кода восстановления"}
            {step === 2 && "Мы отправили код подтверждения на ваш email адрес"}
            {step === 3 && "Создайте новый пароль для вашей учетной записи"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mb-12">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-3 w-16 rounded-full transition-all duration-300 ${
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
                  disabled={loading}
                />
                {loading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleRequestReset}
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
                    setEmail("");
                    setError("");
                  }}
                  disabled={loading}
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

          {/* Step 3: New Password */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Введите новый пароль"
                    className="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-700 transition-colors duration-200 pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-6 w-6" />
                    ) : (
                      <Eye className="h-6 w-6" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Подтвердите новый пароль"
                    className="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-700 transition-colors duration-200 pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-6 w-6" />
                    ) : (
                      <Eye className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 p-4 rounded-2xl">
                <p className="text-blue-800 font-medium mb-2">
                  Требования к паролю:
                </p>
                <ul className="space-y-1 text-sm">
                  <li
                    className={`flex items-center space-x-2 ${
                      password.length >= 8 ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        password.length >= 8 ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <span>Минимум 8 символов</span>
                  </li>
                  <li
                    className={`flex items-center space-x-2 ${
                      password === confirmPassword && password.length > 0
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        password === confirmPassword && password.length > 0
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span>Пароли должны совпадать</span>
                  </li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleConfirmReset}
                  disabled={
                    loading ||
                    password.length < 8 ||
                    password !== confirmPassword
                  }
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-semibold py-4 px-8 rounded-2xl transition-colors duration-200 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Изменяем...
                    </div>
                  ) : (
                    "Изменить пароль"
                  )}
                </button>

                <button
                  onClick={() => {
                    setPassword("");
                    setConfirmPassword("");
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
            {step === 3 && "Пароль будет изменен сразу после подтверждения"}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Вспомнили пароль?{" "}
            <button
              onClick={() => router.push("/auth/sign-in")}
              className="text-green-500 hover:text-green-600 font-medium underline"
            >
              Войти в систему
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
