// "use client";

// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// // Helper function to get CSRF token from cookies
// const getCsrfTokenFromCookie = () => {
//   if (typeof document === "undefined") return null;

//   const name = "csrftoken";
//   let cookieValue = null;
//   if (document.cookie && document.cookie !== "") {
//     const cookies = document.cookie.split(";");
//     for (let i = 0; i < cookies.length; i++) {
//       const cookie = cookies[i].trim();
//       if (cookie.substring(0, name.length + 1) === name + "=") {
//         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//         break;
//       }
//     }
//   }
//   return cookieValue;
// };

// export default function SignInPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     phone: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [loginStatus, setLoginStatus] = useState(null);
//   const [csrfToken, setCsrfToken] = useState("");

//   // Get CSRF token on component mount
//   useEffect(() => {
//     const fetchCsrfToken = async () => {
//       try {
//         // First, try to get CSRF token from cookie
//         const cookieToken = getCsrfTokenFromCookie();
//         if (cookieToken) {
//           setCsrfToken(cookieToken);
//           return;
//         }

//         // If no cookie token, fetch from endpoint to set the cookie
//         const response = await fetch("http://localhost:8000/api/users/login/", {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             Accept: "application/json",
//           },
//         });

//         if (response.ok) {
//           // After the request, the cookie should be set, try to get it again
//           const newCookieToken = getCsrfTokenFromCookie();
//           if (newCookieToken) {
//             setCsrfToken(newCookieToken);
//           } else {
//             // Fallback: try to get from response JSON if your endpoint returns it
//             try {
//               const data = await response.json();
//               if (data.csrfToken) {
//                 setCsrfToken(data.csrfToken);
//               }
//             } catch (jsonError) {
//               console.log("No JSON response for CSRF token");
//             }
//           }
//         } else {
//           console.log("Failed to fetch CSRF token:", response.status);
//         }
//       } catch (error) {
//         console.log("CSRF token fetch failed:", error);
//       }
//     };

//     fetchCsrfToken();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.phone.trim()) {
//       newErrors.phone = "Номер телефона обязателен для заполнения";
//     }

//     if (!formData.password) {
//       newErrors.password = "Пароль обязателен для заполнения";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
//     setLoginStatus(null);

//     try {
//       const headers = {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       };

//       // Add CSRF token if available - match the curl example header name
//       if (csrfToken) {
//         headers["X-CSRFTOKEN"] = csrfToken;
//       }

//       console.log("Making request with headers:", headers);
//       console.log("Request body:", {
//         phone_number: formData.phone,
//         password: formData.password,
//       });

//       const response = await fetch("http://localhost:8000/api/users/login/", {
//         method: "POST",
//         headers: headers,
//         credentials: "include", // Important for CORS with credentials
//         body: JSON.stringify({
//           phone_number: formData.phone,
//           password: formData.password,
//         }),
//       });

//       console.log("Response status:", response.status);
//       console.log(
//         "Response headers:",
//         Object.fromEntries(response.headers.entries())
//       );

//       // Check if response is actually JSON
//       const contentType = response.headers.get("content-type");

//       if (!contentType || !contentType.includes("application/json")) {
//         // If response is not JSON, it's likely an HTML error page
//         const htmlText = await response.text();
//         console.error("Received HTML response instead of JSON:", htmlText);

//         setLoginStatus({
//           type: "error",
//           message: `Ошибка сервера (${response.status}). Проверьте настройки API.`,
//         });
//         return;
//       }

//       if (response.ok) {
//         const result = await response.json();
//         console.log("Login successful:", result);

//         // Store tokens securely
//         if (typeof window !== "undefined") {
//           localStorage.setItem("access_token", result.access);
//           if (result.refresh) {
//             localStorage.setItem("refresh_token", result.refresh);
//           }
//         }

//         setLoginStatus({
//           type: "success",
//           message: "Авторизация прошла успешно!",
//         });

//         // Reset form
//         setFormData({
//           phone: "",
//           password: "",
//         });

