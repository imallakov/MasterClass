// components/UserRoute.js
"use client";

import ProtectedRoute from "./ProtectedRoute";

export default function UserRoute({ children }) {
  return <ProtectedRoute requireAdmin={false}>{children}</ProtectedRoute>;
}
