// import React from "react";
// import StickerCard from "../components/StickerCard";

// const CatalogPage = () => {
//   const motivationalStickers = [
//     {
//       id: 1,
//       image: "/images/examplecardimg.png",
//       category: "мотивационная",
//       price: 334,
//     },
//     {
//       id: 2,
//       image: "/images/examplecardimg.png",
//       category: "мотивационная",
//       price: 334,
//     },
//     {
//       id: 3,
//       image: "/images/examplecardimg.png",
//       category: "мотивационная",
//       price: 334,
//     },
//   ];

//   const affirmationStickers = [
//     {
//       id: 4,
//       image: "/images/examplecardimg.png",
//       category: "Аффирмации",
//       price: 334,
//     },
//     {
//       id: 5,
//       image: "/images/examplecardimg.png",
//       category: "Аффирмации",
//       price: 334,
//     },
//     {
//       id: 6,
//       image: "/images/examplecardimg.png",
//       category: "Аффирмации",
//       price: 334,
//     },
//   ];

//   const congratulatoryStickers = [
//     {
//       id: 7,
//       image: "/images/examplecardimg.png",
//       category: "Поздравительная",
//       price: 334,
//     },
//     {
//       id: 8,
//       image: "/images/examplecardimg.png",
//       category: "Поздравительная",
//       price: 334,
//     },
//     {
//       id: 9,
//       image: "/images/examplecardimg.png",
//       category: "Поздравительная",
//       price: 334,
//     },
//   ];

//   const CategorySection = ({ title, subtitle, stickers }) => (
//     <section className="mb-16">
//       <div className="mb-8">
//         <h2 className="text-4xl font-bold text-slate-700 mb-3">{title}</h2>
//         <div className="text-slate-600">
//           <p className="font-medium mb-1">Вдохновляйся каждый день!</p>
//           <p className="text-sm">{subtitle}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {stickers.map((sticker) => (
//           <StickerCard
//             key={sticker.id}
//             image={sticker.image}
//             category={sticker.category}
//             price={sticker.price}
//           />
//         ))}
//       </div>
//     </section>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="container mx-auto px-6">
//         {/* Motivational Section */}
//         <CategorySection
//           title="Мотивационные:"
//           subtitle="Мотивационные наклейки - заряд энергии и позитива для твоего пространства."
//           stickers={motivationalStickers}
//         />

//         {/* Affirmations Section */}
//         <CategorySection
//           title="Аффирмации:"
//           subtitle="Измени свою жизнь с помощью слов! Наклейки-аффирмации - мощный инструмент для подсознания и достижения целей."
//           stickers={affirmationStickers}
//         />

//         {/* Congratulatory Section */}
//         <CategorySection
//           title="Поздравительные:"
//           subtitle="Сделай праздник ярче! Поздравительные наклейки для украшения подарков, открыток и всего, что дарит радость."
//           stickers={congratulatoryStickers}
//         />
//       </div>
//     </div>
//   );
// };

// export default CatalogPage;

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import StickerCard from "../components/StickerCard";

const CatalogPage = () => {
  const router = useRouter();

  // State management
  const [stickers, setStickers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");

  // Helper function to get CSRF token from cookie
  const getCsrfTokenFromCookie = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "csrftoken") {
        return value;
      }
    }
    return null;
  };

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

  // Fetch data when token is available
  useEffect(() => {
    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  // Authenticated request helper
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

  // Fetch both stickers and categories
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both stickers and categories in parallel
      const [stickersResponse, categoriesResponse] = await Promise.all([
        makeAuthenticatedRequest("http://localhost:8000/api/stickers/"),
        makeAuthenticatedRequest(
          "http://localhost:8000/api/stickers/categories/"
        ),
      ]);

      if (stickersResponse.ok && categoriesResponse.ok) {
        const stickersData = await stickersResponse.json();
        const categoriesData = await categoriesResponse.json();

        setStickers(stickersData);
        setCategories(categoriesData);
      } else {
        throw new Error("Ошибка при загрузке данных");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Ошибка при загрузке данных");
    } finally {
      setLoading(false);
    }
  };

  // Group stickers by category
  const groupStickersByCategory = () => {
    const grouped = {};

    stickers.forEach((sticker) => {
      const categoryId = sticker.category;
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(sticker);
    });

    return grouped;
  };

  // Get category info by ID
  const getCategoryById = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const CategorySection = ({ categoryId, stickers }) => {
    const category = getCategoryById(categoryId);

    if (!category || !stickers || stickers.length === 0) {
      return null;
    }

    return (
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-700 mb-3">
            {category.title}:
          </h2>
          <div className="text-slate-600">
            <p className="font-medium mb-1">Вдохновляйся каждый день!</p>
            <p className="text-sm">{category.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stickers.map((sticker) => (
            <StickerCard
              key={sticker.id}
              image={sticker.image}
              category={category.title}
              price={sticker.price}
              title={sticker.title}
            />
          ))}
        </div>
      </section>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка каталога...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  const groupedStickers = groupStickersByCategory();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            Каталог наклеек
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Выберите из нашей коллекции вдохновляющих наклеек для украшения
            вашего пространства
          </p>
        </div>

        {/* Categories */}
        {categories.length > 0 ? (
          categories.map((category) => (
            <CategorySection
              key={category.id}
              categoryId={category.id}
              stickers={groupedStickers[category.id] || []}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">Нет доступных категорий</p>
          </div>
        )}

        {/* Empty state */}
        {stickers.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-slate-600">Пока нет доступных наклеек</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
