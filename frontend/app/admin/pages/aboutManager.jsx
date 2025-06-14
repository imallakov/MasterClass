// admin/about/page.jsx
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

// About Management Page
const AboutPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [hasExistingAbout, setHasExistingAbout] = useState(false);
  const [aboutId, setAboutId] = useState(null); // Store the ID for PATCH requests

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

  // Fetch existing about data when component mounts and token is available
  useEffect(() => {
    if (accessToken) {
      fetchAbout();
    }
  }, [accessToken]);

  const fetchAbout = async () => {
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/configs/about/`,
        {
          method: "GET",
          headers: headers,
          credentials: "include",
        }
      );

      if (response.ok) {
        const aboutData = await response.json();
        console.log("Fetched about data:", aboutData);

        if (
          aboutData &&
          (aboutData.id !== undefined || Object.keys(aboutData).length > 1)
        ) {
          // Store the ID for future PATCH requests
          setAboutId(aboutData.id);

          // Populate form with existing data
          setFormData({
            title: aboutData.title || "",
            description: aboutData.description || "",
            image: aboutData.image || "",
          });

          // Set image preview if image exists
          if (aboutData.image) {
            setImagePreview(aboutData.image);
          }
          setHasExistingAbout(true);
        } else {
          // No existing about data found
          setHasExistingAbout(false);
        }
      } else if (response.status === 404) {
        // No about data found - this is normal for new users
        setHasExistingAbout(false);
        console.log("No existing about data found (404)");
      } else {
        console.warn("Failed to fetch about data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage({
          type: "error",
          text: "Пожалуйста, выберите файл изображения",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Размер файла не должен превышать 5MB",
        });
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear any previous error messages
      setMessage({ type: "", text: "" });
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" }));
    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const validateForm = () => {
    const { title, description } = formData;

    // Check if at least title or description is filled
    if (!title.trim() && !description.trim()) {
      setMessage({
        type: "error",
        text: "Пожалуйста, заполните хотя бы заголовок или описание",
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

    // Only add Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
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
      // Prepare data for submission
      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("description", formData.description.trim());

      // Add image file if selected
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      console.log(
        "Submitting about data with image:",
        imageFile ? imageFile.name : "no image"
      );
      console.log("Using method:", hasExistingAbout ? "PATCH" : "POST");
      console.log("About ID:", aboutId);

      // Use PATCH if we have existing data, POST if creating new
      const method = hasExistingAbout ? "PATCH" : "POST";
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/configs/about/`;

      const response = await makeAuthenticatedRequest(url, {
        method: method,
        body: submitData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("About update error:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorText;
        } catch {
          errorMessage = errorText;
        }

        throw new Error(`Ошибка при обновлении информации: ${errorMessage}`);
      }

      const result = await response.json();
      console.log("About updated:", result);

      // Update local state with the response
      if (result.id) {
        setAboutId(result.id);
      }

      setMessage({
        type: "success",
        text: "Информация о компании успешно обновлена!",
      });

      setHasExistingAbout(true);

      // Refresh about data to ensure UI is in sync
      await fetchAbout();
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
          <h1 className="text-3xl font-bold text-gray-900">О компании</h1>
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
            {hasExistingAbout
              ? "Редактирование информации о компании"
              : "Настройка информации о компании"}
          </h2>

          {isFetching ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Загрузка информации...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Заголовок *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Название компании или заголовок раздела"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Описание *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 resize-none"
                  placeholder="Расскажите о вашей компании, миссии, ценностях и достижениях..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Изображение
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-sm text-gray-500">
                    Поддерживаемые форматы: JPG, PNG, GIF. Максимальный размер:
                    5MB
                  </p>

                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Предварительный просмотр"
                        className="max-w-full h-auto max-h-64 rounded-lg mx-auto border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
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
                  {isLoading
                    ? "Сохранение..."
                    : hasExistingAbout
                    ? "Обновить"
                    : "Сохранить"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Section - About Info Preview */}
      <div className="w-80 p-8 flex items-start justify-center">
        <div className="w-72">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative">
              {imagePreview ? (
                <div className="w-full h-56 overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="О компании"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-56 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg
                      className="mx-auto h-16 w-16 mb-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9H21ZM19 21H5V3H14V9H19V21Z" />
                    </svg>
                    <h3 className="text-lg font-semibold">О компании</h3>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6">
              {formData.title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {formData.title}
                </h3>
              )}

              {formData.description ? (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {formData.description.length > 150
                    ? `${formData.description.substring(0, 150)}...`
                    : formData.description}
                </p>
              ) : (
                !formData.title && (
                  <div className="text-center text-gray-500 text-sm py-4">
                    Заполните информацию о компании для предварительного
                    просмотра
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
