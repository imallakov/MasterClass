// admin/add-masterclass/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

// Add Master Class Page
const AddMasterClassPage = () => {
  const router = useRouter();
  const { makeAuthenticatedRequest, user, loading } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    participant_limit: "",
    participant_min_age: "",
    participant_max_age: "",
    start_date: "",
    start_time: "",
    // end_date: "",
    end_time: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!loading && (!user || !user.is_staff)) {
      router.push("/auth/sign-in");
    }
  }, [user, loading, router]);

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
      // For demo purposes, we'll create a temporary URL
      // In a real app, you'd upload this to your server first
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
    if (!formData.image) {
      setMessage({ type: "error", text: "Пожалуйста, загрузите фото" });
      return false;
    }

    if (
      !formData.participant_min_age ||
      parseInt(formData.participant_min_age) <= 0
    ) {
      setMessage({
        type: "error",
        text: "Пожалуйста, введите минимальный возраст участников",
      });
      return false;
    }

    if (
      !formData.participant_max_age ||
      parseInt(formData.participant_max_age) <= 0
    ) {
      setMessage({
        type: "error",
        text: "Пожалуйста, введите максимальный возраст участников",
      });
      return false;
    }

    if (
      parseInt(formData.participant_max_age) <
      parseInt(formData.participant_min_age)
    ) {
      setMessage({
        type: "error",
        text: "Максимальный возраст должен быть больше минимального",
      });
      return false;
    }

    // OPTIONAL DATE/TIME VALIDATION - Only validate if provided
    if (
      formData.start_date ||
      formData.start_time ||
      // formData.end_date ||
      formData.end_time
    ) {
      // If any date/time field is provided, all must be provided
      if (!formData.start_date) {
        setMessage({ type: "error", text: "Пожалуйста, выберите дату начала" });
        return false;
      }
      if (!formData.start_time) {
        setMessage({
          type: "error",
          text: "Пожалуйста, выберите время начала",
        });
        return false;
      }
      // if (!formData.end_date) {
      //   setMessage({
      //     type: "error",
      //     text: "Пожалуйста, выберите дату окончания",
      //   });
      //   return false;
      // }
      if (!formData.end_time) {
        setMessage({
          type: "error",
          text: "Пожалуйста, выберите время окончания",
        });
        return false;
      }

      // Validate that end time is after start time
      const startDateTime = new Date(
        `${formData.start_date}T${formData.start_time}`
      );
      const endDateTime = new Date(
        `${formData.start_date}T${formData.end_time}`
      );

      if (endDateTime <= startDateTime) {
        setMessage({
          type: "error",
          text: "Время окончания должно быть позже времени начала",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user || !user.is_staff) {
      setMessage({
        type: "error",
        text: "Не авторизован. Пожалуйста, войдите в систему.",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Create FormData with all masterclass data including the image file
      const formDataForSubmission = new FormData();
      formDataForSubmission.append("title", formData.title.trim());
      formDataForSubmission.append("description", formData.description.trim());
      formDataForSubmission.append(
        "price",
        parseFloat(formData.price).toFixed(1)
      );
      formDataForSubmission.append(
        "participant_limit",
        parseInt(formData.participant_limit)
      );

      formDataForSubmission.append(
        "participant_min_age",
        parseInt(formData.participant_min_age)
      );
      formDataForSubmission.append(
        "participant_max_age",
        parseInt(formData.participant_max_age)
      );

      // Add the actual file, not the blob URL
      if (selectedFile) {
        formDataForSubmission.append("image", selectedFile);
      }

      console.log("Submitting masterclass with FormData");
      console.log("Title:", formData.title.trim());
      console.log("Price:", parseFloat(formData.price).toFixed(2));
      console.log("Participant limit:", parseInt(formData.participant_limit));
      console.log("File:", selectedFile ? selectedFile.name : "No file");

      const masterclassResponse = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/`,
        {
          method: "POST",
          body: formDataForSubmission,
        }
      );

      if (!masterclassResponse.ok) {
        const errorText = await masterclassResponse.text();
        console.error("Masterclass creation error:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorText;
        } catch {
          errorMessage = errorText;
        }

        throw new Error(`Ошибка при создании мастер-класса: ${errorMessage}`);
      }

      const masterclassResult = await masterclassResponse.json();
      const masterclassId = masterclassResult.id;

      console.log("Masterclass created:", masterclassResult);

      // Only create slot if date/time information is provided
      const hasDateTimeInfo =
        formData.start_date &&
        formData.start_time &&
        // formData.end_date &&
        formData.end_time;

      if (hasDateTimeInfo) {
        // Create start and end datetime from form inputs
        const startDateTime = new Date(
          `${formData.start_date}T${formData.start_time}`
        );
        const endDateTime = new Date(
          `${formData.start_date}T${formData.end_time}`
        );

        const slotData = {
          masterclass: masterclassId,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
        };

        console.log("Creating slot with data:", slotData);

        try {
          const slotResponse = await makeAuthenticatedRequest(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/slots/`,
            {
              method: "POST",
              body: JSON.stringify(slotData),
            }
          );

          if (!slotResponse.ok) {
            const errorData = await slotResponse.text();
            console.warn("Slot creation failed:", errorData);
            setMessage({
              type: "success",
              text: `Мастер-класс "${masterclassResult.title}" создан, но не удалось создать слот. Создайте слот отдельно.`,
            });
          } else {
            const slotResult = await slotResponse.json();
            console.log("Slot created:", slotResult);
            setMessage({
              type: "success",
              text: `Мастер-класс "${masterclassResult.title}" и слот успешно созданы!`,
            });
          }
        } catch (slotError) {
          console.warn("Slot creation error:", slotError);
          setMessage({
            type: "success",
            text: `Мастер-класс "${masterclassResult.title}" создан, но не удалось создать слот.`,
          });
        }
      } else {
        // No date/time provided, just show success for masterclass creation
        setMessage({
          type: "success",
          text: `Мастер-класс "${masterclassResult.title}" успешно создан!`,
        });
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        image: "",
        participant_limit: "",
        participant_min_age: "",
        participant_max_age: "",
        start_date: "",
        start_time: "",
        // end_date: "",
        end_time: "",
      });
      setSelectedFile(null);

      // Reset file input
      const fileInput = document.getElementById("photo-upload");
      if (fileInput) fileInput.value = "";
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

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* Left Content */}
      <div className="flex-1 p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Добавить мастер - класс
          </h1>
          <button className="bg-pink-400 hover:bg-pink-500 text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-full font-medium text-sm whitespace-nowrap">
            Отключить блок
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-4 lg:mb-6 p-3 lg:p-4 rounded-lg text-sm lg:text-base ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form Section */}
        <div className="space-y-6">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-6 lg:mb-8"></h2>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            {/* Add Master Class Name */}
            <div>
              <label className="block text-gray-900 font-medium mb-2 lg:mb-3 text-sm lg:text-base">
                Название мастер класса *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 lg:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                placeholder="Название мастер-класса"
                required
              />
            </div>

            {/* Add Description */}
            <div>
              <label className="block text-gray-900 font-medium mb-2 lg:mb-3 text-sm lg:text-base">
                Описание *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 lg:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 resize-none"
                placeholder="Введите описание мастер-класса"
                required
              />
            </div>

            {/* Set Price */}
            <div>
              <label className="block text-gray-900 font-medium mb-2 lg:mb-3 text-sm lg:text-base">
                Стоимость *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full p-3 lg:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                placeholder="Стоимость в рублях"
                required
              />
            </div>

            {/* Participant Limit */}
            <div>
              <label className="block text-gray-900 font-medium mb-2 lg:mb-3 text-sm lg:text-base">
                Лимит участников *
              </label>
              <input
                type="number"
                name="participant_limit"
                value={formData.participant_limit}
                onChange={handleInputChange}
                min="1"
                className="w-full p-3 lg:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                placeholder="Максимальное количество участников"
                required
              />
            </div>

            {/* Start Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div>
                <label className="block text-gray-900 font-medium mb-2 lg:mb-3 text-sm lg:text-base">
                  Дата начала
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full p-3 lg:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  // required
                />
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-2 lg:mb-3 text-sm lg:text-base">
                  Время начала
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  className="w-full p-3 lg:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  // required
                />
              </div>
            </div>

            {/* End Date and Time */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div>
                <label className="block text-gray-900 font-medium mb-2 lg:mb-3 text-sm lg:text-base">
                  Дата окончания
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full p-3 lg:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  // required
                />
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-2 lg:mb-3 text-sm lg:text-base">
                  Время окончания
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  className="w-full p-3 lg:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  // required
                />
              </div>
            </div> */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div></div>
              <div>
                <label className="block text-gray-900 font-medium mb-2 lg:mb-3 text-sm lg:text-base">
                  Время окончания
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  className="w-full p-3 lg:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  // required
                />
              </div>
            </div>

            {/* Participant Age Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div>
                <label className="block text-gray-900 font-medium mb-2 lg:mb-3 text-sm lg:text-base">
                  Минимальный возраст *
                </label>
                <input
                  type="number"
                  name="participant_min_age"
                  value={formData.participant_min_age}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full p-3 lg:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Мин. возраст"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-2 lg:mb-3 text-sm lg:text-base">
                  Максимальный возраст *
                </label>
                <input
                  type="number"
                  name="participant_max_age"
                  value={formData.participant_max_age}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full p-3 lg:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Макс. возраст"
                  required
                />
              </div>
            </div>

            {/* Upload Photo */}
            <div>
              <label className="block text-gray-900 font-medium mb-2 lg:mb-3 text-sm lg:text-base">
                Загрузить фото *
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 lg:p-8 text-center hover:border-gray-300 cursor-pointer bg-gray-50">
                <input
                  type="file"
                  className="hidden"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
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
                        Файл загружен: {selectedFile.name}
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
                        Нажмите для загрузки фото
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-8 lg:mt-12">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-8 lg:px-10 py-2.5 lg:py-3 rounded-full font-medium text-base lg:text-lg shadow-md w-full sm:w-auto ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-[#64A0CE] hover:bg-[#6598c0] text-white"
                }`}
              >
                {isLoading ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Product Card Preview */}
      <div className="w-full lg:w-80 p-4 lg:p-8 flex items-start justify-center order-first lg:order-last">
        <div className="w-full max-w-72 mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative">
              <div className="w-full h-48 lg:h-56 bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-32 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-20 bg-gray-300 rounded mb-2"></div>
                      <div className="text-xs text-gray-500">Превью фото</div>
                    </div>
                  </div>
                )}
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-blue-500 text-sm font-bold">ℹ</span>
              </button>
            </div>
            <div className="p-4 lg:p-6">
              <h3 className="text-gray-600 font-medium mb-1">
                {formData.title || "Название"}
              </h3>
              <h4 className="text-gray-600 font-medium mb-4 text-sm">
                {formData.description || "Описание мастер-класса"}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Лимит: {formData.participant_limit || "—"}
                </span>
                <span className="text-2xl font-bold text-gray-800">
                  {formData.price ? `${formData.price} ₽` : "0 ₽"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMasterClassPage;
