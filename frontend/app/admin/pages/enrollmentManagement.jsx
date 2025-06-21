import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
} from "lucide-react";

// Import this component in your main AdminManagement file

// Utility function for authenticated requests (you should import this from your utils)
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem("access_token");

  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};

const EnrollmentManagementPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [masterclasses, setMasterclasses] = useState([]);
  const [selectedMasterclass, setSelectedMasterclass] = useState(null);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  console.log("aaa");

  // Fetch all enrollments
  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/all_enrollments/`
      );

      if (!response.ok) {
        throw new Error("Ошибка при загрузке записей");
      }

      const data = await response.json();

      // Process the nested data structure
      const allEnrollments = [];
      const masterclassList = [];

      // Extract enrollments and masterclasses from the API response
      data.forEach((masterclass) => {
        if (masterclass.enrollments && masterclass.enrollments.length > 0) {
          // Add masterclass to list
          masterclassList.push({
            id: masterclass.id,
            title: masterclass.title,
          });

          // Process each enrollment and add masterclass info
          masterclass.enrollments.forEach((enrollment) => {
            allEnrollments.push({
              ...enrollment,
              masterclass: {
                id: masterclass.id,
                title: masterclass.title,
              },
              // Map API fields to component expected fields
              slot: {
                start: enrollment.slot_start_time,
                end: enrollment.slot_start_time, // API doesn't provide end time
              },
              user: {
                first_name: enrollment.user_first_name,
                last_name: enrollment.user_last_name,
                phone_number: enrollment.user_phone_number,
                email: enrollment.user_email,
              },
            });
          });
        }
      });

      setEnrollments(allEnrollments);
      setMasterclasses(masterclassList);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setError("Не удалось загрузить записи на мастер-классы");
    } finally {
      setLoading(false);
    }
  };

  // Filter enrollments based on selected masterclass and status
  useEffect(() => {
    let filtered = enrollments;

    if (selectedMasterclass) {
      filtered = filtered.filter(
        (enrollment) =>
          enrollment.masterclass &&
          enrollment.masterclass.id === selectedMasterclass.id
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (enrollment) => enrollment.status === statusFilter
      );
    }

    setFilteredEnrollments(filtered);
  }, [enrollments, selectedMasterclass, statusFilter]);

  // Load data on component mount
  useEffect(() => {
    fetchEnrollments();
  }, []);

  // Get status badge styling - updated to handle 'paid' status
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
      paid: {
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
        text: "Оплачено",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "Отменено",
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
    if (!dateString) return "Не указано";
    return new Date(dateString).toLocaleString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-gray-700">Загрузка записей...</span>
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
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Управление записями
        </h1>
        <p className="text-gray-600">
          Просмотр и управление записями пользователей на мастер-классы
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Фильтры</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Masterclass Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Мастер-класс
            </label>
            <select
              value={selectedMasterclass ? selectedMasterclass.id : ""}
              onChange={(e) => {
                const masterclass = masterclasses.find(
                  (m) => m.id === parseInt(e.target.value)
                );
                setSelectedMasterclass(masterclass || null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Все мастер-классы</option>
              {masterclasses.map((masterclass) => (
                <option key={masterclass.id} value={masterclass.id}>
                  {masterclass.title}
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
              <option value="paid">Оплачено</option>
              <option value="cancelled">Отменено</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Всего записей</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredEnrollments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Подтверждено</p>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  filteredEnrollments.filter((e) => e.status === "confirmed")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Оплачено</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredEnrollments.filter((e) => e.status === "paid").length}
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
                {
                  filteredEnrollments.filter((e) => e.status === "pending")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Отменено</p>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  filteredEnrollments.filter((e) => e.status === "cancelled")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      {/* <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedMasterclass
              ? `Записи на "${selectedMasterclass.title}"`
              : "Все записи"}
          </h3>
        </div>

        {filteredEnrollments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Записи не найдены
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedMasterclass
                ? "На этот мастер-класс пока никто не записался"
                : "Нет записей, соответствующих выбранным фильтрам"}
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
                    Пользователь
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Мастер-класс
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата слота
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Количество
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата записи
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{enrollment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.user.first_name} {enrollment.user.last_name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {enrollment.user.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {enrollment.user.phone_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.masterclass?.title || "Не указано"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(enrollment.slot_start_time)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <User className="h-4 w-4 mr-1" />
                        {enrollment.quantity} чел.
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(enrollment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(enrollment.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div> */}
      <>
        {/* Mobile Card Layout */}
        <div className="block sm:hidden">
          <div className="divide-y divide-gray-200">
            {filteredEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      #{enrollment.id} • {enrollment.user.first_name}{" "}
                      {enrollment.user.last_name}
                    </div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      {enrollment.masterclass?.title || "Не указано"}
                    </div>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    {getStatusBadge(enrollment.status)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="truncate">{enrollment.user.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span>{enrollment.user.phone_number}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span>{formatDate(enrollment.slot_start_time)}</span>
                    </div>
                    <div className="flex items-center ml-4">
                      <User className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>{enrollment.quantity} чел.</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 pt-1">
                    Записан: {formatDate(enrollment.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Мастер-класс
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата слота
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Количество
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата записи
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEnrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{enrollment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {enrollment.user.first_name} {enrollment.user.last_name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {enrollment.user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {enrollment.user.phone_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {enrollment.masterclass?.title || "Не указано"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(enrollment.slot_start_time)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <User className="h-4 w-4 mr-1" />
                      {enrollment.quantity} чел.
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(enrollment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(enrollment.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    </div>
  );
};

export default EnrollmentManagementPage;
