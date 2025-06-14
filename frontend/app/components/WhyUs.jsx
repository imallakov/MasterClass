// import React from "react";
// import Image from "next/image";

// const WhyUs = () => {
//   const reasons = [
//     {
//       id: 1,
//       title: "Индивидуальный подход",
//       description:
//         "Мы понимаем, что каждый ученик уникален, поэтому наши преподаватели разрабатывают индивидуальные программы обучения, учитывая ваши цели и предпочтения.",
//       image: "/images/whyus1.jpg",
//     },
//     {
//       id: 2,
//       title: "Качественные материалы",
//       description:
//         "Мы используем только лучшие материалы и оборудование, чтобы обеспечить комфортное и эффективное обучение",
//       image: "/images/whyus2.jpg",
//     },
//     {
//       id: 3,
//       title: "Удобное расписание",
//       description:
//         "Мы предлагаем гибкое расписание занятий, чтобы вы могли легко вписать мастер-классы в свою жизнь.",
//       image: "/images/whyus3.jpg",
//       button: "Перейти к расписанию",
//     },
//     {
//       id: 4,
//       title: "Опытные преподаватели",
//       description:
//         "Наши преподаватели – профессионалы своего дела, обладающие многолетним опытом и страстью к рукоделию. Они помогут вам раскрыть свой потенциал и достичь новых высот.",
//       image: "/images/whyus4.jpg",
//       button: "Хочу к вам!",
//     },
//   ];

//   // Function to get button styles based on item id
//   const getButtonStyles = (id) => {
//     switch (id) {
//       case 3:
//         return "bg-transparent text-black px-8 py-3 rounded-2xl font-medium border-1 border-black transform w-full tracking-widest text-lg hover:scale-105 transition-all duration-200";
//       case 4:
//         return "bg-white text-black px-8 py-3 rounded-2xl font-medium border-1 border-black transform w-full tracking-widest text-lg hover:scale-105 transition-all duration-200 text-blue-700";
//       default:
//         return "bg-indigo-200 text-slate-700 px-6 py-2 rounded-md hover:bg-indigo-300 transition-colors";
//     }
//   };

//   return (
//     <section className="w-full py-12 px-6 md:px-12 lg:px-16">
//       <div className="container mx-auto">
//         <div className="flex flex-col md:flex-row items-start gap-12">
//           {/* Left circle with title */}
//           <div className="md:w-1/5">
//             <div className="w-48 h-48 rounded-full border-1 border-[#E7717D] flex items-center justify-center">
//               <h2 className="text-4xl font-medium text-[#3A6281] text-center">
//                 Почему мы?
//               </h2>
//             </div>
//           </div>

//           {/* Right content with cards */}
//           <div className="md:w-4/5">
//             <div className="flex flex-col gap-8 mt-24 items-end">
//               {reasons.map((reason) => (
//                 <div
//                   key={reason.id}
//                   className={`${
//                     reason.id == "1" || reason.id == "3"
//                       ? "bg-[#B6BCF0]"
//                       : "bg-[#C9CEF6]"
//                   } rounded-2xl overflow-hidden px-8 pr-16 py-8 w-9/10`}
//                 >
//                   <div className="flex flex-col md:flex-row gap-8">
//                     <div className="w-2/3 flex flex-col items-start justify-between">
//                       <div>
//                         <h3 className="text-4xl font-medium text-slate-800 mb-4">
//                           {reason.title}
//                         </h3>
//                         <p className="text-[#0D0D0D] font-medium text-xs max-w-72 mb-6">
//                           {reason.description}
//                         </p>
//                       </div>
//                       {reason.button && (
//                         <button className={getButtonStyles(reason.id)}>
//                           {reason.button}
//                         </button>
//                       )}
//                     </div>
//                     <div className="w-3/3 relative h-56 md:h-72">
//                       <Image
//                         src={reason.image}
//                         alt={reason.title}
//                         fill
//                         style={{ objectFit: "cover" }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default WhyUs;

import React from "react";
import Image from "next/image";

