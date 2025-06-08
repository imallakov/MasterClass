// admin/delete-sticker/page.jsx
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

// Delete Sticker Page
const DeleteStickerPage = () => {
  const router = useRouter();

  // Step management
  const [currentStep, setCurrentStep] = useState("category"); // "category", "sticker", "confirm"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSticker, setSelectedSticker] = useState(null);

  // Categories and stickers data
  const [categories, setCategories] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingStickers, setLoadingStickers] = useState(false);

  // Deletion state
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Authentication
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

  // Fetch categories when token is available
  useEffect(() => {
    if (accessToken) {
      fetchCategories();
    }
  }, [accessToken]);

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

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/categories/`
      );

      if (response.ok) {
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } else {
        setMessage({
          type: "error",
          text: "Ошибка при загрузке категорий",
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessage({
        type: "error",
        text: "Ошибка при загрузке категорий",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchStickers = async (categoryId) => {
    try {
      setLoadingStickers(true);
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/?category=${categoryId}`
      );

      if (response.ok) {
        const stickersData = await response.json();
        setStickers(stickersData.results || stickersData);
      } else {
        setMessage({
          type: "error",
          text: "Ошибка при загрузке стикеров",
        });
      }
    } catch (error) {
      console.error("Error fetching stickers:", error);
      setMessage({
        type: "error",
        text: "Ошибка при загрузке стикеров",
      });
    } finally {
      setLoadingStickers(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentStep("sticker");
    fetchStickers(category.id);
    setMessage({ type: "", text: "" });
  };

  const handleStickerSelect = (sticker) => {
    setSelectedSticker(sticker);
    setCurrentStep("confirm");
    setMessage({ type: "", text: "" });
  };

  const handleBackToCategories = () => {
    setCurrentStep("category");
    setSelectedCategory(null);
    setStickers([]);
    setMessage({ type: "", text: "" });
  };

  const handleBackToStickers = () => {
    setCurrentStep("sticker");
    setSelectedSticker(null);
    setMessage({ type: "", text: "" });
  };

  const handleDeleteConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleDeleteCancel = () => {
    setShowConfirmModal(false);
  };

  const handleDeleteSticker = async () => {
    if (!selectedSticker || !accessToken) {
      setMessage({
        type: "error",
        text: "Не авторизован или стикер не выбран.",
      });
      return;
    }

    setIsDeleting(true);
    setMessage({ type: "", text: "" });
    setShowConfirmModal(false);

    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/${selectedSticker.id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorText;
        } catch {
          errorMessage = errorText;
        }
        throw new Error(`Ошибка при удалении стикера: ${errorMessage}`);
      }

      setMessage({
        type: "success",
        text: `Стикер "${selectedSticker.title}" успешно удален!`,
      });

      // Wait a moment to show success message, then redirect
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Ошибка соединения с сервером",
      });
    } finally {
      setIsDeleting(false);
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
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Подтвердите удаление
              </h3>
              <p className="text-gray-600 mb-6">
                Вы действительно хотите удалить стикер "{selectedSticker?.title}
                "?
                <br />
                <span className="text-red-600 font-medium">
                  Это действие нельзя отменить.
                </span>
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleDeleteCancel}
                  className="px-6 py-2.5 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-medium"
                >
                  Отмена
                </button>
                <button
                  onClick={handleDeleteSticker}
                  disabled={isDeleting}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium disabled:opacity-50"
                >
                  {isDeleting ? "Удаление..." : "Удалить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Удалить стикер</h1>
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

        {/* Step 1: Category Selection */}
        {currentStep === "category" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">
              Выберите категорию
            </h2>

            {loadingCategories ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">
                  Загрузка категорий...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="p-6 border border-gray-200 rounded-xl hover:border-red-400 hover:shadow-md cursor-pointer transition-all duration-200 bg-white"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Sticker Selection */}
        {currentStep === "sticker" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Выберите стикер для удаления из категории "
                {selectedCategory?.title}"
              </h2>
              <button
                onClick={handleBackToCategories}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-full font-medium text-sm"
              >
                Назад к категориям
              </button>
            </div>

            {loadingStickers ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Загрузка стикеров...</span>
              </div>
            ) : stickers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  В этой категории нет стикеров для удаления
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    onClick={() => handleStickerSelect(sticker)}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 overflow-hidden border border-gray-200 hover:border-red-400 relative group"
                  >
                    {/* Delete overlay on hover */}
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 z-10 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {/* <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </div> */}
                      </div>
                    </div>

                    <div className="h-48 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                      {sticker.image ? (
                        <img
                          src={sticker.image}
                          alt={sticker.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-24 h-32 bg-white rounded-lg shadow-sm flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-20 bg-gray-300 rounded mb-2"></div>
                            <div className="text-xs text-gray-500">Стикер</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {sticker.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Стикер</span>
                        <span className="text-xl font-bold text-gray-800">
                          {sticker.price} ₽
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === "confirm" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Подтверждение удаления стикера
              </h2>
              <button
                onClick={handleBackToStickers}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-full font-medium text-sm"
              >
                Назад к стикерам
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-red-600"
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
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Внимание!
                  </h3>
                  <p className="text-red-800">
                    Вы собираетесь удалить стикер "{selectedSticker?.title}".
                    Это действие нельзя отменить. Все данные о стикере будут
                    удалены навсегда.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Информация о стикере
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Название:
                      </span>
                      <p className="text-gray-900">{selectedSticker?.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Цена:
                      </span>
                      <p className="text-gray-900">
                        {selectedSticker?.price} ₽
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Категория:
                      </span>
                      <p className="text-gray-900">{selectedCategory?.title}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg flex items-center justify-center">
                    {selectedSticker?.image ? (
                      <img
                        src={selectedSticker.image}
                        alt={selectedSticker.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-white rounded shadow-sm flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-16 bg-gray-300 rounded mb-1"></div>
                          <div className="text-xs text-gray-500">Стикер</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-12">
              <button
                onClick={handleBackToStickers}
                disabled={isDeleting}
                className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium text-lg disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-10 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium text-lg shadow-md disabled:opacity-50"
              >
                {isDeleting ? "Удаление..." : "Удалить стикер"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Section - Selected Sticker Preview */}
      {/* {currentStep === "confirm" && selectedSticker && (
        <div className="w-80 p-8 flex items-start justify-center">
          <div className="w-72">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-red-200">
              <div className="relative">
                <div className="w-full h-56 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                  {selectedSticker.image ? (
                    <img
                      src={selectedSticker.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-32 bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-20 bg-gray-300 rounded mb-2"></div>
                        <div className="text-xs text-gray-500">
                          Превью стикера
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shadow-sm">
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  К удалению
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-gray-600 font-medium mb-1">
                  {selectedSticker.title}
                </h3>
                <h4 className="text-gray-600 font-medium mb-4 text-sm">
                  {selectedCategory?.title}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Стикер</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {selectedSticker.price} ₽
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default DeleteStickerPage;
