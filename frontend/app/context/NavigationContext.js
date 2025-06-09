// // contexts/NavigationContext.js
// "use client";
// import React, { createContext, useContext, useState } from "react";

// const NavigationContext = createContext();

// export const useNavigation = () => {
//   const context = useContext(NavigationContext);
//   if (!context) {
//     throw new Error("useNavigation must be used within a NavigationProvider");
//   }
//   return context;
// };

// export const NavigationProvider = ({ children }) => {
//   const [currentPage, setCurrentPage] = useState("profile");
//   const [selectedMasterclassId, setSelectedMasterclassId] = useState(null);

//   const navigateToBooking = (masterclassId) => {
//     setSelectedMasterclassId(masterclassId);
//     setCurrentPage("booking");
//   };

//   const navigateToProfile = () => {
//     setCurrentPage("profile");
//     setSelectedMasterclassId(null);
//   };

//   const navigateToMyClasses = () => {
//     setCurrentPage("myClasses");
//     setSelectedMasterclassId(null);
//   };

//   const value = {
//     currentPage,
//     selectedMasterclassId,
//     navigateToBooking,
//     navigateToProfile,
//     navigateToMyClasses,
//     setCurrentPage,
//   };

//   return (
//     <NavigationContext.Provider value={value}>
//       {children}
//     </NavigationContext.Provider>
//   );
// };

// contexts/NavigationContext.js
"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState("profile");
  const [selectedMasterclassId, setSelectedMasterclassId] = useState(null);
  const router = useRouter();

  // Use useCallback to prevent unnecessary re-renders
  const navigateToBooking = useCallback((masterclassId) => {
    console.log("Navigating to booking with masterclass ID:", masterclassId); // Debug log
    setSelectedMasterclassId(masterclassId);
    setCurrentPage("booking");
    router.push(`/user-account/`);
  }, []);

  const navigateToProfile = useCallback(() => {
    console.log("Navigating to profile"); // Debug log
    setCurrentPage("profile");
    setSelectedMasterclassId(null);
  }, []);

  const navigateToMyClasses = useCallback(() => {
    console.log("Navigating to my classes"); // Debug log
    setCurrentPage("myClasses");
    setSelectedMasterclassId(null);
  }, []);

  const value = {
    currentPage,
    selectedMasterclassId,
    navigateToBooking,
    navigateToProfile,
    navigateToMyClasses,
    setCurrentPage,
  };

  return (
    <NavigationContext.Provider value={value}>
      {" "}
      {children}{" "}
    </NavigationContext.Provider>
  );
};
