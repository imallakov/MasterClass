// admin/delete-sticker/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

// Delete Sticker Page
const DeleteStickerPage = () => {
  const router = useRouter();
  const { makeAuthenticatedRequest, isAuthenticated, loading } = useAuth();
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

  // Check authentication on component mount
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push("/auth/sign-in");
      return;
    }

    if (!loading && isAuthenticated()) {
      fetchCategories();
    }
  }, [loading, isAuthenticated, router]);

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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/categories/${categoryId}/`
      );

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.stickers && responseData.stickers.results) {
          setStickers(responseData.stickers.results);
        } else if (responseData.results) {
          setStickers(responseData.results);
        } else {
          setStickers(responseData);
        }

        console.log(
          "Stickers data:",
          responseData.stickers?.results || responseData
        );
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
    if (!selectedSticker || !isAuthenticated()) {
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
      // setTimeout(() => {
      //   router.back();
      // }, 2000);
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
  if (loading) {
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
    <div className="flex flex-1 flex-col lg:flex-row">
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
      <div className="flex-1 p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Удалить стикер
          </h1>
          <button
            onClick={() => router.back()}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2.5 rounded-full font-medium text-sm self-start sm:self-auto"
          >
            Назад к списку
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

        {/* Step 1: Category Selection */}
        {currentStep === "category" && (
          <div className="space-y-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-6 lg:mb-8">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 gap-4">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                Выберите стикер для удаления из категории "
                {selectedCategory?.title}"
              </h2>
              <button
                onClick={handleBackToCategories}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-full font-medium text-sm self-start sm:self-auto"
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
                    {/* Image Container - Updated this part */}
                    <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                      {sticker.image ? (
                        <img
                          src={sticker.image}
                          alt={sticker.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}

                      {/* Fallback placeholder - always present but hidden if image loads */}
                      <div
                        className={`w-24 h-32 bg-white rounded-lg shadow-sm flex items-center justify-center ${
                          sticker.image ? "absolute" : ""
                        }`}
                        style={{ display: sticker.image ? "none" : "flex" }}
                      >
                        <div className="text-center">
                          <div className="w-16 h-20 bg-gray-200 rounded mb-2 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="text-xs text-gray-500">
                            Изображение
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {sticker.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          ID: {sticker.id}
                        </span>
                        <span className="text-xl font-bold text-red-600">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 gap-4">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                Подтверждение удаления стикера
              </h2>
              <button
                onClick={handleBackToStickers}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-full font-medium text-sm self-start sm:self-auto"
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
                    {selectedSticker?.wb_link && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Ссылка Wildberries:
                        </span>
                        <p className="text-gray-900 text-sm break-all">
                          {selectedSticker.wb_link}
                        </p>
                      </div>
                    )}
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
    </div>
  );
};

export default DeleteStickerPage;
