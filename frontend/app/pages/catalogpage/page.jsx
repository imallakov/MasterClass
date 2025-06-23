"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/app/components/Footer";

// Product Card Component - Mobile Responsive
const ProductCard = ({ title, price, image, stickerId, wbURL }) => {
  return (
    <div className="bg-white rounded-lg border-2 border-solid border-[#3A6281] overflow-hidden max-w-80 w-full mx-auto md:mx-0 hover:shadow-lg transition-shadow">
      <div className="h-60 md:h-80 flex items-center justify-center relative">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full aspect-[3/4] bg-white rounded-lg flex items-center justify-center">
            <img
              src={image || "/images/gallery4.jpg"}
              alt={title}
              className="object-cover p-3 md:p-4 w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div className="p-3 md:p-4">
        <h3 className="text-[#000000] mb-2 md:mb-3 text-base md:text-lg line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-xl md:text-2xl font-semibold text-[#000000]">
            {price} ₽
          </span>
        </div>
        <a href={wbURL} target="_blank" rel="noopener noreferrer">
          <button className="w-full bg-[#61BF7D] hover:bg-[#49905e] text-white text-lg md:text-xl py-2 px-4 rounded-2xl font-medium mt-4 md:mt-6 transition-colors">
            Заказать
          </button>
        </a>
      </div>
    </div>
  );
};

// Category Filter Component
const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="mb-6 md:mb-8">
      <h3 className="text-lg md:text-xl font-semibold text-slate-700 mb-3 md:mb-4">
        Фильтр по категориям:
      </h3>
      <div className="flex flex-wrap gap-2 md:gap-3">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${
            selectedCategory === null
              ? "bg-[#61BF7D] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Все категории
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${
              selectedCategory === category.id
                ? "bg-[#61BF7D] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>
    </div>
  );
};

// Search Component
const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-6 md:mb-8">
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Поиск стикеров..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#61BF7D] text-sm md:text-base"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Sort Component
const SortOptions = ({ sortOption, onSortChange }) => {
  return (
    <div className="mb-6 md:mb-8">
      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#61BF7D] text-sm md:text-base"
      >
        <option value="default">Сортировка</option>
        <option value="price-asc">Цена: по возрастанию</option>
        <option value="price-desc">Цена: по убыванию</option>
        <option value="name-asc">Название: А-Я</option>
        <option value="name-desc">Название: Я-А</option>
      </select>
    </div>
  );
};

// Main Catalog Page Component
const CatalogPage = () => {
  const router = useRouter();

  // States
  const [stickers, setStickers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");

  const itemsPerPage = 12;

  // Helper function to get CSRF token from cookie
  const getCsrfTokenFromCookie = () => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "csrftoken") {
        return value;
      }
    }
    return null;
  };

  // Authenticated request helper
  const makeAuthenticatedRequest = async (url, token = null, options = {}) => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token || accessToken) {
      headers["Authorization"] = `Bearer ${token || accessToken}`;
    }

    if (csrfToken) {
      headers["X-CSRFTOKEN"] = csrfToken;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
      throw new Error("Unauthorized - please login");
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  };

  // Fetch data
  const fetchData = async (token = null) => {
    try {
      setLoading(true);
      setError(null);

      const [stickersResponse, categoriesResponse] = await Promise.all([
        makeAuthenticatedRequest(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/`,
          token
        ),
        makeAuthenticatedRequest(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/categories/`,
          token
        ),
      ]);

      const stickersData = await stickersResponse.json();
      const categoriesData = await categoriesResponse.json();

      setStickers(stickersData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
      const csrf = getCsrfTokenFromCookie();
      setCsrfToken(csrf || "");
    }
    fetchData(token);
  }, []);

  // Filter and sort stickers
  const filteredAndSortedStickers = React.useMemo(() => {
    let filtered = stickers;

    // Filter by category
    if (selectedCategory !== null) {
      filtered = filtered.filter(
        (sticker) => sticker.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((sticker) =>
        sticker.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    switch (sortOption) {
      case "price-asc":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [stickers, selectedCategory, searchTerm, sortOption]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedStickers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStickers = filteredAndSortedStickers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortOption]);

  // Get category name for display
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.title : "Все категории";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Back Button */}
        <div className="mb-4 md:mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Назад
          </button>
        </div>

        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-700 mb-2">
            Каталог стикеров
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Найдите идеальные стикеры для ваших нужд
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61BF7D] mx-auto mb-4"></div>
            <p className="text-slate-600">Загрузка каталога...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-red-800 font-semibold mb-2">
                Ошибка загрузки данных
              </h3>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button
                onClick={() => fetchData()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
                <SortOptions
                  sortOption={sortOption}
                  onSortChange={setSortOption}
                />
              </div>

              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Results Info */}
            <div className="mb-4 md:mb-6">
              <p className="text-gray-600 text-sm md:text-base">
                Показано {paginatedStickers.length} из{" "}
                {filteredAndSortedStickers.length} товаров
                {selectedCategory &&
                  ` в категории "${getCategoryName(selectedCategory)}"`}
                {searchTerm && ` по запросу "${searchTerm}"`}
              </p>
            </div>

            {/* Products Grid */}
            {filteredAndSortedStickers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                  {paginatedStickers.map((sticker) => (
                    <ProductCard
                      key={sticker.id}
                      title={sticker.title}
                      price={sticker.price}
                      image={sticker.image}
                      stickerId={sticker.id}
                      wbURL={sticker.wb_link}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mb-8">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm md:text-base"
                    >
                      ← Предыдущая
                    </button>

                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 2 && page <= currentPage + 2)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 rounded-lg text-sm md:text-base ${
                                currentPage === page
                                  ? "bg-[#61BF7D] text-white"
                                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 3 ||
                          page === currentPage + 3
                        ) {
                          return (
                            <span
                              key={page}
                              className="px-2 py-2 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm md:text-base"
                    >
                      Следующая →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
                  <h3 className="text-gray-800 font-semibold mb-2">
                    Ничего не найдено
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Попробуйте изменить параметры поиска или фильтры
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchTerm("");
                      setSortOption("default");
                    }}
                    className="bg-[#61BF7D] hover:bg-[#49905e] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CatalogPage;