//         // Redirect after successful login
//         setTimeout(() => {
//           if (result.user && result.user.is_staff) {
//             router.push("/admin/adminmanager");
//           } else {
//             router.push("/user-account");
//           }
//         }, 1000);
//       } else {
//         const errorData = await response.json();
//         console.error("Login failed:", errorData);

//         // Handle specific error messages from the API
//         let errorMessage = "Неверный номер телефона или пароль";
//         if (errorData.detail) {
//           errorMessage = errorData.detail;
//         } else if (errorData.non_field_errors) {
//           errorMessage = Array.isArray(errorData.non_field_errors)
//             ? errorData.non_field_errors[0]
//             : errorData.non_field_errors;
//         } else if (errorData.error) {
//           errorMessage = errorData.error;
//         }

//         setLoginStatus({
//           type: "error",
//           message: errorMessage,
//         });
//       }
//     } catch (error) {
//       console.error("Network error details:", error);

//       // More specific error handling
//       if (
//         error.name === "TypeError" &&
//         error.message.includes("Failed to fetch")
//       ) {
//         setLoginStatus({
//           type: "error",
//           message:
//             "Не удается подключиться к серверу. Проверьте, что сервер запущен на localhost:8000",
//         });
//       } else if (error.message.includes("CORS")) {
//         setLoginStatus({
//           type: "error",
//           message: "Ошибка CORS. Проверьте настройки сервера.",
//         });
//       } else {
//         setLoginStatus({
//           type: "error",
//           message: "Ошибка соединения с сервером. Попробуйте позже.",
//         });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleForgotPassword = () => {
//     // Implement forgot password functionality
//     console.log("Forgot password clicked");
//     // You can add navigation to forgot password page or show a modal
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-cyan-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-5xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
//         <div className="flex justify-center items-center min-h-[600px]">
//           {/* Left side - Image */}
//           <div className="relative flex-4 h-full min-h-[600px]">
//             <Image
//               src="/images/authpage.jpg"
//               alt="Hands working on macramé art"
//               fill
//               className="object-fit"
//               priority
//             />
//           </div>

//           {/* Right side - Auth form */}
//           <div className="flex items-center justify-center flex-5 p-8 md:p-12">
//             <div className="w-full max-w-sm space-y-6">
//               <div className="text-center">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-8">
//                   Авторизация
//                 </h1>
//               </div>

//               {/* Status Messages */}
//               {loginStatus && (
//                 <div
//                   className={`p-3 rounded-xl text-center ${
//                     loginStatus.type === "success"
//                       ? "bg-green-100 text-green-700 border border-green-200"
//                       : "bg-red-100 text-red-700 border border-red-200"
//                   }`}
//                 >
//                   {loginStatus.message}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <input
//                     id="phone"
//                     name="phone"
//                     type="tel"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     placeholder="Ваш номер телефона"
//                     className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
//                       errors.phone
//                         ? "border-red-300 focus:ring-red-500"
//                         : "border-gray-200 focus:ring-blue-500"
//                     }`}
//                   />
//                   {errors.phone && (
//                     <p className="text-red-500 text-sm">{errors.phone}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     placeholder="Пароль"
//                     className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
//                       errors.password
//                         ? "border-red-300 focus:ring-red-500"
//                         : "border-gray-200 focus:ring-blue-500"
//                     }`}
//                   />
//                   {errors.password && (
//                     <p className="text-red-500 text-sm">{errors.password}</p>
//                   )}
//                 </div>

//                 <div className="text-right">
//                   <button
//                     type="button"
//                     onClick={handleForgotPassword}
//                     className="text-sm text-gray-600 hover:text-gray-800 underline"
//                   >
//                     Забыли пароль?
//                   </button>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className={`w-full h-12 font-medium rounded-xl mt-6 transition-colors duration-200 ${
//                     isLoading
//                       ? "bg-gray-400 cursor-not-allowed text-white"
//                       : "bg-green-500 hover:bg-green-600 text-white"
//                   }`}
//                 >
//                   {isLoading ? "Авторизация..." : "Авторизироваться"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// best one
// "use client";

// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// // Helper function to get CSRF token from cookies
// const getCsrfTokenFromCookie = () => {
//   if (typeof document === "undefined") return null;

