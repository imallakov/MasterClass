// last one, that works well
// "use client";

// import { createContext, useContext, useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const refreshPromiseRef = useRef(null);
//   const refreshTimeoutRef = useRef(null);

//   useEffect(() => {
//     checkAuthStatus();
//     setupTokenRefreshScheduler();

//     return () => {
//       if (refreshTimeoutRef.current) {
//         clearTimeout(refreshTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Helper function to check if we're on the client side
//   const isClient = () => typeof window !== "undefined";

//   // Helper function to safely get from localStorage
//   const getFromStorage = (key) => {
//     if (!isClient()) return null;
//     try {
//       return localStorage.getItem(key);
//     } catch (error) {
//       console.error(`Error reading ${key} from localStorage:`, error);
//       return null;
//     }
//   };

//   // Helper function to safely set to localStorage
//   const setToStorage = (key, value) => {
//     if (!isClient()) return;
//     try {
//       localStorage.setItem(key, value);
//     } catch (error) {
//       console.error(`Error setting ${key} to localStorage:`, error);
//     }
//   };

//   // Helper function to safely remove from localStorage
//   const removeFromStorage = (key) => {
//     if (!isClient()) return;
//     try {
//       localStorage.removeItem(key);
//     } catch (error) {
//       console.error(`Error removing ${key} from localStorage:`, error);
//     }
//   };

//   // Helper function to decode JWT and get payload
//   const decodeToken = (token) => {
//     if (!token) return null;
//     try {
//       return JSON.parse(atob(token.split(".")[1]));
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return null;
//     }
//   };

//   // Helper function to check if token is expired
//   const isTokenExpired = (token) => {
//     const payload = decodeToken(token);
//     if (!payload) return true;

//     const currentTime = Date.now() / 1000;
//     return payload.exp < currentTime;
//   };

//   // Helper function to check if token expires within specified minutes
//   const isTokenExpiringSoon = (token, minutesBeforeExpiry = 5) => {
//     const payload = decodeToken(token);
//     if (!payload) return true;

//     const currentTime = Date.now() / 1000;
//     const timeBeforeExpiry = currentTime + minutesBeforeExpiry * 60;
//     return payload.exp < timeBeforeExpiry;
//   };

//   // Get time until token expires (in milliseconds)
//   const getTimeUntilExpiry = (token) => {
//     const payload = decodeToken(token);
//     if (!payload) return 0;

//     const currentTime = Date.now() / 1000;
//     const timeUntilExpiry = (payload.exp - currentTime) * 1000;
//     return Math.max(0, timeUntilExpiry);
//   };

//   // Setup intelligent token refresh scheduler
//   const setupTokenRefreshScheduler = () => {
//     const token = getFromStorage("access_token");
//     if (!token || isTokenExpired(token)) return;

//     const timeUntilExpiry = getTimeUntilExpiry(token);
//     // Schedule refresh 2 minutes before expiry, but at least 30 seconds from now
//     const refreshTime = Math.max(30000, timeUntilExpiry - 2 * 60 * 1000);

//     if (refreshTimeoutRef.current) {
//       clearTimeout(refreshTimeoutRef.current);
//     }

//     refreshTimeoutRef.current = setTimeout(() => {
//       console.log("⏰ Scheduled token refresh triggered");
//       refreshAccessToken().then(() => {
//         // Schedule next refresh after successful refresh
//         setupTokenRefreshScheduler();
//       });
//     }, refreshTime);

//     console.log(
//       `⏰ Token refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`
//     );
//   };

//   // Function to refresh access token using refresh token
//   const refreshAccessToken = async (retryCount = 0) => {
//     // Prevent multiple simultaneous refresh attempts
//     if (refreshPromiseRef.current) {
//       return refreshPromiseRef.current;
//     }

//     refreshPromiseRef.current = (async () => {
//       try {
//         console.log("🔄 Starting token refresh...");
//         const refreshToken = getFromStorage("refresh_token");

//         if (!refreshToken) {
//           throw new Error("No refresh token available");
//         }

//         // Check if refresh token is expired
//         if (isTokenExpired(refreshToken)) {
//           console.log("❌ Refresh token is expired");
//           throw new Error("Refresh token expired");
//         }

//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/refresh/`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               refresh: refreshToken,
//             }),
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           console.log("✅ Token refreshed successfully");

//           setToStorage("access_token", data.access);

//           // Update cookie as well
//           if (isClient()) {
//             document.cookie = `access_token=${data.access}; path=/; max-age=${
//               7 * 24 * 60 * 60
//             }`;
//           }

