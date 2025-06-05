"use client";
import React, { useState } from "react";
import PhotoGallery from "../components/PhotoGallery";
import Image from "next/image";
import MasterClasses from "../components/MasterClasses";
import AboutUs from "../components/AboutUs";
import WhyUs from "../components/WhyUs";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
            <div className="w-8 h-8 bg-pink-200 rounded"></div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
            Главная
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
            Мастер - классы
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
            О Нас
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
            Расписание
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
            Контакты
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
            Наклейки
          </a>
        </div>

        {/* CTA Button */}
        <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2 rounded-full font-medium transition-colors">
          Получить консультацию
        </button>

        {/* Mobile menu button */}
        <button className="md:hidden">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

// Product Card Component
const ProductCard = ({ title, price }) => {
  return (
    <div className="bg-white rounded-lg border-2 border-solid border-[#3A6281] overflow-hidden max-w-80">
      <div className="h-80 flex items-center justify-center relative">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full aspect-[3/4] bg-white rounded-lg flex items-center justify-center">
            {/* <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden"> */}
            <Image
              src="/images/gallery4.jpg"
              alt="Workshop scene"
              fill
              className="object-cover p-4"
              priority
            />
            {/* </div> */}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className=" text-[#000000] mb-3 text-lg">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold text-[#000000]">{price}</span>
        </div>
        <button className="w-full bg-[#61BF7D] hover:bg-[#49905e] text-white text-xl py-2 px-4 rounded-2xl font-medium mt-6 transition-colors">
          Заказать
        </button>
      </div>
    </div>
  );
};

// Category Section Component
const CategorySection = ({ category, items }) => {
  return (
    <div className="mb-12">
      <div className="mb-12">
        <h2 className="text-5xl font-bold text-slate-600 mb-4">{category}:</h2>
        <p className="text-lg font-bold text-slate-600">
          Твоя идея - наша реализация!
        </p>
        <p className="text-lg font-bold text-slate-600">
          Создай уникальные наклейки по собственному дизайну. Воплотим любую
          задумку!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <ProductCard key={index} title={item.title} price={item.price} />
        ))}
      </div>
    </div>
  );
};

