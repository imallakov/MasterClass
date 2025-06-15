// admin/add-sticker/page.jsx
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

// Add Sticker Page
const AddStickerPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    image: "",
    category: "",
    wb_link: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

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

  // Fetch categories when component mounts and token is available
  useEffect(() => {
    if (accessToken) {
      fetchCategories();
    }
  }, [accessToken]);

  const fetchCategories = async () => {
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/categories/`,
        {
          method: "GET",
          headers: headers,
          credentials: "include",
        }
      );

      if (response.ok) {
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } else {
        console.warn("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
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
      // For demo purposes, we'll create a temporary URL
      // In a real app, you'd upload this to your server first
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

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const headers = {
      Accept: "application/json",
      ...options.headers,
    };

    // Only set Content-Type to application/json if it's not a FormData upload
    if (!options.body || !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

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
      // Create FormData with all sticker data including the image file
      const formDataForSubmission = new FormData();
      formDataForSubmission.append("title", formData.title.trim());
      formDataForSubmission.append(
        "price",
        parseFloat(formData.price).toFixed(2)
      );
      formDataForSubmission.append("category", parseInt(formData.category));

      formDataForSubmission.append("wb_link", formData.wb_link.trim());

      // Add the actual file, not the blob URL
      if (selectedFile) {
        formDataForSubmission.append("image", selectedFile);
      }

      console.log("Submitting sticker with FormData");
      console.log("Title:", formData.title.trim());
      console.log("Price:", parseFloat(formData.price).toFixed(2));
      console.log("Category:", parseInt(formData.category));
      console.log("File:", selectedFile ? selectedFile.name : "No file");

      // Prepare headers (don't set Content-Type for FormData)
      const headers = {
        Accept: "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      if (csrfToken) {
        headers["X-CSRFTOKEN"] = csrfToken;
      }

      const stickerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/`,
        {
          method: "POST",
          headers: headers,
          body: formDataForSubmission,
          credentials: "include",
        }
      );

      if (!stickerResponse.ok) {
        const errorText = await stickerResponse.text();
        console.error("Sticker creation error:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorText;
        } catch {
          errorMessage = errorText;
        }

        throw new Error(`Ошибка при создании стикера: ${errorMessage}`);
      }

      const stickerResult = await stickerResponse.json();
      console.log("Sticker created:", stickerResult);

      setMessage({
        type: "success",
        text: `Стикер "${stickerResult.title}" успешно создан!`,
      });

      // Reset form
      setFormData({
        title: "",
        price: "",
        image: "",
        category: "",
        wb_link: "",
      });
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
          <h1 className="text-3xl font-bold text-gray-900">Добавить стикер</h1>
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
            Создание стикера
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Add Sticker Name */}
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

            {/* Set Price */}
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
              {loadingCategories ? (
                <div className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-500">
                  Загрузка категорий...
                </div>
              ) : (
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
              )}
            </div>

            {/* WB Link Input */}
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

            {/* Upload Image */}
            <div>
              <label className="block text-gray-900 font-medium mb-3 text-base">
                Загрузить изображение *
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-300 cursor-pointer bg-gray-50">
                <input
                  type="file"
                  className="hidden"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
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
                        Файл загружен: {selectedFile.name}
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
                        Нажмите для загрузки изображения
                      </span>
                    </div>
                  )}
                </label>
              </div>
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

      {/* Right Section - Product Card Preview */}
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
            </div>
            <div className="p-6">
              <h3 className="text-gray-600 font-medium mb-1">
                {formData.title || "Название стикера"}
              </h3>
              <h4 className="text-gray-600 font-medium mb-4 text-sm">
                {formData.category && categories.length > 0
                  ? categories.find(
                      (cat) => cat.id === parseInt(formData.category)
                    )?.name || "Категория"
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
    </div>
  );
};

export default AddStickerPage;
