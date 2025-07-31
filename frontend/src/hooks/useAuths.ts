import { useState, useEffect } from "react";
import { adminAuth, AdminUser } from "../lib/api";

export const useAuth = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session on mount
    const currentAdmin = adminAuth.getCurrentAdmin();
    setAdmin(currentAdmin);
    setIsLoading(false);
  }, []);

  const login = (adminData: AdminUser) => {
    adminAuth.setAdmin(adminData);
    setAdmin(adminData);
  };

  const logout = () => {
    adminAuth.clearAdmin();
    setAdmin(null);
  };

  const isLoggedIn = (): boolean => {
    return admin !== null;
  };

  return {
    admin,
    isLoading,
    isLoggedIn: isLoggedIn(),
    login,
    logout,
  };
};
