// import React from "react";
// import Image from "next/image";

// const StickerCard = ({ image, price, category }) => {
//   return (
//     <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
//       {/* Sticker Image */}
//       <div className="relative">
//         <div
//           className="w-full h-80 bg-gradient-to-b from-blue-200 to-orange-100 flex items-center justify-center relative"
//           style={{
//             backgroundImage: `linear-gradient(180deg, #bfdbfe 0%, #fed7aa 100%)`,
//           }}
//         >
//           {/* Main text content */}
//           <div className="text-center px-4 w-full ">
//             <Image src={image} width={100} height={100} />
//           </div>
//         </div>
//       </div>

//       {/* Card Info */}
//       <div className="p-4">
//         <h3 className="text-gray-700 font-medium mb-2">Наклейка {category}:</h3>
//         <div className="text-2xl font-bold text-gray-900 mb-4">{price} ₽</div>
//         <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
//           Заказать
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StickerCard;

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
          style={{ objectFit: "contain", width: "100%", height: "350px" }}
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
