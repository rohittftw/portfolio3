import { Outlet, Link } from "react-router-dom";
import { LogoutButton } from "../../components/ui/LogoutButton";
import { UserProfile } from "../../components/ui/UserProfile";

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#f4f2ee]">
      <header className="bg-white border-b border-[#dfdeda] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39]">
              Admin Panel
            </div>
            <nav className="flex gap-6">
              <Link
                to="/admin"
                className="text-[#3b3a39] font-medium hover:underline transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/blogs"
                className="text-[#3b3a39] font-medium hover:underline transition-colors duration-200"
              >
                Blogs
              </Link>
              <Link
                to="/admin/projects"
                className="text-[#3b3a39] font-medium hover:underline transition-colors duration-200"
              >
                Projects
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <UserProfile />
            <LogoutButton
              variant="outline"
              size="sm"
              className="border-[#dfdeda] hover:bg-[#f4f2ee] text-[#3b3a39]"
            />
          </div>
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};
