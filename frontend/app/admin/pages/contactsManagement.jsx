// admin/contacts/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

// Contacts Management Page
const ContactsPage = () => {
  const router = useRouter();
  const { makeAuthenticatedRequest } = useAuth();
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
  const [hasExistingContacts, setHasExistingContacts] = useState(false);
  const [contactsId, setContactsId] = useState(null); // Store the ID for PATCH requests

  // // Check authentication on component mount
  // useEffect(() => {
  //   const token = localStorage.getItem("access_token");
  //   if (!token) {
  //     router.push("/auth/sign-in");
  //     return;
  //   }
  //   setAccessToken(token);

  //   // Get CSRF token
  //   const csrf = getCsrfTokenFromCookie();
  //   setCsrfToken(csrf || "");
  // }, [router]);

  // Fetch existing contacts when component mounts and token is available
  useEffect(() => {
    fetchContacts();
  }, [router]);

  const fetchContacts = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/configs/contacts/`,
        {
          method: "GET",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
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

      const method = hasExistingContacts ? "PATCH" : "POST";
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/configs/contacts/`;

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

      if (result.id) {
        setContactsId(result.id);
      }

      setMessage({
        type: "success",
        text: "Контактная информация успешно обновлена!",
      });

      setHasExistingContacts(true);
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

  // // Show loading while checking authentication
  // if (accessToken === null) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Проверка авторизации...</p>
  //       </div>
  //     </div>
  //   );
  // }

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
    </div>
  );
};

export default ContactsPage;
