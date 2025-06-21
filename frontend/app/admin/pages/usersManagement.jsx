// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Users,
//   Search,
//   Filter,
//   ChevronDown,
//   ChevronUp,
//   UserCheck,
//   UserX,
//   Shield,
//   ShieldCheck,
//   Mail,
//   Phone,
//   Calendar,
//   Edit,
//   Trash2,
//   Eye,
//   RefreshCw,
//   Download,
//   AlertCircle,
//   Menu,
//   X,
//   MoreVertical,
// } from "lucide-react";
// import { useAuth } from "@/app/context/AuthContext";

// const UsersManagementPage = () => {
//   const [users, setUsers] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive, staff, verified
//   const [sortBy, setSortBy] = useState("id");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [usersPerPage] = useState(10);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const { makeAuthenticatedRequest } = useAuth();
//   const [isMobile, setIsMobile] = useState(false);
//   const [showMobileActions, setShowMobileActions] = useState({});

//   // Check if mobile on mount and resize
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   useEffect(() => {
//     setTotalCount(users.length);
//   }, [users]);

//   // Fetch users data
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/`
//       );

//       if (response.ok) {
//         const data = await response.json();
//         // Handle paginated response structure
//         if (data.results && Array.isArray(data.results)) {
//           setUsers(data.results);
//           setTotalCount(data.meta?.count || data.results.length);
//           console.log("✅ Users loaded successfully:", data.results.length);
//         } else if (Array.isArray(data)) {
//           // Fallback for direct array response
//           setUsers(data);
//           setTotalCount(data.length);
//           console.log("✅ Users loaded successfully:", data.length);
//         } else {
//           throw new Error("Invalid response format");
//         }
//       } else {
//         throw new Error(`Failed to fetch users: ${response.status}`);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching users:", error);
//       setError(error.message);
//       setUsers([]); // Ensure users is always an array
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Refresh users data
//   const refreshUsers = async () => {
//     setRefreshing(true);
//     await fetchUsers();
//     setRefreshing(false);
//   };

//   // Load users on component mount
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Filter and search users
//   const filteredUsers = users.filter((user) => {
//     // Search filter
//     const matchesSearch =
//       (user.first_name || "")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       (user.last_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (user.phone_number && user.phone_number.includes(searchTerm));

//     // Status filter
//     let matchesStatus = true;
//     switch (filterStatus) {
//       case "active":
//         matchesStatus = user.is_active;
//         break;
//       case "inactive":
//         matchesStatus = !user.is_active;
//         break;
//       case "staff":
//         matchesStatus = user.is_staff;
//         break;
//       case "verified":
//         matchesStatus = user.phone_number_verified || user.email_verified;
//         break;
//       case "all":
//       default:
//         matchesStatus = true;
//     }

//     return matchesSearch && matchesStatus;
//   });

//   // Sort users
//   const sortedUsers = [...filteredUsers].sort((a, b) => {
//     let aValue = a[sortBy];
//     let bValue = b[sortBy];

//     // Handle null/undefined values
//     if (aValue === null || aValue === undefined) aValue = "";
//     if (bValue === null || bValue === undefined) bValue = "";

//     // Handle different data types
//     if (sortBy === "birth_date") {
//       aValue = new Date(aValue || "1900-01-01");
//       bValue = new Date(bValue || "1900-01-01");
//     } else if (typeof aValue === "string") {
//       aValue = aValue.toLowerCase();
//       bValue = bValue.toLowerCase();
//     }

//     if (sortOrder === "asc") {
//       return aValue > bValue ? 1 : -1;
//     } else {
//       return aValue < bValue ? 1 : -1;
//     }
//   });

//   // Pagination
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

//   // Handle sort
//   const handleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(field);
//       setSortOrder("asc");
//     }
//   };

//   // Handle user selection
//   const handleSelectUser = (userId) => {
//     setSelectedUsers((prev) =>
//       prev.includes(userId)
//         ? prev.filter((id) => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   // Handle select all
//   const handleSelectAll = () => {
//     if (selectedUsers.length === currentUsers.length) {
//       setSelectedUsers([]);
//     } else {
//       setSelectedUsers(currentUsers.map((user) => user.id));
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "Не указано";
//     return new Date(dateString).toLocaleDateString("ru-RU");
//   };

//   // Toggle mobile actions
//   const toggleMobileActions = (userId) => {
//     setShowMobileActions((prev) => ({
//       ...prev,
//       [userId]: !prev[userId],
//     }));
//   };

//   // Export users data
//   const exportUsers = () => {
//     const csvContent = [
//       [
//         "ID",
//         "Email",
//         "Имя",
//         "Фамилия",
//         "Телефон",
//         "Дата рождения",
//         "Активен",
//         "Телефон подтвержден",
//         "Email подтвержден",
//         "Администратор",
//       ].join(","),
//       ...filteredUsers.map((user) =>
//         [
//           user.id,
//           user.email || "",
//           user.first_name || "",
//           user.last_name || "",
//           user.phone_number || "",
//           user.birth_date || "",
//           user.is_active ? "Да" : "Нет",
//           user.phone_number_verified ? "Да" : "Нет",
//           user.email_verified ? "Да" : "Нет",
//           user.is_staff ? "Да" : "Нет",
//         ].join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute(
//       "download",
//       `users_${new Date().toISOString().split("T")[0]}.csv`
//     );
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <div className="flex-1 p-8">
//         <div className="flex items-center justify-center h-64">
//           <div className="flex items-center space-x-3">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//             <span className="text-gray-700">Загрузка пользователей...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex-1 p-8">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//           <div className="flex items-center space-x-3">
//             <AlertCircle className="w-6 h-6 text-red-500" />
//             <div>
//               <h3 className="font-medium text-red-800">Ошибка загрузки</h3>
//               <p className="text-red-600 mt-1">{error}</p>
//               <button
//                 onClick={fetchUsers}
//                 className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
//               >
//                 Попробовать снова
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
//         {/* Header */}
//         <div className="mb-6 sm:mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
//                 <Users className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-500" />
//                 Управление пользователями
//               </h1>
//               <p className="text-gray-600 mt-2 text-sm sm:text-base">
//                 Всего пользователей: {totalCount} | Отображено:{" "}
//                 {filteredUsers.length}
//               </p>
//             </div>
//             <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
//               <button
//                 onClick={() => setRefreshing(!refreshing)}
//                 disabled={refreshing}
//                 className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
//               >
//                 <RefreshCw
//                   className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
//                 />
//                 Обновить
//               </button>
//               <button
//                 onClick={exportUsers}
//                 className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
//               >
//                 <Download className="w-4 h-4 mr-2" />
//                 Экспорт CSV
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
//           <div className="flex flex-col space-y-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Поиск по имени, email или телефону..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//               />
//             </div>

//             {/* Filter Toggle */}
//             <div className="flex justify-between items-center">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
//               >
//                 <Filter className="w-4 h-4 mr-2" />
//                 Фильтры
//                 {showFilters ? (
//                   <ChevronUp className="w-4 h-4 ml-2" />
//                 ) : (
//                   <ChevronDown className="w-4 h-4 ml-2" />
//                 )}
//               </button>
//               {selectedUsers.length > 0 && (
//                 <span className="text-sm text-blue-600 font-medium">
//                   Выбрано: {selectedUsers.length}
//                 </span>
//               )}
//             </div>

//             {/* Filters */}
//             {showFilters && (
//               <div className="pt-4 border-t border-gray-200">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Статус
//                     </label>
//                     <select
//                       value={filterStatus}
//                       onChange={(e) => setFilterStatus(e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     >
//                       <option value="all">Все пользователи</option>
//                       <option value="active">Активные</option>
//                       <option value="inactive">Неактивные</option>
//                       <option value="staff">Администраторы</option>
//                       <option value="verified">
//                         С подтвержденными данными
//                       </option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Сортировка
//                     </label>
//                     <select
//                       value={sortBy}
//                       onChange={(e) => setSortBy(e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     >
//                       <option value="id">По ID</option>
//                       <option value="first_name">По имени</option>
//                       <option value="last_name">По фамилии</option>
//                       <option value="email">По email</option>
//                       <option value="birth_date">По дате рождения</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Порядок
//                     </label>
//                     <select
//                       value={sortOrder}
//                       onChange={(e) => setSortOrder(e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     >
//                       <option value="asc">По возрастанию</option>
//                       <option value="desc">По убыванию</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Users Table/Cards */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           {/* Desktop Table */}
//           <div className="hidden lg:block">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left">
//                       <input
//                         type="checkbox"
//                         checked={
//                           selectedUsers.length === currentUsers.length &&
//                           currentUsers.length > 0
//                         }
//                         onChange={handleSelectAll}
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       />
//                     </th>
//                     <th
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                       onClick={() => handleSort("id")}
//                     >
//                       <div className="flex items-center">
//                         ID
//                         {sortBy === "id" &&
//                           (sortOrder === "asc" ? (
//                             <ChevronUp className="w-4 h-4 ml-1" />
//                           ) : (
//                             <ChevronDown className="w-4 h-4 ml-1" />
//                           ))}
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Пользователь
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Контакты
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Дата рождения
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Статус
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Действия
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {currentUsers.map((user) => (
//                     <tr key={user.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <input
//                           type="checkbox"
//                           checked={selectedUsers.includes(user.id)}
//                           onChange={() => handleSelectUser(user.id)}
//                           className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {user.id}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
//                             {user.photo ? (
//                               <img
//                                 src={user.photo}
//                                 alt={`${user.first_name || ""} ${
//                                   user.last_name || ""
//                                 }`}
//                                 className="w-full h-full object-cover"
//                               />
//                             ) : (
//                               <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
//                                 <Users className="w-5 h-5" />
//                               </div>
//                             )}
//                           </div>
//                           <div className="ml-3">
//                             <div className="text-sm font-medium text-gray-900">
//                               {user.first_name || ""} {user.last_name || ""}
//                             </div>
//                             <div className="flex items-center mt-1">
//                               {user.is_staff ? (
//                                 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
//                                   <ShieldCheck className="w-3 h-3 mr-1" />
//                                   Админ
//                                 </span>
//                               ) : (
//                                 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
//                                   <Shield className="w-3 h-3 mr-1" />
//                                   Пользователь
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="space-y-1">
//                           <div className="text-sm text-gray-900 flex items-center">
//                             <Mail className="w-4 h-4 mr-2 text-gray-400" />
//                             <span className="truncate max-w-xs">
//                               {user.email || "Не указан"}
//                             </span>
//                             {user.email_verified && (
//                               <UserCheck className="w-4 h-4 ml-2 text-green-500" />
//                             )}
//                           </div>
//                           <div className="text-sm text-gray-900 flex items-center">
//                             <Phone className="w-4 h-4 mr-2 text-gray-400" />
//                             {user.phone_number || "Не указан"}
//                             {user.phone_number_verified && (
//                               <UserCheck className="w-4 h-4 ml-2 text-green-500" />
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900 flex items-center">
//                           <Calendar className="w-4 h-4 mr-2 text-gray-400" />
//                           {formatDate(user.birth_date)}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             user.is_active
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {user.is_active ? (
//                             <>
//                               <UserCheck className="w-3 h-3 mr-1" />
//                               Активен
//                             </>
//                           ) : (
//                             <>
//                               <UserX className="w-3 h-3 mr-1" />
//                               Неактивен
//                             </>
//                           )}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <button
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded"
//                             title="Просмотр"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button
//                             className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
//                             title="Редактировать"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button
//                             className="text-red-600 hover:text-red-900 p-1 rounded"
//                             title="Удалить"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden">
//             <div className="divide-y divide-gray-200">
//               {currentUsers.map((user) => (
//                 <div key={user.id} className="p-4">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start space-x-3 flex-1">
//                       <input
//                         type="checkbox"
//                         checked={selectedUsers.includes(user.id)}
//                         onChange={() => handleSelectUser(user.id)}
//                         className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       />
//                       <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
//                         {user.photo ? (
//                           <img
//                             src={user.photo}
//                             alt={`${user.first_name || ""} ${
//                               user.last_name || ""
//                             }`}
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
//                             <Users className="w-6 h-6" />
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between">
//                           <h3 className="text-sm font-medium text-gray-900 truncate">
//                             {user.first_name || ""} {user.last_name || ""}
//                           </h3>
//                           <span className="text-xs text-gray-500">
//                             ID: {user.id}
//                           </span>
//                         </div>

//                         <div className="mt-1 space-y-1">
//                           <div className="flex items-center text-sm text-gray-600">
//                             <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
//                             <span className="truncate">
//                               {user.email || "Не указан"}
//                             </span>
//                             {user.email_verified && (
//                               <UserCheck className="w-4 h-4 ml-2 text-green-500 flex-shrink-0" />
//                             )}
//                           </div>
//                           <div className="flex items-center text-sm text-gray-600">
//                             <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
//                             <span>{user.phone_number || "Не указан"}</span>
//                             {user.phone_number_verified && (
//                               <UserCheck className="w-4 h-4 ml-2 text-green-500 flex-shrink-0" />
//                             )}
//                           </div>
//                           <div className="flex items-center text-sm text-gray-600">
//                             <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
//                             <span>{formatDate(user.birth_date)}</span>
//                           </div>
//                         </div>

//                         <div className="mt-2 flex items-center justify-between">
//                           <div className="flex space-x-2">
//                             <span
//                               className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
//                                 user.is_active
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-red-100 text-red-800"
//                               }`}
//                             >
//                               {user.is_active ? (
//                                 <>
//                                   <UserCheck className="w-3 h-3 mr-1" />
//                                   Активен
//                                 </>
//                               ) : (
//                                 <>
//                                   <UserX className="w-3 h-3 mr-1" />
//                                   Неактивен
//                                 </>
//                               )}
//                             </span>
//                             {user.is_staff && (
//                               <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
//                                 <ShieldCheck className="w-3 h-3 mr-1" />
//                                 Админ
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="relative ml-2">
//                       <button
//                         onClick={() => toggleMobileActions(user.id)}
//                         className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
//                       >
//                         <MoreVertical className="w-4 h-4" />
//                       </button>

//                       {showMobileActions[user.id] && (
//                         <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-10">
//                           <div className="py-1">
//                             <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                               <Eye className="w-4 h-4 mr-2" />
//                               Просмотр
//                             </button>
//                             <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                               <Edit className="w-4 h-4 mr-2" />
//                               Редактировать
//                             </button>
//                             <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
//                               <Trash2 className="w-4 h-4 mr-2" />
//                               Удалить
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Empty State */}
//         {currentUsers.length === 0 && (
//           <div className="text-center py-12">
//             <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               Пользователи не найдены
//             </h3>
//             <p className="text-gray-500">
//               {searchTerm || filterStatus !== "all"
//                 ? "Попробуйте изменить параметры поиска или фильтры"
//                 : "Пользователи еще не добавлены"}
//             </p>
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                 disabled={currentPage === 1}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Предыдущая
//               </button>
//               <button
//                 onClick={() =>
//                   setCurrentPage(Math.min(totalPages, currentPage + 1))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Следующая
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Показано{" "}
//                   <span className="font-medium">{indexOfFirstUser + 1}</span> -{" "}
//                   <span className="font-medium">
//                     {Math.min(indexOfLastUser, sortedUsers.length)}
//                   </span>{" "}
//                   из <span className="font-medium">{sortedUsers.length}</span>{" "}
//                   результатов
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                   <button
//                     onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                     disabled={currentPage === 1}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <ChevronUp className="w-5 h-5 rotate-[-90deg]" />
//                   </button>
//                   {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 7) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 4) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 3) {
//                       pageNum = totalPages - 6 + i;
//                     } else {
//                       pageNum = currentPage - 3 + i;
//                     }

//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === pageNum
//                             ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
//                             : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                   <button
//                     onClick={() =>
//                       setCurrentPage(Math.min(totalPages, currentPage + 1))
//                     }
//                     disabled={currentPage === totalPages}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <ChevronUp className="w-5 h-5 rotate-90" />
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UsersManagementPage;
