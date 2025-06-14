import React, { useState, useEffect } from "react";
import {
  Package,
  Calendar,
  Phone,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  DollarSign,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

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

// Utility function for authenticated requests with better error handling
const makeAuthenticatedRequest = async (url, options = {}) => {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      throw new Error("Токен авторизации не найден");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    // Add detailed error information
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (jsonError) {
        // If response is not JSON, use the default error message
        console.warn("Could not parse error response as JSON:", jsonError);
      }

      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
};

const StickerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // Transform grouped data to flat order list
  const transformGroupedData = (groupedData) => {
    const flatOrders = [];
    const stickersMap = {};
    const stickersArray = [];

    if (!Array.isArray(groupedData)) {
      console.warn("Expected array for groupedData, got:", typeof groupedData);
      return { orders: [], stickers: [], stickersMap: {} };
    }

    groupedData.forEach((group) => {
      if (!group || !group.sticker || !Array.isArray(group.orders)) {
        console.warn("Invalid group structure:", group);
        return;
      }

      const { sticker, orders } = group;

      // Store sticker info
      stickersMap[sticker.id] = sticker;
      stickersArray.push(sticker);

      // Transform orders to include sticker reference
      orders.forEach((order) => {
        flatOrders.push({
          ...order,
          sticker: sticker.id, // Reference to sticker ID
          sticker_details: sticker, // Full sticker details for easy access
        });
      });
    });

    return { orders: flatOrders, stickers: stickersArray, stickersMap };
  };

  // Fetch all orders and related data
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if environment variable is set
      if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL не настроен");
      }

      const ordersUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/orders/`;
      const categoriesUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stickers/categories/`;

      console.log("Fetching orders from:", ordersUrl);
      console.log("Fetching categories from:", categoriesUrl);

      // Fetch orders and categories
      const [ordersResponse, categoriesResponse] = await Promise.allSettled([
        makeAuthenticatedRequest(ordersUrl),
        makeAuthenticatedRequest(categoriesUrl),
      ]);

      // Handle orders response
      if (ordersResponse.status === "rejected") {
        throw new Error(
          `Ошибка при загрузке заказов: ${ordersResponse.reason.message}`
        );
      }

      // Handle categories response
      if (categoriesResponse.status === "rejected") {
        console.warn(
          "Failed to load categories:",
          categoriesResponse.reason.message
        );
        // Continue with empty categories array
      }

      const groupedOrdersData = await ordersResponse.value.json();
      const categoriesData =
        categoriesResponse.status === "fulfilled"
          ? await categoriesResponse.value.json()
          : [];

      console.log("Raw orders data:", groupedOrdersData);
      console.log("Categories data:", categoriesData);

      // Transform the grouped data
      const { orders: flatOrders, stickers: stickersArray } =
        transformGroupedData(groupedOrdersData);

      console.log("Transformed orders:", flatOrders);
      console.log("Extracted stickers:", stickersArray);

      setOrders(flatOrders);
      setStickers(stickersArray);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message || "Не удалось загрузить заказы стикеров");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on selected criteria
  useEffect(() => {
    let filtered = orders;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (order) => order.sticker_details?.category === selectedCategory.id
      );
    }

    // Filter by specific sticker
    if (selectedSticker) {
      filtered = filtered.filter(
        (order) => order.sticker === selectedSticker.id
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.phone_number?.includes(searchTerm) ||
          order.id?.toString().includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, selectedCategory, selectedSticker, statusFilter, searchTerm]);

  // Load data on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Get sticker details by ID
  const getStickerById = (stickerId) => {
    return stickers.find((s) => s.id === stickerId);
  };

  // Get category details by ID
  const getCategoryById = (categoryId) => {
    return categories.find((c) => c.id === categoryId);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: AlertCircle,
        text: "Ожидает",
      },
      confirmed: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Подтверждено",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "Отменено",
      },
      completed: {
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
        text: "Выполнено",
      },
      processing: {
        color: "bg-purple-100 text-purple-800",
        icon: Clock,
        text: "В обработке",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Нет данных";
    try {
      return new Date(dateString).toLocaleString("ru-RU", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.warn("Invalid date string:", dateString);
      return "Неверная дата";
    }
  };

  // Calculate total amount
  const calculateTotal = (order) => {
    const sticker = order.sticker_details || getStickerById(order.sticker);
    if (!sticker || !sticker.price) return 0;
    return parseFloat(sticker.price) * (order.quantity || 0);
  };

  // Get statistics
  const getStatistics = () => {
    const stats = {
      total: filteredOrders.length,
      pending: filteredOrders.filter((o) => o.status === "pending").length,
      confirmed: filteredOrders.filter((o) => o.status === "confirmed").length,
      processing: filteredOrders.filter((o) => o.status === "processing")
        .length,
      completed: filteredOrders.filter((o) => o.status === "completed").length,
      cancelled: filteredOrders.filter((o) => o.status === "cancelled").length,
      totalRevenue: filteredOrders
        .filter((o) => o.status === "completed")
        .reduce((sum, order) => sum + calculateTotal(order), 0),
    };
    return stats;
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-gray-700">Загрузка заказов...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Ошибка</h3>
              <div className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
                {error}
              </div>
              <div className="mt-2 text-xs text-red-600">
                <p>Возможные причины:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Проблемы с сетевым соединением</li>
                  <li>Неверный URL API или токен авторизации</li>
                  <li>Сервер временно недоступен</li>
                  <li>Недостаточно прав доступа</li>
                </ul>
              </div>
              <button
                onClick={fetchOrders}
                className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </div>

        {/* Debug information in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800">
              Отладочная информация
            </h3>
            <div className="mt-2 text-xs text-yellow-700">
              <p>
                <strong>Backend URL:</strong>{" "}
                {process.env.NEXT_PUBLIC_BACKEND_URL || "Не настроен"}
              </p>
              <p>
                <strong>Access Token:</strong>{" "}
                {typeof window !== "undefined" &&
                localStorage.getItem("access_token")
                  ? "Установлен"
                  : "Отсутствует"}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Управление заказами стикеров
            </h1>
            <p className="text-gray-600">
              Просмотр и управление заказами стикеров
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Всего заказов</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ожидает</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Выполнено</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Выручка</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalRevenue.toLocaleString()} ₽
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Фильтры</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Поиск
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ID, имя, телефон..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Категория
            </label>
            <select
              value={selectedCategory ? selectedCategory.id : ""}
              onChange={(e) => {
                const category = categories.find(
                  (c) => c.id === parseInt(e.target.value)
                );
                setSelectedCategory(category || null);
                setSelectedSticker(null); // Reset sticker filter
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sticker Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Стикер
            </label>
            <select
              value={selectedSticker ? selectedSticker.id : ""}
              onChange={(e) => {
                const sticker = stickers.find(
                  (s) => s.id === parseInt(e.target.value)
                );
                setSelectedSticker(sticker || null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Все стикеры</option>
              {stickers
                .filter(
                  (sticker) =>
                    !selectedCategory ||
                    sticker.category === selectedCategory.id
                )
                .map((sticker) => (
                  <option key={sticker.id} value={sticker.id}>
                    {sticker.title}
                  </option>
                ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Статус
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все статусы</option>
              <option value="pending">Ожидает</option>
              <option value="confirmed">Подтверждено</option>
              <option value="processing">В обработке</option>
              <option value="completed">Выполнено</option>
              <option value="cancelled">Отменено</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Заказы ({filteredOrders.length})
          </h3>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Заказы не найдены
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Нет заказов, соответствующих выбранным фильтрам
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Клиент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Стикер
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Количество
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const sticker =
                    order.sticker_details || getStickerById(order.sticker);
                  const category = sticker
                    ? getCategoryById(sticker.category)
                    : null;
                  const total = calculateTotal(order);

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.full_name || "Не указано"}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {order.phone_number || "Не указано"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {sticker?.title || "Неизвестно"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {category?.title || "Без категории"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.quantity || 0} шт.
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {total.toLocaleString()} ₽
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Просмотр"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Детали заказа #{selectedOrder.id}
              </h2>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Информация о клиенте</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{selectedOrder.full_name || "Не указано"}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{selectedOrder.phone_number || "Не указано"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Информация о заказе</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Количество: {selectedOrder.quantity || 0} шт.</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                    <span>
                      Сумма: {calculateTotal(selectedOrder).toLocaleString()} ₽
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Товар</h3>
              {(() => {
                const sticker =
                  selectedOrder.sticker_details ||
                  getStickerById(selectedOrder.sticker);
                const category = sticker
                  ? getCategoryById(sticker.category)
                  : null;

                return (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    {sticker?.image && (
                      <img
                        src={sticker.image}
                        alt={sticker.title}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div>
                      <h4 className="font-medium">
                        {sticker?.title || "Неизвестный товар"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {category?.title || "Без категории"}
                      </p>
                      <p className="text-sm font-medium">
                        {sticker?.price || 0} ₽
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Статус заказа</h3>
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickerOrdersPage;
