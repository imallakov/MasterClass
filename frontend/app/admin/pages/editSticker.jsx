// admin/edit-sticker/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

// Edit Sticker Page
const EditStickerPage = () => {
  const router = useRouter();
  const { makeAuthenticatedRequest, isAuthenticated, loading } = useAuth();

  // Step management
  const [currentStep, setCurrentStep] = useState("category"); // "category", "sticker", "edit"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSticker, setSelectedSticker] = useState(null);

  // Categories and stickers data
  const [categories, setCategories] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingStickers, setLoadingStickers] = useState(false);

  // Form data for editing
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    image: "",
    category: "",
    wb_link: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);

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
    const updatedFormData = {
      title: sticker.title || "",
      price: sticker.price ? sticker.price.toString() : "",
      image: sticker.image || "",
      category: sticker.category ? sticker.category.toString() : "",
      wb_link: sticker.wb_link || "",
    };
    setFormData(updatedFormData);
    setOriginalData(updatedFormData);
    setCurrentStep("edit");
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
    setFormData({
      title: "",
      price: "",
      image: "",
      category: "",
      wb_link: "",
    });
    setOriginalData(null);
    setImageChanged(false);
    setSelectedFile(null);
    setMessage({ type: "", text: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageChanged(true);
      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setMessage({
        type: "error",
        text: "Пожалуйста, введите название стикера",
      });
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setMessage({
        type: "error",
        text: "Пожалуйста, введите корректную стоимость",
      });
      return false;
    }
    if (!formData.category) {
      setMessage({
        type: "error",
        text: "Пожалуйста, выберите категорию",
      });
      return false;
    }
    if (!formData.image) {
      setMessage({ type: "error", text: "Пожалуйста, загрузите изображение" });
      return false;
    }

    if (!formData.wb_link.trim()) {
      setMessage({
        type: "error",
        text: "Пожалуйста, введите ссылку на Wildberries",
      });
      return false;
    }
    // ADD URL VALIDATION
    try {
      new URL(formData.wb_link);
    } catch {
      setMessage({
        type: "error",
        text: "Пожалуйста, введите корректную ссылку",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!isAuthenticated()) {
      setMessage({
        type: "error",
        text: "Не авторизован. Пожалуйста, войдите в систему.",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      let response;

      if (imageChanged && selectedFile) {
        // Use PUT with FormData if image was changed
        const formDataForSubmission = new FormData();
        formDataForSubmission.append("title", formData.title.trim());
        formDataForSubmission.append(
          "price",
          parseFloat(formData.price).toFixed(2)
        );
        formDataForSubmission.append("category", parseInt(formData.category));
        formDataForSubmission.append("wb_link", formData.wb_link.trim());
        formDataForSubmission.append("image", selectedFile);

        response = await makeAuthenticatedRequest(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/${selectedSticker.id}/`,
          {
            method: "PUT",
            body: formDataForSubmission,
          }
        );
      } else {
        // Use PATCH with JSON if only text fields changed
        const updateData = {
          title: formData.title.trim(),
          price: parseFloat(formData.price).toFixed(2),
          category: parseInt(formData.category),
          wb_link: formData.wb_link.trim(),
        };

        response = await makeAuthenticatedRequest(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/${selectedSticker.id}/`,
          {
            method: "PATCH",
            body: JSON.stringify(updateData),
          }
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorText;
        } catch {
          errorMessage = errorText;
        }
        throw new Error(`Ошибка при обновлении стикера: ${errorMessage}`);
      }

      const stickerResult = await response.json();

      setMessage({
        type: "success",
        text: `Стикер "${stickerResult.title}" успешно обновлен!`,
      });

      // Update original data
      setOriginalData({ ...formData });
      setImageChanged(false);
      setSelectedFile(null);

      // Reset file input
      const fileInput = document.getElementById("image-upload");
      if (fileInput) fileInput.value = "";
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

  const handleCancel = () => {
    if (originalData) {
      setFormData({ ...originalData });
      setImageChanged(false);
      setSelectedFile(null);
      setMessage({ type: "", text: "" });

      // Reset file input
      const fileInput = document.getElementById("image-upload");
      if (fileInput) fileInput.value = "";
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    return (
      formData.title !== originalData.title ||
      formData.price !== originalData.price ||
      formData.category !== originalData.category ||
      formData.wb_link !== originalData.wb_link ||
      imageChanged
    );
  };

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
      {/* Left Content */}
      <div className="flex-1 p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Редактировать стикер
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
                    className="p-6 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md cursor-pointer transition-all duration-200 bg-white"
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
                Выберите стикер из категории "{selectedCategory?.title}"
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
                  В этой категории нет стикеров для редактирования
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    onClick={() => handleStickerSelect(sticker)}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 overflow-hidden border border-gray-200 hover:border-blue-400"
                  >
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

        {/* Step 3: Edit Form */}
        {currentStep === "edit" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Редактирование стикера "{selectedSticker?.title}"
              </h2>
              <button
                onClick={handleBackToStickers}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-full font-medium text-sm"
              >
                Назад к стикерам
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Edit Sticker Name */}
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Название стикера *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Название стикера"
                  required
                />
              </div>

              {/* Edit Price */}
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Стоимость *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Стоимость в рублях"
                  required
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Категория *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* WB Link Input - ADD THIS ENTIRE SECTION */}
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Ссылка на Wildberries *
                </label>
                <input
                  type="url"
                  name="wb_link"
                  value={formData.wb_link}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="https://www.wildberries.ru/catalog/..."
                  required
                />
              </div>

              {/* Upload New Image */}
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Изображение{" "}
                  {imageChanged && (
                    <span className="text-sm text-orange-600">(изменено)</span>
                  )}
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-300 cursor-pointer bg-gray-50">
                  <input
                    type="file"
                    className="hidden"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {selectedFile ? (
                      <div className="text-green-600">
                        <svg
                          className="mx-auto h-12 w-12 mb-4"
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
                        <span className="font-medium">
                          Новый файл выбран: {selectedFile.name}
                        </span>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <svg
                          className="mx-auto h-12 w-12 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="font-medium">
                          Нажмите для загрузки нового изображения
                        </span>
                        <div className="text-sm text-gray-400 mt-2">
                          Оставьте пустым, чтобы сохранить текущее изображение
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-12">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={!hasChanges() || isLoading}
                  className={`px-8 py-3 rounded-full font-medium text-lg ${
                    !hasChanges() || isLoading
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-gray-500 hover:bg-gray-600 text-white"
                  }`}
                >
                  Отменить
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !hasChanges()}
                  className={`px-10 py-3 rounded-full font-medium text-lg shadow-md ${
                    isLoading || !hasChanges()
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-[#64A0CE] hover:bg-[#6598c0] text-white"
                  }`}
                >
                  {isLoading ? "Сохранение..." : "Сохранить изменения"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Right Section - Product Card Preview */}
      {currentStep === "edit" && (
        <div className="w-80 p-8 flex items-start justify-center">
          <div className="w-72">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative">
                <div className="w-full h-56 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                  {formData.image ? (
                    <img
                      src={formData.image}
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
                <button className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-blue-500 text-sm font-bold">ℹ</span>
                </button>
                {imageChanged && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Изменено
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-gray-600 font-medium mb-1">
                  {formData.title || "Название стикера"}
                </h3>
                <h4 className="text-gray-600 font-medium mb-4 text-sm">
                  {formData.category && categories.length > 0
                    ? categories.find(
                        (cat) => cat.id === parseInt(formData.category)
                      )?.title || "Категория"
                    : "Категория"}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Стикер</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {formData.price ? `${formData.price} ₽` : "0 ₽"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditStickerPage;
