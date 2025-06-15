// // admin/add-masterclass/page.jsx
// "use client";
// import React, { useState } from "react";
// import { Plus, Move, Trash2, LogOut } from "lucide-react";
// import AdminRoute from "@/app/components/AdminRoute";
// import { useAuth } from "@/app/context/AuthContext";
// import AddMasterClassPage from "../pages/addMasterClass";
// import EditMasterClassPage from "../pages/editMasterClass";
// import DeleteMasterClassPage from "../pages/deleteMasterClass";

// // White rounded container for the main content
// const ContentContainer = ({ children }) => {
//   return (
//     <div className="bg-white rounded-3xl shadow-lg mx-8 my-8 overflow-hidden">
//       {children}
//     </div>
//   );
// };

// // Sidebar Component
// const Sidebar = ({ currentPage, onPageChange }) => {
//   const [isExpanded, setIsExpanded] = useState(true);

//   return (
//     <div className="w-80 bg-white h-full flex flex-col border-r border-gray-100">
//       {/* User Profile Section */}
//       <div className="p-6 border-b border-gray-100">
//         <div className="flex items-center space-x-3">
//           <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800">
//             <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-xs">
//               VL
//             </div>
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-900">Виктор Ловецкий</h3>
//             <p className="text-sm text-gray-500">Администратор</p>
//           </div>
//         </div>
//         <button className="text-sm text-blue-500 mt-2 hover:text-blue-600">
//           Изменить фото
//         </button>
//       </div>

//       {/* Navigation */}
//       <div className="flex-1 px-4 py-6">
//         <div className="space-y-2">
//           {/* Master Classes Section */}
//           <div>
//             <div
//               className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium"
//               onClick={() => setIsExpanded(!isExpanded)}
//             >
//               <div className="flex items-center space-x-3">
//                 <span className="text-lg font-bold">—</span>
//                 <span>Мастер классы</span>
//               </div>
//             </div>

//             {isExpanded && (
//               <div className="ml-8 space-y-2 mt-2">
//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
//                     currentPage === "edit"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("edit")}
//                 >
//                   <span>
//                     <Move className="w-4 h-4" />
//                   </span>
//                   <span>Изменить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
//                     currentPage === "add"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("add")}
//                 >
//                   <span>
//                     <Plus className="w-4 h-4" />
//                   </span>
//                   <span>Добавить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
//                     currentPage === "delete"
//                       ? "text-red-500 bg-red-50"
//                       : "text-gray-600 hover:bg-red-50 hover:text-red-500"
//                   }`}
//                   onClick={() => onPageChange("delete")}
//                 >
//                   <span>
//                     <Trash2 className="w-4 h-4" />
//                   </span>
//                   <span>Удалить</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Other Menu Items */}
//           <button className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
//             <span>+</span>
//             <span>О нас</span>
//           </button>

//           <button className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
//             <span>+</span>
//             <span>Почему мы?</span>
//           </button>

//           <button className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
//             <span>+</span>
//             <span>Фотогалерея</span>
//           </button>
//         </div>
//       </div>

//       {/* Logout */}
//       <div className="p-4 border-t border-gray-100">
//         <button className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
//           <span>
//             <LogOut className="w-4 h-4 text-gray-600" />
//           </span>
//           <span>Выйти из аккаунта</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// // Main Component
// const MasterClassManagement = () => {
//   const [currentPage, setCurrentPage] = useState("edit");

//   const { loading, isAuthenticated, isAdmin } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   console.log("isAuthenticated", isAuthenticated());
//   console.log("isAdmin", isAdmin());

//   if (!isAuthenticated()) {
//     console.log("Not authenticated");
//     return null; // Will be redirected by middleware or ProtectedRoute
//   }

//   // Function to render the current page content
//   const renderCurrentPage = () => {
//     switch (currentPage) {
//       case "edit":
//         return <EditMasterClassPage />;
//       case "add":
//         return <AddMasterClassPage />;
//       case "delete":
//         return <DeleteMasterClassPage />;
//       default:
//         return <EditMasterClassPage />;
//     }
//   };

//   return (
//     <AdminRoute>
//       <div className="min-h-screen">
//         {/* Main content area with gradient background */}
//         <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-8">
//           <ContentContainer>
//             <div className="h-24 bg-gradient-to-r from-pink-300 to-pink-200"></div>
//             <div className="flex min-h-96">
//               <Sidebar
//                 currentPage={currentPage}
//                 onPageChange={setCurrentPage}
//               />

