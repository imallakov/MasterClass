// contexts/NavigationContext.js
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState("myClasses");
  const [selectedMasterclassId, setSelectedMasterclassId] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize page based on URL parameters or localStorage
  useEffect(() => {
    // Check URL parameters first
    const pageParam = searchParams.get("page");
    const masterclassParam = searchParams.get("masterclass");

    if (pageParam) {
      setCurrentPage(pageParam);
      if (masterclassParam) {
        setSelectedMasterclassId(parseInt(masterclassParam));
      }
    } else {
      // Check localStorage for last visited page (optional)
      const savedPage = localStorage.getItem("userAccountLastPage");
      if (
        savedPage &&
        ["profile", "booking", "myClasses"].includes(savedPage)
      ) {
        setCurrentPage(savedPage);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("userAccountLastPage", currentPage);
  }, [currentPage]);

  // Use useCallback to prevent unnecessary re-renders
  const navigateToBooking = useCallback(
    (masterclassId) => {
      console.log("Navigating to booking with masterclass ID:", masterclassId);
      setSelectedMasterclassId(masterclassId);
      setCurrentPage("booking");
      console.log("page sets: " + currentPage);

      // Update URL with parameters
      const params = new URLSearchParams();
      params.set("page", "booking");
      if (masterclassId) {
        params.set("masterclass", masterclassId.toString());
      }
      router.push(`/user-account?${params.toString()}`);
      console.log(`router pushes: /user-account?${params.toString()}`);
    },
    [router]
  );

  const navigateToProfile = useCallback(() => {
    console.log("Navigating to profile"); // Debug log
    setCurrentPage("profile");
    setSelectedMasterclassId(null);
    router.push("/user-account?page=profile");
  }, []);

  const navigateToMyClasses = useCallback(() => {
    console.log("Navigating to my classes"); // Debug log
    setCurrentPage("myClasses");
    setSelectedMasterclassId(null);
    router.push("/user-account?page=myClasses");
  }, []);

  const value = {
    currentPage,
    selectedMasterclassId,
    setSelectedMasterclassId, // <- This was missing!
    navigateToBooking,
    navigateToProfile,
    navigateToMyClasses,
    setCurrentPage,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// NavigationContext.js
// "use client";
// import { createContext, useContext, useCallback } from "react";
// import { useRouter } from "next/navigation";

// const NavigationContext = createContext();

// export const useNavigation = () => {
//   const context = useContext(NavigationContext);
//   if (!context) {
//     throw new Error("useNavigation must be used within a NavigationProvider");
//   }
//   return context;
// };

// export const NavigationProvider = ({ children }) => {
//   const router = useRouter();

//   const navigateToBooking = useCallback(
//     (masterclassId) => {
//       console.log("Navigating to booking with masterclass ID:", masterclassId);

//       // Update URL with parameters
//       const params = new URLSearchParams();
//       params.set("page", "booking");
//       if (masterclassId) {
//         params.set("masterclass", masterclassId.toString());
//       }

//       const url = `/user-account?${params.toString()}`;
//       console.log("Navigating to:", url);

//       router.push(url);
//     },
//     [router]
//   );

//   const value = {
//     navigateToBooking,
//     // other navigation functions...
//   };

//   return (
//     <NavigationContext.Provider value={value}>
//       {children}
//     </NavigationContext.Provider>
//   );
// };
