// admin/edit-category/page.jsx
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

// Edit Category Page
const EditStickerCategory = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
      setCategoriesLoading(true);
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/categories/`
      );

      if (!response.ok) {
        throw new Error("Ошибка при загрузке категорий");
      }

      const data = await response.json();
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessage({
        type: "error",
        text: error.message || "Ошибка при загрузке категорий",
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFormData({
      title: category.title,
      description: category.description,
    });
    setMessage({ type: "", text: "" });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!selectedCategory) {
      setMessage({
        type: "error",
        text: "Пожалуйста, выберите категорию для редактирования",
      });
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
      // Update category data
      const categoryData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      console.log("Updating category data:", categoryData);

      const categoryResponse = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/categories/${selectedCategory.id}/`,
        {
          method: "PUT", // or PATCH depending on your API
          body: JSON.stringify(categoryData),
        }
      );

      if (!categoryResponse.ok) {
        const errorText = await categoryResponse.text();
        console.error("Category update error:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorText;
        } catch {
          errorMessage = errorText;
        }

        throw new Error(`Ошибка при обновлении категории: ${errorMessage}`);
      }

      const categoryResult = await categoryResponse.json();
      console.log("Category updated:", categoryResult);

      // Update the category in the list
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id ? { ...cat, ...categoryResult } : cat
        )
      );

      // Update selected category
      setSelectedCategory({ ...selectedCategory, ...categoryResult });

      setMessage({
        type: "success",
        text: `Категория "${categoryResult.title}" успешно обновлена!`,
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

  const handleCancelEdit = () => {
    setSelectedCategory(null);
    setFormData({
      title: "",
      description: "",
    });
    setMessage({ type: "", text: "" });
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* Left Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Редактировать категорию
          </h1>
          <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2.5 rounded-full font-medium text-sm w-full sm:w-auto">
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

        {/* Categories Selection Section */}
        {!selectedCategory && (
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Выберите категорию для редактирования
            </h2>

            {/* Search */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Поиск категорий..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={fetchCategories}
                disabled={categoriesLoading}
                className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium disabled:bg-gray-400 w-full sm:w-auto"
              >
                {categoriesLoading ? "Загрузка..." : "Обновить"}
              </button>
            </div>

            {/* Categories List */}
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Загрузка категорий...</p>
                </div>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg">
                  {searchTerm
                    ? "Категории не найдены"
                    : "Нет доступных категорий"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 overflow-y-auto">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    cclassName="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                    onClick={() => handleCategorySelect(category)}
                  >
                    <div className="flex flex-row items-start justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                          {category.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2 text-sm sm:text-base">
                          {category.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                          {category.created_at && (
                            <span>
                              Создана:{" "}
                              {new Date(category.created_at).toLocaleDateString(
                                "ru-RU"
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="sm:ml-4 flex items-center justify-center sm:justify-start">
                        <svg
                          className="w-5 h-5 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit Form Section */}
        {selectedCategory && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Редактирование категории: "{selectedCategory.title}"
              </h2>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Отменить
              </button>
            </div>

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

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mt-12">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full font-medium text-lg hover:bg-gray-50"
                >
                  Отменить
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-10 py-3 rounded-full font-medium text-lg shadow-md ${
                    isLoading
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

      {/* Right Section - Category Preview */}
      <div className="w-80 p-8 hidden md:flex items-start justify-center">
        <div className="w-72">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative">
              <div className="w-full h-32 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center mb-2">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div className="text-xs text-blue-700 font-medium">
                    {selectedCategory ? "Редактирование" : "Превью категории"}
                  </div>
                </div>
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-blue-500 text-sm font-bold">ℹ</span>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-gray-800 font-semibold mb-3 text-lg">
                {formData.title ||
                  selectedCategory?.title ||
                  "Название категории"}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {formData.description ||
                  selectedCategory?.description ||
                  "Описание категории появится здесь..."}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Статус</span>
                  <span className="font-medium">
                    {selectedCategory ? "Редактируется" : "Выбор категории"}
                  </span>
                </div>
                {selectedCategory && (
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                    <span>ID</span>
                    <span className="font-medium">#{selectedCategory.id}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStickerCategory;