//               {renderCurrentPage()}
//             </div>
//           </ContentContainer>
//         </div>
//       </div>
//     </AdminRoute>
//   );
// };

// export default MasterClassManagement;

// admin/adminmanager last
// "use client";
// import React, { useState } from "react";
// import { Plus, Move, Trash2, LogOut } from "lucide-react";
// import AdminRoute from "@/app/components/AdminRoute";
// import { useAuth } from "@/app/context/AuthContext";
// import AddMasterClassPage from "../pages/addMasterClass";
// import EditMasterClassPage from "../pages/editMasterClass";
// import DeleteMasterClassPage from "../pages/deleteMasterClass";
// import AddStickerPage from "../pages/addSticker";
// import EditStickerPage from "../pages/editSticker";
// import DeleteStickerPage from "../pages/deleteSticker";
// import AddStickerCategory from "../pages/addStickerCategory";
// import EditStickerCategory from "../pages/editStickerCategory";
// import DeleteStickerCategory from "../pages/deleteStickerCategory";

// // White rounded container for the main content
// const ContentContainer = ({ children }) => {
//   return (
//     <div className="bg-white rounded-3xl shadow-lg mx-8 my-8 overflow-hidden">
//       {children}
//     </div>
//   );
// };

// // Sidebar Component
// const Sidebar = ({ currentPage, onPageChange }) => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [isStickersExpanded, setIsStickersExpanded] = useState(true);
//   const [isStickersCategoryExpanded, setIsStickersCategoryExpanded] =
//     useState(true);

//   return (
//     <div className="w-80 bg-white h-full flex flex-col border-r border-gray-100">
//       {/* User Profile Section */}
//       <div className="p-6 border-b border-gray-100">
//         <div className="flex items-center space-x-3">
//           <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800">
//             <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-xs">
//               VL
//             </div>
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-900">Виктор Ловецкий</h3>
//             <p className="text-sm text-gray-500">Администратор</p>
//           </div>
//         </div>
//         <button className="text-sm text-blue-500 mt-2 hover:text-blue-600">
//           Изменить фото
//         </button>
//       </div>

//       {/* Navigation */}
//       <div className="flex-1 px-4 py-6">
//         <div className="space-y-2">
//           {/* Master Classes Section */}
//           <div>
//             <div
//               className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium"
//               onClick={() => setIsExpanded(!isExpanded)}
//             >
//               <div className="flex items-center space-x-3">
//                 <span className="text-lg font-bold">—</span>
//                 <span>Мастер классы</span>
//               </div>
//             </div>

//             {isExpanded && (
//               <div className="ml-8 space-y-2 mt-2">
//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
//                     currentPage === "masterclass-edit"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("masterclass-edit")}
//                 >
//                   <span>
//                     <Move className="w-4 h-4" />
//                   </span>
//                   <span>Изменить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
//                     currentPage === "masterclass-add"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("masterclass-add")}
//                 >
//                   <span>
//                     <Plus className="w-4 h-4" />
//                   </span>
//                   <span>Добавить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
//                     currentPage === "masterclass-delete"
//                       ? "text-red-500 bg-red-50"
//                       : "text-gray-600 hover:bg-red-50 hover:text-red-500"
//                   }`}
//                   onClick={() => onPageChange("masterclass-delete")}
//                 >
//                   <span>
//                     <Trash2 className="w-4 h-4" />
//                   </span>
//                   <span>Удалить</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Stickers Section */}
//           <div>
//             <div
//               className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium"
//               onClick={() => setIsStickersExpanded(!isStickersExpanded)}
//             >
//               <div className="flex items-center space-x-3">
//                 <span className="text-lg font-bold">—</span>
//                 <span>Стикеры</span>
//               </div>
//             </div>

