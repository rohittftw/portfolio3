import { adminAuth } from "../../lib/api";

interface UserProfileProps {
  showUsername?: boolean;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  showUsername = true,
  className = ""
}) => {
  const currentAdmin = adminAuth.getCurrentAdmin();

  if (!currentAdmin) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-8 h-8 bg-[#3b3a39] text-white rounded-full flex items-center justify-center text-sm font-medium">
        {currentAdmin.username.charAt(0).toUpperCase()}
      </div>
      {showUsername && (
        <span className="text-sm font-medium text-[#3b3a39]">
          {currentAdmin.username}
        </span>
      )}
    </div>
  );
};