//   const name = "csrftoken";
//   let cookieValue = null;
//   if (document.cookie && document.cookie !== "") {
//     const cookies = document.cookie.split(";");
//     for (let i = 0; i < cookies.length; i++) {
//       const cookie = cookies[i].trim();
//       if (cookie.substring(0, name.length + 1) === name + "=") {
//         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//         break;
//       }
//     }
//   }
//   return cookieValue;
// };

// export default function SignInPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     phone: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [loginStatus, setLoginStatus] = useState(null);
//   const [csrfToken, setCsrfToken] = useState("");

//   // Get CSRF token on component mount
//   useEffect(() => {
//     const fetchCsrfToken = async () => {
//       try {
//         // First, try to get CSRF token from cookie
//         const cookieToken = getCsrfTokenFromCookie();
//         if (cookieToken) {
//           setCsrfToken(cookieToken);
//           return;
//         }

//         // If no cookie token, fetch from endpoint to set the cookie
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login/`,
//           {
//             method: "GET",
//             credentials: "include",
//             headers: {
//               Accept: "application/json",
//             },
//           }
//         );

//         if (response.ok) {
//           // After the request, the cookie should be set, try to get it again
//           const newCookieToken = getCsrfTokenFromCookie();
//           if (newCookieToken) {
//             setCsrfToken(newCookieToken);
//           } else {
//             // Fallback: try to get from response JSON if your endpoint returns it
//             try {
//               const data = await response.json();
//               if (data.csrfToken) {
//                 setCsrfToken(data.csrfToken);
//               }
//             } catch (jsonError) {
//               console.log("No JSON response for CSRF token");
//             }
//           }
//         } else {
//           console.log("Failed to fetch CSRF token:", response.status);
//         }
//       } catch (error) {
//         console.log("CSRF token fetch failed:", error);
//       }
//     };

//     fetchCsrfToken();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.phone.trim()) {
//       newErrors.phone = "Номер телефона обязателен для заполнения";
//     }

//     if (!formData.password) {
//       newErrors.password = "Пароль обязателен для заполнения";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
//     setLoginStatus(null);

//     try {
//       const headers = {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       };

//       // Add CSRF token if available - match the curl example header name
//       if (csrfToken) {
//         headers["X-CSRFTOKEN"] = csrfToken;
//       }

//       console.log("Making request with headers:", headers);
//       console.log("Request body:", {
//         phone_number: formData.phone,
//         password: formData.password,
//       });

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login/`,
//         {
//           method: "POST",
//           headers: headers,
//           credentials: "include", // Important for CORS with credentials
//           body: JSON.stringify({
//             phone_number: formData.phone,
//             password: formData.password,
//           }),
//         }
//       );

//       console.log("Response status:", response.status);
//       console.log(
//         "Response headers:",
//         Object.fromEntries(response.headers.entries())
//       );

//       // Check if response is actually JSON
//       const contentType = response.headers.get("content-type");

//       if (!contentType || !contentType.includes("application/json")) {
//         // If response is not JSON, it's likely an HTML error page
//         const htmlText = await response.text();
//         console.error("Received HTML response instead of JSON:", htmlText);

//         setLoginStatus({
//           type: "error",
//           message: `Ошибка сервера (${response.status}). Проверьте настройки API.`,
//         });
//         return;
//       }

//       if (response.ok) {
//         const result = await response.json();
//         console.log("Login successful:", result);

//         // Store tokens securely
//         if (typeof window !== "undefined") {
//           localStorage.setItem("access_token", result.access);
//           if (result.refresh) {
//             localStorage.setItem("refresh_token", result.refresh);
//           }
//         }

//         setLoginStatus({
//           type: "success",
//           message: "Авторизация прошла успешно!",
//         });

//         // Reset form
//         setFormData({
//           phone: "",
//           password: "",
//         });

//         // Redirect after successful login
//         setTimeout(() => {
//           if (result.user && result.user.is_staff) {
//             router.push("/admin/adminmanager");
//           } else {
//             router.push("/user-account");
//           }
//         }, 2000);
//       } else {
//         const errorData = await response.json();
//         console.error("Login failed:", errorData);

