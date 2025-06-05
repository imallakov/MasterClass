// "use client";
// import React, { useState, useEffect } from "react";

// const SMSVerificationPage = () => {
//   const [code, setCode] = useState("");
//   const [timeLeft, setTimeLeft] = useState(45);

//   // Countdown timer
//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [timeLeft]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Verification code:", code);
//     // Handle verification logic here
//   };

//   const handleResendCode = () => {
//     setTimeLeft(45);
//     // Handle resend logic here
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">
//           Введите код из СМС
//         </h1>

//         <p className="text-gray-600 text-lg leading-relaxed mb-12 px-4">
//           На указанный вами номер телефона, был выслан четырехзначный код для
//           авторизации на нашем сайте, пожалуйста введите его в поле ниже.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div>
//             <input
//               type="text"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//               placeholder="Введите код"
//               className="w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-gray-700 bg-gray-50"
//               maxLength="4"
//             />
//           </div>

//           <div className="text-gray-500 text-base">
//             {timeLeft > 0 ? (
//               <span>Отправить код заново {timeLeft}с.</span>
//             ) : (
//               <button
//                 type="button"
//                 onClick={handleResendCode}
//                 className="text-blue-500 hover:text-blue-600 underline"
//               >
//                 Отправить код заново
//               </button>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-semibold py-4 px-8 rounded-2xl transition-colors duration-200 shadow-lg"
//           >
//             Отправить
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SMSVerificationPage;

"use client";
import React, { useState, useEffect } from "react";

const SMSVerificationPage = () => {
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Auto-submit when code is complete
  useEffect(() => {
    if (code.length === 4 && !isLoading) {
      handleSubmit();
    }
  }, [code]);

  const handleSubmit = async () => {
    if (code.length !== 4) {
      setError("Пожалуйста, введите 4-значный код");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate verification logic
      const isValidCode = code === "1234"; // Mock validation

      if (isValidCode) {
        setSuccess(true);
        console.log("Verification successful:", code);
      } else {
        setAttempts((prev) => prev + 1);
        if (attempts + 1 >= maxAttempts) {
          setError(
            `Превышено максимальное количество попыток (${maxAttempts}). Попробуйте позже.`
          );
        } else {
          setError(
            `Неверный код. Осталось попыток: ${maxAttempts - attempts - 1}`
          );
        }
        setCode("");
      }
    } catch (error) {
      setError("Произошла ошибка. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timeLeft > 0) return;

    setIsLoading(true);
    setError("");
    setAttempts(0);

    try {
      // Simulate resend API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTimeLeft(45);
      console.log("Code resent successfully");
    } catch (error) {
      setError("Не удалось отправить код. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length <= 4) {
      setCode(value);
      setError("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && code.length === 4) {
      handleSubmit();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Успешно!</h1>
            <p className="text-gray-600 text-lg">
              Ваш номер телефона подтвержден
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 hover:bg-green-600 text-white text-xl font-semibold py-4 px-8 rounded-2xl transition-colors duration-200 shadow-lg"
          >
            Продолжить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Введите код из СМС
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-12 px-4">
          На указанный вами номер телефона, был выслан четырехзначный код для
          авторизации на нашем сайте, пожалуйста введите его в поле ниже.
        </p>

        <div className="space-y-8">
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              onKeyPress={handleKeyPress}
              placeholder="Введите код"
              className={`w-full px-6 py-4 text-2xl border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono tracking-widest transition-colors duration-200 ${
                error
                  ? "border-red-300 bg-red-50 text-red-700"
                  : success
                  ? "border-green-300 bg-green-50 text-green-700"
                  : "border-gray-200 bg-gray-50 text-gray-700"
              }`}
              maxLength="4"
              disabled={isLoading || attempts >= maxAttempts}
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
              {error}
            </div>
          )}

          <div className="text-gray-500 text-base">
            {timeLeft > 0 ? (
              <span>Отправить код заново через {formatTime(timeLeft)}</span>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-blue-500 hover:text-blue-600 underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Отправляем..." : "Отправить код заново"}
              </button>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              disabled={
                code.length !== 4 || isLoading || attempts >= maxAttempts
              }
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-semibold py-4 px-8 rounded-2xl transition-colors duration-200 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Проверяем...
                </div>
              ) : (
                "Отправить"
              )}
            </button>

            <button
              onClick={() => {
                setCode("");
                setError("");
              }}
              disabled={isLoading}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Очистить
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            Попыток осталось: {maxAttempts - attempts}
          </div>

          <div className="mt-4 text-xs text-gray-400">
            Код действителен в течение 10 минут
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSVerificationPage;
