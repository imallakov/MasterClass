// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   User,
//   Wrench,
//   Calendar,
//   LogOut,
//   ChevronUp,
//   ChevronDown,
// } from "lucide-react";
// import UserRoute from "../components/UserRoute";
// import BookingPage from "../pages/bookingPage";
// import { useNavigation } from "../context/NavigationContext";

// // White rounded container for the main content
// const ContentContainer = ({ children }) => {
//   return (
//     <div className="bg-white max-h-[750px] rounded-3xl shadow-lg mx-16 overflow-hidden">
//       {children}
//     </div>
//   );
// };

// const PersonalCabinet = () => {
//   const [contactDataExpanded, setContactDataExpanded] = useState(true);
//   const [personalDataExpanded, setPersonalDataExpanded] = useState(true);
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [gender, setGender] = useState("Не выбрано");
//   const [birthMonth, setBirthMonth] = useState("Выберите месяц");
//   const [birthYear, setBirthYear] = useState("Выберите год");
//   const [_selectedDate, setSelectedDate] = useState(18);
//   const [_selectedMonth, setSelectedMonth] = useState("Апрель 2025");
//   const [_selectedTime, setSelectedTime] = useState("9:30");
//   const [_participants, setParticipants] = useState(22);
//   const {
//     currentPage,
//     selectedMasterclassId,
//     navigateToProfile,
//     navigateToBooking,
//     navigateToMyClasses,
//   } = useNavigation();

//   return (
//     <UserRoute>
//       <div className="min-h-screen">
//         <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 py-8">
//           <ContentContainer>
//             {/* Header */}
//             <div className="h-24 bg-gradient-to-r from-pink-300 to-orange-300 rounded-t-3xl"></div>

//             <div className="flex">
//               {/* Sidebar */}
//               <div className="w-80 bg-white min-h-screen shadow-lg">
//                 {/* Profile Section */}
//                 <div className="p-6 border-b border-gray-100">
//                   <div className="flex items-center space-x-4 mb-4">
//                     <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
//                       <img
//                         src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
//                         alt="Profile"
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900 text-lg">
//                         Виктор Ловецкий
//                       </h3>
//                       <button className="text-sm text-blue-500 hover:text-blue-600 underline">
//                         Изменить фото
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Navigation Menu */}
//                 <div className="p-6">
//                   <div className="space-y-4">
//                     <button
//                       onClick={navigateToProfile}
//                       className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left ${
//                         currentPage === "profile" ? "bg-gray-50" : ""
//                       }`}
//                     >
//                       <User className="w-5 h-5 text-gray-600" />
//                       <span
//                         className={`${
//                           currentPage === "profile"
//                             ? "font-medium text-gray-900"
//                             : "text-gray-700"
//                         }`}
//                       >
//                         Личные данные
//                       </span>
//                     </button>

//                     <button
//                       onClick={navigateToMyClasses}
//                       className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left ${
//                         currentPage === "myClasses" ? "bg-gray-50" : ""
//                       }`}
//                     >
//                       <Wrench className="w-5 h-5 text-gray-600" />
//                       <span
//                         className={`${
//                           currentPage === "myClasses"
//                             ? "font-medium text-gray-900"
//                             : "text-gray-700"
//                         }`}
//                       >
//                         Мои мастер - классы
//                       </span>
//                     </button>

//                     <button
//                       onClick={() => navigateToBooking(null)}
//                       className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left ${
//                         currentPage === "booking" ? "bg-gray-50" : ""
//                       }`}
//                     >
//                       <Calendar className="w-5 h-5 text-gray-600" />
//                       <span
//                         className={`${
//                           currentPage === "booking"
//                             ? "font-medium text-gray-900"
//                             : "text-gray-700"
//                         }`}
//                       >
//                         Запись на мастер - класс
//                       </span>
//                     </button>
//                   </div>
//                 </div>
//                 {/* Logout Button */}
//                 <div className="p-6">
//                   <button className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left">
//                     <LogOut className="w-5 h-5 text-gray-600" />
//                     <span className="text-gray-700">Выйти из аккаунта</span>
//                   </button>
//                 </div>
//               </div>

