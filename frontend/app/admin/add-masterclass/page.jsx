"use client";
import React, { useState } from "react";
import { Plus, Move, Trash2, LogOut } from "lucide-react";

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
                      : "text-black-500 hover:bg-blue-50"
                  }`}
                  onClick={() => onPageChange("edit")}
                >
                  <span className="text-blue-500">
                    <Move className="w-4 h-4 text-gray-600" />
                  </span>
                  <span>Изменить</span>
                </button>
                <button
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left text-sm ${
                    currentPage === "add"
                      ? "text-blue-500 bg-blue-50"
                      : "text-black-500 hover:bg-blue-50"
                  }`}
                  onClick={() => onPageChange("add")}
                >
                  <span className="text-blue-500">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </span>
                  <span>Добавить</span>
                </button>
                <button className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left text-sm">
                  <span className="text-gray-600">
                    <Trash2 className="w-4 h-4 text-gray-600" />
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

// Edit Master Class Page
const EditMasterClassPage = () => {
  const [selectedClass, setSelectedClass] = useState("");

  return (
    <div className="flex flex-1">
      {/* Left Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Мастер - классы</h1>
          <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2.5 rounded-full font-medium text-sm">
            Отключить блок
          </button>
        </div>

        {/* Master Class Selection */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-900 mb-4">
            Выберите мастер - класс
          </label>
          <div className="space-y-3">
            <button
              className={`w-full p-4 rounded-xl text-left font-medium ${
                selectedClass === "macrame"
                  ? "bg-gray-300 text-gray-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedClass("macrame")}
            >
              Макраме кукла
            </button>
            <button
              className={`w-full p-4 rounded-xl text-left font-medium ${
                selectedClass === "macrame-leaf"
                  ? "bg-gray-300 text-gray-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedClass("macrame-leaf")}
            >
              Макраме лист пером
            </button>
          </div>
        </div>

        {/* Edit Options */}
        <div className="mb-12">
          <div className="space-y-6">
            <button className="text-gray-700 underline hover:text-gray-900 font-medium text-left block">
              Изменить дату/время
            </button>
            <button className="text-blue-500 underline hover:text-blue-600 font-medium text-left block">
              Изменить цену
            </button>
            <button className="text-gray-700 underline hover:text-gray-900 font-medium text-left block">
              Изменить название
            </button>
            <button className="text-gray-700 underline hover:text-gray-900 font-medium text-left block">
              Изменить фото
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button className="bg-[#64A0CE] hover:bg-[#6598c0] text-white px-10 py-3 rounded-full font-medium text-lg">
            Сохранить
          </button>
        </div>
      </div>

      {/* Right Section - Product Card */}
      <div className="w-80 p-8 flex items-start justify-center">
        <div className="w-72">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative">
              <div className="w-full h-56 bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center">
                <div className="w-24 h-32 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-20 bg-gray-300 rounded mb-2"></div>
                    <div className="text-xs text-gray-500">Макраме кукла</div>
                  </div>
                </div>
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-blue-500 text-sm font-bold">ℹ</span>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-gray-600 font-medium mb-1">Макраме</h3>
              <h4 className="text-gray-600 font-medium mb-4">кукла</h4>
              <div className="flex items-center justify-end">
                <span className="text-2xl font-bold text-gray-300">1200 ₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Master Class Page
const AddMasterClassPage = () => {
  const [masterClassName, setMasterClassName] = useState("");
  const [price, setPrice] = useState("");

  return (
    <div className="flex flex-1">
      {/* Left Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Добавить мастер - класс
          </h1>
          <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2.5 rounded-full font-medium text-sm">
            Отключить блок
          </button>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-8">
            Создание мастер - класса
          </h2>

          {/* Add Master Class Name */}
          <div>
            <label className="block text-gray-900 font-medium mb-3 text-base">
              Добавить мастер класс
            </label>
            <input
              type="text"
              value={masterClassName}
              onChange={(e) => setMasterClassName(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              placeholder="Название мастер-класса"
            />
          </div>

          {/* Add Title */}
          <div>
            <label className="block text-gray-900 font-medium mb-3 text-base">
              Добавить название
            </label>
            <input
              type="text"
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              placeholder="Введите название"
            />
          </div>

          {/* Set Price */}
          <div>
            <label className="block text-gray-900 font-medium mb-3 text-base">
              Указать стоимость
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              placeholder="Стоимость в рублях"
            />
          </div>

          {/* Upload Photo */}
          <div>
            <label className="block text-gray-900 font-medium mb-3 text-base">
              Загрузить фото
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-300 cursor-pointer bg-gray-50">
              <input
                type="file"
                className="hidden"
                id="photo-upload"
                accept="image/*"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="font-medium">Нажмите для загрузки фото</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-12">
          <button className="bg-[#64A0CE] hover:bg-[#6598c0] text-white px-10 py-3 rounded-full font-medium text-lg shadow-md">
            Сохранить
          </button>
        </div>
      </div>

      {/* Right Section - Product Card */}
      <div className="w-80 p-8 flex items-start justify-center">
        <div className="w-72">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative">
              <div className="w-full h-56 bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center">
                <div className="w-24 h-32 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-20 bg-gray-300 rounded mb-2"></div>
                    <div className="text-xs text-gray-500">Макраме кукла</div>
                  </div>
                </div>
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-blue-500 text-sm font-bold">ℹ</span>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-gray-600 font-medium mb-1">Макраме</h3>
              <h4 className="text-gray-600 font-medium mb-4">кукла</h4>
              <div className="flex items-center justify-end">
                <span className="text-2xl font-bold text-gray-300">1200 ₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const MasterClassManagement = () => {
  const [currentPage, setCurrentPage] = useState("edit");

  return (
    <div className="min-h-screen">
      {/* Main content area with gradient background */}
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-8">
        <ContentContainer>
          <div className="h-24 bg-gradient-to-r from-pink-300 to-pink-200"></div>
          <div className="flex min-h-96">
            <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

            {currentPage === "edit" ? (
              <EditMasterClassPage />
            ) : (
              <AddMasterClassPage />
            )}
          </div>
        </ContentContainer>
      </div>
    </div>
  );
};

export default MasterClassManagement;
