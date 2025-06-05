// import Image from "next/image";

// export default function SignUpPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-cyan-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-5xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
//         <div className="flex justify-center items-center min-h-[650px]">
//           {/* Left side - Image */}
//           <div className="relative flex-4 h-full min-h-[650px]">
//             <Image
//               src="/images/authpage.jpg"
//               alt="Hands working on macramé art"
//               fill
//               className="object-fit"
//               priority
//             />
//           </div>

//           {/* Right side - Registration form */}
//           <div className="flex items-center justify-center flex-5 p-8 md:p-12">
//             <div className="w-full max-w-sm space-y-6">
//               <div className="text-center">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-8">
//                   Регистрация
//                 </h1>
//               </div>

//               <form className="space-y-4">
//                 <div className="space-y-2">
//                   <input
//                     id="fullName"
//                     type="text"
//                     placeholder="Ваше ФИО"
//                     className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <input
//                     id="birthDate"
//                     type="date"
//                     placeholder="Дата рождения"
//                     className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <input
//                     id="password"
//                     type="password"
//                     placeholder="Придумайте пароль"
//                     className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <input
//                     id="phone"
//                     type="tel"
//                     placeholder="Введите номер телефона"
//                     className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <input
//                     id="email"
//                     type="email"
//                     placeholder="Ваш Email адрес"
//                     className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="flex items-center space-x-2 py-2">
//                   <input
//                     type="checkbox"
//                     id="privacy"
//                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
//                   />
//                   <label
//                     htmlFor="privacy"
//                     className="text-sm text-gray-600 leading-relaxed"
//                   >
//                     Согласен с{" "}
//                     <button
//                       type="button"
//                       className="text-blue-500 hover:text-blue-700 underline"
//                     >
//                       политикой конфиденциальности
//                     </button>
//                   </label>
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     type="submit"
//                     className="flex-1 h-12 bg-[#0AC500] hover:bg-green-600 text-white font-medium rounded-xl transition-colors duration-200"
//                   >
//                     Подтвердить
//                   </button>
//                   <button
//                     type="button"
//                     className="flex-1 h-12 text-white bg-[#F3A9A9] hover:bg-pink-400 text-gray-700 font-medium rounded-xl border border-pink-300 transition-colors duration-200"
//                   >
//                     Отмена
//                   </button>
//                 </div>
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
import { useState } from "react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    email: "",
    privacyAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = "ФИО обязательно для заполнения";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен для заполнения";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Введите корректный email адрес";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен для заполнения";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "Подтвердите пароль";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Пароли не совпадают";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Номер телефона обязателен для заполнения";
    }

    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted =
        "Необходимо согласие с политикой конфиденциальности";
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
    setSubmitStatus(null);

    try {
      const response = await fetch(
        "http://localhost:8000/api/users/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            password_confirm: formData.passwordConfirm,
            full_name: formData.fullName,
            phone_number: formData.phone,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSubmitStatus({
          type: "success",
          message: "Регистрация прошла успешно!",
        });

        // Reset form
        setFormData({
          fullName: "",
          birthDate: "",
          password: "",
          passwordConfirm: "",
          phone: "",
          email: "",
          privacyAccepted: false,
        });

        console.log("Registration successful:", result);
      } else {
        const errorData = await response.json();
        setSubmitStatus({
          type: "error",
          message: "Ошибка регистрации. Проверьте введенные данные.",
        });
        console.error("Registration failed:", errorData);
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Ошибка соединения с сервером. Попробуйте позже.",
      });
      console.error("Network error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      birthDate: "",
      password: "",
      passwordConfirm: "",
      phone: "",
      email: "",
      privacyAccepted: false,
    });
    setErrors({});
    setSubmitStatus(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex justify-center items-center min-h-[650px]">
          {/* Left side - Image */}
          <div className="relative flex-4 h-full min-h-[650px]">
            <Image
              src="/images/authpage.jpg"
              alt="Hands working on macramé art"
              fill
              className="object-fit"
              priority
            />
          </div>

          {/* Right side - Registration form */}
          <div className="flex items-center justify-center flex-5 p-8 md:p-12">
            <div className="w-full max-w-sm space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Регистрация
                </h1>
              </div>

              {/* Status Messages */}
              {submitStatus && (
                <div
                  className={`p-3 rounded-xl text-center ${
                    submitStatus.type === "success"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ваше ФИО"
                    className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.fullName
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-blue-500"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    placeholder="Дата рождения"
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Придумайте пароль"
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

                <div className="space-y-2">
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                    placeholder="Подтвердите пароль"
                    className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.passwordConfirm
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-blue-500"
                    }`}
                  />
                  {errors.passwordConfirm && (
                    <p className="text-red-500 text-sm">
                      {errors.passwordConfirm}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
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

                <div className="space-y-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ваш Email адрес"
                    className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.email
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-blue-500"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 py-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label
                    htmlFor="privacy"
                    className="text-sm text-gray-600 leading-relaxed"
                  >
                    Согласен с{" "}
                    <button
                      type="button"
                      className="text-blue-500 hover:text-blue-700 underline"
                    >
                      политикой конфиденциальности
                    </button>
                  </label>
                </div>
                {errors.privacyAccepted && (
                  <p className="text-red-500 text-sm">
                    {errors.privacyAccepted}
                  </p>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 h-12 font-medium rounded-xl transition-colors duration-200 ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-[#0AC500] hover:bg-green-600 text-white"
                    }`}
                  >
                    {isLoading ? "Регистрация..." : "Подтвердить"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 h-12 text-gray-700 bg-[#F3A9A9] hover:bg-pink-400 font-medium rounded-xl border border-pink-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