//             {isStickersExpanded && (
//               <div className="ml-8 space-y-2 mt-2">
//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
//                     currentPage === "sticker-edit"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("sticker-edit")}
//                 >
//                   <span>
//                     <Move className="w-4 h-4" />
//                   </span>
//                   <span>Изменить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
//                     currentPage === "sticker-add"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("sticker-add")}
//                 >
//                   <span>
//                     <Plus className="w-4 h-4" />
//                   </span>
//                   <span>Добавить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
//                     currentPage === "sticker-delete"
//                       ? "text-red-500 bg-red-50"
//                       : "text-gray-600 hover:bg-red-50 hover:text-red-500"
//                   }`}
//                   onClick={() => onPageChange("sticker-delete")}
//                 >
//                   <span>
//                     <Trash2 className="w-4 h-4" />
//                   </span>
//                   <span>Удалить</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Stickers Section */}
//           <div>
//             <div
//               className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium"
//               onClick={() =>
//                 setIsStickersCategoryExpanded(!isStickersCategoryExpanded)
//               }
//             >
//               <div className="flex items-center space-x-3">
//                 <span className="text-lg font-bold">—</span>
//                 <span>Категории</span>
//               </div>
//             </div>

//             {isStickersCategoryExpanded && (
//               <div className="ml-8 space-y-2 mt-2">
//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
//                     currentPage === "sticker-category-edit"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("sticker-category-edit")}
//                 >
//                   <span>
//                     <Move className="w-4 h-4" />
//                   </span>
//                   <span>Изменить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
//                     currentPage === "sticker-category-add"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("sticker-category-add")}
//                 >
//                   <span>
//                     <Plus className="w-4 h-4" />
//                   </span>
//                   <span>Добавить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
//                     currentPage === "sticker-category-delete"
//                       ? "text-red-500 bg-red-50"
//                       : "text-gray-600 hover:bg-red-50 hover:text-red-500"
//                   }`}
//                   onClick={() => onPageChange("sticker-category-delete")}
//                 >
//                   <span>
//                     <Trash2 className="w-4 h-4" />
//                   </span>
//                   <span>Удалить</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Other Menu Items */}
//           <button className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
//             <span>+</span>
//             <span>О нас</span>
//           </button>

//           <button className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
//             <span>+</span>
//             <span>Почему мы?</span>
//           </button>

//           <button className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
//             <span>+</span>
//             <span>Фотогалерея</span>
//           </button>
//         </div>
//       </div>

//       {/* Logout */}
//       <div className="p-4 border-t border-gray-100">
//         <button className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
//           <span>
//             <LogOut className="w-4 h-4 text-gray-600" />
//           </span>
//           <span>Выйти из аккаунта</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// // Main Component
// const AdminManagement = () => {
//   const [currentPage, setCurrentPage] = useState("masterclass-edit");

//   const { loading, isAuthenticated, isAdmin } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   console.log("isAuthenticated", isAuthenticated());
//   console.log("isAdmin", isAdmin());

//   if (!isAuthenticated()) {
//     console.log("Not authenticated");
//     return null; // Will be redirected by middleware or ProtectedRoute
//   }

//   // Function to render the current page content
//   const renderCurrentPage = () => {
//     switch (currentPage) {
//       // Master Class Pages
//       case "masterclass-edit":
//         return <EditMasterClassPage />;
//       case "masterclass-add":
//         return <AddMasterClassPage />;
//       case "masterclass-delete":
//         return <DeleteMasterClassPage />;

//       // Sticker Pages
//       case "sticker-edit":
//         return <EditStickerPage />;
//       case "sticker-add":
//         return <AddStickerPage />;
//       case "sticker-delete":
//         return <DeleteStickerPage />;

//       // Sticker Category Pages
//       case "sticker-category-edit":
//         return <EditStickerCategory />;
//       case "sticker-category-add":
//         return <AddStickerCategory />;
//       case "sticker-category-delete":
//         return <DeleteStickerCategory />;

//       default:
//         return <EditMasterClassPage />;
//     }
//   };

//   return (
//     <AdminRoute>
//       <div className="min-h-screen">
//         {/* Main content area with gradient background */}
//         <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-8">
//           <ContentContainer>
//             <div className="h-24 bg-gradient-to-r from-pink-300 to-pink-200"></div>
//             <div className="flex min-h-96">
//               <Sidebar
//                 currentPage={currentPage}
//                 onPageChange={setCurrentPage}
//               />

//               {renderCurrentPage()}
//             </div>
//           </ContentContainer>
//         </div>
//       </div>
//     </AdminRoute>
//   );
// };

// export default AdminManagement;

