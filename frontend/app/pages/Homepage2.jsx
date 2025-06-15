"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import PhotoGallery from "../components/PhotoGallery";
import Image from "next/image";
import MasterClasses from "../components/MasterClasses";
import AboutUs from "../components/AboutUs";
import WhyUs from "../components/WhyUs";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// Product Card Component with Order Modal
const ProductCard = ({ title, price, image, stickerId, wbURL }) => {
  return (
    <>
      <div className="bg-white rounded-lg border-2 border-solid border-[#3A6281] overflow-hidden max-w-80">
        <div className="h-80 flex items-center justify-center relative">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full aspect-[3/4] bg-white rounded-lg flex items-center justify-center">
              <img
                src={image || "/images/gallery4.jpg"}
                alt={title}
                className="object-cover p-4 w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-[#000000] mb-3 text-lg">{title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold text-[#000000]">
              {price} ₽
            </span>
          </div>
          <a href={wbURL}>
            <button className="w-full bg-[#61BF7D] hover:bg-[#49905e] text-white text-xl py-2 px-4 rounded-2xl font-medium mt-6 transition-colors">
              Заказать
            </button>
          </a>
        </div>
      </div>
    </>
  );
};

// Category Section Component - Updated
const CategorySection = ({ category, items, description }) => {
  return (
    <div className="mb-12">
      <div className="mb-12">
        <h2 className="text-5xl font-bold text-slate-600 mb-4">{category}:</h2>
        <p className="text-lg font-bold text-slate-600">
          {description ||
            "Создай уникальные наклейки по собственному дизайну. Воплотим любую задумку!"}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <ProductCard
            key={item.id || index}
            title={item.title}
            price={item.price}
            image={item.image}
            stickerId={item.id}
            wbURL={item.wb_link}
          />
        ))}
      </div>
    </div>
  );
};

