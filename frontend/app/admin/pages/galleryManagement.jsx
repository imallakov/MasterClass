// pages/addGallery.js
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

const AddGalleryPage = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  // Authentication
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

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const headers = {
      Accept: "application/json",
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      setMessage({ type: "error", text: "Пожалуйста, выберите изображение" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("image", selectedImage);

      // Create headers without Content-Type (let browser set it for FormData)
      const headers = {
        Accept: "application/json",
      };

      // Add authentication token
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      // Add CSRF token if available
      if (csrfToken) {
        headers["X-CSRFTOKEN"] = csrfToken;
      }

      const response = await fetch(
        "`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gallery/",
        {
          method: "POST",
          headers,
          credentials: "include",
          body: formData,
        }
      );

      // Handle token expiration
      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.push("/auth/sign-in");
        throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
      }

      if (response.ok) {
        setMessage({ type: "success", text: "Изображение успешно добавлено!" });
        setSelectedImage(null);
        setImagePreview("");
        // Reset form
        document.getElementById("imageInput").value = "";
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.detail || "Ошибка при добавлении изображения",
        });
      }
    } catch (error) {
      console.error("Error adding image:", error);
      setMessage({
        type: "error",
        text: "Ошибка при добавлении изображения",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Добавить изображение в галерею
        </h1>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="imageInput"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Выберите изображение
            </label>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Предварительный просмотр
              </label>
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-64 object-contain rounded-lg border border-gray-200"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !selectedImage}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Добавление..." : "Добавить изображение"}
          </button>
        </form>
      </div>
    </div>
  );
};

// pages/deleteGallery.js
const DeleteGalleryPage = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  // Authentication
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

  // Fetch images when token is available
  useEffect(() => {
    if (accessToken) {
      fetchImages();
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

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(
        "`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gallery/"
      );

      if (response.ok) {
        const imagesData = await response.json();
        setImages(imagesData);
      } else {
        setMessage({
          type: "error",
          text: "Ошибка при загрузке изображений",
        });
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setMessage({
        type: "error",
        text: "Ошибка при загрузке изображений",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm("Вы уверены, что хотите удалить это изображение?")) {
      return;
    }

    setDeletingId(imageId);
    setMessage(null);

    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gallery/${imageId}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "Изображение успешно удалено!" });
        // Remove the deleted image from the list
        setImages(images.filter((image) => image.id !== imageId));
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.detail || "Ошибка при удалении изображения",
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setMessage({
        type: "error",
        text: "Ошибка при удалении изображения",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Удалить изображения из галереи
      </h1>

      {message && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Загрузка изображений...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={`data:image/jpeg;base64,${image.image}`}
                alt={`Gallery ${image.id}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-3">
                  Загружено: {new Date(image.uploaded_at).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleDelete(image.id)}
                  disabled={deletingId === image.id}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {deletingId === image.id ? "Удаление..." : "Удалить"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-600">Изображения не найдены</div>
        </div>
      )}
    </div>
  );
};

export { AddGalleryPage, DeleteGalleryPage };
