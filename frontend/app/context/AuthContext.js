// // contexts/AuthContext.js
// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       // First verify token (this should only verify, not return user data)
//       const verifyResponse = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/verify/`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             token,
//           }),
//         }
//       );

//       if (verifyResponse.ok) {
//         // Token is valid, now fetch user data
//         const userResponse = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me/`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (userResponse.ok) {
//           const userData = await userResponse.json();
//           setUser(userData);
//         } else {
//           // Failed to fetch user data
//           console.error("Failed to fetch user data");
//           localStorage.removeItem("access_token");
//           localStorage.removeItem("refresh_token");
//         }
//       } else {
//         // Token is invalid, remove it
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//       }
//     } catch (error) {
//       console.error("Auth check failed:", error);
//       // On error, clear tokens
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to refresh user data
//   const refreshUserData = async () => {
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) return;

//       const userResponse = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me/`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (userResponse.ok) {
//         const userData = await userResponse.json();
//         setUser(userData);
//         return userData;
//       } else {
//         console.error("Failed to refresh user data");
//         return null;
//       }
//     } catch (error) {
//       console.error("Failed to refresh user data:", error);
//       return null;
//     }
//   };

//   const login = (userData, tokens) => {
//     setUser(userData);
//     localStorage.setItem("access_token", tokens.access);

//     // Also set as cookie for middleware
//     document.cookie = `access_token=${tokens.access}; path=/; max-age=${
//       7 * 24 * 60 * 60
//     }`; // 7 days

//     if (tokens.refresh) {
//       localStorage.setItem("refresh_token", tokens.refresh);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     // Clear cookie as well
//     document.cookie =
//       "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
//     router.push("/");
//   };

//   const isAdmin = () => {
//     return user?.is_staff === true;
//   };

//   const isAuthenticated = () => {
//     return !!user;
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     isAdmin,
//     isAuthenticated,
//     checkAuthStatus,
//     refreshUserData, // New function to refresh user data
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }

// // Custom hook for route protection
// export function useRequireAuth(requiredRole = null) {
//   const { user, loading, isAuthenticated, isAdmin } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading) {
//       if (!isAuthenticated()) {
//         router.push("/auth/sign-in");
//         return;
//       }
//       console.log("user", user);
//       console.log("requiredRole", requiredRole);
//       console.log("isAdmin", isAdmin());
//       if (requiredRole === "admin" && !isAdmin()) {
//         router.push("/unauthorized");
//         return;
//       }
//     }
//   }, [user, loading, requiredRole, router]);

