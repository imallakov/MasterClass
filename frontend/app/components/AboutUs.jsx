// import React from "react";
// import Image from "next/image";

// const AboutUs = () => {
//   return (
//     <section className="w-full py-8 md:py-12 px-4 md:px-12 lg:px-16">
//       <div className="container mx-auto">
//         <h2 className="text-3xl md:text-5xl font-bold text-slate-600 mb-4 md:mb-6">
//           О нас
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-12 items-start">
//           <div className="flex flex-col justify-between h-full">
//             <p className="text-md md:text-lg lg:text-3xl text-[#000000] mb-0 md:mb-6 leading-relaxed">
//               Мы - команда опытных мастеров, которые делятся своим опытом и
//               любовью к творчеству. Наши мастер-классы проходят в уютной
//               атмосфере и подходят для людей любого уровня подготовки.
//             </p>
//             {/* Arrow - hidden on mobile, shown on md and up */}
//             <div className="hidden md:flex justify-self-start md:justify-start mt-8">
//               <div className="w-64 h-72 relative">
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
//           <div className="relative h-[500px] md:h-[750px] justify-self-end w-72 md:w-full rounded-2xl overflow-hidden">
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

import React, { useState, useEffect } from "react";
import Image from "next/image";

const AboutUs = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/configs/about/`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAboutData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching about data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="w-full py-8 md:py-12 px-4 md:px-12 lg:px-16">
        <div className="container mx-auto">
          <div className="animate-pulse">
            <div className="h-8 md:h-12 bg-gray-300 rounded w-1/4 mb-4 md:mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-12 items-start">
              <div className="flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                </div>
              </div>
              <div className="relative h-[500px] md:h-[750px] justify-self-end w-72 md:w-full rounded-2xl bg-gray-300"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="w-full py-8 md:py-12 px-4 md:px-12 lg:px-16">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-600 mb-4">
              О нас
            </h2>
            <p className="text-red-500 text-lg">
              Ошибка загрузки данных: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Main content with API data
  return (
    <section className="w-full py-8 md:py-12 px-4 md:px-12 lg:px-16">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-600 mb-4 md:mb-6">
          {aboutData?.title || "О нас"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-12 items-start">
          <div className="flex flex-col justify-between h-full">
            <p className="text-md md:text-lg lg:text-3xl text-[#000000] mb-0 md:mb-6 leading-relaxed">
              {aboutData?.description || "Информация недоступна"}
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
              src={aboutData?.image || "/images/aboutus.jpg"}
              alt={
                aboutData?.title ||
                "Pottery workshop with people working on clay"
              }
              layout="fill"
              style={{ objectFit: "cover" }}
              className="rounded-lg"
              onError={(e) => {
                // Fallback to default image if API image fails to load
                e.target.src = "/images/aboutus.jpg";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
