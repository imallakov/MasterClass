// admin/contacts/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

// Contacts Management Page
const ContactsPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone_number: "",
    email: "",
    address: "",
    telegram_id: "",
    vk_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [hasExistingContacts, setHasExistingContacts] = useState(false);
  const [contactsId, setContactsId] = useState(null); // Store the ID for PATCH requests

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/sign-in");
      return;
    }
    setAccessToken(token);

    // Get CSRF token
    const csrf = getCsrfTokenFromCookie();
    setCsrfToken(csrf || "");
  }, [router]);

  // Fetch existing contacts when component mounts and token is available
  useEffect(() => {
    if (accessToken) {
      fetchContacts();
    }
  }, [accessToken]);

  const fetchContacts = async () => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      if (csrfToken) {
        headers["X-CSRFTOKEN"] = csrfToken;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/configs/contacts/`,
        {
          method: "GET",
          headers: headers,
          credentials: "include",
        }
      );

      if (response.ok) {
        const contactsData = await response.json();
        console.log("Fetched contacts data:", contactsData);

        if (
          contactsData &&
          (contactsData.id !== undefined ||
            Object.keys(contactsData).length > 1)
        ) {
          // Store the ID for future PATCH requests
          setContactsId(contactsData.id);

          // Populate form with existing data
          setFormData({
            phone_number: contactsData.phone_number || "",
            email: contactsData.email || "",
            address: contactsData.address || "",
            telegram_id: contactsData.telegram_id || "",
            vk_id: contactsData.vk_id || "",
          });
          setHasExistingContacts(true);
        } else {
          // No existing contacts found
          setHasExistingContacts(false);
        }
      } else if (response.status === 404) {
        // No contacts found - this is normal for new users
        setHasExistingContacts(false);
        console.log("No existing contacts found (404)");
      } else {
        console.warn("Failed to fetch contacts:", response.status);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { phone_number, email, address, telegram_id, vk_id } = formData;

    // Check if at least one field is filled
    if (
      !phone_number.trim() &&
      !email.trim() &&
      !address.trim() &&
      !telegram_id.trim() &&
      !vk_id.trim()
    ) {
      setMessage({
        type: "error",
        text: "Пожалуйста, заполните хотя бы одно поле контактной информации",
      });
      return false;
    }

    // Validate email format if provided
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setMessage({
          type: "error",
          text: "Пожалуйста, введите корректный email адрес",
        });
        return false;
      }
    }

    // Validate phone number format if provided (basic validation)
    if (phone_number.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(phone_number.replace(/[\s\-\(\)]/g, ""))) {
        setMessage({
          type: "error",
          text: "Пожалуйста, введите корректный номер телефона",
        });
        return false;
      }
    }

    return true;
  };

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add authentication token
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Add CSRF token if available
    if (csrfToken) {
      headers["X-CSRFTOKEN"] = csrfToken;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    // Handle token expiration
    if (response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.push("/auth/sign-in");
      throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
    }

    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!accessToken) {
      setMessage({
        type: "error",
        text: "Не авторизован. Пожалуйста, войдите в систему.",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Prepare data for submission
      const contactsData = {
        phone_number: formData.phone_number.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        telegram_id: formData.telegram_id.trim(),
        vk_id: formData.vk_id.trim(),
      };

      console.log("Submitting contacts data:", contactsData);
      console.log("Using method:", hasExistingContacts ? "PATCH" : "POST");
      console.log("Contacts ID:", contactsId);

      // Use PATCH if we have existing contacts, POST if creating new
      const method = hasExistingContacts ? "PATCH" : "POST";
      const url =
        hasExistingContacts && contactsId
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/configs/contacts/`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/configs/contacts/`;

      const response = await makeAuthenticatedRequest(url, {
        method: method,
        body: JSON.stringify(contactsData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Contacts update error:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorText;
        } catch {
          errorMessage = errorText;
        }

        throw new Error(`Ошибка при обновлении контактов: ${errorMessage}`);
      }

      const result = await response.json();
      console.log("Contacts updated:", result);

      // Update local state with the response
      if (result.id) {
        setContactsId(result.id);
      }

      setMessage({
        type: "success",
        text: "Контактная информация успешно обновлена!",
      });

      setHasExistingContacts(true);

      // Refresh contacts data to ensure UI is in sync
      await fetchContacts();
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Ошибка соединения с сервером",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (accessToken === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      {/* Left Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Добавить мастер - класс
          </h1>
          <button className="bg-pink-400 hover:bg-pink-500 text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-full font-medium text-sm whitespace-nowrap">
            Отключить блок
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form Section */}
        <div className="space-y-6">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-6 lg:mb-8">
            {hasExistingContacts
              ? "Редактирование контактной информации"
              : "Настройка контактной информации"}
          </h2>

          {isFetching ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Загрузка контактов...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Number */}
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Email адрес
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="example@domain.com"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Адрес
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 resize-none"
                  placeholder="Укажите полный адрес..."
                />
              </div>

              {/* Telegram ID */}
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Telegram ID
                </label>
                <input
                  type="text"
                  name="telegram_id"
                  value={formData.telegram_id}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="@username или ссылка на Telegram"
                />
              </div>

              {/* VK ID */}
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  VK ID
                </label>
                <input
                  type="text"
                  name="vk_id"
                  value={formData.vk_id}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="vk.com/username или ID"
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-center mt-12">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-10 py-3 rounded-full font-medium text-lg shadow-md ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-[#64A0CE] hover:bg-[#6598c0] text-white"
                  }`}
                >
                  {isLoading
                    ? "Сохранение..."
                    : hasExistingContacts
                    ? "Обновить"
                    : "Сохранить"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Section - Contact Info Preview */}
      {/* <div className="w-80 p-8 flex items-start justify-center">
        <div className="w-72">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative">
              <div className="w-full h-56 bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg
                    className="mx-auto h-16 w-16 mb-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9H21ZM19 21H5V3H14V9H19V21Z" />
                  </svg>
                  <h3 className="text-lg font-semibold">
                    Контактная информация
                  </h3>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                {formData.phone_number && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-blue-500">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">
                      {formData.phone_number}
                    </span>
                  </div>
                )}

                {formData.email && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-blue-500">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 break-all">
                      {formData.email}
                    </span>
                  </div>
                )}

                {formData.address && (
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 text-blue-500 mt-0.5">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">
                      {formData.address}
                    </span>
                  </div>
                )}

                {formData.telegram_id && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-blue-500">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 break-all">
                      {formData.telegram_id}
                    </span>
                  </div>
                )}

                {formData.vk_id && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-blue-500">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zM18.58 16.23h-2.12c-.64 0-.84-.51-2-1.62-.99-.99-1.43-.99-1.68-.99-.34 0-.44.1-.44.58v1.48c0 .4-.13.64-1.18.64-1.77 0-3.74-.99-5.13-2.82C3.77 10.77 3.29 8.68 3.29 8.15c0-.25.1-.48.58-.48h2.12c.43 0 .59.2.76.66.85 2.33 2.29 4.37 2.88 4.37.22 0 .32-.1.32-.66V9.72c-.07-1.11-.65-1.21-.65-1.6 0-.2.16-.4.42-.4h3.32c.36 0 .49.18.49.64v3.44c0 .36.16.49.26.49.22 0 .4-.13.81-.53 1.24-1.39 2.13-3.54 2.13-3.54.12-.26.31-.5.74-.5h2.12c.53 0 .65.27.53.64-.18.55-2.34 4.18-2.34 4.18-.19.32-.26.46 0 .78 1.91 2.22 2.08 3.32 2.08 3.48-.01.41-.31.62-.75.62z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 break-all">
                      {formData.vk_id}
                    </span>
                  </div>
                )}

                {!formData.phone_number &&
                  !formData.email &&
                  !formData.address &&
                  !formData.telegram_id &&
                  !formData.vk_id && (
                    <div className="text-center text-gray-500 text-sm py-4">
                      Заполните контактную информацию для предварительного
                      просмотра
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ContactsPage;
