// "use client";
// import React, { useState, useEffect } from "react";
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

// const EditMasterClassPage = () => {
//   const router = useRouter();
//   const [masterclasses, setMasterclasses] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedMasterclass, setSelectedMasterclass] = useState(null);
//   const [slots, setSlots] = useState([]);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [slotFormData, setSlotFormData] = useState({
//     start_date: "",
//     start_time: "",
//     end_date: "",
//     end_time: "",
//   });
//   const [isLoadingSlots, setIsLoadingSlots] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     price: "",
//     image: "",
//     participant_limit: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingMasterclasses, setIsLoadingMasterclasses] = useState(true);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [accessToken, setAccessToken] = useState(null);
//   const [csrfToken, setCsrfToken] = useState("");
//   const [editMode, setEditMode] = useState("");

//   const fetchSlots = async (masterclassId) => {
//     if (!masterclassId) return;

//     setIsLoadingSlots(true);
//     try {
//       const response = await makeAuthenticatedRequest(
//         `http://localhost:8000/api/masterclasses/${masterclassId}`
//       );

//       if (!response.ok) {
//         throw new Error("Ошибка при загрузке слотов");
//       }

//       const data = await response.json();
//       // Extract slots from the masterclass data
//       setSlots(Array.isArray(data.slots) ? data.slots : []);
//     } catch (error) {
//       console.error("Error fetching slots:", error);
//       setMessage({
//         type: "error",
//         text: "Не удалось загрузить слоты",
//       });
//     } finally {
//       setIsLoadingSlots(false);
//     }
//   };

//   // Check authentication on component mount
//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       router.push("/auth/sign-in");
//       return;
//     }
//     setAccessToken(token);

//     // Get CSRF token
//     const csrf = getCsrfTokenFromCookie();
//     setCsrfToken(csrf || "");
//   }, [router]);

//   // Fetch masterclasses when component mounts and token is available
//   useEffect(() => {
//     if (accessToken) {
//       fetchMasterclasses();
//     }
//   }, [accessToken]);

//   // Update form data when selected masterclass changes
//   useEffect(() => {
//     if (selectedMasterclass) {
//       setFormData({
//         title: selectedMasterclass.title || "",
//         description: selectedMasterclass.description || "",
//         price: selectedMasterclass.price || "",
//         image: selectedMasterclass.image || "",
//         participant_limit: selectedMasterclass.participant_limit || "",
//       });
//       setSelectedFile(null);
//       setEditMode("");
//     }
//   }, [selectedMasterclass]);

//   const makeAuthenticatedRequest = async (url, options = {}) => {
//     const headers = {
//       Accept: "application/json",
//       ...options.headers,
//     };

//     // Only set Content-Type to application/json if it's not a FormData upload
//     if (!options.body || !(options.body instanceof FormData)) {
//       headers["Content-Type"] = "application/json";
//     }

//     // Add authentication token
//     if (accessToken) {
//       headers["Authorization"] = `Bearer ${accessToken}`;
//     }

//     // Add CSRF token if available
//     if (csrfToken) {
//       headers["X-CSRFTOKEN"] = csrfToken;
//     }

//     const response = await fetch(url, {
//       ...options,
//       headers,
//       credentials: "include",
//     });

//     // Handle token expiration
//     if (response.status === 401) {
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       router.push("/auth/sign-in");
//       throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
//     }

//     return response;
//   };

//   const fetchMasterclasses = async () => {
//     setIsLoadingMasterclasses(true);
//     try {
//       const response = await makeAuthenticatedRequest(
//         "http://localhost:8000/api/masterclasses/"
//       );

//       if (!response.ok) {
//         throw new Error("Ошибка при загрузке мастер-классов");
//       }

//       const data = await response.json();
//       setMasterclasses(Array.isArray(data) ? data : data.results || []);
//     } catch (error) {
//       console.error("Error fetching masterclasses:", error);
//       setMessage({
//         type: "error",
//         text: "Не удалось загрузить мастер-классы",
//       });
//     } finally {
//       setIsLoadingMasterclasses(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       // Create a temporary URL for preview
//       const imageUrl = URL.createObjectURL(file);
//       setFormData((prev) => ({
//         ...prev,
//         image: imageUrl,
//       }));
//     }
//   };