//         // Handle specific error messages from the API
//         let errorMessage = "Неверный номер телефона или пароль";
//         if (errorData.detail) {
//           errorMessage = errorData.detail;
//         } else if (errorData.non_field_errors) {
//           errorMessage = Array.isArray(errorData.non_field_errors)
//             ? errorData.non_field_errors[0]
//             : errorData.non_field_errors;
//         } else if (errorData.error) {
//           errorMessage = errorData.error;
//         }

//         setLoginStatus({
//           type: "error",
//           message: errorMessage,
//         });
//       }
//     } catch (error) {
//       console.error("Network error details:", error);

//       // More specific error handling
//       if (
//         error.name === "TypeError" &&
//         error.message.includes("Failed to fetch")
//       ) {
//         setLoginStatus({
//           type: "error",
//           message:
//             "Не удается подключиться к серверу. Проверьте, что сервер запущен на localhost:8000",
//         });
//       } else if (error.message.includes("CORS")) {
//         setLoginStatus({
//           type: "error",
//           message: "Ошибка CORS. Проверьте настройки сервера.",
//         });
//       } else {
//         setLoginStatus({
//           type: "error",
//           message: "Ошибка соединения с сервером. Попробуйте позже.",
//         });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleForgotPassword = () => {
//     // Implement forgot password functionality
//     console.log("Forgot password clicked");
//     // You can add navigation to forgot password page or show a modal
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-cyan-100">
//       {/* Desktop Layout */}
//       <div className="hidden md:flex items-center justify-center p-4 min-h-screen">
//         <div className="w-full max-w-5xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
//           <div className="flex justify-center items-center min-h-[600px]">
//             {/* Left side - Image */}
//             <div className="relative flex-4 h-full min-h-[600px]">
//               <Image
//                 src="/images/authpage.jpg"
//                 alt="Hands working on macramé art"
//                 className="w-full h-full object-cover"
//                 width={600}
//                 height={600}
//                 priority
//               />
//             </div>

//             {/* Right side - Auth form */}
//             <div className="flex items-center justify-center flex-5 p-8 md:p-12">
//               <div className="w-full max-w-sm space-y-6">
//                 <div className="text-center">
//                   <h1 className="text-3xl font-bold text-gray-900 mb-8">
//                     Авторизация
//                   </h1>
//                 </div>

//                 {/* Status Messages */}
//                 {loginStatus && (
//                   <div
//                     className={`p-3 rounded-xl text-center ${
//                       loginStatus.type === "success"
//                         ? "bg-green-100 text-green-700 border border-green-200"
//                         : "bg-red-100 text-red-700 border border-red-200"
//                     }`}
//                   >
//                     {loginStatus.message}
//                   </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div className="space-y-2">
//                     <input
//                       id="phone"
//                       name="phone"
//                       type="tel"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       placeholder="Ваш номер телефона"
//                       className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
//                         errors.phone
//                           ? "border-red-300 focus:ring-red-500"
//                           : "border-gray-200 focus:ring-blue-500"
//                       }`}
//                     />
//                     {errors.phone && (
//                       <p className="text-red-500 text-sm">{errors.phone}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <input
//                       id="password"
//                       name="password"
//                       type="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       placeholder="Пароль"
//                       className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
//                         errors.password
//                           ? "border-red-300 focus:ring-red-500"
//                           : "border-gray-200 focus:ring-blue-500"
//                       }`}
//                     />
//                     {errors.password && (
//                       <p className="text-red-500 text-sm">{errors.password}</p>
//                     )}
//                   </div>

//                   <div className="text-right">
//                     <button
//                       type="button"
//                       onClick={handleForgotPassword}
//                       className="text-sm text-gray-600 hover:text-gray-800 underline"
//                     >
//                       Забыли пароль?
//                     </button>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className={`w-full h-12 font-medium rounded-xl mt-6 transition-colors duration-200 ${
//                       isLoading
//                         ? "bg-gray-400 cursor-not-allowed text-white"
//                         : "bg-green-500 hover:bg-green-600 text-white"
//                     }`}
//                   >
//                     {isLoading ? "Авторизация..." : "Авторизироваться"}
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Layout */}
//       <div className="md:hidden min-h-screen flex flex-col relative">
//         {/* Background Image */}
//         <div className="absolute inset-0 z-0">
//           <Image
//             src="/images/authpage.jpg"
//             alt="Hands working on macramé art"
//             className="w-full h-full object-cover"
//             width={600}
//             height={600}
//             priority
//           />
//           <div className="absolute inset-0 bg-black/20"></div>
//         </div>

