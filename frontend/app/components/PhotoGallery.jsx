import Image from "next/image";

export default function PhotoGallery() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 md:py-12 px-4 md:px-0">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-600">
          Наша фотогалерея
        </h1>
        <h3 className="text-lg mt-6 sm:text-xl md:text-2xl font-regular text-slate-600">
          Как проходят мастер-классы
        </h3>
      </div>

      {/* Mobile Gallery */}
      <div className="block md:hidden px-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Row 1 */}
          <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
            <Image
              src="/images/gallery1.jpg"
              alt="Main sewing workshop"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
            <Image
              src="/images/gallery4.jpg"
              alt="Workshop scene"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Row 2 */}
          <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
            <Image
              src="/images/gallery3.jpg"
              alt="Craft activity"
              fill
              className="object-cover"
            />
          </div>
          <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
            <Image
              src="/images/gallery5.jpg"
              alt="Craft activity"
              fill
              className="object-cover"
            />
          </div>

          {/* Row 3 */}
          <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
            <Image
              src="/images/gallery2.jpg"
              alt="Knitting lesson"
              fill
              className="object-cover"
            />
          </div>
          <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="Learning together"
              fill
              className="object-cover"
            />
          </div>

          {/* Logo - full width */}
          <div className="col-span-2 aspect-[2/1] relative rounded-xl overflow-hidden">
            <Image
              src="/images/gallery6.jpg"
              alt="Learning together"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Desktop Gallery Grid */}
      <div className="hidden md:grid grid-cols-12 gap-6 overflow-x-scroll">
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

        {/* Bottom Row */}
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
      </div>

      {/* Progress indicator - exact match */}
      <div className="flex justify-center mt-12 md:mt-20">
        <div className="flex items-center space-x-2">
          <div className="w-8 md:w-12 h-1 bg-orange-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

// import Image from "next/image";

// export default function PhotoGallery() {
//   return (
//     <div className="min-h-screen bg-white">
//       <div className="container mx-auto py-8 md:py-12 px-4 md:px-0">
//         {/* Title */}
//         <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-600">
//           Наша фотогалерея
//         </h1>
//         <h3 className="text-lg mt-6 sm:text-xl md:text-2xl font-regular text-slate-600">
//           Как проходят мастер-классы
//         </h3>
//       </div>

//       {/* Mobile Gallery */}
//       <div className="block md:hidden px-4">
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           {/* Row 1 */}
//           <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
//             <Image
//               src="/images/gallery1.jpg"
//               alt="Main sewing workshop"
//               fill
//               className="object-cover"
//               priority
//             />
//           </div>
//           <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
//             <Image
//               src="/images/gallery4.jpg"
//               alt="Workshop scene"
//               fill
//               className="object-cover"
//               priority
//             />
//           </div>

//           {/* Row 2 */}
//           <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
//             <Image
//               src="/images/gallery3.jpg"
//               alt="Craft activity"
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
//             <Image
//               src="/images/gallery5.jpg"
//               alt="Craft activity"
//               fill
//               className="object-cover"
//             />
//           </div>

//           {/* Row 3 */}
//           <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
//             <Image
//               src="/images/gallery2.jpg"
//               alt="Knitting lesson"
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
//             <Image
//               src="/images/gallery6.jpg"
//               alt="Learning together"
//               fill
//               className="object-cover"
//             />
//           </div>

//           {/* Row 4 - New images */}
//           <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
//             <Image
//               src="/images/gallery7.jpg"
//               alt="Creative workshop"
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
//             <Image
//               src="/images/gallery8.jpg"
//               alt="Hands-on learning"
//               fill
//               className="object-cover"
//             />
//           </div>

