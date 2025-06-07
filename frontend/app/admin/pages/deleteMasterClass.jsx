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

const DeleteMasterClassPage = () => {
  const router = useRouter();
  const [masterclasses, setMasterclasses] = useState([]);
  const [isLoadingMasterclasses, setIsLoadingMasterclasses] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    masterclass: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Fetch masterclasses when component mounts and token is available
  useEffect(() => {
    if (accessToken) {
      fetchMasterclasses();
    }
  }, [accessToken]);

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

  const fetchMasterclasses = async () => {
    setIsLoadingMasterclasses(true);
    try {
      const response = await makeAuthenticatedRequest(
        "http://localhost:8000/api/masterclasses/"
      );

      if (!response.ok) {
        throw new Error("Ошибка при загрузке мастер-классов");
      }

      const data = await response.json();
      setMasterclasses(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error fetching masterclasses:", error);
      setMessage({
        type: "error",
        text: "Не удалось загрузить мастер-классы",
      });
    } finally {
      setIsLoadingMasterclasses(false);
    }
  };

  const handleDeleteClick = (masterclass) => {
    setDeleteConfirmation({
      isOpen: true,
      masterclass: masterclass,
    });
    setMessage({ type: "", text: "" });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      masterclass: null,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.masterclass) return;

    setIsDeleting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await makeAuthenticatedRequest(
        `http://localhost:8000/api/masterclasses/${deleteConfirmation.masterclass.id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Masterclass deletion error:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorText;
        } catch {
          errorMessage = errorText;
        }

        throw new Error(`Ошибка при удалении мастер-класса: ${errorMessage}`);
      }

      // Remove the deleted masterclass from the local state
      setMasterclasses((prev) =>
        prev.filter((mc) => mc.id !== deleteConfirmation.masterclass.id)
      );

      setMessage({
        type: "success",
        text: `Мастер-класс "${deleteConfirmation.masterclass.title}" успешно удален!`,
      });

      // Close confirmation dialog
      setDeleteConfirmation({
        isOpen: false,
        masterclass: null,
      });
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
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Удаление мастер-классов
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

        {/* Masterclasses List */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-900 mb-4">
            Список мастер-классов
          </label>

          {isLoadingMasterclasses ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Загрузка мастер-классов...</p>
            </div>
          ) : masterclasses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Мастер-классы не найдены</p>
            </div>
          ) : (
            <div className="space-y-3">
              {masterclasses.map((masterclass) => (
                <div
                  key={masterclass.id}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1">
                      {masterclass.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {masterclass.description?.length > 100
                        ? `${masterclass.description.substring(0, 100)}...`
                        : masterclass.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Цена: {masterclass.price} ₽</span>
                      <span>Лимит: {masterclass.participant_limit} чел.</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteClick(masterclass)}
                    className="flex items-center justify-center w-10 h-10 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors ml-4"
                    title="Удалить мастер-класс"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Подтвердите удаление
              </h3>

              <p className="text-gray-600 mb-2">
                Вы действительно хотите удалить мастер-класс?
              </p>

              <p className="font-medium text-gray-800 mb-6">
                "{deleteConfirmation.masterclass?.title}"
              </p>

              <p className="text-sm text-red-600 mb-8">
                Это действие нельзя отменить!
              </p>

              <div className="flex gap-4">
                <button
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Отмена
                </button>

                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Удаление...
                    </>
                  ) : (
                    "Удалить"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right Section - Info Card */}
      <div className="w-80 p-8 flex items-start justify-center">
        <div className="w-72">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-red-200 to-red-300 p-8 text-center">
              <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg">Удаление</h3>
              <p className="text-white text-sm opacity-90">Мастер-классов</p>
            </div>

            <div className="p-6">
              <h4 className="text-gray-800 font-medium mb-3">Внимание!</h4>
              <p className="text-gray-600 text-sm mb-4">
                Удаление мастер-класса необратимо. Все связанные данные будут
                потеряны.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                  Регистрации участников
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                  История платежей
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                  Материалы курса
                </div>
              </div>
            </div>
          </div>

          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
              <p>Token: {accessToken ? "Available" : "Not available"}</p>
              <p>CSRF: {csrfToken ? "Available" : "Not available"}</p>
              <p>Total: {masterclasses.length} masterclasses</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteMasterClassPage;
