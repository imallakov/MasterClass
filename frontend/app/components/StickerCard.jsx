import React from "react";
import _Image from "next/image";

const StickerCard = ({ image, price, category }) => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="p-4">
        <img
          src={image}
          alt={`Наклейка ${category}`}
          layout="responsive"
          width={190} // ширина по пропорциям (примерно 19 см)
          height={120} // высота по пропорциям (примерно 12 см)
          objectFit="contain"
          priority={true}
        />
      </div>

      <div className="p-6">
        <h3 className="text-gray-800 font-semibold text-lg mb-2">
          Наклейка мотивационная:
        </h3>
        <div className="text-3xl font-bold text-gray-900 mb-6">{price} ₽</div>
        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors duration-200">
          Заказать
        </button>
      </div>
    </div>
  );
};

export default StickerCard;
