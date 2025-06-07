// components/ProtectedRoute.js
"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, requiredRole = null }) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null; // Will redirect to login
  }

  if (requiredRole === "admin" && !isAdmin()) {
    return null; // Will redirect to unauthorized
  }

  return children;
}
