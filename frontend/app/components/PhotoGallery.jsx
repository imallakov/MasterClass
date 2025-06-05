// import Image from "next/image";

// export default function PhotoGallery() {
//   return (
//     <div className="min-h-screen bg-white">
//       <div className="container mx-auto py-12">
//         {/* Title */}
//         <h1 className="text-5xl font-bold text-slate-600">Наша фотогалерея</h1>
//       </div>
//       {/* Gallery Grid */}
//       <div className="grid grid-cols-12 gap-6">
//         {/* Top Row */}
//         {/* Left small image */}
//         <div className="col-span-2 row-span-2 flex items-center">
//           <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
//             <Image
//               src="/images/gallery4.jpg"
//               alt="Workshop scene"
//               fill
//               className="object-cover"
//               priority
//             />
//           </div>
//         </div>

//         {/* Center large image */}
//         <div className="col-span-4">
//           <div className="w-full aspect-[2/1] relative rounded-xl overflow-hidden">
//             <Image
//               src="/images/gallery1.jpg"
//               alt="Main sewing workshop"
//               fill
//               className="object-cover"
//               priority
//             />
//           </div>
//         </div>

//         <div className="col-span-2"></div>
//         <div className="col-span-2"></div>

//         {/* Bottom Row */}
//         {/* Skip first 2 columns (left image continues) */}
//         <div className="col-span-2"></div>

//         {/* Bottom left image */}
//         <div className="col-span-2">
//           <div className="w-full aspect-[2/3] relative rounded-xl overflow-hidden">
//             <Image
//               src="/images/gallery6.jpg"
//               alt="Learning together"
//               fill
//               className="object-cover"
//             />
//           </div>
//         </div>

//         {/* Logo section */}
//         <div className="col-span-2 flex items-center justify-center">
//           <div className="text-center">
//             {/* Logo circle - exact match */}
//             <div className="w-28 h-28 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-full flex items-center justify-center mb-3 mx-auto border border-yellow-200">
//               {/* Simple castle silhouette */}
//               <div className="text-orange-500">
//                 <svg
//                   width="40"
//                   height="40"
//                   viewBox="0 0 50 50"
//                   fill="currentColor"
//                 >
//                   <rect x="8" y="25" width="34" height="20" />
//                   <rect x="6" y="40" width="38" height="3" />
//                   <rect x="12" y="20" width="4" height="8" />
//                   <rect x="22" y="20" width="4" height="8" />
//                   <rect x="32" y="20" width="4" height="8" />
//                   <rect x="15" y="15" width="4" height="8" />
//                   <rect x="25" y="15" width="4" height="8" />
//                   <rect x="35" y="15" width="4" height="8" />
//                   <rect x="20" y="10" width="4" height="8" />
//                   <rect x="30" y="10" width="4" height="8" />
//                 </svg>
//               </div>
//             </div>
//             <p className="text-orange-500 font-medium text-sm">
//               Дворец мастеров
//             </p>
//           </div>
//         </div>

//         {/* Right image */}
//         <div className="col-span-2 row-span-2">
//           <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
//             <Image
//               src="/images/gallery3.jpg"
//               alt="Craft activity"
//               fill
//               className="object-cover"
//             />
//           </div>
//         </div>

//         {/* Bottom right image */}
//         <div className="col-span-4">
//           <div className="w-full aspect-[4/3] relative rounded-xl overflow-hidden">
//             <Image
//               src="/images/gallery2.jpg"
//               alt="Knitting lesson"
//               fill
//               className="object-cover"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Progress indicator - exact match */}
//       <div className="flex justify-center mt-20">
//         <div className="flex items-center space-x-2">
//           <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
//           <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
//           <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
//           <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
//         </div>
//       </div>
//     </div>
//   );
// }

import Image from "next/image";

export default function PhotoGallery() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12">
        {/* Title */}
        <h1 className="text-5xl font-bold text-slate-600">Наша фотогалерея</h1>
      </div>
      {/* Gallery Grid */}
      <div className="grid grid-cols-12 gap-6 overflow-x-scroll">
        {/* Top Row */}
        {/* Left small image */}
        <div className="col-span-2 row-span-2 flex items-center">
          <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
            <Image
              src="/images/gallery4.jpg"
              alt="Workshop scene"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Center large image */}
        <div className="col-span-4">
          <div className="w-full aspect-[2/1] relative rounded-xl overflow-hidden">
            <Image
              src="/images/gallery1.jpg"
              alt="Main sewing workshop"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* <div className="col-span-2"></div> */}

        {/* Right image */}
        <div className="col-span-2 row-span-2 flex items-center">
          <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
            <Image
              src="/images/gallery3.jpg"
              alt="Craft activity"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* <div className="col-span-2"></div>
        <div className="col-span-2"></div> */}

        {/* Bottom Row */}
        {/* Skip first 2 columns (left image continues) */}
        {/* <div className="col-span-4"></div> */}
        <div className="col-span-4 row-span-4 grid grid-cols-4">
          <div className="col-span-2 flex items-center gap-6">
            <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
              <Image
                src="/images/gallery5.jpg"
                alt="Craft activity"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="col-span-4 flex items-center">
            <div className="w-full aspect-[2/1] relative rounded-xl overflow-hidden">
              <Image
                src="/images/gallery2.jpg"
                alt="Knitting lesson"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom left image */}
        <div className="col-span-2">
          <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
            <Image
              src="/images/gallery6.jpg"
              alt="Learning together"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Logo section */}
        <div className="col-span-2">
          <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="Learning together"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Bottom right image */}
        {/* <div className="col-span-4 row-span-2">
          <div className="col-span-2 flex items-center">
            <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
              <Image
                src="/images/gallery3.jpg"
                alt="Craft activity"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="col-span-4 flex items-end">
            <div className="w-full aspect-[5/3] relative rounded-xl overflow-hidden">
              <Image
                src="/images/gallery2.jpg"
                alt="Knitting lesson"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div> */}
      </div>

      {/* Progress indicator - exact match */}
      <div className="flex justify-center mt-20">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
