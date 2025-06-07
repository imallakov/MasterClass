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

//       // Verify token with your backend
//       const response = await fetch("http://localhost:8000/api/users/verify/", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           token,
//         }),
//       });

//       if (response.ok) {
//         const userData = await response.json();
//         setUser(userData);
//       } else {
//         // Token is invalid, remove it
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//       }
//     } catch (error) {
//       console.error("Auth check failed:", error);
//     } finally {
//       setLoading(false);
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

// contexts/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      // First verify token (this should only verify, not return user data)
      const verifyResponse = await fetch(
        "http://localhost:8000/api/users/verify/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
          }),
        }
      );

      if (verifyResponse.ok) {
        // Token is valid, now fetch user data
        const userResponse = await fetch(
          "http://localhost:8000/api/users/me/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        } else {
          // Failed to fetch user data
          console.error("Failed to fetch user data");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // On error, clear tokens
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh user data
  const refreshUserData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const userResponse = await fetch("http://localhost:8000/api/users/me/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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
    setUser(userData);
    localStorage.setItem("access_token", tokens.access);

    // Also set as cookie for middleware
    document.cookie = `access_token=${tokens.access}; path=/; max-age=${
      7 * 24 * 60 * 60
    }`; // 7 days

    if (tokens.refresh) {
      localStorage.setItem("refresh_token", tokens.refresh);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // Clear cookie as well
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
    refreshUserData, // New function to refresh user data
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

// Custom hook for route protection
export function useRequireAuth(requiredRole = null) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        router.push("/auth/sign-in");
        return;
      }
      console.log("user", user);
      console.log("requiredRole", requiredRole);
      console.log("isAdmin", isAdmin());
      if (requiredRole === "admin" && !isAdmin()) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [user, loading, requiredRole, router]);

  return {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
  };
}