//   const validateForm = () => {
//     if (!formData.title.trim()) {
//       setMessage({
//         type: "error",
//         text: "Пожалуйста, введите название мастер-класса",
//       });
//       return false;
//     }
//     if (!formData.description.trim()) {
//       setMessage({ type: "error", text: "Пожалуйста, введите описание" });
//       return false;
//     }
//     if (!formData.price || parseFloat(formData.price) <= 0) {
//       setMessage({
//         type: "error",
//         text: "Пожалуйста, введите корректную стоимость",
//       });
//       return false;
//     }
//     if (
//       !formData.participant_limit ||
//       parseInt(formData.participant_limit) <= 0
//     ) {
//       setMessage({
//         type: "error",
//         text: "Пожалуйста, введите лимит участников",
//       });
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     if (!selectedMasterclass) {
//       setMessage({
//         type: "error",
//         text: "Пожалуйста, выберите мастер-класс для редактирования",
//       });
//       return;
//     }

//     if (!accessToken) {
//       setMessage({
//         type: "error",
//         text: "Не авторизован. Пожалуйста, войдите в систему.",
//       });
//       return;
//     }

//     setIsLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       // Create FormData with updated masterclass data
//       const formDataForSubmission = new FormData();
//       formDataForSubmission.append("title", formData.title.trim());
//       formDataForSubmission.append("description", formData.description.trim());
//       formDataForSubmission.append(
//         "price",
//         parseFloat(formData.price).toFixed(2)
//       );
//       formDataForSubmission.append(
//         "participant_limit",
//         parseInt(formData.participant_limit)
//       );

//       // Add the file only if a new file was selected
//       if (selectedFile) {
//         formDataForSubmission.append("image", selectedFile);
//       }

//       console.log("Updating masterclass with FormData");
//       console.log("ID:", selectedMasterclass.id);
//       console.log("Title:", formData.title.trim());
//       console.log("Price:", parseFloat(formData.price).toFixed(2));
//       console.log("Participant limit:", parseInt(formData.participant_limit));
//       console.log(
//         "New file:",
//         selectedFile ? selectedFile.name : "No new file"
//       );

//       // Prepare headers (don't set Content-Type for FormData)
//       const headers = {
//         Accept: "application/json",
//       };

//       if (accessToken) {
//         headers["Authorization"] = `Bearer ${accessToken}`;
//       }

//       if (csrfToken) {
//         headers["X-CSRFTOKEN"] = csrfToken;
//       }

//       const response = await fetch(
//         `http://localhost:8000/api/masterclasses/${selectedMasterclass.id}/`,
//         {
//           method: "PATCH",
//           headers: headers,
//           body: formDataForSubmission,
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Masterclass update error:", errorText);

//         let errorMessage;
//         try {
//           const errorData = JSON.parse(errorText);
//           errorMessage = errorData.detail || errorData.message || errorText;
//         } catch {
//           errorMessage = errorText;
//         }

//         throw new Error(`Ошибка при обновлении мастер-класса: ${errorMessage}`);
//       }

//       const updatedMasterclass = await response.json();
//       console.log("Masterclass updated:", updatedMasterclass);

//       // Update the masterclass in the local state
//       setMasterclasses((prev) =>
//         prev.map((mc) =>
//           mc.id === selectedMasterclass.id ? updatedMasterclass : mc
//         )
//       );

//       // Update selected masterclass
//       setSelectedMasterclass(updatedMasterclass);

//       setMessage({
//         type: "success",
//         text: `Мастер-класс "${updatedMasterclass.title}" успешно обновлен!`,
//       });

//       // Reset file input
//       const fileInput = document.getElementById("photo-upload");
//       if (fileInput) fileInput.value = "";
//       setSelectedFile(null);
//       setEditMode("");
//     } catch (error) {
//       console.error("Error:", error);
//       setMessage({
//         type: "error",
//         text: error.message || "Ошибка соединения с сервером",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleMasterclassSelect = (masterId) => {
//     setSelectedClass(masterId);
//     const masterclass = masterclasses.find(
//       (mc) => mc.id === parseInt(masterId)
//     );
//     setSelectedMasterclass(masterclass);
//     setMessage({ type: "", text: "" });

//     // FETCH SLOTS FOR SELECTED MASTERCLASS
//     if (masterclass) {
//       fetchSlots(masterclass.id);
//     }
//   };

//   const handleSlotInputChange = (e) => {
//     const { name, value } = e.target;
//     setSlotFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSlotSelect = (slot) => {
//     setSelectedSlot(slot);
//     const startDate = new Date(slot.start);
//     const endDate = new Date(slot.end);

//     setSlotFormData({
//       start_date: startDate.toISOString().split("T")[0],
//       start_time: startDate.toTimeString().slice(0, 5),
//       end_date: endDate.toISOString().split("T")[0],
//       end_time: endDate.toTimeString().slice(0, 5),
//     });

//     // Clear any existing messages when selecting a slot
//     setMessage({ type: "", text: "" });
//   };

//   const validateSlotForm = () => {
//     if (!slotFormData.start_date) {
//       setMessage({ type: "error", text: "Пожалуйста, выберите дату начала" });
//       return false;
//     }
//     if (!slotFormData.start_time) {
//       setMessage({ type: "error", text: "Пожалуйста, выберите время начала" });
//       return false;
//     }
//     if (!slotFormData.end_date) {
//       setMessage({
//         type: "error",
//         text: "Пожалуйста, выберите дату окончания",
//       });
//       return false;
//     }
//     if (!slotFormData.end_time) {
//       setMessage({
//         type: "error",
//         text: "Пожалуйста, выберите время окончания",
//       });
//       return false;
//     }

//     const startDateTime = new Date(
//       `${slotFormData.start_date}T${slotFormData.start_time}`
//     );
//     const endDateTime = new Date(
//       `${slotFormData.end_date}T${slotFormData.end_time}`
//     );

//     if (endDateTime <= startDateTime) {
//       setMessage({
//         type: "error",
//         text: "Время окончания должно быть позже времени начала",
//       });
//       return false;
//     }

//     return true;
//   };

//   const handleSlotUpdate = async (e) => {
//     e.preventDefault();

//     if (!validateSlotForm() || !selectedMasterclass || !selectedSlot) {
//       return;
//     }

//     setIsLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const startDateTime = new Date(
//         `${slotFormData.start_date}T${slotFormData.start_time}`
//       );
//       const endDateTime = new Date(
//         `${slotFormData.end_date}T${slotFormData.end_time}`
//       );

//       const slotData = {
//         masterclass: selectedMasterclass.id,
//         start: startDateTime.toISOString(),
//         end: endDateTime.toISOString(),
//       };

//       const response = await makeAuthenticatedRequest(
//         `http://localhost:8000/api/masterclasses/slots/${selectedSlot.id}/`,
//         {
//           method: "PATCH",
//           body: JSON.stringify(slotData),
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Ошибка при обновлении слота: ${errorText}`);
//       }

//       const updatedSlot = await response.json();

//       // Update slot in state
//       setSlots((prev) =>
//         prev.map((slot) => (slot.id === selectedSlot.id ? updatedSlot : slot))
//       );

//       // Update selected slot
//       setSelectedSlot(updatedSlot);

//       setMessage({
//         type: "success",
//         text: "Слот успешно обновлен!",
//       });
//     } catch (error) {
//       console.error("Error updating slot:", error);
//       setMessage({
//         type: "error",
//         text: error.message || "Ошибка при обновлении слота",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSlotDelete = async (slotId) => {
//     if (!confirm("Вы уверены, что хотите удалить этот слот?")) {
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await makeAuthenticatedRequest(
//         `http://localhost:8000/api/masterclasses/slots/${slotId}/`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Ошибка при удалении слота");
//       }

//       // Remove slot from state
//       setSlots((prev) => prev.filter((slot) => slot.id !== slotId));
//       setSelectedSlot(null);
//       setSlotFormData({
//         start_date: "",
//         start_time: "",
//         end_date: "",
//         end_time: "",
//       });

//       setMessage({
//         type: "success",
//         text: "Слот успешно удален!",
//       });
//     } catch (error) {
//       console.error("Error deleting slot:", error);
//       setMessage({
//         type: "error",
//         text: "Ошибка при удалении слота",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSlotCreate = async (e) => {
//     e.preventDefault();

//     if (!validateSlotForm() || !selectedMasterclass) {
//       return;
//     }

//     setIsLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const startDateTime = new Date(
//         `${slotFormData.start_date}T${slotFormData.start_time}`
//       );
//       const endDateTime = new Date(
//         `${slotFormData.end_date}T${slotFormData.end_time}`
//       );

//       const slotData = {
//         masterclass: selectedMasterclass.id,
//         start: startDateTime.toISOString(),
//         end: endDateTime.toISOString(),
//       };

//       const response = await makeAuthenticatedRequest(
//         "http://localhost:8000/api/masterclasses/slots/",
//         {
//           method: "POST",
//           body: JSON.stringify(slotData),
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Ошибка при создании слота: ${errorText}`);
//       }

//       const newSlot = await response.json();

//       // Add new slot to state
//       setSlots((prev) => [...prev, newSlot]);

//       // Reset form
//       setSlotFormData({
//         start_date: "",
//         start_time: "",
//         end_date: "",
//         end_time: "",
//       });

//       setMessage({
//         type: "success",
//         text: "Новый слот успешно создан!",
//       });
//     } catch (error) {
//       console.error("Error creating slot:", error);
//       setMessage({
//         type: "error",
//         text: error.message || "Ошибка при создании слота",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEditModeChange = (mode) => {
//     setEditMode(mode);
//     setMessage({ type: "", text: "" });
//   };

//   // Show loading while checking authentication
//   if (accessToken === null) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Проверка авторизации...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-1">
//       {/* Left Content */}
//       <div className="flex-1 p-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Мастер - классы</h1>
//           <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2.5 rounded-full font-medium text-sm">
//             Отключить блок
//           </button>
//         </div>

//         {/* Message */}
//         {message.text && (
//           <div
//             className={`mb-6 p-4 rounded-lg ${
//               message.type === "success"
//                 ? "bg-green-100 text-green-800 border border-green-200"
//                 : "bg-red-100 text-red-800 border border-red-200"
//             }`}
//           >
//             {message.text}
//           </div>
//         )}

//         {/* Master Class Selection */}
//         <div className="mb-8">
//           <label className="block text-lg font-medium text-gray-900 mb-4">
//             Выберите мастер - класс
//           </label>
//           {isLoadingMasterclasses ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
//               <p className="text-gray-600">Загрузка мастер-классов...</p>
//             </div>
//           ) : masterclasses.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-600">Мастер-классы не найдены</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {masterclasses.map((masterclass) => (
//                 <button
//                   key={masterclass.id}
//                   className={`w-full p-4 rounded-xl text-left font-medium ${
//                     selectedClass === masterclass.id.toString()
//                       ? "bg-gray-300 text-gray-800"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                   onClick={() =>
//                     handleMasterclassSelect(masterclass.id.toString())
//                   }
//                 >
//                   {masterclass.title}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Edit Options */}
//         {selectedMasterclass && (
//           <div className="mb-8">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               Что вы хотите изменить?
//             </h3>
//             <div className="space-y-4">
//               <button
//                 className={`text-left block font-medium underline ${
//                   editMode === "price"
//                     ? "text-blue-600"
//                     : "text-gray-700 hover:text-gray-900"
//                 }`}
//                 onClick={() => handleEditModeChange("price")}
//               >
//                 Изменить цену
//               </button>
//               <button
//                 className={`text-left block font-medium underline ${
//                   editMode === "title"
//                     ? "text-blue-600"
//                     : "text-gray-700 hover:text-gray-900"
//                 }`}
//                 onClick={() => handleEditModeChange("title")}
//               >
//                 Изменить название
//               </button>
//               <button
//                 className={`text-left block font-medium underline ${
//                   editMode === "description"
//                     ? "text-blue-600"
//                     : "text-gray-700 hover:text-gray-900"
//                 }`}
//                 onClick={() => handleEditModeChange("description")}
//               >
//                 Изменить описание
//               </button>
//               <button
//                 className={`text-left block font-medium underline ${
//                   editMode === "image"
//                     ? "text-blue-600"
//                     : "text-gray-700 hover:text-gray-900"
//                 }`}
//                 onClick={() => handleEditModeChange("image")}
//               >
//                 Изменить фото
//               </button>
//               <button
//                 className={`text-left block font-medium underline ${
//                   editMode === "participant_limit"
//                     ? "text-blue-600"
//                     : "text-gray-700 hover:text-gray-900"
//                 }`}
//                 onClick={() => handleEditModeChange("participant_limit")}
//               >
//                 Изменить лимит участников
//               </button>
//               {/* ADD THIS NEW OPTION */}
//               <button
//                 className="text-left block font-medium underline text-gray-700 hover:text-gray-900"
//                 onClick={() => {
//                   // Scroll to slots section
//                   const slotsSection = document.querySelector(
//                     'h3:contains("Управление слотами времени")'
//                   );
//                   if (slotsSection) {
//                     slotsSection.scrollIntoView({ behavior: "smooth" });
//                   }
//                 }}
//               >
//                 Управлять слотами времени
//               </button>
//               <button
//                 className={`text-left block font-medium underline ${
//                   editMode === "all"
//                     ? "text-blue-600"
//                     : "text-gray-700 hover:text-gray-900"
//                 }`}
//                 onClick={() => handleEditModeChange("all")}
//               >
//                 Изменить все поля
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Slot Management Section */}
//         {selectedMasterclass && editMode === "all" && (
//           <div className="mb-8">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               Управление слотами времени
//             </h3>

//             {/* Existing Slots */}
//             <div className="mb-6">
//               <h4 className="text-md font-medium text-gray-700 mb-3">
//                 Существующие слоты:
//               </h4>
//               {isLoadingSlots ? (
//                 <div className="text-center py-4">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
//                   <p className="text-gray-600 text-sm">Загрузка слотов...</p>
//                 </div>
//               ) : slots.length === 0 ? (
//                 <div className="text-center py-4 bg-gray-50 rounded-lg">
//                   <p className="text-gray-600">Слоты не найдены</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   <div className="space-y-2">
//                     {slots.map((slot) => {
//                       const startDate = new Date(slot.start);
//                       const endDate = new Date(slot.end);
//                       const isSelected =
//                         selectedSlot && selectedSlot.id === slot.id;

//                       return (
//                         <div
//                           key={slot.id}
//                           className={`p-4 rounded-lg border cursor-pointer transition-colors ${
//                             isSelected
//                               ? "border-blue-500 bg-blue-50"
//                               : "border-gray-200 bg-white hover:border-gray-300"
//                           }`}
//                           onClick={() => handleSlotSelect(slot)}
//                         >
//                           <div className="flex justify-between items-center">
//                             <div className="flex-1">
//                               <p className="font-medium text-gray-900">
//                                 {startDate.toLocaleDateString("ru-RU")} -{" "}
//                                 {endDate.toLocaleDateString("ru-RU")}
//                               </p>
//                               <p className="text-sm text-gray-600 mb-1">
//                                 {startDate.toLocaleTimeString("ru-RU", {
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                 })}{" "}
//                                 -{" "}
//                                 {endDate.toLocaleTimeString("ru-RU", {
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                 })}
//                               </p>
//                               {/* NEW: Display free places */}
//                               <p className="text-sm text-blue-600 font-medium">
//                                 Свободных мест: {slot.free_places || 0}
//                               </p>
//                             </div>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleSlotDelete(slot.id);
//                               }}
//                               className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
//                               disabled={isLoading}
//                             >
//                               Удалить
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Slot Edit/Create Form */}
//             <div className="bg-gray-50 p-6 rounded-lg">
//               <h4 className="text-md font-medium text-gray-700">
//                 {selectedSlot ? "Редактировать слот" : "Создать новый слот"}
//               </h4>
//               {selectedSlot && (
//                 <div className="text-right">
//                   <p className="text-sm text-gray-600">
//                     Слот ID: {selectedSlot.id}
//                   </p>
//                   <p className="text-sm text-blue-600 font-medium">
//                     Свободных мест: {selectedSlot.free_places || 0}
//                   </p>
//                 </div>
//               )}

