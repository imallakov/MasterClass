// admin/delete-category/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

// Delete Category Page
const DeleteStickerCategory = () => {
  const router = useRouter();
  const { makeAuthenticatedRequest, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/sign-in");
      return;
    }
    fetchCategories();
  }, [router, isAuthenticated]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      setDeleteLoading(categoryToDelete.id);
      setMessage({ type: "", text: "" });

      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/categories/${categoryToDelete.id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete error:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorText;
        } catch {
          errorMessage = errorText;
        }

        throw new Error(`Ошибка при удалении категории: ${errorMessage}`);
      }

      // Remove deleted category from the list
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryToDelete.id)
      );

      setMessage({
        type: "success",
        text: `Категория "${categoryToDelete.title}" успешно удалена!`,
      });

      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Ошибка при удалении категории",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading while checking authentication
  if (!isAuthenticated()) {
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
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Удалить категорию
          </h1>
          <button className="bg-pink-400 hover:bg-pink-500 text-white px-4 md:px-6 py-2.5 rounded-full font-medium text-sm w-full sm:w-auto">
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

        {/* Search and Filter Section */}
        <div className="mb-6">
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
              disabled={isLoading}
              className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium disabled:bg-gray-400 w-full sm:w-auto"
            >
              {isLoading ? "Загрузка..." : "Обновить"}
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Список категорий ({filteredCategories.length})
          </h2>

          {isLoading ? (
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
              {searchTerm && (
                <p className="text-gray-500 text-sm mt-2">
                  Попробуйте изменить поисковый запрос
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm md:text-base">
                        {category.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs md:text-sm text-gray-500">
                        {category.created_at && (
                          <span>
                            Создана:{" "}
                            {new Date(category.created_at).toLocaleDateString(
                              "ru-RU"
                            )}
                          </span>
                        )}
                        {category.stickers_count !== undefined && (
                          <span>Стикеров: {category.stickers_count}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      disabled={deleteLoading === category.id}
                      className={`sm:ml-4 px-3 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-colors w-full sm:w-auto ${
                        deleteLoading === category.id
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {deleteLoading === category.id ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Удаление...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span>Удалить</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.966-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Подтвердите удаление
              </h3>
              <p className="text-gray-600 mb-6">
                Вы уверены, что хотите удалить категорию <br />
                <strong>"{categoryToDelete.title}"</strong>?
                <br />
                <span className="text-sm text-red-600 mt-2 block">
                  Это действие нельзя отменить!
                </span>
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleteLoading === categoryToDelete.id}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                >
                  Отмена
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading === categoryToDelete.id}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {deleteLoading === categoryToDelete.id
                    ? "Удаление..."
                    : "Удалить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteStickerCategory;
