"use client";
import React, { useState } from "react";
import {
  User,
  Wrench,
  Calendar,
  LogOut,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const PersonalCabinet = () => {
  const [contactDataExpanded, setContactDataExpanded] = useState(true);
  const [personalDataExpanded, setPersonalDataExpanded] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("Не выбрано");
  const [birthMonth, setBirthMonth] = useState("Выберите месяц");
  const [birthYear, setBirthYear] = useState("Выберите год");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200">
      {/* Header */}
      <div className="h-24 bg-gradient-to-r from-pink-300 to-orange-300 rounded-t-3xl"></div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white min-h-screen shadow-lg">
          {/* Profile Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  Виктор Ловецкий
                </h3>
                <button className="text-sm text-blue-500 hover:text-blue-600 underline">
                  Изменить фото
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-6">
            <div className="space-y-4">
              <button className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left bg-gray-50">
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Личные данные</span>
              </button>

              <button className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left">
                <Wrench className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Мои мастер - классы</span>
              </button>

              <button className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Выбрать дату</span>
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <button className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left">
              <LogOut className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Выйти из аккаунта</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 bg-white mx-8 my-8 rounded-3xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Личный кабинет
          </h1>

          {/* Contact Data Section */}
          <div className="mb-6">
            <button
              onClick={() => setContactDataExpanded(!contactDataExpanded)}
              className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-semibold text-gray-900">
                Контактные данные
              </span>
              {contactDataExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {contactDataExpanded && (
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Введите имя"
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ваша фамилия
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Введите фамилию"
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Personal Data Section */}
          <div className="mb-8">
            <button
              onClick={() => setPersonalDataExpanded(!personalDataExpanded)}
              className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-semibold text-gray-900">Личные данные</span>
              {personalDataExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {personalDataExpanded && (
              <div className="mt-4 grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ваш пол
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option>Не выбрано</option>
                    <option>Мужской</option>
                    <option>Женский</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Месяц рождения
                  </label>
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option>Выберите месяц</option>
                    <option>Январь</option>
                    <option>Февраль</option>
                    <option>Март</option>
                    <option>Апрель</option>
                    <option>Май</option>
                    <option>Июнь</option>
                    <option>Июль</option>
                    <option>Август</option>
                    <option>Сентябрь</option>
                    <option>Октябрь</option>
                    <option>Ноябрь</option>
                    <option>Декабрь</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Год рождения
                  </label>
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option>Выберите год</option>
                    {Array.from({ length: 50 }, (_, i) => 2005 - i).map(
                      (year) => (
                        <option key={year}>{year}</option>
                      )
                    )}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-medium text-lg shadow-lg transition-colors">
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalCabinet;