//           // If a new refresh token is provided, update it
//           if (data.refresh) {
//             setToStorage("refresh_token", data.refresh);
//           }

//           // Setup next refresh schedule
//           setupTokenRefreshScheduler();

//           return data.access;
//         } else {
//           const errorData = await response.text();
//           console.error("❌ Token refresh failed:", response.status, errorData);

//           // Retry once for server errors (5xx)
//           if (response.status >= 500 && retryCount === 0) {
//             console.log("🔄 Retrying token refresh due to server error...");
//             await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
//             return refreshAccessToken(1);
//           }

//           throw new Error(`Failed to refresh token: ${response.status}`);
//         }
//       } catch (error) {
//         console.error("❌ Token refresh error:", error);

//         // Only logout on specific errors, not network issues
//         if (
//           error.message.includes("Refresh token expired") ||
//           error.message.includes("No refresh token available") ||
//           (error.message.includes("Failed to refresh token") &&
//             error.message.includes("401"))
//         ) {
//           console.log("🚪 Logging out due to authentication failure");
//           clearAuthTokens();
//           setUser(null);
//           router.push("/auth/sign-in");
//         }

//         return null;
//       } finally {
//         refreshPromiseRef.current = null;
//       }
//     })();

//     return refreshPromiseRef.current;
//   };

//   // Function to make authenticated requests with automatic token refresh
//   const makeAuthenticatedRequest = async (url, options = {}) => {
//     let token = getFromStorage("access_token");

//     // Check if token exists and is not expired
//     if (!token || isTokenExpired(token)) {
//       console.log("🔄 Token missing or expired, refreshing...");
//       token = await refreshAccessToken();

//       if (!token) {
//         throw new Error("Failed to get valid access token");
//       }
//     }

//     // First attempt with current token
//     const requestOptions = {
//       ...options,
//       headers: {
//         ...options.headers,
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     };

//     let response = await fetch(url, requestOptions);

//     // If token is expired (401), try to refresh and retry once
//     if (response.status === 401) {
//       console.log("🔄 Received 401, attempting token refresh...");
//       const newToken = await refreshAccessToken();

//       if (newToken) {
//         // Retry the request with new token
//         requestOptions.headers.Authorization = `Bearer ${newToken}`;
//         response = await fetch(url, requestOptions);

//         if (response.status === 401) {
//           // If still 401 after refresh, authentication is invalid
//           console.error("❌ Still getting 401 after token refresh");
//           clearAuthTokens();
//           setUser(null);
//           router.push("/auth/sign-in");
//           throw new Error("Authentication failed after token refresh");
//         }
//       } else {
//         throw new Error("Failed to refresh token");
//       }
//     }

//     return response;
//   };

//   // Function to clear all authentication tokens
//   const clearAuthTokens = () => {
//     console.log("🧹 Clearing all auth tokens");
//     removeFromStorage("access_token");
//     removeFromStorage("refresh_token");
//     if (isClient()) {
//       document.cookie =
//         "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
//     }

//     // Clear scheduled refresh
//     if (refreshTimeoutRef.current) {
//       clearTimeout(refreshTimeoutRef.current);
//     }
//   };

//   const checkAuthStatus = async () => {
//     try {
//       console.log("🔍 Checking auth status...");
//       const token = getFromStorage("access_token");

//       if (!token) {
//         console.log("❌ No access token found");
//         setLoading(false);
//         return;
//       }

//       if (isTokenExpired(token)) {
//         console.log("🔄 Token expired, attempting refresh...");
//         const newToken = await refreshAccessToken();
//         if (!newToken) {
//           setLoading(false);
//           return;
//         }
//       }

//       // Try to fetch user data with automatic token refresh
//       const userResponse = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me/`
//       );

//       if (userResponse.ok) {
//         const userData = await userResponse.json();
//         console.log("✅ User authenticated successfully");
//         setUser(userData);
//       } else {
//         console.error("❌ Failed to fetch user data:", userResponse.status);
//         clearAuthTokens();
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("❌ Auth check failed:", error);
//       clearAuthTokens();
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to refresh user data
//   const refreshUserData = async () => {
//     try {
//       const userResponse = await makeAuthenticatedRequest(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me/`
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
//     console.log("✅ User logged in");
//     setUser(userData);
//     setToStorage("access_token", tokens.access);

//     // Also set as cookie for middleware
//     if (isClient()) {
//       document.cookie = `access_token=${tokens.access}; path=/; max-age=${
//         7 * 24 * 60 * 60
//       }`;
//     }

//     if (tokens.refresh) {
//       setToStorage("refresh_token", tokens.refresh);
//     }

