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

// Authenticated request helper (similar to AddMasterClassPage)
const makeAuthenticatedRequest = async (url, options = {}) => {
  const accessToken = localStorage.getItem("access_token"); // Fixed: use "access_token" not "accessToken"
  const csrfToken = getCsrfTokenFromCookie();

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

  // Handle token expiration (same as AddMasterClassPage)
  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // You might want to redirect to login or show login modal
    throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
  }

  return response;
};

// Product Card Component with Order Modal
const ProductCard = ({ title, price, image, stickerId }) => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    full_name: "",
    quantity: 1,
    phone_number: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOrderError("");

    try {
      const orderData = {
        sticker: stickerId,
        full_name: orderForm.full_name,
        quantity: parseInt(orderForm.quantity),
        phone_number: orderForm.phone_number,
      };

      // Fix: Remove the null parameter and pass options directly
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/orders/`,
        {
          method: "POST",
          body: JSON.stringify(orderData),
        }
      );

      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Order created:", result);

      setOrderSuccess(true);
      // Reset form
      setOrderForm({
        full_name: "",
        quantity: 1,
        phone_number: "",
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowOrderModal(false);
        setOrderSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error creating order:", error);
      setOrderError(error.message || "Произошла ошибка при оформлении заказа");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
          <button
            onClick={() => setShowOrderModal(true)}
            className="w-full bg-[#61BF7D] hover:bg-[#49905e] text-white text-xl py-2 px-4 rounded-2xl font-medium mt-6 transition-colors"
          >
            Заказать
          </button>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Оформить заказ</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Товар: {title}</p>
              <p className="text-sm text-gray-600">Цена: {price} ₽</p>
            </div>

            {orderSuccess ? (
              <div className="text-center py-8">
                <div className="text-green-500 text-4xl mb-4">✓</div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  Заказ успешно оформлен!
                </h3>
                <p className="text-gray-600">
                  Мы свяжемся с вами в ближайшее время
                </p>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Полное имя *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={orderForm.full_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61BF7D]"
                    placeholder="Введите ваше полное имя"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Количество *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={orderForm.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61BF7D]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Номер телефона *
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={orderForm.phone_number}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61BF7D]"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Итого: {(price * orderForm.quantity).toLocaleString()} ₽
                  </p>
                </div>

                {orderError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{orderError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#61BF7D] hover:bg-[#49905e] text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Оформление..." : "Оформить заказ"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
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
            stickerId={item.id} // Add this line to pass the sticker ID
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
