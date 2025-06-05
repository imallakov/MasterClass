// import React from "react";
// import Image from "next/image";

// const AboutUs = () => {
//   return (
//     <section className="w-full py-12 px-6 md:px-12 lg:px-16">
//       <div className="container mx-auto">
//         <h2 className="text-5xl font-bold text-slate-600 mb-6">О нас</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
//           <div className="flex flex-col justify-between h-full">
//             <p className="text-lg md:text-3xl text-[#000000] mb-6">
//               Мы - команда опытных мастеров, которые делятся своим опытом и
//               любовью к творчеству. Наши мастер-классы проходят в уютной
//               атмосфере и подходят для людей любого уровня подготовки.
//             </p>
//             <div className="flex justify-self-start md:justify-start mt-8">
//               <div className="w-64 h-72 relative ">
//                 <svg
//                   viewBox="0 0 100 100"
//                   className="w-full h-full text-pink-200"
//                 >
//                   <path
//                     d="M50,90 L50,10 M50,90 L30,70 M50,90 L70,70"
//                     stroke="currentColor"
//                     strokeWidth="1"
//                     fill="none"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//           <div className="relative h-[750px] w-full rounded-2xl overflow-hidden">
//             <Image
//               src="/images/aboutus.jpg"
//               alt="Pottery workshop with people working on clay"
//               layout="fill"
//               style={{ objectFit: "cover" }}
//               className="rounded-lg"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutUs;

import React from "react";
import Image from "next/image";

const AboutUs = () => {
  return (
    <section className="w-full py-8 md:py-12 px-4 md:px-12 lg:px-16">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-600 mb-4 md:mb-6">
          О нас
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-12 items-start">
          <div className="flex flex-col justify-between h-full">
            <p className="text-md md:text-lg lg:text-3xl text-[#000000] mb-0 md:mb-6 leading-relaxed">
              Мы - команда опытных мастеров, которые делятся своим опытом и
              любовью к творчеству. Наши мастер-классы проходят в уютной
              атмосфере и подходят для людей любого уровня подготовки.
            </p>
            {/* Arrow - hidden on mobile, shown on md and up */}
            <div className="hidden md:flex justify-self-start md:justify-start mt-8">
              <div className="w-64 h-72 relative">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-pink-200"
                >
                  <path
                    d="M50,90 L50,10 M50,90 L30,70 M50,90 L70,70"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] md:h-[750px] justify-self-end w-72 md:w-full rounded-2xl overflow-hidden">
            <Image
              src="/images/aboutus.jpg"
              alt="Pottery workshop with people working on clay"
              layout="fill"
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
