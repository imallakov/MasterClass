// auth/sign-up
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

export default function RegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    // lastName: "",
    // birthDate: "",
    password: "",
    passwordConfirm: "",
    phone: "+",
    email: "",
    agreeToPolicy: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");

  const cleanPhoneForBackend = (phone) => {
    // Remove +7 prefix and any spaces/formatting
    return phone.replace(/^\+\s*/, "").replace(/\s+/g, "");
  };

  const formatDateForBackend = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
  };

  // Get CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const cookieToken = getCsrfTokenFromCookie();
        if (cookieToken) {
          setCsrfToken(cookieToken);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/register/`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const newCookieToken = getCsrfTokenFromCookie();
          if (newCookieToken) {
            setCsrfToken(newCookieToken);
          }
        }
      } catch (error) {
        console.log("CSRF token fetch failed:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      // Ensure phone always starts with +7
      if (value.startsWith("+7")) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      } else if (value.length < 2) {
        // If user tries to delete everything, keep +7
        setFormData((prev) => ({
          ...prev,
          [name]: "+",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Имя обязательно для заполнения";
    }

    // if (!formData.lastName.trim()) {
    //   newErrors.lastName = "Фамилия обязательна для заполнения";
    // }

    // if (!formData.birthDate) {
    //   newErrors.birthDate = "Дата рождения обязательна";
    // }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен для заполнения";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "Подтвердите пароль";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Пароли не совпадают";
    }

    // Updated phone validation
    if (!formData.phone.trim() || formData.phone === "+7") {
      newErrors.phone = "Номер телефона обязателен для заполнения";
    } else if (formData.phone.length < 12) {
      // +7 + 10 digits minimum
      newErrors.phone = "Введите корректный номер телефона";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен для заполнения";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Некорректный email адрес";
    }

    if (!formData.agreeToPolicy) {
      newErrors.agreeToPolicy =
        "Необходимо согласиться с политикой конфиденциальности";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setRegistrationStatus(null);

    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      if (csrfToken) {
        headers["X-CSRFTOKEN"] = csrfToken;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/register/`,
        {
          method: "POST",
          headers: headers,
          credentials: "include",
          body: JSON.stringify({
            first_name: formData.firstName,
            // last_name: formData.lastName,
            // password: formData.password,
            password_confirm: formData.passwordConfirm,
            phone_number: cleanPhoneForBackend(formData.phone), // Clean phone number
            email: formData.email,
            birth_date: formatDateForBackend(formData.birthDate),
          }),
        }
      );

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const htmlText = await response.text();
        console.error("Received HTML response instead of JSON:", htmlText);

        setRegistrationStatus({
          type: "error",
          message: `Ошибка сервера (${response.status}). Проверьте настройки API.`,
        });
        return;
      }

      if (response.ok) {
        const result = await response.json();
        console.log("Registration successful:", result);

        setRegistrationStatus({
          type: "success",
          message: "Регистрация прошла успешно!",
        });

        setFormData({
          firstName: "",
          // lastName: "",
          // birthDate: "",
          password: "",
          passwordConfirm: "",
          phone: "+", // Reset to +7
          email: "",
          agreeToPolicy: false,
        });

        // Redirect after successful registration
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);

        let errorMessage = "Ошибка регистрации";
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }

        setRegistrationStatus({
          type: "error",
          message: errorMessage,
        });
      }
    } catch (error) {
      console.error("Network error details:", error);

      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        setRegistrationStatus({
          type: "error",
          message:
            "Не удается подключиться к серверу. Проверьте, что сервер запущен на localhost:8000",
        });
      } else {
        setRegistrationStatus({
          type: "error",
          message: "Ошибка соединения с сервером. Попробуйте позже.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      // lastName: "",
      // birthDate: "",
      password: "",
      passwordConfirm: "",
      phone: "+", // Reset to +7
      email: "",
      agreeToPolicy: false,
    });
    setErrors({});
    setRegistrationStatus(null);
    router.push("/auth/sign-in");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-cyan-100">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-5xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex justify-center items-center min-h-[600px]">
            {/* Left side - Image */}
            <div className="relative flex-4 h-full min-h-[600px]">
              <Image
                src="/images/authpage.jpg"
                alt="Hands working on macramé art"
                className="w-full h-full object-cover"
                width={600}
                height={600}
                priority
              />
            </div>

            {/* Right side - Registration form */}
            <div className="flex items-center justify-center flex-5 p-8 md:p-12">
              <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Регистрация
                  </h1>
                </div>

                {/* Status Messages */}
                {registrationStatus && (
                  <div
                    className={`p-3 rounded-xl text-center ${
                      registrationStatus.type === "success"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {registrationStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Ваше имя"
                      className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.firstName
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-blue-500"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm">{errors.firstName}</p>
                    )}
                  </div>

                  {/* <div className="space-y-2">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Ваша фамилия"
                      className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.lastName
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-blue-500"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm">{errors.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.birthDate
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-blue-500"
                      }`}
                    />
                    {errors.birthDate && (
                      <p className="text-red-500 text-sm">{errors.birthDate}</p>
                    )}
                  </div> */}

                  <div className="space-y-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Придумайте пароль"
                      className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.password
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-blue-500"
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type="password"
                      value={formData.passwordConfirm}
                      onChange={handleInputChange}
                      placeholder="Подтвердите пароль"
                      className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.passwordConfirm
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-blue-500"
                      }`}
                    />
                    {errors.passwordConfirm && (
                      <p className="text-red-500 text-sm">
                        {errors.passwordConfirm}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      maxLength={12}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Введите номер телефона"
                      className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.phone
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-blue-500"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ваш Email адрес"
                      className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.email
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-blue-500"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        id="agreeToPolicy"
                        name="agreeToPolicy"
                        type="checkbox"
                        checked={formData.agreeToPolicy}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="agreeToPolicy"
                        className="text-sm text-gray-600"
                      >
                        Согласен с{" "}
                        <a
                          href="/documents/Политики_в_отношении_обр_перс_данных.docx"
                          download="Политики_в_отношении_обр_перс_данных.docx"
                          className="text-blue-500 underline"
                        >
                          политикой конфиденциальности
                        </a>
                      </label>
                    </div>
                    {errors.agreeToPolicy && (
                      <p className="text-red-500 text-sm">
                        {errors.agreeToPolicy}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 h-12 font-medium rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex-1 h-12 font-medium rounded-xl transition-colors duration-200 ${
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      {isLoading ? "Регистрация..." : "Подтвердить"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen flex flex-col relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/authpage.jpg"
            alt="Hands working on macramé art"
            className="w-full h-full object-cover"
            width={600}
            height={600}
            priority
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Регистрация</h1>
            </div>

            {/* Status Messages */}
            {registrationStatus && (
              <div
                className={`p-3 rounded-xl text-center mb-4 ${
                  registrationStatus.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {registrationStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Ваше имя"
                  className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.firstName
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* <div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Ваша фамилия"
                  className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.lastName
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  placeholder="Дата рождения"
                  className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.birthDate
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.birthDate}
                  </p>
                )}
              </div> */}

              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Придумайте пароль"
                  className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  placeholder="Подтвердите пароль"
                  className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.passwordConfirm
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                />
                {errors.passwordConfirm && (
                  <p className="text-red-500 text-sm">
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>

              <div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+7 (XXX) XXX-XX-XX"
                  className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.phone
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Ваш Email адрес"
                  className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-start space-x-3">
                  <input
                    id="agreeToPolicy"
                    name="agreeToPolicy"
                    type="checkbox"
                    checked={formData.agreeToPolicy}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  />
                  <label
                    htmlFor="agreeToPolicy"
                    className="text-sm text-gray-700 leading-relaxed"
                  >
                    Согласен с{" "}
                    <a
                      href="/documents/Политики_в_отношении_обр_перс_данных.docx"
                      download="Политики_в_отношении_обр_перс_данных.docx"
                      className="text-blue-500 underline"
                    >
                      политикой конфиденциальности
                    </a>
                  </label>
                </div>
                {errors.agreeToPolicy && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.agreeToPolicy}
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full h-12 font-medium rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full h-12 font-medium rounded-xl transition-colors duration-200 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isLoading ? "Регистрация..." : "Подтвердить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