//         {/* Content */}
//         <div className="relative z-10 flex-1 flex flex-col justify-center py-8 px-4">
//           <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl mx-auto w-full max-w-sm">
//             <div className="text-center mb-6">
//               <h1 className="text-2xl font-bold text-gray-900">Авторизация</h1>
//             </div>

//             {/* Status Messages */}
//             {loginStatus && (
//               <div
//                 className={`p-3 rounded-xl text-center mb-4 ${
//                   loginStatus.type === "success"
//                     ? "bg-green-100 text-green-700 border border-green-200"
//                     : "bg-red-100 text-red-700 border border-red-200"
//                 }`}
//               >
//                 {loginStatus.message}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   placeholder="Ваш номер телефона"
//                   className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
//                     errors.phone
//                       ? "border-red-300 focus:ring-red-500"
//                       : "border-gray-200 focus:ring-blue-500"
//                   }`}
//                 />
//                 {errors.phone && (
//                   <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
//                 )}
//               </div>

//               <div>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder="Пароль"
//                   className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
//                     errors.password
//                       ? "border-red-300 focus:ring-red-500"
//                       : "border-gray-200 focus:ring-blue-500"
//                   }`}
//                 />
//                 {errors.password && (
//                   <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//                 )}
//               </div>

//               <div className="text-right pt-2">
//                 <button
//                   type="button"
//                   onClick={handleForgotPassword}
//                   className="text-sm text-gray-700 hover:text-gray-900 underline"
//                 >
//                   Забыли пароль?
//                 </button>
//               </div>