// last best
// "use client";
// import React, { useState } from "react";
// import {
//   Plus,
//   Move,
//   Trash2,
//   LogOut,
//   ChevronDown,
//   ChevronRight,
// } from "lucide-react";
// import AdminRoute from "@/app/components/AdminRoute";
// import { useAuth } from "@/app/context/AuthContext";
// import AddMasterClassPage from "../pages/addMasterClass";
// import EditMasterClassPage from "../pages/editMasterClass";
// import DeleteMasterClassPage from "../pages/deleteMasterClass";
// import AddStickerPage from "../pages/addSticker";
// import EditStickerPage from "../pages/editSticker";
// import DeleteStickerPage from "../pages/deleteSticker";
// import AddStickerCategory from "../pages/addStickerCategory";
// import EditStickerCategory from "../pages/editStickerCategory";
// import DeleteStickerCategory from "../pages/deleteStickerCategory";
// import { useRouter } from "next/navigation";
// import { AddGalleryPage, DeleteGalleryPage } from "../pages/galleryManagement";

// // White rounded container for the main content
// const ContentContainer = ({ children }) => {
//   return (
//     <div className="bg-white rounded-3xl shadow-lg mx-8 my-8 overflow-hidden">
//       {children}
//     </div>
//   );
// };

// // Sidebar Component
// const Sidebar = ({ currentPage, onPageChange }) => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [isStickersExpanded, setIsStickersExpanded] = useState(true);
//   const [isStickersCategoryExpanded, setIsStickersCategoryExpanded] =
//     useState(true);
//   const [isGalleryExpanded, setIsGalleryExpanded] = useState(true);

//   const router = useRouter();

//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     router.push("/auth/sign-in");
//   };

//   return (
//     <div className="w-80 bg-white h-full flex flex-col border-r border-gray-100">
//       {/* User Profile Section */}
//       <div className="p-6 border-b border-gray-100">
//         <div className="flex items-center space-x-3">
//           <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800">
//             <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-xs">
//               VL
//             </div>
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-900">Виктор Ловецкий</h3>
//             <p className="text-sm text-gray-500">Администратор</p>
//           </div>
//         </div>
//         <button className="text-sm text-blue-500 mt-2 hover:text-blue-600">
//           Изменить фото
//         </button>
//       </div>

//       {/* Navigation */}
//       <div className="flex-1 px-4 py-6">
//         <div className="space-y-2">
//           {/* Master Classes Section */}
//           <div>
//             <div
//               className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium transition-colors duration-200"
//               onClick={() => setIsExpanded(!isExpanded)}
//             >
//               <div className="flex items-center space-x-3">
//                 <div className="transition-transform duration-200">
//                   {isExpanded ? (
//                     <ChevronDown className="w-5 h-5 text-gray-600" />
//                   ) : (
//                     <ChevronRight className="w-5 h-5 text-gray-600" />
//                   )}
//                 </div>
//                 <span>Мастер классы</span>
//               </div>
//             </div>

//             {isExpanded && (
//               <div className="ml-8 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
//                     currentPage === "masterclass-edit"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("masterclass-edit")}
//                 >
//                   <span>
//                     <Move className="w-4 h-4" />
//                   </span>
//                   <span>Изменить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
//                     currentPage === "masterclass-add"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("masterclass-add")}
//                 >
//                   <span>
//                     <Plus className="w-4 h-4" />
//                   </span>
//                   <span>Добавить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
//                     currentPage === "masterclass-delete"
//                       ? "text-red-500 bg-red-50"
//                       : "text-gray-600 hover:bg-red-50 hover:text-red-500"
//                   }`}
//                   onClick={() => onPageChange("masterclass-delete")}
//                 >
//                   <span>
//                     <Trash2 className="w-4 h-4" />
//                   </span>
//                   <span>Удалить</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Stickers Section */}
//           <div>
//             <div
//               className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium transition-colors duration-200"
//               onClick={() => setIsStickersExpanded(!isStickersExpanded)}
//             >
//               <div className="flex items-center space-x-3">
//                 <div className="transition-transform duration-200">
//                   {isStickersExpanded ? (
//                     <ChevronDown className="w-5 h-5 text-gray-600" />
//                   ) : (
//                     <ChevronRight className="w-5 h-5 text-gray-600" />
//                   )}
//                 </div>
//                 <span>Стикеры</span>
//               </div>
//             </div>