//   return {
//     user,
//     loading,
//     isAuthenticated: isAuthenticated(),
//     isAdmin: isAdmin(),
//   };
// }
"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const refreshPromiseRef = useRef(null); // Prevent multiple simultaneous refresh attempts

  useEffect(() => {
    checkAuthStatus();

    // Set up automatic token refresh check every 5 minutes
    const interval = setInterval(() => {
      const token = getFromStorage("access_token");
      if (token && isTokenExpiringSoon(token)) {
        console.log("🔄 Token expiring soon, refreshing...");
        refreshAccessToken();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Helper function to check if we're on the client side
  const isClient = () => typeof window !== "undefined";

  // Helper function to safely get from localStorage
  const getFromStorage = (key) => {
    if (!isClient()) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  };

  // Helper function to safely set to localStorage
  const setToStorage = (key, value) => {
    if (!isClient()) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting ${key} to localStorage:`, error);
    }
  };

  // Helper function to safely remove from localStorage
  const removeFromStorage = (key) => {
    if (!isClient()) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  };

  // Helper function to decode JWT and check expiration
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  // Helper function to check if token expires within next 5 minutes
  const isTokenExpiringSoon = (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      const fiveMinutesFromNow = currentTime + 5 * 60; // 5 minutes in seconds
      return payload.exp < fiveMinutesFromNow;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  };

  // Function to refresh access token using refresh token
  const refreshAccessToken = async () => {
    // Prevent multiple simultaneous refresh attempts
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    refreshPromiseRef.current = (async () => {
      try {
        console.log("🔄 Starting token refresh...");
        const refreshToken = getFromStorage("refresh_token");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/refresh/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refresh: refreshToken,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Token refreshed successfully");

          setToStorage("access_token", data.access);

          // Update cookie as well
          if (isClient()) {
            document.cookie = `access_token=${data.access}; path=/; max-age=${
              7 * 24 * 60 * 60
            }`;
          }

          // If a new refresh token is provided, update it
          if (data.refresh) {
            setToStorage("refresh_token", data.refresh);
          }

          return data.access;
        } else {
          const errorData = await response.text();
          console.error("❌ Token refresh failed:", response.status, errorData);
          throw new Error(`Failed to refresh token: ${response.status}`);
        }
      } catch (error) {
        console.error("❌ Token refresh error:", error);
        // If refresh fails, clear all tokens and redirect to login
        clearAuthTokens();
        setUser(null);
        router.push("/auth/sign-in");
        return null;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  };

  // Function to make authenticated requests with automatic token refresh
  const makeAuthenticatedRequest = async (url, options = {}) => {
    let token = getFromStorage("access_token");

    // Check if token exists and is not expired
    if (!token || isTokenExpired(token)) {
      console.log("🔄 Token missing or expired, refreshing...");
      token = await refreshAccessToken();

      if (!token) {
        throw new Error("Failed to get valid access token");
      }
    }

    // First attempt with current token
    const requestOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    let response = await fetch(url, requestOptions);

    // If token is expired (401), try to refresh and retry once
    if (response.status === 401) {
      console.log("🔄 Received 401, attempting token refresh...");
      const newToken = await refreshAccessToken();

      if (newToken) {
        // Retry the request with new token
        requestOptions.headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, requestOptions);

        if (response.status === 401) {
          // If still 401 after refresh, something is wrong
          console.error("❌ Still getting 401 after token refresh");
          clearAuthTokens();
          setUser(null);
          router.push("/auth/sign-in");
          throw new Error("Authentication failed after token refresh");
        }
      } else {
        throw new Error("Failed to refresh token");
      }
    }

    return response;
  };

  // Function to clear all authentication tokens
  const clearAuthTokens = () => {
    console.log("🧹 Clearing all auth tokens");
    removeFromStorage("access_token");
    removeFromStorage("refresh_token");
    if (isClient()) {
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  };

  const checkAuthStatus = async () => {
    try {
      console.log("🔍 Checking auth status...");
      const token = getFromStorage("access_token");

      if (!token) {
        console.log("❌ No access token found");
        setLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        console.log("🔄 Token expired, attempting refresh...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          setLoading(false);
          return;
        }
      }

      // Try to fetch user data with automatic token refresh
      const userResponse = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me/`
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log("✅ User authenticated successfully");
        setUser(userData);
      } else {
        console.error("❌ Failed to fetch user data:", userResponse.status);
        clearAuthTokens();
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Auth check failed:", error);
      clearAuthTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh user data
  const refreshUserData = async () => {
    try {
      const userResponse = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me/`
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        return userData;
      } else {
        console.error("Failed to refresh user data");
        return null;
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      return null;
    }
  };

  const login = (userData, tokens) => {
    console.log("✅ User logged in");
    setUser(userData);
    setToStorage("access_token", tokens.access);

    // Also set as cookie for middleware
    if (isClient()) {
      document.cookie = `access_token=${tokens.access}; path=/; max-age=${
        7 * 24 * 60 * 60
      }`;
    }

    if (tokens.refresh) {
      setToStorage("refresh_token", tokens.refresh);
    }
  };

  const logout = () => {
    console.log("👋 User logged out");
    setUser(null);
    clearAuthTokens();
    router.push("/");
  };

  const isAdmin = () => {
    return user?.is_staff === true;
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    checkAuthStatus,
    refreshUserData,
    makeAuthenticatedRequest,
    refreshAccessToken, // Expose this if you need manual refresh
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Improved custom hook for route protection
export function useRequireAuth(requiredRole = null) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        router.push("/auth/sign-in");
        return;
      }

      if (requiredRole === "admin" && !isAdmin()) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [user, loading, requiredRole, router, isAuthenticated, isAdmin]);

  return {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
  };
}