//               <form
//                 onSubmit={selectedSlot ? handleSlotUpdate : handleSlotCreate}
//                 className="space-y-4"
//               >
//                 {/* Start Date and Time */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2 text-sm">
//                       Дата начала *
//                     </label>
//                     <input
//                       type="date"
//                       name="start_date"
//                       value={slotFormData.start_date}
//                       onChange={handleSlotInputChange}
//                       className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2 text-sm">
//                       Время начала *
//                     </label>
//                     <input
//                       type="time"
//                       name="start_time"
//                       value={slotFormData.start_time}
//                       onChange={handleSlotInputChange}
//                       className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* End Date and Time */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2 text-sm">
//                       Дата окончания *
//                     </label>
//                     <input
//                       type="date"
//                       name="end_date"
//                       value={slotFormData.end_date}
//                       onChange={handleSlotInputChange}
//                       className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2 text-sm">
//                       Время окончания *
//                     </label>
//                     <input
//                       type="time"
//                       name="end_time"
//                       value={slotFormData.end_time}
//                       onChange={handleSlotInputChange}
//                       className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Form Buttons */}
//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className={`px-6 py-2 rounded-lg font-medium text-sm ${
//                       isLoading
//                         ? "bg-gray-400 cursor-not-allowed text-white"
//                         : selectedSlot
//                         ? "bg-green-600 hover:bg-green-700 text-white"
//                         : "bg-blue-600 hover:bg-blue-700 text-white"
//                     }`}
//                   >
//                     {isLoading
//                       ? "Сохранение..."
//                       : selectedSlot
//                       ? "Обновить слот"
//                       : "Создать слот"}
//                   </button>

