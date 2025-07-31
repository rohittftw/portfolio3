import React from "react";
import { Navigate } from "react-router-dom";
import { adminAuth } from "../../lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = adminAuth.isLoggedIn();

  if (!isLoggedIn) {
    // Redirect to login page if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Higher-order component version
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => (
    <ProtectedRoute>
      <Component {...props} />
    </ProtectedRoute>
  );
};
