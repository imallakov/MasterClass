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
//                       : "text-black-500 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("edit")}
//                 >
//                   <span className="text-blue-500">
//                     <Move className="w-4 h-4 text-gray-600" />
//                   </span>
//                   <span>Изменить</span>
//                 </button>
//                 <button
//                   className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
//                     currentPage === "add"
//                       ? "text-blue-500 bg-blue-50"
//                       : "text-black-500 hover:bg-blue-50"
//                   }`}
//                   onClick={() => onPageChange("add")}
//                 >
//                   <span className="text-blue-500">
//                     <Plus className="w-4 h-4 text-gray-600" />
//                   </span>
//                   <span>Добавить</span>
//                 </button>
//                 <button className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left text-sm">
//                   <span className="text-gray-600">
//                     <Trash2 className="w-4 h-4 text-gray-600" />
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

//               {currentPage === "edit" ? (
//                 <EditMasterClassPage />
//               ) : (
//                 <AddMasterClassPage />
//               )}
//             </div>
//           </ContentContainer>
//         </div>
//       </div>
//     </AdminRoute>
//   );
// };

// export default MasterClassManagement;

// admin/add-masterclass/page.jsx
"use client";
import React, { useState } from "react";
import { Plus, Move, Trash2, LogOut } from "lucide-react";
import AdminRoute from "@/app/components/AdminRoute";
import { useAuth } from "@/app/context/AuthContext";
import AddMasterClassPage from "../pages/addMasterClass";
import EditMasterClassPage from "../pages/editMasterClass";
import DeleteMasterClassPage from "../pages/deleteMasterClass";

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

  return (
    <div className="w-80 bg-white h-full flex flex-col border-r border-gray-100">
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800">
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-xs">
              VL
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Виктор Ловецкий</h3>
            <p className="text-sm text-gray-500">Администратор</p>
          </div>
        </div>
        <button className="text-sm text-blue-500 mt-2 hover:text-blue-600">
          Изменить фото
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {/* Master Classes Section */}
          <div>
            <div
              className="flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer font-medium"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold">—</span>
                <span>Мастер классы</span>
              </div>
            </div>

            {isExpanded && (
              <div className="ml-8 space-y-2 mt-2">
                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
                    currentPage === "edit"
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                  onClick={() => onPageChange("edit")}
                >
                  <span>
                    <Move className="w-4 h-4" />
                  </span>
                  <span>Изменить</span>
                </button>

                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
                    currentPage === "add"
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                  onClick={() => onPageChange("add")}
                >
                  <span>
                    <Plus className="w-4 h-4" />
                  </span>
                  <span>Добавить</span>
                </button>

                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
                    currentPage === "delete"
                      ? "text-red-500 bg-red-50"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-500"
                  }`}
                  onClick={() => onPageChange("delete")}
                >
                  <span>
                    <Trash2 className="w-4 h-4" />
                  </span>
                  <span>Удалить</span>
                </button>
              </div>
            )}
          </div>

          {/* Other Menu Items */}
          <button className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
            <span>+</span>
            <span>О нас</span>
          </button>

          <button className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
            <span>+</span>
            <span>Почему мы?</span>
          </button>

          <button className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
            <span>+</span>
            <span>Фотогалерея</span>
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
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
const MasterClassManagement = () => {
  const [currentPage, setCurrentPage] = useState("edit");

  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("isAuthenticated", isAuthenticated());
  console.log("isAdmin", isAdmin());

  if (!isAuthenticated()) {
    console.log("Not authenticated");
    return null; // Will be redirected by middleware or ProtectedRoute
  }

  // Function to render the current page content
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "edit":
        return <EditMasterClassPage />;
      case "add":
        return <AddMasterClassPage />;
      case "delete":
        return <DeleteMasterClassPage />;
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

export default MasterClassManagement;