//                   {selectedSlot && (
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSelectedSlot(null);
//                         setSlotFormData({
//                           start_date: "",
//                           start_time: "",
//                           end_date: "",
//                           end_time: "",
//                         });
//                         setMessage({ type: "", text: "" });
//                       }}
//                       className="px-6 py-2 rounded-lg font-medium text-sm bg-gray-600 hover:bg-gray-700 text-white"
//                     >
//                       Отменить
//                     </button>
//                   )}
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Edit Form */}
//         {selectedMasterclass && editMode && (
//           <form onSubmit={handleSubmit} className="space-y-6 mb-8">
//             {/* Title Edit */}
//             {(editMode === "title" || editMode === "all") && (
//               <div>
//                 <label className="block text-gray-900 font-medium mb-3 text-base">
//                   Название мастер класса *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                   placeholder="Название мастер-класса"
//                   required
//                 />
//               </div>
//             )}

//             {/* Description Edit */}
//             {(editMode === "description" || editMode === "all") && (
//               <div>
//                 <label className="block text-gray-900 font-medium mb-3 text-base">
//                   Описание *
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 h-32 resize-none"
//                   placeholder="Введите описание мастер-класса"
//                   required
//                 />
//               </div>
//             )}

//             {/* Price Edit */}
//             {(editMode === "price" || editMode === "all") && (
//               <div>
//                 <label className="block text-gray-900 font-medium mb-3 text-base">
//                   Стоимость *
//                 </label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   step="0.01"
//                   min="0"
//                   className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                   placeholder="Стоимость в рублях"
//                   required
//                 />
//               </div>
//             )}