//             {isStickersExpanded && (
//               <div className="ml-8 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
//                     currentPage === "sticker-edit"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("sticker-edit")}
//                 >
//                   <span>
//                     <Move className="w-4 h-4" />
//                   </span>
//                   <span>Изменить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
//                     currentPage === "sticker-add"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("sticker-add")}
//                 >
//                   <span>
//                     <Plus className="w-4 h-4" />
//                   </span>
//                   <span>Добавить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
//                     currentPage === "sticker-delete"
//                       ? "text-red-500 bg-red-50"
//                       : "text-gray-600 hover:bg-red-50 hover:text-red-500"
//                   }`}
//                   onClick={() => onPageChange("sticker-delete")}
//                 >
//                   <span>
//                     <Trash2 className="w-4 h-4" />
//                   </span>
//                   <span>Удалить</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Categories Section */}
//           <div>
//             <div
//               className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium transition-colors duration-200"
//               onClick={() =>
//                 setIsStickersCategoryExpanded(!isStickersCategoryExpanded)
//               }
//             >
//               <div className="flex items-center space-x-3">
//                 <div className="transition-transform duration-200">
//                   {isStickersCategoryExpanded ? (
//                     <ChevronDown className="w-5 h-5 text-gray-600" />
//                   ) : (
//                     <ChevronRight className="w-5 h-5 text-gray-600" />
//                   )}
//                 </div>
//                 <span>Категории Стикеров</span>
//               </div>
//             </div>

//             {isStickersCategoryExpanded && (
//               <div className="ml-8 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
//                     currentPage === "sticker-category-edit"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("sticker-category-edit")}
//                 >
//                   <span>
//                     <Move className="w-4 h-4" />
//                   </span>
//                   <span>Изменить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
//                     currentPage === "sticker-category-add"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("sticker-category-add")}
//                 >
//                   <span>
//                     <Plus className="w-4 h-4" />
//                   </span>
//                   <span>Добавить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
//                     currentPage === "sticker-category-delete"
//                       ? "text-red-500 bg-red-50"
//                       : "text-gray-600 hover:bg-red-50 hover:text-red-500"
//                   }`}
//                   onClick={() => onPageChange("sticker-category-delete")}
//                 >
//                   <span>
//                     <Trash2 className="w-4 h-4" />
//                   </span>
//                   <span>Удалить</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Other Menu Items */}
//           {/* <button className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left transition-colors duration-200">
//             <Plus className="w-4 h-4" />
//             <span>О нас</span>
//           </button> */}

//           {/* Gallery Section */}
//           <div>
//             <div
//               className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium transition-colors duration-200"
//               onClick={() => setIsGalleryExpanded(!isGalleryExpanded)}
//             >
//               <div className="flex items-center space-x-3">
//                 <div className="transition-transform duration-200">
//                   {isGalleryExpanded ? (
//                     <ChevronDown className="w-5 h-5 text-gray-600" />
//                   ) : (
//                     <ChevronRight className="w-5 h-5 text-gray-600" />
//                   )}
//                 </div>
//                 <span>Фотогалерея</span>
//               </div>
//             </div>

//             {isGalleryExpanded && (
//               <div className="ml-8 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
//                     currentPage === "gallery-add"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-gray-600 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("gallery-add")}
//                 >
//                   <span>
//                     <Plus className="w-4 h-4" />
//                   </span>
//                   <span>Добавить</span>
//                 </button>

//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
//                     currentPage === "gallery-delete"
//                       ? "text-red-500 bg-red-50"
//                       : "text-gray-600 hover:bg-red-50 hover:text-red-500"
//                   }`}
//                   onClick={() => onPageChange("gallery-delete")}
//                 >
//                   <span>
//                     <Trash2 className="w-4 h-4" />
//                   </span>
//                   <span>Удалить</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Logout */}
//       <div className="p-4 border-t border-gray-100">
//         <button
//           onClick={handleLogout}
//           className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left transition-colors duration-200"
//         >
//           <span>
//             <LogOut className="w-4 h-4 text-gray-600" />
//           </span>
//           <span>Выйти из аккаунта</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// // Main Component
// const AdminManagement = () => {
//   const [currentPage, setCurrentPage] = useState("masterclass-edit");

//   const { loading, isAuthenticated, isAdmin } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   console.log("isAuthenticated", isAuthenticated());
//   console.log("isAdmin", isAdmin());