// Main Component
const Homepage2 = () => {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  // Create refs for each section
  const homeRef = useRef(null);
  const masterClassesRef = useRef(null);
  const catalogRef = useRef(null);
  const aboutUsRef = useRef(null);
  const scheduleRef = useRef(null);
  const contactsRef = useRef(null);
  const stickersRef = useRef(null);
  const whyUsRef = useRef(null);
  const reviewsRef = useRef(null);
  const photoGalleryRef = useRef(null);

  // Navigation function with smooth scrolling
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // API State management
  const [stickers, setStickers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");

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

  // Check authentication on component mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
      // Get CSRF token
      const csrf = getCsrfTokenFromCookie();
      setCsrfToken(csrf || "");
    }
    // Always try to fetch data, whether authenticated or not
    fetchData(token);
  }, []);

  // Authenticated request helper
  const makeAuthenticatedRequest = async (url, token = null, options = {}) => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add authentication token if available
    if (token || accessToken) {
      headers["Authorization"] = `Bearer ${token || accessToken}`;
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

  // Fetch both stickers and categories
  const fetchData = async (token = null) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both stickers and categories in parallel
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

  // Group stickers by category
  const groupStickersByCategory = () => {
    if (!stickers.length || !categories.length) {
      return [];
    }

    const grouped = categories
      .map((category) => {
        const categoryStickers = stickers.filter(
          (sticker) => sticker.category === category.id
        );
        return {
          category: category.title,
          description: category.description,
          items: categoryStickers.map((sticker) => ({
            id: sticker.id,
            title: sticker.title,
            price: sticker.price,
            image: sticker.image,
            wb_link: sticker.wb_link,
          })),
        };
      })
      .filter((group) => group.items.length > 0);

    return grouped;
  };

  const categoriesToShow = (() => {
    const allCategories = groupStickersByCategory();
    return showAll ? allCategories : allCategories.slice(0, 2);
  })();

  // Pass navigation function to navbar
  const navigationProps = {
    scrollToSection,
    refs: {
      home: homeRef,
      masterClasses: masterClassesRef,
      catalog: catalogRef,
      aboutUs: aboutUsRef,
      schedule: scheduleRef,
      contacts: contactsRef,
      stickers: stickersRef,
      whyUs: whyUsRef,
      reviews: reviewsRef,
      photoGallery: photoGalleryRef,
    },
  };

  return (
    <div className="min-h-screen">
      {/* Add Navbar with navigation props */}
      <Navbar scrollToSection={scrollToSection} refs={navigationProps.refs} />

      <div className="hidden md:block">
        {/* Hero Section */}
        <section
          ref={homeRef}
          className="relative bg-pink-200 py-16 px-4 overflow-hidden h-screen inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero2.png')`,
          }}
        >
          <div className="max-w-7xl mx-auto flex justify-between flex-col h-full relative z-4">
            <div className="text-left py-2 px-6 bg-black/50 rounded-2xl max-w-[570px]">
              <h1 className="text-2xl md:text-3xl font-medium text-white">
                Брендовые стикеры{" "}
                <span className="text-green-600">уже доступны</span>
              </h1>
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="flex justify-center items-center gap-4">
                <a href="">
                  <img
                    className="w-24 h-24"
                    src="/images/wildberries.png"
                    alt="wildberries"
                  />
                </a>
                <a href="https://www.instagram.com/dvorec_masterov">
                  <img
                    className="w-24 h-24 rounded-full object-cover"
                    src="/images/instagram.png"
                    alt="ozon"
                  />
                </a>
                <a href="https://vk.com/club229163599">
                  <img
                    className="w-24 h-24 rounded-full object-cover"
                    src="/images/vk.png"
                    alt="vk"
                  />
                </a>
              </div>
              <div className="flex justify-center items-center gap-4">
                <a href="https://t.me/dvorec_masterov_kazan">
                  <img
                    className="`w-24 h-24 rounded-full object-cover"
                    src="/images/telegram.png"
                    alt="telegram"
                  />
                </a>
                <a href="">
                  <img
                    className="w-28 h-28 rounded-full object-cover"
                    src="/images/whatsapp.png"
                    alt="whatsapp"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section ref={catalogRef} className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
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

            {/* Categories */}
            {!loading &&
              !error &&
              categoriesToShow.length > 0 &&
              categoriesToShow.map((categoryData, index) => (
                <CategorySection
                  key={categoryData.category || index}
                  category={categoryData.category}
                  items={categoryData.items}
                  description={categoryData.description}
                />
              ))}

            {/* No Data State */}
            {!loading && !error && categoriesToShow.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-gray-800 font-semibold mb-2">
                    Каталог пуст
                  </h3>
                  <p className="text-gray-600 text-sm">
                    На данный момент нет доступных стикеров для отображения.
                  </p>
                </div>
              </div>
            )}

            {/* Show More/Less Button */}
            {!loading &&
              !error &&
              categoriesToShow.length > 0 &&
              groupStickersByCategory().length > 2 && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="bg-transparent text-[#4E4E4E] border-1 border-black px-10 py-3 rounded-2xl font-medium text-lg transition-colors shadow-lg hover:shadow-xl"
                  >
                    {showAll ? "Скрыть" : "Показать ещё"}
                  </button>
                </div>
              )}
          </div>
        </section>
      </div>

      {/* Mobile Version */}
      <div className="block md:hidden">
        {/* Mobile Hero Section */}
        <section
          ref={homeRef}
          className="relative bg-pink-200 py-8 px-4 overflow-hidden min-h-[60vh] inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero2.png')`,
          }}
        >
          <div className="flex flex-col justify-between h-full relative z-4 min-h-[calc(70vh-4rem)]">
            <div className="text-center py-3 px-4 bg-black/50 rounded-xl mx-auto max-w-sm mt-2">
              <h1 className="text-xl font-medium text-white">
                Брендовые стикеры{" "}
                <span className="text-green-600">уже доступны</span>
              </h1>
            </div>

            <div className="flex flex-col gap-4 pb-4">
              {/* Top row of social icons */}
              <div className="flex justify-center items-center gap-3">
                <a href="">
                  <img
                    className="w-16 h-16"
                    src="/images/wildberries.png"
                    alt="wildberries"
                  />
                </a>
                <a href="https://www.instagram.com/dvorec_masterov">
                  <img
                    className="w-16 h-16 rounded-full object-cover"
                    src="/images/instagram.png"
                    alt="instagram"
                  />
                </a>
                <a href="https://vk.com/club229163599">
                  <img
                    className="w-16 h-16 rounded-full object-cover"
                    src="/images/vk.png"
                    alt="vk"
                  />
                </a>
              </div>

              {/* Bottom row of social icons */}
              <div className="flex justify-center items-center gap-3">
                <a href="https://t.me/dvorec_masterov_kazan">
                  <img
                    className="w-16 h-16 rounded-full object-cover"
                    src="/images/telegram.png"
                    alt="telegram"
                  />
                </a>
                <a href="">
                  <img
                    className="w-18 h-18 rounded-full object-cover"
                    src="/images/whatsapp.png"
                    alt="whatsapp"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Products Section */}
        <section ref={catalogRef} className="py-8 px-4">
          <div className="max-w-full mx-auto">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-600 mx-auto mb-3"></div>
                <p className="text-slate-600 text-sm">Загрузка каталога...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-auto">
                  <h3 className="text-red-800 font-semibold mb-2 text-sm">
                    Ошибка загрузки данных
                  </h3>
                  <p className="text-red-600 text-xs mb-3">{error}</p>
                  <button
                    onClick={() => fetchData()}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Попробовать снова
                  </button>
                </div>
              </div>
            )}

            {/* Categories */}
            {!loading &&
              !error &&
              categoriesToShow.length > 0 &&
              categoriesToShow.map((categoryData, index) => (
                <CategorySection
                  key={categoryData.category || index}
                  category={categoryData.category}
                  items={categoryData.items}
                  description={categoryData.description}
                />
              ))}

            {/* No Data State */}
            {!loading && !error && categoriesToShow.length === 0 && (
              <div className="text-center py-8">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mx-auto">
                  <h3 className="text-gray-800 font-semibold mb-2 text-sm">
                    Каталог пуст
                  </h3>
                  <p className="text-gray-600 text-xs">
                    На данный момент нет доступных стикеров для отображения.
                  </p>
                </div>
              </div>
            )}

            {/* Show More/Less Button */}
            {!loading &&
              !error &&
              categoriesToShow.length > 0 &&
              groupStickersByCategory().length > 2 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="bg-transparent text-[#4E4E4E] border-1 border-black px-6 py-2 rounded-xl font-medium text-base transition-colors shadow-lg hover:shadow-xl w-full max-w-xs"
                  >
                    {showAll ? "Скрыть" : "Показать ещё"}
                  </button>
                </div>
              )}
          </div>
        </section>
      </div>

      {/* Add refs to each component section */}
      <div ref={masterClassesRef}>
        <MasterClasses />
      </div>

      <div ref={aboutUsRef}>
        <AboutUs />
      </div>

      <div ref={whyUsRef}>
        <WhyUs />
      </div>

      <div ref={reviewsRef}>
        <Reviews />
      </div>

      <div ref={photoGalleryRef}>
        <PhotoGallery />
      </div>

      <div ref={contactsRef}>
        <Footer scrollToSection={scrollToSection} refs={navigationProps.refs} />
      </div>
    </div>
  );
};

export default Homepage2;
