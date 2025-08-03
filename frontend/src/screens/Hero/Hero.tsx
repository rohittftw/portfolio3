import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from '../../hooks/useAnalytics';
import { usePageTracking } from '../../hooks/usePageTracking';

// To adjust the profile picture's position, change the objectPosition value below.
// For example: 'center', 'top', 'bottom', 'left', 'right', 'center top', etc.
const PROFILE_PIC_OBJECT_POSITION = "top";
// To zoom in or out on the profile picture, change the scale value below (e.g., 1.2 for 120% zoom).
const PROFILE_PIC_SCALE = 1;

export const Hero = (): JSX.Element => {
  usePageTracking('home');

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2ee]">
      {/* Navbar - Responsive */}
      <nav className="w-full bg-white border-b border-[#dfdeda] py-3 sm:py-4 px-4 sm:px-8 flex items-center justify-between">
        <div className="text-xl sm:text-2xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39]">
          BackendDev
        </div>
        <div className="flex gap-3 sm:gap-6 text-sm sm:text-base">
          <a href="/" className="text-[#3b3a39] font-medium hover:underline">Home</a>
          <Link to="/projects" className="text-[#3b3a39] font-medium hover:underline">Projects</Link>
          <Link to="/blogs" className="text-[#3b3a39] font-medium hover:underline">Blogs</Link>
          <Link to="/resume" className="text-[#3b3a39] font-medium hover:underline">Resume</Link>
        </div>
      </nav>

      {/* Hero Section - Mobile Optimized */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-4">
        {/* Profile Picture - Responsive sizing */}
        <img
          src="/src/public/pfp.png"
          alt="Rohit's Profile"
          className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full border-4 border-black shadow mb-6 sm:mb-8 mt-8 sm:mt-12 object-cover"
          style={{
            objectPosition: PROFILE_PIC_OBJECT_POSITION === "top" ? 'center top' : PROFILE_PIC_OBJECT_POSITION,
            transform: `scale(${PROFILE_PIC_SCALE})`,
            transition: 'transform 0.3s, object-position 0.3s',
          }}
        />

        {/* Heading - Responsive text sizing */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-4 sm:mb-6 leading-tight px-2">
          Hi, I'm Rohit — Backend Developer
        </h1>

        {/* Description - Responsive text and spacing */}
        <p className="text-base sm:text-lg md:text-xl font-light [font-family:'Lexend_Deca',Helvetica] text-[#6e6d6b] mb-6 sm:mb-8 max-w-xs sm:max-w-lg md:max-w-2xl leading-relaxed px-2">
          I build robust, scalable, and efficient server-side applications. Passionate about APIs, databases, and cloud infrastructure. Let's create something amazing together!
        </p>

        {/* CTA Button - Touch-friendly sizing */}
        <a
          href="#contact"
          className="inline-block bg-[#3b3a39] text-white px-6 sm:px-8 py-3 sm:py-3 rounded-lg font-medium text-base sm:text-lg shadow hover:bg-[#232221] transition-colors duration-200 min-h-[48px] flex items-center justify-center"
        >
          Contact Me
        </a>
      </main>

      {/* Footer - Responsive */}
      <footer className="w-full bg-white border-t border-[#dfdeda] py-3 sm:py-4 px-4 sm:px-8 text-center text-[#6e6d6b] text-xs sm:text-sm">
        © {new Date().getFullYear()} Rohit — Backend Developer.
      </footer>
    </div>
  );
};