//   if (!isAuthenticated()) {
//     console.log("Not authenticated");
//     return null; // Will be redirected by middleware or ProtectedRoute
//   }

//   // Function to render the current page content
//   const renderCurrentPage = () => {
//     switch (currentPage) {
//       // Master Class Pages
//       case "masterclass-edit":
//         return <EditMasterClassPage />;
//       case "masterclass-add":
//         return <AddMasterClassPage />;
//       case "masterclass-delete":
//         return <DeleteMasterClassPage />;

//       // Sticker Pages
//       case "sticker-edit":
//         return <EditStickerPage />;
//       case "sticker-add":
//         return <AddStickerPage />;
//       case "sticker-delete":
//         return <DeleteStickerPage />;

//       // Sticker Category Pages
//       case "sticker-category-edit":
//         return <EditStickerCategory />;
//       case "sticker-category-add":
//         return <AddStickerCategory />;
//       case "sticker-category-delete":
//         return <DeleteStickerCategory />;

//       case "gallery-add":
//         return <AddGalleryPage />;
//       case "gallery-delete":
//         return <DeleteGalleryPage />;

//       default:
//         return <EditMasterClassPage />;
//     }
//   };

//   return (
//     <AdminRoute>
//       <div className="min-h-screen">
//         {/* Main content area with gradient background */}
//         <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-8">
//           <ContentContainer>
//             <div className="h-24 bg-gradient-to-r from-pink-300 to-pink-200"></div>
//             <div className="flex min-h-96">
//               <Sidebar
//                 currentPage={currentPage}
//                 onPageChange={setCurrentPage}
//               />

//               {renderCurrentPage()}
//             </div>
//           </ContentContainer>
//         </div>
//       </div>
//     </AdminRoute>
//   );
// };

// export default AdminManagement;

"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Move,
  Trash2,
  LogOut,
  ChevronDown,
  ChevronRight,
  Users,
  Logs,
  Contact,
  Edit,
} from "lucide-react";
import AdminRoute from "@/app/components/AdminRoute";
import { useAuth } from "@/app/context/AuthContext";
import AddMasterClassPage from "../pages/addMasterClass";
import EditMasterClassPage from "../pages/editMasterClass";
import DeleteMasterClassPage from "../pages/deleteMasterClass";
import AddStickerPage from "../pages/addSticker";
import EditStickerPage from "../pages/editSticker";
import DeleteStickerPage from "../pages/deleteSticker";
import AddStickerCategory from "../pages/addStickerCategory";
import EditStickerCategory from "../pages/editStickerCategory";
import DeleteStickerCategory from "../pages/deleteStickerCategory";
import { useRouter } from "next/navigation";
import { AddGalleryPage, DeleteGalleryPage } from "../pages/galleryManagement";
import EnrollmentManagementPage from "../pages/enrollmentManagement";
import ContactsPage from "../pages/contactsManagement";
import AboutPage from "../pages/aboutManager";

