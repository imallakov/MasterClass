// import React from "react";
// import Image from "next/image";

// const Reviews = () => {
//   const reviews = [
//     {
//       id: 1,
//       name: "Виктор",
//       avatar: "/images/review1.jpg",
//       rating: 5,
//       text: "Приходили на мастер классы вместе с ребёнком, всё понравилось, очень круто, советую",
//     },
//     {
//       id: 2,
//       name: "Мишель",
//       avatar: "/images/review2.png",
//       rating: 5,
//       text: "Ребёнок был очень доволен, завтра идём вместе на макраме",
//     },
//   ];

//   return (
//     <section className="w-full py-8 md:py-12 px-6 md:px-12 lg:px-16">
//       <div className="container mx-auto">
//         <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-600 mb-6 md:mb-10">
//           Отзывы
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
//           {reviews.map((review) => (
//             <div
//               key={review.id}
//               className={`rounded-2xl md:rounded-4xl p-4 md:p-6 w-full min-h-[200px] md:h-54 ${
//                 review.id === 1 ? "bg-[#9A743A]" : "bg-[#E9A980]"
//               }`}
//             >
//               <div className="flex items-center mb-3 md:mb-4">
//                 <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-full overflow-hidden mr-2 md:mr-3 flex-shrink-0">
//                   <Image
//                     src={review.avatar}
//                     alt={review.name}
//                     width={48}
//                     height={48}
//                     className="rounded-full object-cover"
//                   />
//                 </div>
//                 <span className="text-lg md:text-xl font-medium text-white flex-grow min-w-0">
//                   {review.name}
//                 </span>
//                 <div className="flex ml-2 md:ml-auto flex-shrink-0">
//                   {[...Array(review.rating)].map((_, i) => (
//                     <svg
//                       key={i}
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-6 w-6 md:h-8 md:w-8 text-yellow-300"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//               </div>
//               <p className="text-white text-sm md:text-sm leading-relaxed">
//                 {review.text}
//               </p>
//             </div>
//           ))}

//           {/* Add Review Card */}
//           <div className="rounded-2xl md:rounded-4xl bg-[#9D9EEE] p-4 md:p-6 flex flex-col items-center justify-center min-h-[200px] md:min-h-0">
//             <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 flex items-center justify-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-8 w-8 md:h-12 md:w-12 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 4v16m8-8H4"
//                 />
//               </svg>
//             </div>
//             <p className="text-white text-center text-base md:text-lg">
//               Поделиться отзывом
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Reviews;

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Reviews = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Виктор",
      avatar: "/images/review1.jpg",
      rating: 5,
      text: "Приходили на мастер классы вместе с ребёнком, всё понравилось, очень круто, советую",
    },
    {
      id: 2,
      name: "Мишель",
      avatar: "/images/review2.png",
      rating: 5,
      text: "Ребёнок был очень доволен, завтра идём вместе на макраме",
    },
  ]);

  // Authentication state
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  // Helper function to get CSRF token from cookie
  const getCsrfTokenFromCookie = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    return cookieValue;
  };

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);

      // Get CSRF token
      const csrf = getCsrfTokenFromCookie();
      setCsrfToken(csrf || "");
    }
  }, []);

  // Fetch reviews when authenticated
  useEffect(() => {
    if (accessToken) {
      fetchReviews();
    }
  }, [accessToken]);

  // Authenticated request helper
  const makeAuthenticatedRequest = async (url, options = {}) => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add authentication token
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Add CSRF token if available
    if (csrfToken) {
      headers["X-CSRFTOKEN"] = csrfToken;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    // Handle token expiration
    if (response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setIsAuthenticated(false);
      setAccessToken(null);
      router.push("/auth/sign-in");
      throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
    }

    return response;
  };

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/`
      );

      if (response.ok) {
        const reviewsData = await response.json();
        setReviews(reviewsData);

        // Check if user has already reviewed (you might need to adjust this logic based on your API)
        // This assumes the API returns user info or you have another way to check
        setUserHasReviewed(false); // Update this based on your logic
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewText.trim()) {
      setMessage({ type: "error", text: "Пожалуйста, введите текст отзыва" });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/`,
        {
          method: "POST",
          body: JSON.stringify({
            rating: rating,
            text: reviewText,
          }),
        }
      );

      if (response.ok) {
        const newReview = await response.json();
        setReviews((prev) => [...prev, newReview]);
        setIsModalOpen(false);
        setReviewText("");
        setRating(5);
        setUserHasReviewed(true);
        setMessage({ type: "success", text: "Отзыв успешно добавлен!" });
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.message || "Ошибка при добавлении отзыва",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage({ type: "error", text: "Ошибка при добавлении отзыва" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle add review click
  const handleAddReviewClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }

    if (userHasReviewed) {
      setMessage({ type: "info", text: "Вы уже оставили отзыв" });
      return;
    }

    setIsModalOpen(true);
    setMessage({ type: "", text: "" });
  };

  return (
    <section className="w-full py-8 md:py-12 px-6 md:px-12 lg:px-16">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-600 mb-6 md:mb-10">
          Отзывы
        </h2>

        {/* Message Display */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : message.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`rounded-2xl md:rounded-4xl p-4 md:p-6 w-full min-h-[200px] md:h-54 ${
                review.id === 1 ? "bg-[#9A743A]" : "bg-[#E9A980]"
              }`}
            >
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-full overflow-hidden mr-2 md:mr-3 flex-shrink-0">
                  <Image
                    src={review.avatar || "/images/default-avatar.png"}
                    alt={review.name || review.full_name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="text-lg md:text-xl font-medium text-white flex-grow min-w-0">
                  {review.name || review.full_name}
                </span>
                <div className="flex ml-2 md:ml-auto flex-shrink-0">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8 text-yellow-300"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-white text-sm md:text-sm leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}

          {/* Add Review Card */}
          <div
            className={`rounded-2xl md:rounded-4xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[200px] md:min-h-0 cursor-pointer transition-opacity ${
              userHasReviewed
                ? "bg-gray-400 opacity-50 cursor-not-allowed"
                : "bg-[#9D9EEE] hover:bg-[#8b8cdc]"
            }`}
            onClick={handleAddReviewClick}
          >
            <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 md:h-12 md:w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <p className="text-white text-center text-base md:text-lg">
              {userHasReviewed ? "Отзыв уже добавлен" : "Поделиться отзывом"}
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Добавить отзыв
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitReview}>
              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Оценка
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ваш отзыв
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Поделитесь своими впечатлениями..."
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Отправка..." : "Отправить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Reviews;
