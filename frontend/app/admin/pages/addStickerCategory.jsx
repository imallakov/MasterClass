// admin/add-category/page.jsx
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

// Add Category Page
const AddStickerCategory = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setMessage({
        type: "error",
        text: "Пожалуйста, введите название категории",
      });
      return false;
    }
    if (!formData.description.trim()) {
      setMessage({
        type: "error",
        text: "Пожалуйста, введите описание категории",
      });
      return false;
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
      // Create category data
      const categoryData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      console.log("Submitting category data:", categoryData);

      const categoryResponse = await makeAuthenticatedRequest(
        "http://localhost:8000/api/stickers/categories/",
        {
          method: "POST",
          body: JSON.stringify(categoryData),
        }
      );

      if (!categoryResponse.ok) {
        const errorText = await categoryResponse.text();
        console.error("Category creation error:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorText;
        } catch {
          errorMessage = errorText;
        }

        throw new Error(`Ошибка при создании категории: ${errorMessage}`);
      }

      const categoryResult = await categoryResponse.json();
      console.log("Category created:", categoryResult);

      setMessage({
        type: "success",
        text: `Категория "${categoryResult.title}" успешно создана!`,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
      });
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Добавить категорию
          </h1>
          <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2.5 rounded-full font-medium text-sm">
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
          <h2 className="text-xl font-semibold text-gray-900 mb-8">
            Создание категории
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Title */}
            <div>
              <label className="block text-gray-900 font-medium mb-3 text-base">
                Название категории *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                placeholder="Название категории"
                required
              />
            </div>

            {/* Category Description */}
            <div>
              <label className="block text-gray-900 font-medium mb-3 text-base">
                Описание категории *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 resize-vertical"
                placeholder="Описание категории"
                required
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
                {isLoading ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Category Preview */}
      <div className="w-80 p-8 flex items-start justify-center">
        <div className="w-72">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative">
              <div className="w-full h-32 bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center mb-2">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div className="text-xs text-purple-700 font-medium">
                    Превью категории
                  </div>
                </div>
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-purple-500 text-sm font-bold">ℹ</span>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-gray-800 font-semibold mb-3 text-lg">
                {formData.title || "Название категории"}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {formData.description || "Описание категории появится здесь..."}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Тип</span>
                  <span className="font-medium">Категория</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStickerCategory;