//             {/* Participant Limit Edit */}
//             {(editMode === "participant_limit" || editMode === "all") && (
//               <div>
//                 <label className="block text-gray-900 font-medium mb-3 text-base">
//                   Лимит участников *
//                 </label>
//                 <input
//                   type="number"
//                   name="participant_limit"
//                   value={formData.participant_limit}
//                   onChange={handleInputChange}
//                   min="1"
//                   className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                   placeholder="Максимальное количество участников"
//                   required
//                 />
//               </div>
//             )}

//             {/* Image Edit */}
//             {(editMode === "image" || editMode === "all") && (
//               <div>
//                 <label className="block text-gray-900 font-medium mb-3 text-base">
//                   Загрузить новое фото
//                 </label>
//                 <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-300 cursor-pointer bg-gray-50">
//                   <input
//                     type="file"
//                     className="hidden"
//                     id="photo-upload"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                   />
//                   <label htmlFor="photo-upload" className="cursor-pointer">
//                     {selectedFile ? (
//                       <div className="text-green-600">
//                         <svg
//                           className="mx-auto h-12 w-12 mb-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                         <span className="font-medium">
//                           Новый файл: {selectedFile.name}
//                         </span>
//                       </div>
//                     ) : (
//                       <div className="text-gray-500">
//                         <svg
//                           className="mx-auto h-12 w-12 mb-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                           />
//                         </svg>
//                         <span className="font-medium">
//                           Нажмите для загрузки нового фото
//                         </span>
//                       </div>
//                     )}
//                   </label>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-2">
//                   Оставьте пустым, если не хотите менять изображение
//                 </p>
//               </div>
//             )}

//             {/* Save Button */}
//             <div className="flex justify-center mt-8">
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`px-10 py-3 rounded-full font-medium text-lg shadow-md ${
//                   isLoading
//                     ? "bg-gray-400 cursor-not-allowed text-white"
//                     : "bg-[#64A0CE] hover:bg-[#6598c0] text-white"
//                 }`}
//               >
//                 {isLoading ? "Сохранение..." : "Сохранить изменения"}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>

//       {/* Right Section - Product Card Preview */}
//       <div className="w-80 p-8 flex items-start justify-center">
//         <div className="w-72">
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//             <div className="relative">
//               <div className="w-full h-56 bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center">
//                 {selectedMasterclass &&
//                 (formData.image || selectedMasterclass.image) ? (
//                   <img
//                     src={formData.image || selectedMasterclass.image}
//                     alt="Preview"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-24 h-32 bg-white rounded-lg shadow-sm flex items-center justify-center">
//                     <div className="text-center">
//                       <div className="w-16 h-20 bg-gray-300 rounded mb-2"></div>
//                       <div className="text-xs text-gray-500">
//                         {selectedMasterclass
//                           ? selectedMasterclass.title
//                           : "Превью фото"}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <button className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-sm">
//                 <span className="text-blue-500 text-sm font-bold">ℹ</span>
//               </button>
//             </div>
//             <div className="p-6">
//               <h3 className="text-gray-600 font-medium mb-1">
//                 {selectedMasterclass ? formData.title : "Название"}
//               </h3>
//               <h4 className="text-gray-600 font-medium mb-4 text-sm">
//                 {selectedMasterclass
//                   ? formData.description
//                   : "Описание мастер-класса"}
//               </h4>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-500">
//                   Лимит:{" "}
//                   {selectedMasterclass ? formData.participant_limit : "—"}
//                 </span>
//                 <span className="text-2xl font-bold text-gray-800">
//                   {selectedMasterclass ? `${formData.price} ₽` : "0 ₽"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Debug info - remove in production */}
//           {process.env.NODE_ENV === "development" && (
//             <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
//               <p>Token: {accessToken ? "Available" : "Not available"}</p>
//               <p>CSRF: {csrfToken ? "Available" : "Not available"}</p>
//               <p>
//                 Selected:{" "}
//                 {selectedMasterclass ? selectedMasterclass.id : "None"}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditMasterClassPage;

"use client";
import React, { useState, useEffect } from "react";
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