//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className={`w-full h-12 font-medium rounded-xl transition-colors duration-200 ${
//                     isLoading
//                       ? "bg-gray-400 cursor-not-allowed text-white"
//                       : "bg-green-500 hover:bg-green-600 text-white"
//                   }`}
//                 >
//                   {isLoading ? "Авторизация..." : "Авторизироваться"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Helper function to get CSRF token from cookies
const getCsrfTokenFromCookie = () => {
  if (typeof document === "undefined") return null;

  const name = "csrftoken";
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");

  // Get CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        // First, try to get CSRF token from cookie
        const cookieToken = getCsrfTokenFromCookie();
        if (cookieToken) {
          setCsrfToken(cookieToken);
          return;
        }

        // If no cookie token, fetch from endpoint to set the cookie
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login/`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          // After the request, the cookie should be set, try to get it again
          const newCookieToken = getCsrfTokenFromCookie();
          if (newCookieToken) {
            setCsrfToken(newCookieToken);
          } else {
            // Fallback: try to get from response JSON if your endpoint returns it
            try {
              const data = await response.json();
              if (data.csrfToken) {
                setCsrfToken(data.csrfToken);
              }
            } catch (jsonError) {
              console.log("No JSON response for CSRF token");
            }
          }
        } else {
          console.log("Failed to fetch CSRF token:", response.status);
        }
      } catch (error) {
        console.log("CSRF token fetch failed:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = "Номер телефона обязателен для заполнения";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен для заполнения";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginStatus(null);

    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      // Add CSRF token if available - match the curl example header name
      if (csrfToken) {
        headers["X-CSRFTOKEN"] = csrfToken;
      }

      console.log("Making request with headers:", headers);
      console.log("Request body:", {
        phone_number: formData.phone,
        password: formData.password,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login/`,
        {
          method: "POST",
          headers: headers,
          credentials: "include", // Important for CORS with credentials
          body: JSON.stringify({
            phone_number: formData.phone,
            password: formData.password,
          }),
        }
      );

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        // If response is not JSON, it's likely an HTML error page
        const htmlText = await response.text();
        console.error("Received HTML response instead of JSON:", htmlText);

        setLoginStatus({
          type: "error",
          message: `Ошибка сервера (${response.status}). Проверьте настройки API.`,
        });
        return;
      }

      if (response.ok) {
        const result = await response.json();
        console.log("Login successful:", result);

        // Store tokens securely
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", result.access);
          if (result.refresh) {
            localStorage.setItem("refresh_token", result.refresh);
          }
        }

        setLoginStatus({
          type: "success",
          message: "Авторизация прошла успешно!",
        });

        // Reset form
        setFormData({
          phone: "",
          password: "",
        });

        // Redirect after successful login
        setTimeout(() => {
          if (result.user && result.user.is_staff) {
            router.push("/admin/adminmanager");
          } else {
            router.push("/user-account");
          }
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);

        // Handle specific error messages from the API
        let errorMessage = "Неверный номер телефона или пароль";
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.non_field_errors) {
          errorMessage = Array.isArray(errorData.non_field_errors)
            ? errorData.non_field_errors[0]
            : errorData.non_field_errors;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }

        setLoginStatus({
          type: "error",
          message: errorMessage,
        });
      }
    } catch (error) {
      console.error("Network error details:", error);

      // More specific error handling
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        setLoginStatus({
          type: "error",
          message:
            "Не удается подключиться к серверу. Проверьте, что сервер запущен на localhost:8000",
        });
      } else if (error.message.includes("CORS")) {
        setLoginStatus({
          type: "error",
          message: "Ошибка CORS. Проверьте настройки сервера.",
        });
      } else {
        setLoginStatus({
          type: "error",
          message: "Ошибка соединения с сервером. Попробуйте позже.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    console.log("Forgot password clicked");
    // You can add navigation to forgot password page or show a modal
  };

  const handleRegister = () => {
    router.push("/auth/sign-up");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-cyan-100">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-5xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex justify-center items-center min-h-[600px]">
            {/* Left side - Image */}
            <div className="relative flex-4 h-full min-h-[600px]">
              <Image
                src="/images/authpage.jpg"
                alt="Hands working on macramé art"
                className="w-full h-full object-cover"
                width={600}
                height={600}
                priority
              />
            </div>

            {/* Right side - Auth form */}
            <div className="flex items-center justify-center flex-5 p-8 md:p-12">
              <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Авторизация
                  </h1>
                </div>

                {/* Status Messages */}
                {loginStatus && (
                  <div
                    className={`p-3 rounded-xl text-center ${
                      loginStatus.type === "success"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {loginStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Ваш номер телефона"
                      className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.phone
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-blue-500"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Пароль"
                      className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.password
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-blue-500"
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                      Забыли пароль?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full h-12 font-medium rounded-xl mt-6 transition-colors duration-200 ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {isLoading ? "Авторизация..." : "Авторизироваться"}
                  </button>
                </form>

                {/* Register link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 text-sm">
                    Нет аккаунта?{" "}
                    <button
                      type="button"
                      onClick={handleRegister}
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      Зарегистрироваться
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen flex flex-col relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/authpage.jpg"
            alt="Hands working on macramé art"
            className="w-full h-full object-cover"
            width={600}
            height={600}
            priority
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-8 px-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl mx-auto w-full max-w-sm">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Авторизация</h1>
            </div>

            {/* Status Messages */}
            {loginStatus && (
              <div
                className={`p-3 rounded-xl text-center mb-4 ${
                  loginStatus.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {loginStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Ваш номер телефона"
                  className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.phone
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Пароль"
                  className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="text-right pt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-gray-700 hover:text-gray-900 underline"
                >
                  Забыли пароль?
                </button>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full h-12 font-medium rounded-xl transition-colors duration-200 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isLoading ? "Авторизация..." : "Авторизироваться"}
                </button>
              </div>
            </form>

            {/* Register link for mobile */}
            <div className="text-center pt-4">
              <p className="text-gray-700 text-sm">
                Нет аккаунта?{" "}
                <button
                  type="button"
                  onClick={handleRegister}
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Зарегистрироваться
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