const WhyUs = () => {
  const reasons = [
    {
      id: 1,
      title: "Индивидуальный подход",
      description:
        "Мы понимаем, что каждый ученик уникален, поэтому наши преподаватели разрабатывают индивидуальные программы обучения, учитывая ваши цели и предпочтения.",
      image: "/images/whyus1.jpg",
    },
    {
      id: 2,
      title: "Качественные материалы",
      description:
        "Мы используем только лучшие материалы и оборудование, чтобы обеспечить комфортное и эффективное обучение",
      image: "/images/whyus2.jpg",
    },
    {
      id: 3,
      title: "Удобное расписание",
      description:
        "Мы предлагаем гибкое расписание занятий, чтобы вы могли легко вписать мастер-классы в свою жизнь.",
      image: "/images/whyus3.jpg",
      button: "Перейти к расписанию",
    },
    {
      id: 4,
      title: "Опытные преподаватели",
      description:
        "Наши преподаватели – профессионалы своего дела, обладающие многолетним опытом и страстью к рукоделию. Они помогут вам раскрыть свой потенциал и достичь новых высот.",
      image: "/images/whyus4.jpg",
      button: "Хочу к вам!",
    },
    {
      id: 5,
      title: "Уютная атмосфера",
      description:
        "В наших мастерских царит тёплая и дружелюбная атмосфера, способствующая творчеству и вдохновению. Вы будете чувствовать себя как дома!",
      image: "/images/gallery3.jpg",
    },
  ];

  // Function to get button styles based on item id
  const getButtonStyles = (id) => {
    switch (id) {
      case 3:
        return "bg-transparent text-black px-8 py-3 rounded-2xl font-medium border-1 border-black transform w-full tracking-widest text-lg hover:scale-105 transition-all duration-200";
      case 4:
        return "bg-white text-black px-8 py-3 rounded-2xl font-medium border-1 border-black transform w-full tracking-widest text-lg hover:scale-105 transition-all duration-200 text-blue-700";
      default:
        return "bg-indigo-200 text-slate-700 px-6 py-2 rounded-md hover:bg-indigo-300 transition-colors";
    }
  };

  return (
    <section className="w-full py-12 px-6 md:px-12 lg:px-16">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-12">
          {/* Left circle with title */}
          <div className="md:w-1/5 w-full flex justify-center md:justify-start">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-1 border-[#E7717D] flex items-center justify-center">
              <h2 className="text-2xl sm:text-4xl font-medium text-[#3A6281] text-center px-4">
                Почему мы?
              </h2>
            </div>
          </div>

          {/* Right content with cards */}
          <div className="md:w-4/5 w-full">
            <div className="flex flex-col gap-6 md:gap-8 md:mt-24 md:items-end">
              {reasons.map((reason) => (
                <div
                  key={reason.id}
                  className={`${
                    reason.id == "1" || reason.id == "3"
                      ? "bg-[#B6BCF0]"
                      : "bg-[#C9CEF6]"
                  } rounded-2xl overflow-hidden px-4 sm:px-6 md:px-8 md:pr-16 py-6 md:py-8 w-full md:w-9/10`}
                >
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                    <div className="w-full md:w-2/3 flex flex-col items-start justify-between">
                      <div className="w-full">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-slate-800 mb-3 md:mb-4">
                          {reason.title}
                        </h3>
                        <p className="text-[#0D0D0D] font-medium text-sm md:text-xs max-w-full md:max-w-72 mb-4 md:mb-6 leading-relaxed">
                          {reason.description}
                        </p>
                      </div>
                      {reason.button && (
                        <button
                          className={`${getButtonStyles(
                            reason.id
                          )} text-sm md:text-lg px-4 md:px-8 py-2 md:py-3`}
                        >
                          {reason.button}
                        </button>
                      )}
                    </div>
                    <div className="w-full md:w-3/3 relative h-48 sm:h-56 md:h-72 rounded-lg md:rounded-none overflow-hidden">
                      <Image
                        src={reason.image}
                        alt={reason.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
