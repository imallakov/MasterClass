// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Footer from "@/app/components/Footer";

// // Product Card Component - Компактный размер как на Wildberries
// const ProductCard = ({ title, price, image, stickerId, wbURL }) => {
//   return (
//     <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full hover:shadow-md transition-shadow">
//       {/* Уменьшенная высота изображения */}
//       <div className="h-40 sm:h-48 md:h-52 flex items-center justify-center relative">
//         <div className="w-full h-full flex items-center justify-center">
//           <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
//             <img
//               src={image || "/images/gallery4.jpg"}
//               alt={title}
//               className="object-cover p-2 sm:p-3 w-full h-full"
//               loading="lazy"
//             />
//           </div>
//         </div>
//       </div>
//       {/* Уменьшенные отступы */}
//       <div className="p-2 sm:p-3">
//         <h3 className="text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] font-medium">
//           {title}
//         </h3>
//         <div className="flex items-center justify-between mb-2 sm:mb-3">
//           <span className="text-lg sm:text-xl font-semibold text-gray-900">
//             {price} ₽
//           </span>
//         </div>
//         <a href={wbURL} target="_blank" rel="noopener noreferrer">
//           <button className="w-full bg-[#61BF7D] hover:bg-[#49905e] text-white text-sm sm:text-base py-2 px-3 rounded-lg font-medium transition-colors">
//             Заказать
//           </button>
//         </a>
//       </div>
//     </div>
//   );
// };

// // Category Filter Component
// const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
//   return (
//     <div className="mb-4 sm:mb-6">
//       <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3">
//         Фильтр по категориям:
//       </h3>
//       <div className="flex flex-wrap gap-2">
//         <button
//           onClick={() => onCategoryChange(null)}
//           className={`px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-sm ${
//             selectedCategory === null
//               ? "bg-[#61BF7D] text-white"
//               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//           }`}
//         >
//           Все категории
//         </button>
//         {categories.map((category) => (
//           <button
//             key={category.id}
//             onClick={() => onCategoryChange(category.id)}
//             className={`px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-sm ${
//               selectedCategory === category.id
//                 ? "bg-[#61BF7D] text-white"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             {category.title}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Search Component
// const SearchBar = ({ searchTerm, onSearchChange }) => {
//   return (
//     <div className="mb-4 sm:mb-6">
//       <div className="relative max-w-sm sm:max-w-md">
//         <input
//           type="text"
//           placeholder="Поиск стикеров..."
//           value={searchTerm}
//           onChange={(e) => onSearchChange(e.target.value)}
//           className="w-full px-3 sm:px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#61BF7D] text-sm sm:text-base"
//         />
//         <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//           <svg
//             className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//             />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Sort Component
// const SortOptions = ({ sortOption, onSortChange }) => {
//   return (
//     <div className="mb-4 sm:mb-6">
//       <select
//         value={sortOption}
//         onChange={(e) => onSortChange(e.target.value)}
//         className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#61BF7D] text-sm sm:text-base"
//       >
//         <option value="default">Сортировка</option>
//         <option value="price-asc">Цена: по возрастанию</option>
//         <option value="price-desc">Цена: по убыванию</option>
//         <option value="name-asc">Название: А-Я</option>
//         <option value="name-desc">Название: Я-А</option>
//       </select>
//     </div>
//   );
// };

// // Main Catalog Page Component
// const CatalogPage = () => {
//   const router = useRouter();

//   // States
//   const [stickers, setStickers] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOption, setSortOption] = useState("default");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [accessToken, setAccessToken] = useState(null);
//   const [csrfToken, setCsrfToken] = useState("");

//   // Увеличиваем количество товаров на странице для компактного отображения
//   const itemsPerPage = 20;

//   // Helper function to get CSRF token from cookie
//   const getCsrfTokenFromCookie = () => {
//     if (typeof document === "undefined") return null;
//     const cookies = document.cookie.split(";");
//     for (let cookie of cookies) {
//       const [name, value] = cookie.trim().split("=");
//       if (name === "csrftoken") {
//         return value;
//       }
//     }
//     return null;
//   };

//   // Authenticated request helper
//   const makeAuthenticatedRequest = async (url, token = null, options = {}) => {
//     const headers = {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       ...options.headers,
//     };

//     if (token || accessToken) {
//       headers["Authorization"] = `Bearer ${token || accessToken}`;
//     }

//     if (csrfToken) {
//       headers["X-CSRFTOKEN"] = csrfToken;
//     }

//     const response = await fetch(url, {
//       ...options,
//       headers,
//       credentials: "include",
//     });

