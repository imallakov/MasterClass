"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import UserRoute from "@/app/components/UserRoute";

export default function PasswordChangePage() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Password strength validation
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Минимум 8 символов");
    if (!/[A-Z]/.test(password)) errors.push("Одна заглавная буква");
    if (!/[a-z]/.test(password)) errors.push("Одна строчная буква");
    if (!/\d/.test(password)) errors.push("Одна цифра");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("Один специальный символ");
    return errors;
  };

  const getPasswordStrength = (password) => {
    const errors = validatePassword(password);
    if (password.length === 0) return { strength: 0, label: "" };
    if (errors.length === 0) return { strength: 100, label: "Сильный" };
    if (errors.length <= 2) return { strength: 60, label: "Средний" };
    return { strength: 30, label: "Слабый" };
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear general message when user starts typing
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.oldPassword.trim()) {
      errors.oldPassword = "Введите текущий пароль";
    }

    if (!formData.newPassword.trim()) {
      errors.newPassword = "Введите новый пароль";
    } else {
      const passwordErrors = validatePassword(formData.newPassword);
      if (passwordErrors.length > 0) {
        errors.newPassword = "Пароль должен соответствовать всем требованиям";
      }
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Подтвердите новый пароль";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Пароли не совпадают";
    }

    if (
      formData.oldPassword &&
      formData.newPassword &&
      formData.oldPassword === formData.newPassword
    ) {
      errors.newPassword = "Новый пароль должен отличаться от текущего";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      setSuccess(true);
      setMessage({
        type: "success",
        text: "Пароль успешно изменен! Используйте новый пароль для входа в систему.",
      });
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Произошла ошибка при изменении пароля. Попробуйте еще раз.",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);
  const passwordRequirements = validatePassword(formData.newPassword);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-100 flex items-center justify-center p-4">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Успешно!</h1>
            <p className="text-gray-600 text-lg">Ваш пароль успешно изменен</p>
          </div>
          <button
            onClick={() => {
              setSuccess(false);
              setMessage({ type: "", text: "" });
            }}
            className="bg-green-500 hover:bg-green-600 text-white text-xl font-semibold py-4 px-8 rounded-2xl transition-colors duration-200 shadow-lg"
          >
            Продолжить
          </button>
        </div>
      </div>
    );
  }

  return (
    <UserRoute>
      <>
        <Navbar />
        <div className="h-20"></div>
        <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Изменение пароля
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Обновите пароль для обеспечения безопасности вашего аккаунта
              </p>
            </div>

            {/* Global Message */}
            {message.text && (
              <div
                className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${
                  message.type === "success"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
                <span
                  className={`text-base ${
                    message.type === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {message.text}
                </span>
              </div>
            )}

            {/* Form */}
            <div className="space-y-6">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block text-lg font-medium text-gray-700 mb-3"
                >
                  Текущий пароль
                </label>
                <div className="relative">
                  <input
                    id="oldPassword"
                    type={showPasswords.old ? "text" : "password"}
                    value={formData.oldPassword}
                    onChange={(e) =>
                      handleInputChange("oldPassword", e.target.value)
                    }
                    className={`w-full px-6 py-4 text-lg border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-14 transition-colors duration-200 ${
                      validationErrors.oldPassword
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                    placeholder="Введите текущий пароль"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("old")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.old ? (
                      <EyeOff className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </button>
                </div>
                {validationErrors.oldPassword && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700">
                    {validationErrors.oldPassword}
                  </div>
                )}
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-lg font-medium text-gray-700 mb-3"
                >
                  Новый пароль
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                    className={`w-full px-6 py-4 text-lg border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-14 transition-colors duration-200 ${
                      validationErrors.newPassword
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                    placeholder="Введите новый пароль"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base text-gray-600">
                        Сложность пароля
                      </span>
                      <span
                        className={`text-base font-medium ${
                          passwordStrength.strength >= 80
                            ? "text-green-600"
                            : passwordStrength.strength >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          passwordStrength.strength >= 80
                            ? "bg-green-500"
                            : passwordStrength.strength >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                {formData.newPassword && passwordRequirements.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-base text-gray-600 mb-3">
                      Пароль должен содержать:
                    </p>
                    <ul className="space-y-2">
                      {passwordRequirements.map((req, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 text-base text-red-600"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationErrors.newPassword && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700">
                    {validationErrors.newPassword}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-lg font-medium text-gray-700 mb-3"
                >
                  Подтвердите новый пароль
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`w-full px-6 py-4 text-lg border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-14 transition-colors duration-200 ${
                      validationErrors.confirmPassword
                        ? "border-red-300 bg-red-50 text-red-700"
                        : formData.confirmPassword &&
                          formData.newPassword === formData.confirmPassword
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                    placeholder="Подтвердите новый пароль"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700">
                    {validationErrors.confirmPassword}
                  </div>
                )}
                {formData.confirmPassword &&
                  formData.newPassword === formData.confirmPassword && (
                    <div className="mt-2 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      Пароли совпадают
                    </div>
                  )}
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-semibold py-4 px-8 rounded-2xl transition-colors duration-200 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Изменяем пароль...
                    </div>
                  ) : (
                    "Изменить пароль"
                  )}
                </button>

                <button
                  onClick={() => {
                    setFormData({
                      oldPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setValidationErrors({});
                    setMessage({ type: "", text: "" });
                  }}
                  disabled={loading}
                  className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Очистить
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </>
    </UserRoute>
  );
}