// White rounded container for the main content
const ContentContainer = ({ children }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg mx-8 my-8 overflow-hidden">
      {children}
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ currentPage, onPageChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isStickersExpanded, setIsStickersExpanded] = useState(true);
  const [isStickersCategoryExpanded, setIsStickersCategoryExpanded] =
    useState(true);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(true);
  const [isEnrollmentsExpanded, setIsEnrollmentsExpanded] = useState(true);
  const [isContactManager, setIsContactManager] = useState(true);
  const [isAboutManager, setIsAboutManager] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  console.log(user);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/auth/sign-in");
  };

  return (
    <div className="w-80 bg-white h-full flex flex-col border-r border-gray-100">
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800">
            <img src={user.photo} alt="user" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.first_name}</h3>
            <p className="text-sm text-gray-500">Администратор</p>
          </div>
        </div>
        {/* <button className="text-sm text-blue-500 mt-2 hover:text-blue-600">
          Изменить фото
        </button> */}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {/* Master Classes Section */}
          <div>
            <div
              className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium transition-colors duration-200"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center space-x-3">
                <div className="transition-transform duration-200">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <span>Мастер классы</span>
              </div>
            </div>

            {isExpanded && (
              <div className="ml-8 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
                    currentPage === "masterclass-edit"
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                  onClick={() => onPageChange("masterclass-edit")}
                >
                  <span>
                    <Move className="w-4 h-4" />
                  </span>
                  <span>Изменить</span>
                </button>

                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
                    currentPage === "masterclass-add"
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                  onClick={() => onPageChange("masterclass-add")}
                >
                  <span>
                    <Plus className="w-4 h-4" />
                  </span>
                  <span>Добавить</span>
                </button>

                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
                    currentPage === "masterclass-delete"
                      ? "text-red-500 bg-red-50"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-500"
                  }`}
                  onClick={() => onPageChange("masterclass-delete")}
                >
                  <span>
                    <Trash2 className="w-4 h-4" />
                  </span>
                  <span>Удалить</span>
                </button>
              </div>
            )}
          </div>

          {/* Enrollments Section */}
          <div>
            <div
              className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium transition-colors duration-200"
              onClick={() => setIsEnrollmentsExpanded(!isEnrollmentsExpanded)}
            >
              <div className="flex items-center space-x-3">
                <div className="transition-transform duration-200">
                  {isEnrollmentsExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <span>Записи на МК</span>
              </div>
            </div>

            {isEnrollmentsExpanded && (
              <div className="ml-8 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
                    currentPage === "enrollments-manage"
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                  onClick={() => onPageChange("enrollments-manage")}
                >
                  <span>
                    <Users className="w-4 h-4" />
                  </span>
                  <span>Управление записями</span>
                </button>
              </div>
            )}
          </div>

          {/* Stickers Section */}
          <div>
            <div
              className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium transition-colors duration-200"
              onClick={() => setIsStickersExpanded(!isStickersExpanded)}
            >
              <div className="flex items-center space-x-3">
                <div className="transition-transform duration-200">
                  {isStickersExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <span>Стикеры</span>
              </div>
            </div>

            {isStickersExpanded && (
              <div className="ml-8 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
                    currentPage === "sticker-edit"
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                  onClick={() => onPageChange("sticker-edit")}
                >
                  <span>
                    <Move className="w-4 h-4" />
                  </span>
                  <span>Изменить</span>
                </button>

                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
                    currentPage === "sticker-add"
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                  onClick={() => onPageChange("sticker-add")}
                >
                  <span>
                    <Plus className="w-4 h-4" />
                  </span>
                  <span>Добавить</span>
                </button>

                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
                    currentPage === "sticker-delete"
                      ? "text-red-500 bg-red-50"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-500"
                  }`}
                  onClick={() => onPageChange("sticker-delete")}
                >
                  <span>
                    <Trash2 className="w-4 h-4" />
                  </span>
                  <span>Удалить</span>
                </button>
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div>
            <div
              className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium transition-colors duration-200"
              onClick={() =>
                setIsStickersCategoryExpanded(!isStickersCategoryExpanded)
              }
            >
              <div className="flex items-center space-x-3">
                <div className="transition-transform duration-200">
                  {isStickersCategoryExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <span>Категории Стикеров</span>
              </div>
            </div>

            {isStickersCategoryExpanded && (
              <div className="ml-8 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
                    currentPage === "sticker-category-edit"
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                  onClick={() => onPageChange("sticker-category-edit")}
                >
                  <span>
                    <Move className="w-4 h-4" />
                  </span>
                  <span>Изменить</span>
                </button>

                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
                    currentPage === "sticker-category-add"
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                  onClick={() => onPageChange("sticker-category-add")}
                >
                  <span>
                    <Plus className="w-4 h-4" />
                  </span>
                  <span>Добавить</span>
                </button>

                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
                    currentPage === "sticker-category-delete"
                      ? "text-red-500 bg-red-50"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-500"
                  }`}
                  onClick={() => onPageChange("sticker-category-delete")}
                >
                  <span>
                    <Trash2 className="w-4 h-4" />
                  </span>
                  <span>Удалить</span>
                </button>
              </div>
            )}
          </div>

          {/* Gallery Section */}
          <div>
            <div
              className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium transition-colors duration-200"
              onClick={() => setIsGalleryExpanded(!isGalleryExpanded)}
            >
              <div className="flex items-center space-x-3">
                <div className="transition-transform duration-200">
                  {isGalleryExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <span>Фотогалерея</span>
              </div>
            </div>

            {isGalleryExpanded && (
              <div className="ml-8 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
                    currentPage === "gallery-add"
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                  onClick={() => onPageChange("gallery-add")}
                >
                  <span>
                    <Plus className="w-4 h-4" />
                  </span>
                  <span>Добавить</span>
                </button>

                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
                    currentPage === "gallery-delete"
                      ? "text-red-500 bg-red-50"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-500"
                  }`}
                  onClick={() => onPageChange("gallery-delete")}
                >
                  <span>
                    <Trash2 className="w-4 h-4" />
                  </span>
                  <span>Удалить</span>
                </button>
              </div>
            )}
          </div>

          {/* Contact Management Section */}
          <div>
            <div
              className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium transition-colors duration-200"
              onClick={() => setIsContactManager(!isContactManager)}
            >
              <div className="flex items-center space-x-3">
                <div className="transition-transform duration-200">
                  {isContactManager ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <span>Контакты</span>
              </div>
            </div>

            {isContactManager && (
              <div className="ml-8 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
                    currentPage === "contact-manager"
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                  onClick={() => onPageChange("contact-manager")}
                >
                  <span>
                    <Contact className="w-4 h-4" />
                  </span>
                  <span>Изменить</span>
                </button>
              </div>
            )}
          </div>

          {/* About Management Section */}
          <div>
            <div
              className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium transition-colors duration-200"
              onClick={() => setIsAboutManager(!isAboutManager)}
            >
              <div className="flex items-center space-x-3">
                <div className="transition-transform duration-200">
                  {isAboutManager ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <span>О нас</span>
              </div>
            </div>

            {isAboutManager && (
              <div className="ml-8 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm transition-colors duration-200 ${
                    currentPage === "about-manager"
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                  onClick={() => onPageChange("about-manager")}
                >
                  <span>
                    <Edit className="w-4 h-4" />
                  </span>
                  <span>Изменить</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left transition-colors duration-200"
        >
          <span>
            <LogOut className="w-4 h-4 text-gray-600" />
          </span>
          <span>Выйти из аккаунта</span>
        </button>
      </div>
    </div>
  );
};

// Main Component
const AdminManagement = () => {
  const [currentPage, setCurrentPage] = useState("masterclass-edit");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const { loading, isAuthenticated, isAdmin } = useAuth();

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading while auth is being checked or on server side
  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-700">Загрузка...</span>
          </div>
        </div>
      </div>
    );
  }

  // Check authentication after client-side render
  if (!isAuthenticated()) {
    console.log("Not authenticated, redirecting...");
    router.push("/auth/sign-in");
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-700">Перенаправление...</span>
          </div>
        </div>
      </div>
    );
  }

  // Check admin privileges
  if (!isAdmin()) {
    console.log("Not admin, redirecting...");
    router.push("/user-account");
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Доступ запрещен</h2>
            <p>У вас нет прав администратора</p>
          </div>
        </div>
      </div>
    );
  }

  // Function to render the current page content
  const renderCurrentPage = () => {
    switch (currentPage) {
      // Master Class Pages
      case "masterclass-edit":
        return <EditMasterClassPage />;
      case "masterclass-add":
        return <AddMasterClassPage />;
      case "masterclass-delete":
        return <DeleteMasterClassPage />;

      // Enrollment Management
      case "enrollments-manage":
        return <EnrollmentManagementPage />;

      // Sticker Pages
      case "sticker-edit":
        return <EditStickerPage />;
      case "sticker-add":
        return <AddStickerPage />;
      case "sticker-delete":
        return <DeleteStickerPage />;

      // Sticker Category Pages
      case "sticker-category-edit":
        return <EditStickerCategory />;
      case "sticker-category-add":
        return <AddStickerCategory />;
      case "sticker-category-delete":
        return <DeleteStickerCategory />;

      case "gallery-add":
        return <AddGalleryPage />;
      case "gallery-delete":
        return <DeleteGalleryPage />;

      case "contact-manager":
        return <ContactsPage />;

      case "about-manager":
        return <AboutPage />;

      default:
        return <EditMasterClassPage />;
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen">
        {/* Main content area with gradient background */}
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-8">
          <ContentContainer>
            <div className="h-24 bg-gradient-to-r from-pink-300 to-pink-200"></div>
            <div className="flex min-h-96">
              <Sidebar
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />

              {renderCurrentPage()}
            </div>
          </ContentContainer>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminManagement;