//           {/* Logo - full width */}
//           <div className="col-span-2 aspect-[2/1] relative rounded-xl overflow-hidden">
//             <Image
//               src="/images/logo.png"
//               alt="Learning together"
//               fill
//               className="object-cover"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Desktop Gallery Grid - YOUR ORIGINAL + NEW IMAGES EXTENDING HORIZONTALLY */}
//       <div className="hidden md:block overflow-x-scroll">
//         <div
//           className="grid gap-6"
//           style={{ gridTemplateColumns: "repeat(20, 1fr)", minWidth: "200vw" }}
//         >
//           {/* TOP ROW - ORIGINAL */}
//           {/* Left small image */}
//           <div className="col-span-2 row-span-2 flex items-center">
//             <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
//               <Image
//                 src="/images/gallery4.jpg"
//                 alt="Workshop scene"
//                 fill
//                 className="object-cover"
//                 priority
//               />
//             </div>
//           </div>

//           {/* Center large image */}
//           <div className="col-span-4">
//             <div className="w-full aspect-[2/1] relative rounded-xl overflow-hidden">
//               <Image
//                 src="/images/gallery1.jpg"
//                 alt="Main sewing workshop"
//                 fill
//                 className="object-cover"
//                 priority
//               />
//             </div>
//           </div>

//           {/* Right image */}
//           <div className="col-span-2 row-span-2 flex items-center">
//             <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
//               <Image
//                 src="/images/gallery3.jpg"
//                 alt="Craft activity"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           </div>

//           {/* TOP ROW - NEW IMAGES (same pattern) */}
//           {/* Left small image */}
//           <div className="col-span-2 row-span-2 flex items-center">
//             <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
//               <Image
//                 src="/images/gallery7.jpg"
//                 alt="New workshop scene"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           </div>

//           {/* Center large image */}
//           <div className="col-span-4">
//             <div className="w-full aspect-[2/1] relative rounded-xl overflow-hidden">
//               <Image
//                 src="/images/gallery8.jpg"
//                 alt="New craft session"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           </div>

//           {/* Right image */}
//           <div className="col-span-2 row-span-2 flex items-center">
//             <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
//               <Image
//                 src="/images/gallery9.jpg"
//                 alt="New learning activity"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           </div>

//           {/* BOTTOM ROW - ORIGINAL */}
//           <div className="col-span-4 row-span-4 grid grid-cols-4">
//             <div className="col-span-2 flex items-center gap-6">
//               <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
//                 <Image
//                   src="/images/gallery5.jpg"
//                   alt="Craft activity"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             </div>
//             <div className="col-span-4 flex items-center">
//               <div className="w-full aspect-[2/1] relative rounded-xl overflow-hidden">
//                 <Image
//                   src="/images/gallery2.jpg"
//                   alt="Knitting lesson"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Bottom left image - ORIGINAL */}
//           <div className="col-span-2">
//             <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
//               <Image
//                 src="/images/gallery6.jpg"
//                 alt="Learning together"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           </div>

//           {/* Logo section - ORIGINAL */}
//           <div className="col-span-2">
//             <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
//               <Image
//                 src="/images/logo.png"
//                 alt="Learning together"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           </div>

//           {/* BOTTOM ROW - NEW IMAGES (same pattern) */}
//           <div className="col-span-4 row-span-4 grid grid-cols-4">
//             <div className="col-span-2 flex items-center gap-6">
//               <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
//                 <Image
//                   src="/images/gallery10.jpg"
//                   alt="New hands-on work"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             </div>
//             <div className="col-span-4 flex items-center">
//               <div className="w-full aspect-[2/1] relative rounded-xl overflow-hidden">
//                 <Image
//                   src="/images/gallery11.jpg"
//                   alt="New creative process"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Bottom left image - NEW */}
//           <div className="col-span-2">
//             <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden">
//               <Image
//                 src="/images/gallery12.jpg"
//                 alt="New learning moment"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Progress indicator - exact match */}
//         <div className="flex justify-center mt-12 md:mt-20">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 md:w-12 h-1 bg-orange-500 rounded-full"></div>
//             <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
//             <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
//             <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
