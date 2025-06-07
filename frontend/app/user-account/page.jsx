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
import UserRoute from "../components/UserRoute";

// White rounded container for the main content
const ContentContainer = ({ children }) => {
  return (
    <div className="bg-white max-h-[750px] rounded-3xl shadow-lg mx-16 overflow-hidden">
      {children}
    </div>
  );
};

const PersonalCabinet = () => {
  const [currentPage, setCurrentPage] = useState("profile");
  const [contactDataExpanded, setContactDataExpanded] = useState(true);
  const [personalDataExpanded, setPersonalDataExpanded] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("Не выбрано");
  const [birthMonth, setBirthMonth] = useState("Выберите месяц");
  const [birthYear, setBirthYear] = useState("Выберите год");
  const [selectedDate, setSelectedDate] = useState(18);
  const [selectedMonth, setSelectedMonth] = useState("Апрель 2025");
  const [selectedTime, setSelectedTime] = useState("9:30");
  const [participants, setParticipants] = useState(22);

  return (
    <UserRoute>
      <div className="min-h-screen">
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 py-8">
          <ContentContainer>
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
                    <button
                      onClick={() => setCurrentPage("profile")}
                      className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left ${
                        currentPage === "profile" ? "bg-gray-50" : ""
                      }`}
                    >
                      <User className="w-5 h-5 text-gray-600" />
                      <span
                        className={`${
                          currentPage === "profile"
                            ? "font-medium text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        Личные данные
                      </span>
                    </button>

                    <button className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left">
                      <Wrench className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">Мои мастер - классы</span>
                    </button>

                    <button
                      onClick={() => setCurrentPage("booking")}
                      className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left ${
                        currentPage === "booking" ? "bg-gray-50" : ""
                      }`}
                    >
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span
                        className={`${
                          currentPage === "booking"
                            ? "font-medium text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        Запись на мастер - класс
                      </span>
                    </button>
                  </div>
                </div>
                {/* Logout Button */}
                <div className="p-6">
                  <button className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left">
                    <LogOut className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Выйти из аккаунта</span>
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-8 bg-white mx-8 my-8 rounded-3xl">
                {currentPage === "profile" ? (
                  <ProfilePage
                    contactDataExpanded={contactDataExpanded}
                    setContactDataExpanded={setContactDataExpanded}
                    personalDataExpanded={personalDataExpanded}
                    setPersonalDataExpanded={setPersonalDataExpanded}
                    firstName={firstName}
                    setFirstName={setFirstName}
                    lastName={lastName}
                    setLastName={setLastName}
                    gender={gender}
                    setGender={setGender}
                    birthMonth={birthMonth}
                    setBirthMonth={setBirthMonth}
                    birthYear={birthYear}
                    setBirthYear={setBirthYear}
                  />
                ) : (
                  <BookingPage
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    participants={participants}
                    setParticipants={setParticipants}
                  />
                )}
              </div>
            </div>
          </ContentContainer>
        </div>
      </div>
    </UserRoute>
  );
};

const ProfilePage = ({
  contactDataExpanded,
  setContactDataExpanded,
  personalDataExpanded,
  setPersonalDataExpanded,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  gender,
  setGender,
  birthMonth,
  setBirthMonth,
  birthYear,
  setBirthYear,
}) => {
  return (
    <div className="">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Личный кабинет</h1>

      {/* Contact Data Section */}
      <div className="mb-6">
        <button
          onClick={() => setContactDataExpanded(!contactDataExpanded)}
          className="flex items-center justify-between w-90 py-4 transition-colors"
        >
          <span className="font-semibold text-gray-900">Контактные данные</span>
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
          className="flex items-center justify-between w-90 py-4 transition-colors"
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
                {Array.from({ length: 50 }, (_, i) => 2005 - i).map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-medium text-lg shadow-lg transition-colors">
          Сохранить
        </button>
      </div>
    </div>
  );
};

const BookingPage = ({
  selectedDate,
  setSelectedDate,
  selectedMonth,
  setSelectedMonth,
  selectedTime,
  setSelectedTime,
  participants,
  setParticipants,
}) => {
  const timeSlots = ["9:30", "10:20", "12:10", "14:30", "19:30"];

  const calendar = [
    [null, null, null, null, null, null, 1],
    [2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, 22],
    [23, 24, 25, 26, 27, 28, 29],
    [30, 31, 1, 2, 3, 4, 5],
  ];

  const getDateStatus = (date) => {
    if (!date || date > 31) return "";
    if ([8, 14, 15, 20, 21, 22, 23, 26, 28, 29].includes(date))
      return "available";
    if ([9, 17].includes(date)) return "highlighted";
    return "unavailable";
  };

  const getDateClass = (date, status) => {
    if (!date || date > 31) return "text-gray-300";
    if (date === selectedDate)
      return "bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center";
    if (status === "available")
      return "text-green-500 hover:bg-green-50 cursor-pointer rounded-full w-8 h-8 flex items-center justify-center";
    if (status === "highlighted")
      return "text-green-400 hover:bg-green-50 cursor-pointer rounded-full w-8 h-8 flex items-center justify-center";
    return "text-gray-400 cursor-not-allowed";
  };

  return (
    <div className="flex gap-8">
      {/* Left Side - Calendar and Time */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Выбрать дату</h1>

        {/* Calendar */}
        <div className="mb-8">
          <div className="border-2 border-blue-300 rounded-2xl p-6 bg-white">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button className="p-2 hover:bg-gray-100 rounded">
                <svg
                  className="w-5 h-5"
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
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                Апрель 2025
              </h2>
              <button className="p-2 hover:bg-gray-100 rounded">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {calendar.map((week, weekIndex) =>
                week.map((date, dayIndex) => {
                  const status = getDateStatus(date);
                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`p-2 text-sm font-medium ${getDateClass(
                        date,
                        status
                      )}`}
                      onClick={() =>
                        date &&
                        date <= 31 &&
                        status !== "unavailable" &&
                        setSelectedDate(date)
                      }
                    >
                      {date}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Available Time Slots */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Доступное время:
          </h3>
          <div className="flex flex-wrap gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedTime === time
                    ? "bg-green-500 text-white"
                    : "bg-gray-600 text-white hover:bg-gray-700"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Additional Info */}
      <div className="w-80">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Дополнительные данные
        </h2>

        {/* Participants Counter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">
              Количество участников
            </span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setParticipants(Math.max(1, participants - 1))}
                className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-400"
              >
                -
              </button>
              <span className="text-xl font-bold text-orange-500">
                {participants}/24
              </span>
              <button
                onClick={() => setParticipants(Math.min(24, participants + 1))}
                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Master Class Description */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Что будет на МК</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Куклы макраме - интересный вариант домашнего декора и настоящий
            простор для фантазии рукодельниц. Каждый участник сам выберет какого
            цвета будет платье, волосы, сделает своей кукле прическу или
            заплетет косу, сплетет венок.
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="mb-6">
          <p className="text-xs text-gray-600 mb-2">
            Нажимая кнопку "Записаться", вы автоматически соглашаетесь с{" "}
            <a href="#" className="text-blue-500 underline">
              обработкой ваших персональных данных
            </a>
          </p>
        </div>

        {/* Register Button */}
        <button className="w-full bg-blue-400 hover:bg-blue-500 text-white py-3 rounded-full font-medium text-lg shadow-lg transition-colors">
          Записаться
        </button>
      </div>
    </div>
  );
};

export default PersonalCabinet;
