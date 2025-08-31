import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-[#dfdeda] py-3 sm:py-4 px-4 sm:px-8 flex items-center justify-center">
      {/* Navigation Links - Always centered, increased text size */}
      <div className="flex gap-4 sm:gap-8 text-base sm:text-lg">
        <a href="/" className="text-[#3b3a39] font-medium hover:underline">Home</a>
        <Link to="/projects" className="text-[#3b3a39] font-medium hover:underline">Projects</Link>
        <Link to="/blogs" className="text-[#3b3a39] font-medium hover:underline">Blogs</Link>
        <Link to="/resume" className="text-[#3b3a39] font-medium hover:underline">Resume</Link>
      </div>
    </nav>
  );
};
