"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const EditMasterClassPage = () => {
  const router = useRouter();
  const { makeAuthenticatedRequest, user, loading } = useAuth();
  const [masterclasses, setMasterclasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMasterclass, setSelectedMasterclass] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotFormData, setSlotFormData] = useState({
    start_date: "",
    start_time: "",
    // end_date: "",
    end_time: "",
  });
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    participant_limit: "",
    participant_min_age: "",
    participant_max_age: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMasterclasses, setIsLoadingMasterclasses] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editMode, setEditMode] = useState("");

  const fetchSlots = async (masterclassId) => {
    if (!masterclassId) return;

    setIsLoadingSlots(true);
    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/${masterclassId}`
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

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/sign-in");
    }
  }, [user, loading, router]);

  // Fetch masterclasses when user is available
  useEffect(() => {
    if (user) {
      fetchMasterclasses();
    }
  }, [user]);

  // Update form data when selected masterclass changes
  useEffect(() => {
    if (selectedMasterclass) {
      setFormData({
        title: selectedMasterclass.title || "",
        description: selectedMasterclass.description || "",
        price: selectedMasterclass.price || "",
        image: selectedMasterclass.image || "",
        participant_limit: selectedMasterclass.participant_limit || "",
        participant_min_age: selectedMasterclass.participant_min_age || "",
        participant_max_age: selectedMasterclass.participant_max_age || "",
      });
      setSelectedFile(null);
      setEditMode("");
    }
  }, [selectedMasterclass]);

  const fetchMasterclasses = async () => {
    setIsLoadingMasterclasses(true);
    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/`
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

    if (
      formData.participant_min_age &&
      parseInt(formData.participant_min_age) < 0
    ) {
      setMessage({
        type: "error",
        text: "Минимальный возраст не может быть отрицательным",
      });
      return false;
    }

    if (
      formData.participant_max_age &&
      parseInt(formData.participant_max_age) < 0
    ) {
      setMessage({
        type: "error",
        text: "Максимальный возраст не может быть отрицательным",
      });
      return false;
    }

    if (
      formData.participant_min_age &&
      formData.participant_max_age &&
      parseInt(formData.participant_min_age) >
        parseInt(formData.participant_max_age)
    ) {
      setMessage({
        type: "error",
        text: "Минимальный возраст не может быть больше максимального",
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

    if (!user) {
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

      // ADD AGE FIELDS TO FORM DATA
      if (formData.participant_min_age) {
        formDataForSubmission.append(
          "participant_min_age",
          parseInt(formData.participant_min_age)
        );
      }

      if (formData.participant_max_age) {
        formDataForSubmission.append(
          "participant_max_age",
          parseInt(formData.participant_max_age)
        );
      }

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

      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/${selectedMasterclass.id}/`,
        {
          method: "PATCH",
          body: formDataForSubmission,
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
    // if (!slotFormData.end_date) {
    //   setMessage({
    //     type: "error",
    //     text: "Пожалуйста, выберите дату окончания",
    //   });
    //   return false;
    // }
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
      `${slotFormData.start_date}T${slotFormData.end_time}`
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

  const handleSlotDelete = async (slotId) => {
    if (!confirm("Вы уверены, что хотите удалить этот слот?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/slots/${slotId}/`,
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
        // end_date: "",
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

    console.log("Button clicked, form submitted");
    console.log("Form data:", slotFormData);
    console.log("Selected masterclass:", selectedMasterclass);
    console.log("Validation result:", validateSlotForm());

    if (!validateSlotForm() || !selectedMasterclass) {
      console.log("Validation failed or no masterclass selected");
      return;
    }

    console.log("Starting API request...");
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const startDateTime = new Date(
        `${slotFormData.start_date}T${slotFormData.start_time}`
      );
      const endDateTime = new Date(
        `${slotFormData.start_date}T${slotFormData.end_time}`
      );

      // Add validation to ensure we have valid dates
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error("Некорректные дата или время");
      }

      const slotData = {
        masterclass: selectedMasterclass.id,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
      };

      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/masterclasses/slots/`,
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
        // end_date: "",
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
  if (loading) {
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
    <div className="flex flex-col lg:flex-row flex-1">
      {/* Left Content */}
      <div className="flex-1 p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Мастер - классы
          </h1>
          <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2.5 rounded-full font-medium text-sm w-full sm:w-auto">
            Отключить блок
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-4 lg:mb-6 p-3 lg:p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Master Class Selection */}
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
          ) : selectedClass ? (
            // Selected state - show as dropdown
            <select
              value={selectedClass}
              onChange={(e) => handleMasterclassSelect(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 font-medium text-gray-800"
            >
              {masterclasses.map((masterclass) => (
                <option key={masterclass.id} value={masterclass.id.toString()}>
                  {masterclass.title}
                </option>
              ))}
            </select>
          ) : (
            // Initial selection state
            <div className="space-y-3">
              {masterclasses.map((masterclass) => (
                <button
                  key={masterclass.id}
                  className="w-full p-4 rounded-xl text-left font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                  editMode === "slots"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => handleEditModeChange("slots")}
              >
                Управлять слотами времени
              </button>
              <button
                className={`text-left block font-medium underline ${
                  editMode === "age_limits"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => handleEditModeChange("age_limits")}
              >
                Изменить возрастные ограничения
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

                {/* Slot Create Form */}
                <div className="bg-gray-50 p-4 lg:p-6 rounded-lg">
                  <h4 className="text-md font-medium text-gray-700">
                    Создать новый слот
                  </h4>

                  <form onSubmit={handleSlotCreate} className="space-y-4">
                    {/* Start Date and Time */}
                    {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    </div> */}

                    {/* End Date and Time */}
                    {/* <div className="grid grid-cols-2 gap-4">
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
                    </div> */}

                    {/* Start Date and Time */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

                    {/* End Time Only */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div></div> {/* Empty div for grid alignment */}
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
                        // type="submit"
                        onClick={handleSlotCreate}
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

            {(editMode === "age_limits" || editMode === "all") && (
              <div>
                <label className="block text-gray-900 font-medium mb-3 text-base">
                  Возрастные ограничения
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                      Минимальный возраст
                    </label>
                    <input
                      type="number"
                      name="participant_min_age"
                      value={formData.participant_min_age}
                      onChange={handleInputChange}
                      min="0"
                      max="120"
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      placeholder="Мин. возраст"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                      Максимальный возраст
                    </label>
                    <input
                      type="number"
                      name="participant_max_age"
                      value={formData.participant_max_age}
                      onChange={handleInputChange}
                      min="0"
                      max="120"
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      placeholder="Макс. возраст"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Оставьте поля пустыми, если возрастных ограничений нет
                </p>
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
                className={`px-6 lg:px-10 py-2 lg:py-3 rounded-full font-medium text-base lg:text-lg shadow-md w-full sm:w-auto ${
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
      <div className="flex w-80 p-8 items-center md:items-start justify-center">
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
              <h4 className="text-gray-600 font-medium mb-4 text-sm whitespace-pre">
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

              {/* ADD AGE LIMITS DISPLAY */}
              {selectedMasterclass &&
                (formData.participant_min_age ||
                  formData.participant_max_age) && (
                  <div className="text-sm text-gray-500">
                    Возраст:{" "}
                    {formData.participant_min_age &&
                    formData.participant_max_age
                      ? `${formData.participant_min_age} - ${formData.participant_max_age} лет`
                      : formData.participant_min_age
                      ? `от ${formData.participant_min_age} лет`
                      : `до ${formData.participant_max_age} лет`}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMasterClassPage;