//               {/* Main Content */}
//               <div className="flex-1 p-8 bg-white mx-8 my-8 rounded-3xl">
//                 {currentPage === "profile" ? (
//                   <ProfilePage
//                     contactDataExpanded={contactDataExpanded}
//                     setContactDataExpanded={setContactDataExpanded}
//                     personalDataExpanded={personalDataExpanded}
//                     setPersonalDataExpanded={setPersonalDataExpanded}
//                     firstName={firstName}
//                     setFirstName={setFirstName}
//                     lastName={lastName}
//                     setLastName={setLastName}
//                     gender={gender}
//                     setGender={setGender}
//                     birthMonth={birthMonth}
//                     setBirthMonth={setBirthMonth}
//                     birthYear={birthYear}
//                     setBirthYear={setBirthYear}
//                   />
//                 ) : currentPage === "booking" ? (
//                   <BookingPage masterclassId={selectedMasterclassId} />
//                 ) : currentPage === "myClasses" ? (
//                   <div>
//                     <h1 className="text-3xl font-bold text-gray-900 mb-8">
//                       Мои мастер-классы
//                     </h1>
//                     {/* Add your MyClasses component content here */}
//                   </div>
//                 ) : null}
//               </div>
//             </div>
//           </ContentContainer>
//         </div>
//       </div>
//     </UserRoute>
//   );
// };

// const ProfilePage = ({
//   contactDataExpanded,
//   setContactDataExpanded,
//   personalDataExpanded,
//   setPersonalDataExpanded,
//   firstName,
//   setFirstName,
//   lastName,
//   setLastName,
//   gender,
//   setGender,
//   birthMonth,
//   setBirthMonth,
//   birthYear,
//   setBirthYear,
// }) => {
//   return (
//     <div className="">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">Личный кабинет</h1>

//       {/* Contact Data Section */}
//       <div className="mb-6">
//         <button
//           onClick={() => setContactDataExpanded(!contactDataExpanded)}
//           className="flex items-center justify-between w-90 py-4 transition-colors"
//         >
//           <span className="font-semibold text-gray-900">Контактные данные</span>
//           {contactDataExpanded ? (
//             <ChevronUp className="w-5 h-5 text-gray-600" />
//           ) : (
//             <ChevronDown className="w-5 h-5 text-gray-600" />
//           )}
//         </button>

//         {contactDataExpanded && (
//           <div className="mt-4 grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Ваше имя
//               </label>
//               <input
//                 type="text"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 placeholder="Введите имя"
//                 className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Ваша фамилия
//               </label>
//               <input
//                 type="text"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 placeholder="Введите фамилию"
//                 className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Personal Data Section */}
//       <div className="mb-8">
//         <button
//           onClick={() => setPersonalDataExpanded(!personalDataExpanded)}
//           className="flex items-center justify-between w-90 py-4 transition-colors"
//         >
//           <span className="font-semibold text-gray-900">Личные данные</span>
//           {personalDataExpanded ? (
//             <ChevronUp className="w-5 h-5 text-gray-600" />
//           ) : (
//             <ChevronDown className="w-5 h-5 text-gray-600" />
//           )}
//         </button>

