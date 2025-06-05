// import Image from "next/image";

// export default function SignInPage() {
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

//               <form className="space-y-4">
//                 <div className="space-y-2">
//                   <input
//                     id="phone"
//                     type="tel"
//                     placeholder="Ваш номер телефона"
//                     className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <input
//                     id="password"
//                     type="password"
//                     placeholder="Пароль"
//                     className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="text-right">
//                   <button
//                     type="button"
//                     className="text-sm text-gray-600 hover:text-gray-800 underline"
//                   >
//                     Забыли пароль
//                   </button>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl mt-6 transition-colors duration-200"
//                 >
//                   Авторизироваться
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

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
        const response = await fetch("http://localhost:8000/api/csrf/", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          // After the request, the cookie should be set, try to get it again
          const newCookieToken = getCsrfTokenFromCookie();
          if (newCookieToken) {
            setCsrfToken(newCookieToken);
          } else {
            // Fallback: try to get from response JSON if your endpoint returns it
            const data = await response.json();
            if (data.csrfToken) {
              setCsrfToken(data.csrfToken);
            }
          }
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
        "Content-Type": "application/json",
      };

      // Add CSRF token if available
      if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
      }

      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: headers,
        credentials: "include", // Important for CORS with credentials
        body: JSON.stringify({
          phone_number: formData.phone,
          password: formData.password,
        }),
      });

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

        // Store tokens securely
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", result.access);
          localStorage.setItem("refresh_token", result.refresh);
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

        console.log("Login successful:", result);

        // Redirect after successful login
        // Example: setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        const errorData = await response.json();

        // Handle specific error messages from the API
        let errorMessage = "Неверный номер телефона или пароль";
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0];
        }

        setLoginStatus({
          type: "error",
          message: errorMessage,
        });

        console.error("Login failed:", errorData);
      }
    } catch (error) {
      console.error("Network error details:", error);

      setLoginStatus({
        type: "error",
        message: "Ошибка соединения с сервером. Проверьте настройки CORS.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    console.log("Forgot password clicked");
    // You can add navigation to forgot password page or show a modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex justify-center items-center min-h-[600px]">
          {/* Left side - Image */}
          <div className="relative flex-4 h-full min-h-[600px]">
            <Image
              src="/images/authpage.jpg"
              alt="Hands working on macramé art"
              fill
              className="object-fit"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
