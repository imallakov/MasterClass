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

// auth/sign-in
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

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

// Eye icon components
const EyeIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOffIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
);

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: "+",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Add this state
  const { login } = useAuth();

  // 7. Add helper function to clean phone number for backend
  const cleanPhoneForBackend = (phone) => {
    // Remove +7 prefix and any spaces/formatting
    return phone.replace(/^\+\s*/, "").replace(/\s+/g, "");
  };

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

    if (name === "phone") {
      // Ensure phone always starts with +7
      if (value.startsWith("+")) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      } else if (value.length < 2) {
        // If user tries to delete everything, keep +7
        setFormData((prev) => ({
          ...prev,
          [name]: "+",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

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

    // Updated phone validation
    if (!formData.phone.trim() || formData.phone === "+") {
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
            phone_number: cleanPhoneForBackend(formData.phone),
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

        // Use AuthContext login method instead of direct localStorage
        login(result.user, {
          access: result.access,
          refresh: result.refresh,
        });

        setLoginStatus({
          type: "success",
          message: "Авторизация прошла успешно!",
        });

        // Reset form
        setFormData({
          phone: "+",
          password: "",
        });

        // Navigate immediately (no setTimeout needed)
        if (result.user && result.user.is_staff) {
          router.push("/admin/adminmanager");
        } else {
          router.push("/user-account");
        }
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
    router.push("/auth/password-reset");
    // You can add navigation to forgot password page or show a modal
  };

  const handleRegister = () => {
    router.push("/auth/sign-up");
  };

  const handleGoHome = () => {
    router.push("/");
  };


  // Add toggle function
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
                      maxLength={12}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Введите номер телефона"
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

                  {/* Updated password field with icon */}
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Пароль"
                        className={`w-full h-12 px-4 pr-12 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                          errors.password
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-200 focus:ring-blue-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
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
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleGoHome}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Главная страница
                  </button>
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
                  placeholder="+7 (XXX) XXX-XX-XX"
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

              {/* Updated mobile password field with icon */}
              <div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Пароль"
                    className={`w-full h-12 px-4 pr-12 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.password
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
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
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleGoHome}
                className="text-sm text-gray-700 hover:text-gray-900 underline"
              >
                Главная страница
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

//   const handleRegister = () => {
//     router.push("/auth/sign-up");
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

//                 {/* Register link */}
//                 <div className="text-center pt-4">
//                   <p className="text-gray-600 text-sm">
//                     Нет аккаунта?{" "}
//                     <button
//                       type="button"
//                       onClick={handleRegister}
//                       className="text-blue-600 hover:text-blue-800 underline font-medium"
//                     >
//                       Зарегистрироваться
//                     </button>
//                   </p>
//                 </div>
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

//             {/* Register link for mobile */}
//             <div className="text-center pt-4">
//               <p className="text-gray-700 text-sm">
//                 Нет аккаунта?{" "}
//                 <button
//                   type="button"
//                   onClick={handleRegister}
//                   className="text-blue-600 hover:text-blue-800 underline font-medium"
//                 >
//                   Зарегистрироваться
//                 </button>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