const EditMasterClassPage = () => {
  const router = useRouter();
  const [masterclasses, setMasterclasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMasterclass, setSelectedMasterclass] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotFormData, setSlotFormData] = useState({
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
  });
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    participant_limit: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMasterclasses, setIsLoadingMasterclasses] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [editMode, setEditMode] = useState("");

  const fetchSlots = async (masterclassId) => {
    if (!masterclassId) return;

    setIsLoadingSlots(true);
    try {
      const response = await makeAuthenticatedRequest(
        `http://localhost:8000/api/masterclasses/${masterclassId}`
      );

      if (!response.ok) {
        throw new Error("Ошибка при загрузке слотов");
      }

      const data = await response.json();
      // Extract slots from the masterclass data
      setSlots(Array.isArray(data.slots) ? data.slots : []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setMessage({
        type: "error",
        text: "Не удалось загрузить слоты",
      });
    } finally {
      setIsLoadingSlots(false);
    }
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

  // Fetch masterclasses when component mounts and token is available
  useEffect(() => {
    if (accessToken) {
      fetchMasterclasses();
    }
  }, [accessToken]);

  // Update form data when selected masterclass changes
  useEffect(() => {
    if (selectedMasterclass) {
      setFormData({
        title: selectedMasterclass.title || "",
        description: selectedMasterclass.description || "",
        price: selectedMasterclass.price || "",
        image: selectedMasterclass.image || "",
        participant_limit: selectedMasterclass.participant_limit || "",
      });
      setSelectedFile(null);
      setEditMode("");
    }
  }, [selectedMasterclass]);

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const headers = {
      Accept: "application/json",
      ...options.headers,
    };

    // Only set Content-Type to application/json if it's not a FormData upload
    if (!options.body || !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

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
      router.push("/auth/sign-in");
      throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
    }

    return response;
  };

  const fetchMasterclasses = async () => {
    setIsLoadingMasterclasses(true);
    try {
      const response = await makeAuthenticatedRequest(
        "http://localhost:8000/api/masterclasses/"
      );

      if (!response.ok) {
        throw new Error("Ошибка при загрузке мастер-классов");
      }

      const data = await response.json();
      setMasterclasses(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error fetching masterclasses:", error);
      setMessage({
        type: "error",
        text: "Не удалось загрузить мастер-классы",
      });
    } finally {
      setIsLoadingMasterclasses(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setMessage({
        type: "error",
        text: "Пожалуйста, введите название мастер-класса",
      });
      return false;
    }
    if (!formData.description.trim()) {
      setMessage({ type: "error", text: "Пожалуйста, введите описание" });
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setMessage({
        type: "error",
        text: "Пожалуйста, введите корректную стоимость",
      });
      return false;
    }
    if (
      !formData.participant_limit ||
      parseInt(formData.participant_limit) <= 0
    ) {
      setMessage({
        type: "error",
        text: "Пожалуйста, введите лимит участников",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!selectedMasterclass) {
      setMessage({
        type: "error",
        text: "Пожалуйста, выберите мастер-класс для редактирования",
      });
      return;
    }

    if (!accessToken) {
      setMessage({
        type: "error",
        text: "Не авторизован. Пожалуйста, войдите в систему.",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Create FormData with updated masterclass data
      const formDataForSubmission = new FormData();
      formDataForSubmission.append("title", formData.title.trim());
      formDataForSubmission.append("description", formData.description.trim());
      formDataForSubmission.append(
        "price",
        parseFloat(formData.price).toFixed(2)
      );
      formDataForSubmission.append(
        "participant_limit",
        parseInt(formData.participant_limit)
      );

      // Add the file only if a new file was selected
      if (selectedFile) {
        formDataForSubmission.append("image", selectedFile);
      }

      console.log("Updating masterclass with FormData");
      console.log("ID:", selectedMasterclass.id);
      console.log("Title:", formData.title.trim());
      console.log("Price:", parseFloat(formData.price).toFixed(2));
      console.log("Participant limit:", parseInt(formData.participant_limit));
      console.log(
        "New file:",
        selectedFile ? selectedFile.name : "No new file"
      );

      // Prepare headers (don't set Content-Type for FormData)
      const headers = {
        Accept: "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      if (csrfToken) {
        headers["X-CSRFTOKEN"] = csrfToken;
      }

      const response = await fetch(
        `http://localhost:8000/api/masterclasses/${selectedMasterclass.id}/`,
        {
          method: "PATCH",
          headers: headers,
          body: formDataForSubmission,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Masterclass update error:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorText;
        } catch {
          errorMessage = errorText;
        }

        throw new Error(`Ошибка при обновлении мастер-класса: ${errorMessage}`);
      }

      const updatedMasterclass = await response.json();
      console.log("Masterclass updated:", updatedMasterclass);

      // Update the masterclass in the local state
      setMasterclasses((prev) =>
        prev.map((mc) =>
          mc.id === selectedMasterclass.id ? updatedMasterclass : mc
        )
      );

      // Update selected masterclass
      setSelectedMasterclass(updatedMasterclass);

      setMessage({
        type: "success",
        text: `Мастер-класс "${updatedMasterclass.title}" успешно обновлен!`,
      });

      // Reset file input
      const fileInput = document.getElementById("photo-upload");
      if (fileInput) fileInput.value = "";
      setSelectedFile(null);
      setEditMode("");
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Ошибка соединения с сервером",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMasterclassSelect = (masterId) => {
    setSelectedClass(masterId);
    const masterclass = masterclasses.find(
      (mc) => mc.id === parseInt(masterId)
    );
    setSelectedMasterclass(masterclass);
    setMessage({ type: "", text: "" });

    // FETCH SLOTS FOR SELECTED MASTERCLASS
    if (masterclass) {
      fetchSlots(masterclass.id);
    }
  };

  const handleSlotInputChange = (e) => {
    const { name, value } = e.target;
    setSlotFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    const startDate = new Date(slot.start);
    const endDate = new Date(slot.end);

    // setSlotFormData({
    //   start_date: startDate.toISOString().split("T")[0],
    //   start_time: startDate.toTimeString().slice(0, 5),
    //   end_date: endDate.toISOString().split("T")[0],
    //   end_time: endDate.toTimeString().slice(0, 5),
    // });

    // Clear any existing messages when selecting a slot
    setMessage({ type: "", text: "" });
  };

  const validateSlotForm = () => {
    if (!slotFormData.start_date) {
      setMessage({ type: "error", text: "Пожалуйста, выберите дату начала" });
      return false;
    }
    if (!slotFormData.start_time) {
      setMessage({ type: "error", text: "Пожалуйста, выберите время начала" });
      return false;
    }
    if (!slotFormData.end_date) {
      setMessage({
        type: "error",
        text: "Пожалуйста, выберите дату окончания",
      });
      return false;
    }
    if (!slotFormData.end_time) {
      setMessage({
        type: "error",
        text: "Пожалуйста, выберите время окончания",
      });
      return false;
    }

    const startDateTime = new Date(
      `${slotFormData.start_date}T${slotFormData.start_time}`
    );
    const endDateTime = new Date(
      `${slotFormData.end_date}T${slotFormData.end_time}`
    );

    if (endDateTime <= startDateTime) {
      setMessage({
        type: "error",
        text: "Время окончания должно быть позже времени начала",
      });
      return false;
    }

    return true;
  };

  //   const handleSlotUpdate = async (e) => {
  //     e.preventDefault();

  //     if (!validateSlotForm() || !selectedMasterclass || !selectedSlot) {
  //       return;
  //     }

  //     setIsLoading(true);
  //     setMessage({ type: "", text: "" });

  //     try {
  //       const startDateTime = new Date(
  //         `${slotFormData.start_date}T${slotFormData.start_time}`
  //       );
  //       const endDateTime = new Date(
  //         `${slotFormData.end_date}T${slotFormData.end_time}`
  //       );

  //       const slotData = {
  //         masterclass: selectedMasterclass.id,
  //         start: startDateTime.toISOString(),
  //         end: endDateTime.toISOString(),
  //       };

  //       const response = await makeAuthenticatedRequest(
  //         `http://localhost:8000/api/masterclasses/slots/${selectedSlot.id}/`,
  //         {
  //           method: "PATCH",
  //           body: JSON.stringify(slotData),
  //         }
  //       );

  //       if (!response.ok) {
  //         const errorText = await response.text();
  //         throw new Error(`Ошибка при обновлении слота: ${errorText}`);
  //       }

  //       const updatedSlot = await response.json();

  //       // Update slot in state
  //       setSlots((prev) =>
  //         prev.map((slot) => (slot.id === selectedSlot.id ? updatedSlot : slot))
  //       );

  //       // Update selected slot
  //       setSelectedSlot(updatedSlot);

  //       setMessage({
  //         type: "success",
  //         text: "Слот успешно обновлен!",
  //       });
  //     } catch (error) {
  //       console.error("Error updating slot:", error);
  //       setMessage({
  //         type: "error",
  //         text: error.message || "Ошибка при обновлении слота",
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const handleSlotDelete = async (slotId) => {
    if (!confirm("Вы уверены, что хотите удалить этот слот?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await makeAuthenticatedRequest(
        `http://localhost:8000/api/masterclasses/slots/${slotId}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при удалении слота");
      }

      // Remove slot from state
      setSlots((prev) => prev.filter((slot) => slot.id !== slotId));
      setSelectedSlot(null);
      setSlotFormData({
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
      });

      setMessage({
        type: "success",
        text: "Слот успешно удален!",
      });
    } catch (error) {
      console.error("Error deleting slot:", error);
      setMessage({
        type: "error",
        text: "Ошибка при удалении слота",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotCreate = async (e) => {
    e.preventDefault();

    if (!validateSlotForm() || !selectedMasterclass) {
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const startDateTime = new Date(
        `${slotFormData.start_date}T${slotFormData.start_time}`
      );
      const endDateTime = new Date(
        `${slotFormData.end_date}T${slotFormData.end_time}`
      );

      const slotData = {
        masterclass: selectedMasterclass.id,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
      };

      const response = await makeAuthenticatedRequest(
        "http://localhost:8000/api/masterclasses/slots/",
        {
          method: "POST",
          body: JSON.stringify(slotData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при создании слота: ${errorText}`);
      }

      const newSlot = await response.json();

      // Add new slot to state
      setSlots((prev) => [...prev, newSlot]);

      // Reset form
      setSlotFormData({
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
      });

      setMessage({
        type: "success",
        text: "Новый слот успешно создан!",
      });
    } catch (error) {
      console.error("Error creating slot:", error);
      setMessage({
        type: "error",
        text: error.message || "Ошибка при создании слота",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditModeChange = (mode) => {
    setEditMode(mode);
    setMessage({ type: "", text: "" });
  };

  // Show loading while checking authentication
  if (accessToken === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      {/* Left Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Мастер - классы</h1>
          <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2.5 rounded-full font-medium text-sm">
            Отключить блок
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Master Class Selection */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-900 mb-4">
            Выберите мастер - класс
          </label>
          {isLoadingMasterclasses ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Загрузка мастер-классов...</p>
            </div>
          ) : masterclasses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Мастер-классы не найдены</p>
            </div>
          ) : (
            <div className="space-y-3">
              {masterclasses.map((masterclass) => (
                <button
                  key={masterclass.id}
                  className={`w-full p-4 rounded-xl text-left font-medium ${
                    selectedClass === masterclass.id.toString()
                      ? "bg-gray-300 text-gray-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() =>
                    handleMasterclassSelect(masterclass.id.toString())
                  }
                >
                  {masterclass.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Edit Options */}
        {selectedMasterclass && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Что вы хотите изменить?
            </h3>
            <div className="space-y-4">
              <button
                className={`text-left block font-medium underline ${
                  editMode === "price"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => handleEditModeChange("price")}
              >
                Изменить цену
              </button>
              <button
                className={`text-left block font-medium underline ${
                  editMode === "title"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => handleEditModeChange("title")}
              >
                Изменить название
              </button>
              <button
                className={`text-left block font-medium underline ${
                  editMode === "description"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => handleEditModeChange("description")}
              >
                Изменить описание
              </button>
              <button
                className={`text-left block font-medium underline ${
                  editMode === "image"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => handleEditModeChange("image")}
              >
                Изменить фото
              </button>
              <button
                className={`text-left block font-medium underline ${
                  editMode === "participant_limit"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => handleEditModeChange("participant_limit")}
              >
                Изменить лимит участников
              </button>

              <button
                className={`text-left block font-medium underline ${
                  editMode === "participant_limit"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => handleEditModeChange("slots")}
              >
                Управлять слотами времени
              </button>
              <button
                className={`text-left block font-medium underline ${
                  editMode === "all"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => handleEditModeChange("all")}
              >
                Изменить все поля
              </button>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {selectedMasterclass && editMode && (
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            {/* Title Edit */}
            {(editMode === "title" || editMode === "all") && (
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Название мастер класса *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Название мастер-класса"
                  required
                />
              </div>
            )}

            {/* Description Edit */}
            {(editMode === "description" || editMode === "all") && (
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Описание *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 h-32 resize-none"
                  placeholder="Введите описание мастер-класса"
                  required
                />
              </div>
            )}

            {/* Price Edit */}
            {(editMode === "price" || editMode === "all") && (
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Стоимость *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Стоимость в рублях"
                  required
                />
              </div>
            )}

            {/* Participant Limit Edit */}
            {(editMode === "participant_limit" || editMode === "all") && (
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Лимит участников *
                </label>
                <input
                  type="number"
                  name="participant_limit"
                  value={formData.participant_limit}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Максимальное количество участников"
                  required
                />
              </div>
            )}

            {/* Slots Edit */}
            {(editMode === "slots" || editMode === "all") && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Управление слотами времени
                </h3>

                {/* Existing Slots */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 mb-3">
                    Существующие слоты:
                  </h4>
                  {isLoadingSlots ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">
                        Загрузка слотов...
                      </p>
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">Слоты не найдены</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="space-y-2">
                        {slots.map((slot) => {
                          const startDate = new Date(slot.start);
                          const endDate = new Date(slot.end);
                          const isSelected =
                            selectedSlot && selectedSlot.id === slot.id;

                          return (
                            <div
                              key={slot.id}
                              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                              onClick={() => handleSlotSelect(slot)}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">
                                    {startDate.toLocaleDateString("ru-RU")} -{" "}
                                    {endDate.toLocaleDateString("ru-RU")}
                                  </p>
                                  <p className="text-sm text-gray-600 mb-1">
                                    {startDate.toLocaleTimeString("ru-RU", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {endDate.toLocaleTimeString("ru-RU", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                  {/* NEW: Display free places */}
                                  <p className="text-sm text-blue-600 font-medium">
                                    Свободных мест: {slot.free_places || 0}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSlotDelete(slot.id);
                                  }}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
                                  disabled={isLoading}
                                >
                                  Удалить
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Slot Edit/Create Form */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-md font-medium text-gray-700">
                    Создать новый слот
                  </h4>

                  <form onSubmit={handleSlotCreate} className="space-y-4">
                    {/* Start Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                          Дата начала *
                        </label>
                        <input
                          type="date"
                          name="start_date"
                          value={slotFormData.start_date}
                          onChange={handleSlotInputChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                          Время начала *
                        </label>
                        <input
                          type="time"
                          name="start_time"
                          value={slotFormData.start_time}
                          onChange={handleSlotInputChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                          required
                        />
                      </div>
                    </div>

                    {/* End Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                          Дата окончания *
                        </label>
                        <input
                          type="date"
                          name="end_date"
                          value={slotFormData.end_date}
                          onChange={handleSlotInputChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                          Время окончания *
                        </label>
                        <input
                          type="time"
                          name="end_time"
                          value={slotFormData.end_time}
                          onChange={handleSlotInputChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                          required
                        />
                      </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-6 py-2 rounded-lg font-medium text-sm ${
                          isLoading
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {isLoading ? "Сохранение..." : "Создать слот"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Image Edit */}
            {(editMode === "image" || editMode === "all") && (
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Загрузить новое фото
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-300 cursor-pointer bg-gray-50">
                  <input
                    type="file"
                    className="hidden"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    {selectedFile ? (
                      <div className="text-green-600">
                        <svg
                          className="mx-auto h-12 w-12 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="font-medium">
                          Новый файл: {selectedFile.name}
                        </span>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <svg
                          className="mx-auto h-12 w-12 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="font-medium">
                          Нажмите для загрузки нового фото
                        </span>
                      </div>
                    )}
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Оставьте пустым, если не хотите менять изображение
                </p>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-10 py-3 rounded-full font-medium text-lg shadow-md ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-[#64A0CE] hover:bg-[#6598c0] text-white"
                }`}
              >
                {isLoading ? "Сохранение..." : "Сохранить изменения"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Right Section - Product Card Preview */}
      <div className="w-80 p-8 flex items-start justify-center">
        <div className="w-72">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative">
              <div className="w-full h-56 bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center">
                {selectedMasterclass &&
                (formData.image || selectedMasterclass.image) ? (
                  <img
                    src={formData.image || selectedMasterclass.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-32 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-20 bg-gray-300 rounded mb-2"></div>
                      <div className="text-xs text-gray-500">
                        {selectedMasterclass
                          ? selectedMasterclass.title
                          : "Превью фото"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-blue-500 text-sm font-bold">ℹ</span>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-gray-600 font-medium mb-1">
                {selectedMasterclass ? formData.title : "Название"}
              </h3>
              <h4 className="text-gray-600 font-medium mb-4 text-sm">
                {selectedMasterclass
                  ? formData.description
                  : "Описание мастер-класса"}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Лимит:{" "}
                  {selectedMasterclass ? formData.participant_limit : "—"}
                </span>
                <span className="text-2xl font-bold text-gray-800">
                  {selectedMasterclass ? `${formData.price} ₽` : "0 ₽"}
                </span>
              </div>
            </div>
          </div>

          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
              <p>Token: {accessToken ? "Available" : "Not available"}</p>
              <p>CSRF: {csrfToken ? "Available" : "Not available"}</p>
              <p>
                Selected:{" "}
                {selectedMasterclass ? selectedMasterclass.id : "None"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMasterClassPage;