//         {personalDataExpanded && (
//           <div className="mt-4 grid grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Ваш пол
//               </label>
//               <select
//                 value={gender}
//                 onChange={(e) => setGender(e.target.value)}
//                 className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
//               >
//                 <option>Не выбрано</option>
//                 <option>Мужской</option>
//                 <option>Женский</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Месяц рождения
//               </label>
//               <select
//                 value={birthMonth}
//                 onChange={(e) => setBirthMonth(e.target.value)}
//                 className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
//               >
//                 <option>Выберите месяц</option>
//                 <option>Январь</option>
//                 <option>Февраль</option>
//                 <option>Март</option>
//                 <option>Апрель</option>
//                 <option>Май</option>
//                 <option>Июнь</option>
//                 <option>Июль</option>
//                 <option>Август</option>
//                 <option>Сентябрь</option>
//                 <option>Октябрь</option>
//                 <option>Ноябрь</option>
//                 <option>Декабрь</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Год рождения
//               </label>
//               <select
//                 value={birthYear}
//                 onChange={(e) => setBirthYear(e.target.value)}
//                 className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
//               >
//                 <option>Выберите год</option>
//                 {Array.from({ length: 50 }, (_, i) => 2005 - i).map((year) => (
//                   <option key={year}>{year}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Save Button */}
//       <div className="flex justify-center">
//         <button className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-medium text-lg shadow-lg transition-colors">
//           Сохранить
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PersonalCabinet;

"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Wrench,
  Calendar,
  LogOut,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import UserRoute from "../components/UserRoute";
import BookingPage from "../pages/bookingPage";
import { useNavigation } from "../context/NavigationContext";
import { useRouter } from "next/navigation"; // Add this import

// White rounded container for the main content
const ContentContainer = ({ children }) => {
  return (
    <div className="bg-white max-h-[750px] rounded-3xl shadow-lg mx-16 overflow-hidden">
      {children}
    </div>
  );
};

// Helper function to get CSRF token from cookie
const getCsrfTokenFromCookie = () => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "csrftoken") {
      return value;
    }
  }
  return null;
};