//     if (response.status === 401) {
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//       }
//       throw new Error("Unauthorized - please login");
//     }

//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//     }

//     return response;
//   };

//   // Fetch data
//   const fetchData = async (token = null) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const [stickersResponse, categoriesResponse] = await Promise.all([
//         makeAuthenticatedRequest(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/`,
//           token
//         ),
//         makeAuthenticatedRequest(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/categories/`,
//           token
//         ),
//       ]);

//       const stickersData = await stickersResponse.json();
//       const categoriesData = await categoriesResponse.json();

//       setStickers(stickersData);
//       setCategories(categoriesData);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initialize data on component mount
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const token = localStorage.getItem("access_token");
//     if (token) {
//       setAccessToken(token);
//       const csrf = getCsrfTokenFromCookie();
//       setCsrfToken(csrf || "");
//     }
//     fetchData(token);
//   }, []);

//   // Filter and sort stickers
//   const filteredAndSortedStickers = React.useMemo(() => {
//     let filtered = stickers;

//     // Filter by category
//     if (selectedCategory !== null) {
//       filtered = filtered.filter(
//         (sticker) => sticker.category === selectedCategory
//       );
//     }

//     // Filter by search term
//     if (searchTerm) {
//       filtered = filtered.filter((sticker) =>
//         sticker.title.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Sort
//     switch (sortOption) {
//       case "price-asc":
//         filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
//         break;
//       case "price-desc":
//         filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
//         break;
//       case "name-asc":
//         filtered.sort((a, b) => a.title.localeCompare(b.title));
//         break;
//       case "name-desc":
//         filtered.sort((a, b) => b.title.localeCompare(a.title));
//         break;
//       default:
//         break;
//     }

//     return filtered;
//   }, [stickers, selectedCategory, searchTerm, sortOption]);

//   // Pagination
//   const totalPages = Math.ceil(filteredAndSortedStickers.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedStickers = filteredAndSortedStickers.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   // Reset page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [selectedCategory, searchTerm, sortOption]);

//   // Get category name for display
//   const getCategoryName = (categoryId) => {
//     const category = categories.find((cat) => cat.id === categoryId);
//     return category ? category.title : "Все категории";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
//         {/* Back Button */}
//         <div className="mb-3 sm:mb-4">
//           <button
//             onClick={() => router.push("/")}
//             className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
//           >
//             <svg
//               className="w-4 h-4 sm:w-5 sm:h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//             Назад
//           </button>
//         </div>

//         {/* Page Header */}
//         <div className="mb-4 sm:mb-6">
//           <h1 className="text-2xl sm:text-3xl font-bold text-slate-700 mb-1 sm:mb-2">
//             Каталог стикеров
//           </h1>
//           <p className="text-gray-600 text-sm">
//             Найдите идеальные стикеры для ваших нужд
//           </p>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#61BF7D] mx-auto mb-4"></div>
//             <p className="text-slate-600 text-sm sm:text-base">
//               Загрузка каталога...
//             </p>
//           </div>
//         )}

//         {/* Error State */}
//         {error && !loading && (
//           <div className="text-center py-12">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
//               <h3 className="text-red-800 font-semibold mb-2 text-sm sm:text-base">
//                 Ошибка загрузки данных
//               </h3>
//               <p className="text-red-600 text-sm mb-4">{error}</p>
//               <button
//                 onClick={() => fetchData()}
//                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
//               >
//                 Попробовать снова
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Main Content */}
//         {!loading && !error && (
//           <>
//             {/* Filters and Search */}
//             <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
//               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
//                 <SearchBar
//                   searchTerm={searchTerm}
//                   onSearchChange={setSearchTerm}
//                 />
//                 <SortOptions
//                   sortOption={sortOption}
//                   onSortChange={setSortOption}
//                 />
//               </div>

//               <CategoryFilter
//                 categories={categories}
//                 selectedCategory={selectedCategory}
//                 onCategoryChange={setSelectedCategory}
//               />
//             </div>

//             {/* Results Info */}
//             <div className="mb-3 sm:mb-4">
//               <p className="text-gray-600 text-sm">
//                 Показано {paginatedStickers.length} из{" "}
//                 {filteredAndSortedStickers.length} товаров
//                 {selectedCategory &&
//                   ` в категории "${getCategoryName(selectedCategory)}"`}
//                 {searchTerm && ` по запросу "${searchTerm}"`}
//               </p>
//             </div>