// Main Component
const Homepage2 = () => {
  const [showAll, setShowAll] = useState(false);

  // JSON data
  const stickersData = {
    stickers: [
      {
        category: "Мотивационные",
        title1: "Вдохновляйся каждый день!",
        title2:
          "Мотивационные наклейки – заряд энергии и позитива для твоего пространства.",
        items: [
          { title: "Чтобы дойти до цели...", price: "334 ₽" },
          { title: "У тебя всё получится", price: "334 ₽" },
          {
            title: "Ты молодец! Даже если никто тебе этого не сказал",
            price: "334 ₽",
          },
        ],
      },
      {
        category: "Аффирмации",
        title1: "Измени свою жизнь с помощью слов!",
        title2:
          "Наклейки-аффирмации - мощный инструмент для подсознания и достижения целей..",
        items: [
          { title: "В гармонии с собой и с миром", price: "334 ₽" },
          { title: "Свети", price: "334 ₽" },
          { title: "Я люблю себя", price: "334 ₽" },
        ],
      },
      {
        category: "Поздравительные",
        title1: "Сделай праздник ярче!",
        title2:
          "Поздравительные наклейки для украшения подарков, открыток и всего, что дарит радость.",
        items: [
          { title: "Любимой маме и дорогой бабушке!", price: "334 ₽" },
          { title: "С Юбилеем", price: "334 ₽" },
          { title: "Чудесного Нового Года, любимая!", price: "334 ₽" },
        ],
      },
      {
        category: "Именные",
        title1: "Персонализируй все!",
        title2:
          "Именные наклейки – отличный способ пометить вещи, подарки или создать уникальный стиль",
        items: [
          { title: "Настя", price: "334 ₽" },
          { title: "Крещение Максима", price: "334 ₽" },
          { title: "Полине 1 годик", price: "334 ₽" },
        ],
      },
      {
        category: "На выписку",
        title1: "Самый трогательный момент!",
        title2:
          "Наклейки на выписку из роддома – украсьте машину, дом и создайте праздничное настроение.",
        items: [
          { title: "Добро пожаловать домой, Ляля!", price: "334 ₽" },
          { title: "Добро пожаловать домой", price: "334 ₽" },
          { title: "Welcome Baby", price: "334 ₽" },
        ],
      },
      {
        category: "На выпускной",
        title1: "Праздник, который запомнится!",
        title2:
          "Наклейки на выпускной – для украшения зала, подарков и памятных сувениров",
        items: [
          { title: "Последний звонок!", price: "334 ₽" },
          { title: "Выпуск 2025", price: "334 ₽" },
          { title: "До свидания, детский сад!", price: "334 ₽" },
        ],
      },
      {
        category: "Для витрин",
        title1: "Привлекай внимание к своему бизнесу!",
        title2:
          "Наклейки для витрин – яркая реклама, акции и информация для ваших клиентов",
        items: [
          { title: "Аптека", price: "334 ₽" },
          { title: "Фрукты овощи", price: "334 ₽" },
          { title: "Канцтовары", price: "334 ₽" },
        ],
      },
      {
        category: "Режим работы",
        title1: "Четко и понятно!",
        title2:
          "Наклейки с режимом работы – информативность и профессионализм для вашего бизнеса",
        items: [
          { title: "Автозапчасти: 10.00 - 19.00", price: "334 ₽" },
          { title: "Цветы: 8.00 - 00.00", price: "334 ₽" },
          {
            title: "Семейная пекарня: Пн-Сб 9-21, Вс - выходной",
            price: "334 ₽",
          },
        ],
      },
      {
        category: "Метрики",
        title1: "Самые важные цифры!",
        title2:
          "Наклейки с метриками новорожденного – уникальный декор детской и памятный подарок",
        items: [
          { title: "Альбина 14.01.2023 3280г 51см 00:52", price: "334 ₽" },
          { title: "Иконки роста, даты, вес и т.д.", price: "334 ₽" },
          { title: "Ульяна 01.07.2023 2250г 45см 12:38", price: "334 ₽" },
        ],
      },
      {
        category: "Заплатки для натяжного потолка",
        title1: "Спаси свой потолок!",
        title2:
          "Эстетичные заплатки для натяжного потолка – быстрое и надежное решение проблемы.",
        items: [
          { title: "Цветы и облака", price: "334 ₽" },
          { title: "Фигурные заплатки", price: "334 ₽" },
          { title: "Разнообразные формы", price: "334 ₽" },
        ],
      },
      {
        category: "Индивидуальные наклейки на заказ",
        title1: "Твоя идея - наша реализация!",
        title2:
          "Создай уникальные наклейки по собственному дизайну. Воплотим любую задумку!",
        items: [
          { title: "Иван & Анастасия 26.04.2025", price: "334 ₽" },
          { title: "Комната Варюши", price: "334 ₽" },
          { title: "Эсуман маленькая принцесса", price: "334 ₽" },
        ],
      },
      {
        category: "Термотрансферные наклейки",
        title1: "Перенеси изображение на ткань за секунды!",
        title2:
          "Термотрансферные наклейки - простой способ кастомизировать одежду и аксессуары.",
        items: [
          { title: "Barbie", price: "334 ₽" },
          { title: "Олень и лес", price: "334 ₽" },
          { title: "Фламинго и солнце", price: "334 ₽" },
        ],
      },
      {
        category: "Термотрансферные наклейки на заказ",
        title1: "Твой уникальный стиль!",
        title2:
          "Создай свои термотрансферные наклейки по индивидуальному дизайну.",
        items: [
          { title: "Номер 39", price: "334 ₽" },
          { title: "Комната Варюши", price: "334 ₽" },
          { title: "Эсуман маленькая принцесса", price: "334 ₽" },
        ],
      },
      {
        category: "Для автомобилей",
        title1: "Подчеркни свой стиль!",
        title2:
          "Наклейки на авто – виниловый тюнинг, реклама и самовыражение на дороге.",
        items: [
          { title: "Banditka", price: "334 ₽" },
          { title: "BORZ", price: "334 ₽" },
          { title: "Sunshine", price: "334 ₽" },
        ],
      },
    ],
  };

  // Get categories to display
  const categoriesToShow = showAll
    ? stickersData.stickers
    : stickersData.stickers.slice(0, 2);

  return (
    <div className="min-h-screen">
      <div className="hidden md:block">
        <Navbar />
        {/* Hero Section */}
        <section
          className="relative bg-pink-200 py-16 px-4 overflow-hidden h-screen inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero2.png')`,
          }}
        >
          <div className="max-w-7xl mx-auto relative z-4">
            <div className="text-left mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Брендовые стикеры{" "}
                <span className="text-green-600">уже доступны</span>
              </h1>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Categories */}
            {categoriesToShow.map((categoryData, index) => (
              <CategorySection
                key={index}
                category={categoryData.category}
                items={categoryData.items}
              />
            ))}

            {/* Show More/Less Button */}
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAll(!showAll)}
                className="bg-transparent text-[#4E4E4E] border-1 border-black px-10 py-3 rounded-2xl font-medium text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                {showAll ? "Скрыть" : "Показать ещё"}
              </button>
            </div>
          </div>
        </section>
      </div>
      <MasterClasses />
      <AboutUs />
      <WhyUs />
      <Reviews />
      <PhotoGallery />
      <Footer />
    </div>
  );
};

export default Homepage2;