const PersonalCabinet = () => {
  const router = useRouter();
  const [contactDataExpanded, setContactDataExpanded] = useState(true);
  const [personalDataExpanded, setPersonalDataExpanded] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    id: 0,
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    is_active: true,
    phone_number_verified: true,
    is_staff: false,
    photo: "",
  });

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photo, setPhoto] = useState("");
  const [gender, setGender] = useState("Не выбрано");
  const [birthMonth, setBirthMonth] = useState("Выберите месяц");
  const [birthYear, setBirthYear] = useState("Выберите год");
  const fileInputRef = useRef(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  // Add photo preview state
  const [photoPreview, setPhotoPreview] = useState("");
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  // Authentication
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");

  const {
    currentPage,
    selectedMasterclassId,
    navigateToProfile,
    navigateToBooking,
    navigateToMyClasses,
  } = useNavigation();

  const getMonthNumber = (monthName) => {
    const months = {
      Январь: "01",
      Февраль: "02",
      Март: "03",
      Апрель: "04",
      Май: "05",
      Июнь: "06",
      Июль: "07",
      Август: "08",
      Сентябрь: "09",
      Октябрь: "10",
      Ноябрь: "11",
      Декабрь: "12",
    };
    return months[monthName] || "01";
  };

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/sign-in");
      return;
    }
    setAccessToken(token);

    // Get CSRF token
    const csrf = getCsrfTokenFromCookie();
    setCsrfToken(csrf || "");
  }, [router]);

  // Fetch profile data when token is available
  useEffect(() => {
    if (accessToken) {
      fetchProfileData();
    }
  }, [accessToken]);

  // Update form fields when profile data changes
  useEffect(() => {
    setFirstName(profileData.first_name || "");
    setLastName(profileData.last_name || "");
    setEmail(profileData.email || "");
    setPhoneNumber(profileData.phone_number || "");
    setPhoto(profileData.photo || "");
  }, [profileData]);

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const headers = {
      Accept: "application/json",
      ...options.headers,
    };

    // Only add Content-Type for JSON, let browser set it for FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Add authentication token
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Add CSRF token if available (and not FormData - browser will handle multipart boundary)
    if (csrfToken && !(options.body instanceof FormData)) {
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
      router.push("/auth/sign-in");
      throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
    }

    return response;
  };

  // Update the handlePhotoChange function
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhotoFile(file); // Store the File object separately

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  // Update the useEffect that sets form data to handle photo preview
  useEffect(() => {
    setFirstName(profileData.first_name || "");
    setLastName(profileData.last_name || "");
    setEmail(profileData.email || "");
    setPhoneNumber(profileData.phone_number || "");

    // Handle photo display
    if (profileData.photo) {
      // If it's a full URL, use it directly
      if (profileData.photo.startsWith("http")) {
        setPhotoPreview(profileData.photo);
      } else {
        // If it's a relative path, prepend backend URL
        setPhotoPreview(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}${profileData.photo}`
        );
      }
    }
  }, [profileData]);

  // Helper function to safely parse JSON response
  const parseResponse = async (response) => {
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      try {
        return await response.json();
      } catch (error) {
        console.error("JSON parsing error:", error);
        throw new Error("Ошибка обработки ответа сервера");
      }
    } else {
      // If response is not JSON, get text for debugging
      const text = await response.text();
      console.error("Non-JSON response:", text);
      throw new Error("Сервер вернул некорректный ответ");
    }
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me/`
      );

      if (response.ok) {
        const userData = await parseResponse(response);
        setProfileData(userData);
        setMessage({ type: "", text: "" });
      } else {
        // Try to get error details from response
        let errorMessage = "Ошибка при загрузке данных профиля";
        try {
          const errorData = await parseResponse(response);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }

        setMessage({
          type: "error",
          text: errorMessage,
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setMessage({
        type: "error",
        text: error.message || "Ошибка при загрузке данных профиля",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfileData = async () => {
    try {
      setSaving(true);

      // Create the data object for JSON request
      const updatedData = {
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        phone_number_verified: profileData.phone_number_verified,
      };

      // Add birth_date if available
      if (birthMonth !== "Выберите месяц" && birthYear !== "Выберите год") {
        const monthNumber = getMonthNumber(birthMonth);
        updatedData.birth_date = `01.${monthNumber}.${birthYear}`;
      }

      let response;

      // Check if we have a NEW photo file to upload
      if (newPhotoFile && newPhotoFile instanceof File) {
        // Use FormData when uploading a file
        const formData = new FormData();

        // Add all the text fields
        Object.keys(updatedData).forEach((key) => {
          formData.append(key, updatedData[key]);
        });

        // Add the photo file
        formData.append("photo", newPhotoFile);

        response = await makeAuthenticatedRequest(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me/`,
          {
            method: "PATCH",
            body: formData,
          }
        );
      } else {
        // Use JSON when no file upload is needed - DON'T include photo field at all
        response = await makeAuthenticatedRequest(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me/`,
          {
            method: "PATCH",
            body: JSON.stringify(updatedData), // No photo field included
          }
        );
      }

      if (response.ok) {
        const updatedProfile = await parseResponse(response);
        setProfileData(updatedProfile);
        setNewPhotoFile(null); // Clear the new photo file after successful upload
        setMessage({
          type: "success",
          text: "Данные профиля успешно сохранены",
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      } else {
        let errorMessage = "Ошибка при сохранении данных";
        try {
          const errorData = await parseResponse(response);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }

        setMessage({
          type: "error",
          text: errorMessage,
        });
      }
    } catch (error) {
      console.error("Error saving profile data:", error);
      setMessage({
        type: "error",
        text: error.message || "Ошибка при сохранении данных",
      });
    } finally {
      setSaving(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      setEnrollmentsLoading(true);
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/enrollments/`
      );

      if (response.ok) {
        const enrollmentsData = await parseResponse(response);
        setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
      } else {
        let errorMessage = "Ошибка при загрузке записей";
        try {
          const errorData = await parseResponse(response);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }

        setMessage({
          type: "error",
          text: errorMessage,
        });
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setMessage({
        type: "error",
        text: error.message || "Ошибка при загрузке записей",
      });
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && currentPage === "myClasses") {
      fetchEnrollments();
    }
  }, [accessToken, currentPage]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/auth/sign-in");
  };

  if (loading) {
    return (
      <UserRoute>
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка данных профиля...</p>
          </div>
        </div>
      </UserRoute>
    );
  }

  return (
    <UserRoute>
      <div className="min-h-screen">
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 py-8">
          {/* <ContentContainer> */}
          <div className="bg-white h-[calc(100vh-4rem)] rounded-3xl shadow-lg mx-16 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="h-24 bg-gradient-to-r from-pink-300 to-orange-300 rounded-t-3xl"></div>

            <div className="flex flex-1 min-h-0">
              {/* Sidebar */}
              <div className="w-80 bg-white shadow-lg flex-shrink-0 flex flex-col">
                {/* Profile Section */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-20 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                      {profileData.photo || photoPreview ? (
                        <img
                          src={photoPreview || profileData.photo}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {profileData.full_name ||
                          profileData.first_name +
                            " " +
                            profileData.last_name ||
                          "Пользователь"}
                      </h3>
                      <button
                        onClick={handlePhotoChange}
                        className="text-sm text-blue-500 hover:text-blue-600 underline"
                      >
                        Изменить фото
                      </button>
                    </div>
                  </div>
                </div>

                {/* Navigation Menu */}
                <div className="p-6">
                  <div className="space-y-4">
                    <button
                      onClick={navigateToProfile}
                      className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left ${
                        currentPage === "profile" ? "bg-gray-50" : ""
                      }`}
                    >
                      <User className="w-5 h-5 text-gray-600" />
                      <span
                        className={`${
                          currentPage === "profile"
                            ? "font-medium text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        Личные данные
                      </span>
                    </button>

                    <button
                      onClick={navigateToMyClasses}
                      className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left ${
                        currentPage === "myClasses" ? "bg-gray-50" : ""
                      }`}
                    >
                      <Wrench className="w-5 h-5 text-gray-600" />
                      <span
                        className={`${
                          currentPage === "myClasses"
                            ? "font-medium text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        Мои мастер - классы
                      </span>
                    </button>

                    <button
                      onClick={() => navigateToBooking(null)}
                      className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left ${
                        currentPage === "booking" ? "bg-gray-50" : ""
                      }`}
                    >
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span
                        className={`${
                          currentPage === "booking"
                            ? "font-medium text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        Запись на мастер - класс
                      </span>
                    </button>
                  </div>
                </div>
                {/* Logout Button */}
                <div className="p-6">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left"
                  >
                    <LogOut className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Выйти из аккаунта</span>
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-8 bg-white overflow-y-auto min-h-0">
                {currentPage === "profile" ? (
                  <ProfilePage
                    contactDataExpanded={contactDataExpanded}
                    setContactDataExpanded={setContactDataExpanded}
                    personalDataExpanded={personalDataExpanded}
                    setPersonalDataExpanded={setPersonalDataExpanded}
                    firstName={firstName}
                    setFirstName={setFirstName}
                    lastName={lastName}
                    setLastName={setLastName}
                    email={email}
                    setEmail={setEmail}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    photoPreview={photoPreview}
                    handlePhotoChange={handlePhotoChange}
                    gender={gender}
                    setGender={setGender}
                    birthMonth={birthMonth}
                    setBirthMonth={setBirthMonth}
                    birthYear={birthYear}
                    setBirthYear={setBirthYear}
                    onSave={saveProfileData}
                    saving={saving}
                    message={message}
                  />
                ) : currentPage === "booking" ? (
                  <BookingPage masterclassId={selectedMasterclassId} />
                ) : currentPage === "myClasses" ? (
                  <MyClassesPage
                    enrollments={enrollments}
                    loading={enrollmentsLoading}
                    onRefresh={fetchEnrollments}
                  />
                ) : null}
              </div>
            </div>
          </div>
          {/* </ContentContainer> */}
        </div>
      </div>
    </UserRoute>
  );
};

const ProfilePage = ({
  contactDataExpanded,
  setContactDataExpanded,
  personalDataExpanded,
  setPersonalDataExpanded,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  gender,
  setGender,
  birthMonth,
  setBirthMonth,
  birthYear,
  setBirthYear,
  onSave,
  saving,
  message,
}) => {
  return (
    <div className="">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Личный кабинет</h1>

      {/* Message Display */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Contact Data Section */}
      <div className="mb-6">
        <button
          onClick={() => setContactDataExpanded(!contactDataExpanded)}
          className="flex items-center justify-between w-90 py-4 transition-colors"
        >
          <span className="font-semibold text-gray-900">Контактные данные</span>
          {contactDataExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {contactDataExpanded && (
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ваше имя
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Введите имя"
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ваша фамилия
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Введите фамилию"
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email"
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Номер телефона
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Введите номер телефона"
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Personal Data Section */}
      <div className="mb-8">
        <button
          onClick={() => setPersonalDataExpanded(!personalDataExpanded)}
          className="flex items-center justify-between w-90 py-4 transition-colors"
        >
          <span className="font-semibold text-gray-900">Личные данные</span>
          {personalDataExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {personalDataExpanded && (
          <div className="mt-4 grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ваш пол
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option>Не выбрано</option>
                <option>Мужской</option>
                <option>Женский</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Месяц рождения
              </label>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option>Выберите месяц</option>
                <option>Январь</option>
                <option>Февраль</option>
                <option>Март</option>
                <option>Апрель</option>
                <option>Май</option>
                <option>Июнь</option>
                <option>Июль</option>
                <option>Август</option>
                <option>Сентябрь</option>
                <option>Октябрь</option>
                <option>Ноябрь</option>
                <option>Декабрь</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Год рождения
              </label>
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option>Выберите год</option>
                {Array.from({ length: 50 }, (_, i) => 2005 - i).map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={onSave}
          disabled={saving}
          className={`px-8 py-3 rounded-2xl font-medium text-lg shadow-lg transition-colors ${
            saving
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-400 hover:bg-blue-500 text-white"
          }`}
        >
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </div>
  );
};

const MyClassesPage = ({ enrollments, loading, onRefresh }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Ожидает подтверждения";
      case "confirmed":
        return "Подтверждено";
      case "cancelled":
        return "Отменено";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Загрузка ваших записей...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Мои мастер-классы</h1>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Обновить
        </button>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            У вас пока нет записей
          </h3>
          <p className="text-gray-600 mb-6">
            Запишитесь на мастер-класс, чтобы они появились здесь
          </p>
          {/* <button
            onClick={() => navigateToBooking(null)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Записаться на мастер-класс
          </button> */}
        </div>
      ) : (
        <div className="space-y-6">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {enrollment.masterclass.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        enrollment.status
                      )}`}
                    >
                      {getStatusText(enrollment.status)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {enrollment.masterclass.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Дата:</span>
                      <p className="text-gray-600">
                        {formatDate(enrollment.slot.start)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Время:</span>
                      <p className="text-gray-600">
                        {formatTime(enrollment.slot.start)} -{" "}
                        {formatTime(enrollment.slot.end)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Количество мест:
                      </span>
                      <p className="text-gray-600">{enrollment.quantity}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Стоимость:
                      </span>
                      <p className="text-gray-600">
                        {enrollment.masterclass.price * enrollment.quantity} ₽
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Дата записи:
                      </span>
                      <p className="text-gray-600">
                        {formatDate(enrollment.created_at)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Свободных мест:
                      </span>
                      <p className="text-gray-600">
                        {enrollment.slot.free_places}
                      </p>
                    </div>
                  </div>
                </div>

                {enrollment.masterclass.image && (
                  <div className="ml-6 flex-shrink-0">
                    <img
                      src={enrollment.masterclass.image}
                      alt={enrollment.masterclass.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {enrollment.status === "pending" && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                    Ваша запись ожидает подтверждения. Мы свяжемся с вами в
                    ближайшее время.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalCabinet;