//             {/* Products Grid - Компактная сетка */}
//             {filteredAndSortedStickers.length > 0 ? (
//               <>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
//                   {paginatedStickers.map((sticker) => (
//                     <ProductCard
//                       key={sticker.id}
//                       title={sticker.title}
//                       price={sticker.price}
//                       image={sticker.image}
//                       stickerId={sticker.id}
//                       wbURL={sticker.wb_link}
//                     />
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="flex justify-center items-center gap-1 sm:gap-2 mb-6 sm:mb-8">
//                     <button
//                       onClick={() =>
//                         setCurrentPage((prev) => Math.max(prev - 1, 1))
//                       }
//                       disabled={currentPage === 1}
//                       className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm"
//                     >
//                       ← Пред.
//                     </button>

//                     <div className="flex gap-1">
//                       {[...Array(totalPages)].map((_, index) => {
//                         const page = index + 1;
//                         if (
//                           page === 1 ||
//                           page === totalPages ||
//                           (page >= currentPage - 1 && page <= currentPage + 1)
//                         ) {
//                           return (
//                             <button
//                               key={page}
//                               onClick={() => setCurrentPage(page)}
//                               className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm ${
//                                 currentPage === page
//                                   ? "bg-[#61BF7D] text-white"
//                                   : "border border-gray-300 text-gray-700 hover:bg-gray-100"
//                               }`}
//                             >
//                               {page}
//                             </button>
//                           );
//                         } else if (
//                           page === currentPage - 2 ||
//                           page === currentPage + 2
//                         ) {
//                           return (
//                             <span
//                               key={page}
//                               className="px-1 py-1.5 sm:py-2 text-gray-500 text-sm"
//                             >
//                               ...
//                             </span>
//                           );
//                         }
//                         return null;
//                       })}
//                     </div>

//                     <button
//                       onClick={() =>
//                         setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                       }
//                       disabled={currentPage === totalPages}
//                       className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm"
//                     >
//                       След. →
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="bg-gray-100 rounded-lg p-6 sm:p-8 max-w-md mx-auto">
//                   <h3 className="text-gray-800 font-semibold mb-2 text-sm sm:text-base">
//                     Ничего не найдено
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-4">
//                     Попробуйте изменить параметры поиска или фильтры
//                   </p>
//                   <button
//                     onClick={() => {
//                       setSelectedCategory(null);
//                       setSearchTerm("");
//                       setSortOption("default");
//                     }}
//                     className="bg-[#61BF7D] hover:bg-[#49905e] text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
//                   >
//                     Сбросить фильтры
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default CatalogPage;

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "/app/components/Footer";

