import React from "react";
import StickerCard from "../components/StickerCard";

const CatalogPage = () => {
  const motivationalStickers = [
    {
      id: 1,
      image: "/images/examplecardimg.png",
      category: "мотивационная",
      price: 334,
    },
    {
      id: 2,
      image: "/images/examplecardimg.png",
      category: "мотивационная",
      price: 334,
    },
    {
      id: 3,
      image: "/images/examplecardimg.png",
      category: "мотивационная",
      price: 334,
    },
  ];

  const affirmationStickers = [
    {
      id: 4,
      image: "/images/examplecardimg.png",
      category: "Аффирмации",
      price: 334,
    },
    {
      id: 5,
      image: "/images/examplecardimg.png",
      category: "Аффирмации",
      price: 334,
    },
    {
      id: 6,
      image: "/images/examplecardimg.png",
      category: "Аффирмации",
      price: 334,
    },
  ];

  const congratulatoryStickers = [
    {
      id: 7,
      image: "/images/examplecardimg.png",
      category: "Поздравительная",
      price: 334,
    },
    {
      id: 8,
      image: "/images/examplecardimg.png",
      category: "Поздравительная",
      price: 334,
    },
    {
      id: 9,
      image: "/images/examplecardimg.png",
      category: "Поздравительная",
      price: 334,
    },
  ];

  const CategorySection = ({ title, subtitle, stickers }) => (
    <section className="mb-16">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-slate-700 mb-3">{title}</h2>
        <div className="text-slate-600">
          <p className="font-medium mb-1">Вдохновляйся каждый день!</p>
          <p className="text-sm">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stickers.map((sticker) => (
          <StickerCard
            key={sticker.id}
            image={sticker.image}
            category={sticker.category}
            price={sticker.price}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Motivational Section */}
        <CategorySection
          title="Мотивационные:"
          subtitle="Мотивационные наклейки - заряд энергии и позитива для твоего пространства."
          stickers={motivationalStickers}
        />

        {/* Affirmations Section */}
        <CategorySection
          title="Аффирмации:"
          subtitle="Измени свою жизнь с помощью слов! Наклейки-аффирмации - мощный инструмент для подсознания и достижения целей."
          stickers={affirmationStickers}
        />

        {/* Congratulatory Section */}
        <CategorySection
          title="Поздравительные:"
          subtitle="Сделай праздник ярче! Поздравительные наклейки для украшения подарков, открыток и всего, что дарит радость."
          stickers={congratulatoryStickers}
        />
      </div>
    </div>
  );
};

export default CatalogPage;
