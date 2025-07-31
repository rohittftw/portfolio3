import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "./button";
import { logoutAdmin } from "../../lib/api";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg";
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "outline",
  size = "default",
  className = "",
  showIcon = true,
  showText = true
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the admin session
    logoutAdmin();
    // Redirect to login page
    navigate("/admin/login", { replace: true });
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      size={size}
      className={`transition-colors duration-200 ${className}`}
      title="Logout"
    >
      {showIcon && <LogOut className="w-4 h-4" />}
      {showText && (showIcon ? <span className="ml-2">Logout</span> : "Logout")}
    </Button>
  );
};
