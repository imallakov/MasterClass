// import React from "react";
// import Image from "next/image";

// const Reviews = () => {
//   const reviews = [
//     {
//       id: 1,
//       name: "Виктор",
//       avatar: "/images/review1.jpg",
//       rating: 5,
//       text: "Приходили на мастер классы вместе с ребёнком, всё понравилось, очень круто, советую",
//     },
//     {
//       id: 2,
//       name: "Мишель",
//       avatar: "/images/review2.png",
//       rating: 5,
//       text: "Ребёнок был очень доволен, завтра идём вместе на макраме",
//     },
//   ];

//   return (
//     <section className="w-full py-12 px-6 md:px-12 lg:px-16">
//       <div className="container mx-auto">
//         <h2 className="text-5xl font-bold text-slate-600 mb-10">Отзывы</h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {reviews.map((review) => (
//             <div
//               key={review.id}
//               className={`rounded-4xl p-6 w-full h-54 ${
//                 review.id === 1 ? "bg-[#9A743A]" : "bg-[#E9A980]"
//               }`}
//             >
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 relative rounded-full overflow-hidden mr-3">
//                   <Image
//                     src={review.avatar}
//                     alt={review.name}
//                     width={48}
//                     height={48}
//                     className="rounded-full"
//                   />
//                 </div>
//                 <span className="text-xl font-medium text-white">
//                   {review.name}
//                 </span>
//                 <div className="flex ml-auto">
//                   {[...Array(review.rating)].map((_, i) => (
//                     <svg
//                       key={i}
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-8 w-8 text-yellow-300"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//               </div>
//               <p className="text-white text-sm">{review.text}</p>
//             </div>
//           ))}

//           {/* Add Review Card */}
//           <div className="rounded-4xl bg-[#9D9EEE] p-6 flex flex-col items-center justify-center">
//             <div className="w-16 h-16 mb-4 flex items-center justify-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-12 w-12 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 4v16m8-8H4"
//                 />
//               </svg>
//             </div>
//             <p className="text-white text-center text-lg">Поделиться отзывом</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Reviews;

import React from "react";
import Image from "next/image";

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Виктор",
      avatar: "/images/review1.jpg",
      rating: 5,
      text: "Приходили на мастер классы вместе с ребёнком, всё понравилось, очень круто, советую",
    },
    {
      id: 2,
      name: "Мишель",
      avatar: "/images/review2.png",
      rating: 5,
      text: "Ребёнок был очень доволен, завтра идём вместе на макраме",
    },
  ];

  return (
    <section className="w-full py-8 md:py-12 px-6 md:px-12 lg:px-16">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-600 mb-6 md:mb-10">
          Отзывы
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`rounded-2xl md:rounded-4xl p-4 md:p-6 w-full min-h-[200px] md:h-54 ${
                review.id === 1 ? "bg-[#9A743A]" : "bg-[#E9A980]"
              }`}
            >
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-full overflow-hidden mr-2 md:mr-3 flex-shrink-0">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="text-lg md:text-xl font-medium text-white flex-grow min-w-0">
                  {review.name}
                </span>
                <div className="flex ml-2 md:ml-auto flex-shrink-0">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8 text-yellow-300"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-white text-sm md:text-sm leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}

          {/* Add Review Card */}
          <div className="rounded-2xl md:rounded-4xl bg-[#9D9EEE] p-4 md:p-6 flex flex-col items-center justify-center min-h-[200px] md:min-h-0">
            <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 md:h-12 md:w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <p className="text-white text-center text-base md:text-lg">
              Поделиться отзывом
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