// Product Card Component - Компактный размер как на Wildberries
const ProductCard = ({ title, price, image, stickerId, wbURL }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full hover:shadow-md transition-shadow">
      {/* Уменьшенная высота изображения */}
      <div className="h-40 sm:h-48 md:h-52 flex items-center justify-center relative">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
            <img
              src={image || "/images/gallery4.jpg"}
              alt={title}
              className="object-cover p-2 sm:p-3 w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      {/* Уменьшенные отступы */}
      <div className="p-2 sm:p-3">
        <h3 className="text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] font-medium">
          {title}
        </h3>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-lg sm:text-xl font-semibold text-gray-900">
            {price} ₽
          </span>
        </div>
        <a href={wbURL} target="_blank" rel="noopener noreferrer">
          <button className="w-full bg-[#61BF7D] hover:bg-[#49905e] text-white text-sm sm:text-base py-2 px-3 rounded-lg font-medium transition-colors">
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
    <div className="mb-4 sm:mb-6">
      <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3">
        Фильтр по категориям:
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-sm ${
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
            className={`px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-sm ${
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
    <div className="mb-4 sm:mb-6">
      <div className="relative max-w-sm sm:max-w-md">
        <input
          type="text"
          placeholder="Поиск стикеров..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#61BF7D] text-sm sm:text-base"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
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
    <div className="mb-4 sm:mb-6">
      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#61BF7D] text-sm sm:text-base"
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

  // Pagination metadata from API
  const [paginationMeta, setPaginationMeta] = useState({
    count: 0,
    total_pages: 0,
    current_page: 1,
    next: null,
    previous: null,
  });

  // Items per page - using API's default of 50, but can be adjusted
  const itemsPerPage = 50;

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

  // Fetch categories
  const fetchCategories = async (token = null) => {
    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/categories/`,
        token
      );
      const categoriesData = await response.json();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  // Fetch stickers with pagination
  const fetchStickers = async (page = 1, categoryId = null, token = null) => {
    try {
      let url;
      const params = new URLSearchParams();

      if (page > 1) {
        params.append("page", page.toString());
      }

      // Use different endpoint based on category selection
      if (categoryId) {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/categories/${categoryId}/`;
      } else {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/all/`;
      }

      // Add query parameters if they exist
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await makeAuthenticatedRequest(url, token);
      const data = await response.json();

      if (categoryId) {
        // Category endpoint structure
        setStickers(data.stickers.results);
        setPaginationMeta(data.stickers.meta);
      } else {
        // All stickers endpoint structure
        setStickers(data.results);
        setPaginationMeta(data.meta);
      }
    } catch (error) {
      console.error("Error fetching stickers:", error);
      throw error;
    }
  };

  // Fetch data
  const fetchData = async (page = 1, categoryId = null, token = null) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories and stickers
      await Promise.all([
        fetchCategories(token),
        fetchStickers(page, categoryId, token),
      ]);
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
    fetchData(1, null, token);
  }, []);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    fetchData(1, categoryId);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page, selectedCategory);
  };

  // Client-side filtering and sorting for search and sort
  const filteredAndSortedStickers = React.useMemo(() => {
    let filtered = [...stickers];

    // Filter by search term (client-side)
    if (searchTerm) {
      filtered = filtered.filter((sticker) =>
        sticker.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort (client-side)
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
  }, [stickers, searchTerm, sortOption]);

  // Reset page when search or sort changes
  useEffect(() => {
    if (searchTerm || sortOption !== "default") {
      // When filtering/sorting, we work with current page data
      setCurrentPage(paginationMeta.current_page);
    }
  }, [searchTerm, sortOption]);

  // Get category name for display
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.title : "Все категории";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Back Button */}
        <div className="mb-3 sm:mb-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
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
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-700 mb-1 sm:mb-2">
            Каталог стикеров
          </h1>
          <p className="text-gray-600 text-sm">
            Найдите идеальные стикеры для ваших нужд
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#61BF7D] mx-auto mb-4"></div>
            <p className="text-slate-600 text-sm sm:text-base">
              Загрузка каталога...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
              <h3 className="text-red-800 font-semibold mb-2 text-sm sm:text-base">
                Ошибка загрузки данных
              </h3>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button
                onClick={() => fetchData(currentPage, selectedCategory)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
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
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
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
                onCategoryChange={handleCategoryChange}
              />
            </div>

            {/* Results Info */}
            <div className="mb-3 sm:mb-4">
              <p className="text-gray-600 text-sm">
                Показано {filteredAndSortedStickers.length} из{" "}
                {searchTerm || sortOption !== "default"
                  ? filteredAndSortedStickers.length
                  : paginationMeta.count}{" "}
                товаров
                {selectedCategory &&
                  ` в категории "${getCategoryName(selectedCategory)}"`}
                {searchTerm && ` по запросу "${searchTerm}"`}
                {!searchTerm && !sortOption !== "default" && (
                  <span>
                    {" "}
                    (страница {paginationMeta.current_page} из{" "}
                    {paginationMeta.total_pages})
                  </span>
                )}
              </p>
            </div>

            {/* Products Grid - Компактная сетка */}
            {filteredAndSortedStickers.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {filteredAndSortedStickers.map((sticker) => (
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

                {/* Pagination - Only show when not filtering/sorting */}
                {!searchTerm &&
                  sortOption === "default" &&
                  paginationMeta.total_pages > 1 && (
                    <div className="flex justify-center items-center gap-1 sm:gap-2 mb-6 sm:mb-8">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!paginationMeta.previous}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm"
                      >
                        ← Пред.
                      </button>

                      <div className="flex gap-1">
                        {[...Array(paginationMeta.total_pages)].map(
                          (_, index) => {
                            const page = index + 1;
                            if (
                              page === 1 ||
                              page === paginationMeta.total_pages ||
                              (page >= currentPage - 1 &&
                                page <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm ${
                                    currentPage === page
                                      ? "bg-[#61BF7D] text-white"
                                      : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            } else if (
                              page === currentPage - 2 ||
                              page === currentPage + 2
                            ) {
                              return (
                                <span
                                  key={page}
                                  className="px-1 py-1.5 sm:py-2 text-gray-500 text-sm"
                                >
                                  ...
                                </span>
                              );
                            }
                            return null;
                          }
                        )}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!paginationMeta.next}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm"
                      >
                        След. →
                      </button>
                    </div>
                  )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-lg p-6 sm:p-8 max-w-md mx-auto">
                  <h3 className="text-gray-800 font-semibold mb-2 text-sm sm:text-base">
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
                      setCurrentPage(1);
                      fetchData(1, null);
                    }}
                    className="bg-[#61BF7D] hover:bg-[#49905e] text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
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