//     // Setup token refresh scheduler after login
//     setupTokenRefreshScheduler();
//   };

//   const logout = () => {
//     console.log("👋 User logged out");
//     setUser(null);
//     clearAuthTokens();
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
//     refreshUserData,
//     makeAuthenticatedRequest,
//     refreshAccessToken,
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

// // Improved custom hook for route protection
// export function useRequireAuth(requiredRole = null) {
//   const { user, loading, isAuthenticated, isAdmin } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading) {
//       if (!isAuthenticated()) {
//         router.push("/auth/sign-in");
//         return;
//       }

//       if (requiredRole === "admin" && !isAdmin()) {
//         router.push("/unauthorized");
//         return;
//       }
//     }
//   }, [user, loading, requiredRole, router, isAuthenticated, isAdmin]);

//   return {
//     user,
//     loading,
//     isAuthenticated: isAuthenticated(),
//     isAdmin: isAdmin(),
//   };
// }

//implementation of new functions, but need to test
"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const refreshPromiseRef = useRef(null);
  const refreshTimeoutRef = useRef(null);

  useEffect(() => {
    checkAuthStatus();
    setupTokenRefreshScheduler();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
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

  // Helper function to decode JWT and get payload
  const decodeToken = (token) => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Helper function to check if token is expired
  const isTokenExpired = (token) => {
    const payload = decodeToken(token);
    if (!payload) return true;

    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  };

  // Helper function to check if token expires within specified minutes
  const isTokenExpiringSoon = (token, minutesBeforeExpiry = 5) => {
    const payload = decodeToken(token);
    if (!payload) return true;

    const currentTime = Date.now() / 1000;
    const timeBeforeExpiry = currentTime + minutesBeforeExpiry * 60;
    return payload.exp < timeBeforeExpiry;
  };

  // Get time until token expires (in milliseconds)
  const getTimeUntilExpiry = (token) => {
    const payload = decodeToken(token);
    if (!payload) return 0;

    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = (payload.exp - currentTime) * 1000;
    return Math.max(0, timeUntilExpiry);
  };

  // Setup intelligent token refresh scheduler
  const setupTokenRefreshScheduler = () => {
    const token = getFromStorage("access_token");
    if (!token || isTokenExpired(token)) return;

    const timeUntilExpiry = getTimeUntilExpiry(token);
    // Schedule refresh 2 minutes before expiry, but at least 30 seconds from now
    const refreshTime = Math.max(30000, timeUntilExpiry - 2 * 60 * 1000);

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      console.log("⏰ Scheduled token refresh triggered");
      refreshAccessToken().then(() => {
        // Schedule next refresh after successful refresh
        setupTokenRefreshScheduler();
      });
    }, refreshTime);

    console.log(
      `⏰ Token refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`
    );
  };

  // Function to refresh access token using refresh token

  // Helper function to get specific cookie value
  const getCookie = (name) => {
    if (!isClient()) return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
    return null;
  };

  // Function to refresh access token using refresh token
  const refreshAccessToken = async (retryCount = 0) => {
    // Prevent multiple simultaneous refresh attempts
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    refreshPromiseRef.current = (async () => {
      try {
        console.log("🔄 Starting token refresh...");

        // Debug: Check if refresh token cookie exists
        const refreshTokenFromCookie = getCookie("refreshToken");
        console.log(
          "🍪 Refresh token cookie:",
          refreshTokenFromCookie ? "Found" : "Not found"
        );

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/refresh/`,
          {
            method: "POST",
            credentials: "include", // This sends cookies automatically
            headers: {
              "Content-Type": "application/json",
            },
            // No body needed - refresh token comes from 'refreshToken' cookie
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Token refreshed successfully");

          setToStorage("access_token", data.access);

          // Update access token cookie as well (for middleware)
          if (isClient()) {
            document.cookie = `access_token=${data.access}; path=/; max-age=${
              7 * 24 * 60 * 60
            }`;
          }

          // Setup next refresh schedule
          setupTokenRefreshScheduler();

          return data.access;
        } else {
          const errorData = await response.text();
          console.error("❌ Token refresh failed:", response.status, errorData);

          // Retry once for server errors (5xx)
          if (response.status >= 500 && retryCount === 0) {
            console.log("🔄 Retrying token refresh due to server error...");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return refreshAccessToken(1);
          }

          throw new Error(`Failed to refresh token: ${response.status}`);
        }
      } catch (error) {
        console.error("❌ Token refresh error:", error);

        // Handle 401 refresh token errors - this means refresh token is invalid/expired
        if (
          error.message.includes("Failed to refresh token: 401") ||
          error.message.includes("Invalid refresh token")
        ) {
          console.log("🚪 Refresh token invalid/expired, logging out");
          await logout();
          return null;
        }

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
      credentials: "include",
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
          // If still 401 after refresh, authentication is invalid
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

    if (isClient()) {
      // Clear access token cookie
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Clear refresh token cookie (matching backend name)
      document.cookie =
        "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Clear CSRF token cookie
      document.cookie =
        "csrftoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    // Clear scheduled refresh
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
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

  // NEW: Password Reset - Request OTP
  const requestPasswordReset = async (email) => {
    try {
      console.log("🔐 Requesting password reset for:", email);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/password-reset/request/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Password reset OTP sent successfully");
        return { success: true, data };
      } else {
        console.error("❌ Password reset request failed:", data);
        return { success: false, error: data };
      }
    } catch (error) {
      console.error("❌ Password reset request error:", error);
      return {
        success: false,
        error: { message: "Network error occurred" },
      };
    }
  };

  // NEW: Password Reset - Validate OTP
  const validatePasswordResetOTP = async (email, otp) => {
    try {
      console.log("🔐 Validating password reset OTP for:", email);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/password-reset/validate/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Password reset OTP validated successfully");
        return { success: true, data };
      } else {
        console.error("❌ Password reset OTP validation failed:", data);
        return { success: false, error: data };
      }
    } catch (error) {
      console.error("❌ Password reset OTP validation error:", error);
      return {
        success: false,
        error: { message: "Network error occurred" },
      };
    }
  };

  // NEW: Password Reset - Confirm New Password
  const confirmPasswordReset = async (tempToken, password) => {
    try {
      console.log("🔐 Confirming password reset");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/password-reset/confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ temp_token: tempToken, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Password reset confirmed successfully");
        return { success: true, data };
      } else {
        console.error("❌ Password reset confirmation failed:", data);
        return { success: false, error: data };
      }
    } catch (error) {
      console.error("❌ Password reset confirmation error:", error);
      return {
        success: false,
        error: { message: "Network error occurred" },
      };
    }
  };

  // NEW: Email Verification - Request OTP
  const requestEmailVerification = async (email) => {
    try {
      console.log("📧 Requesting email verification for:", email);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/email-verify/request/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Email verification OTP sent successfully");
        return { success: true, data };
      } else {
        console.error("❌ Email verification request failed:", data);
        return { success: false, error: data };
      }
    } catch (error) {
      console.error("❌ Email verification request error:", error);
      return {
        success: false,
        error: { message: "Network error occurred" },
      };
    }
  };

  // NEW: Email Verification - Confirm OTP
  const confirmEmailVerification = async (email, otp) => {
    try {
      console.log("📧 Confirming email verification for:", email);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/email-verify/confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Email verification confirmed successfully");
        // Refresh user data to update verification status
        await refreshUserData();
        return { success: true, data };
      } else {
        console.error("❌ Email verification confirmation failed:", data);
        return { success: false, error: data };
      }
    } catch (error) {
      console.error("❌ Email verification confirmation error:", error);
      return {
        success: false,
        error: { message: "Network error occurred" },
      };
    }
  };

  // Updated login function - the backend sets the refreshToken cookie automatically
  const login = (userData, tokens) => {
    console.log("✅ User logged in");
    setUser(userData);
    setToStorage("access_token", tokens.access);

    // Set access token cookie for middleware
    if (isClient()) {
      document.cookie = `access_token=${tokens.access}; path=/; max-age=${
        7 * 24 * 60 * 60
      }`;

      // Debug: Check if refreshToken cookie was set by backend
      setTimeout(() => {
        const refreshTokenCookie = getCookie("refreshToken");
        console.log(
          "🍪 RefreshToken cookie after login:",
          refreshTokenCookie ? "Set" : "Not set"
        );

        if (!refreshTokenCookie) {
          console.warn(
            "⚠️ Warning: refreshToken cookie not found after login!"
          );
        }
      }, 100);
    }

    // Setup token refresh scheduler after login
    setupTokenRefreshScheduler();
  };

  // Updated logout function to call the correct backend endpoint
  const logout = async () => {
    console.log("👋 User logging out");

    // Call backend logout to clear refresh token cookie
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    }

    setUser(null);
    clearAuthTokens();
    router.push("/auth/sign-in");
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
    refreshAccessToken,
    // NEW: Password Reset Functions
    requestPasswordReset,
    validatePasswordResetOTP,
    confirmPasswordReset,
    // NEW: Email Verification Functions
    requestEmailVerification,
    confirmEmailVerification,
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
        router.push("/");
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
