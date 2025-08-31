import React, { useEffect } from "react";
import { useAnalytics } from '../../hooks/useAnalytics';
import { usePageTracking } from '../../hooks/usePageTracking';
import { Navbar } from '../../components/ui/Navbar'; // Import the separate Navbar component
import pfp from "../../public/pfp.png";
import { Footer } from "../../components/ui/Footer";

// To adjust the profile picture's position, change the objectPosition value below.
// For example: 'center', 'top', 'bottom', 'left', 'right', 'center top', etc.
const PROFILE_PIC_OBJECT_POSITION = "top";
// To zoom in or out on the profile picture, change the scale value below (e.g., 1.2 for 120% zoom).
const PROFILE_PIC_SCALE = 1;

export const Hero = (): JSX.Element => {
  usePageTracking('home');

  // Social media links - update these with your actual URLs
  const socialLinks = {
    github: "https://github.com/rohittftw",
    leetcode: "https://leetcode.com/rohittftw",
    twitter: "https://x.com/rohitttftw",
    linkedin: "https://linkedin.com/in/rohitdhawadkar"
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2ee]">
      {/* Use the separate Navbar component */}
      <Navbar />

      {/* Hero Section - Mobile Optimized */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-4">
        {/* Profile Picture - Responsive sizing */}
        <img
        src={pfp}
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

        {/* Social Media Buttons - Black & White */}
        <div className="flex gap-4 sm:gap-6">
          {/* GitHub */}
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 sm:w-14 sm:h-14 bg-#6e6d6b border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 shadow-lg group"
            title="GitHub"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black group-hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>

          {/* LeetCode */}
          <a
            href={socialLinks.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 sm:w-14 sm:h-14 bg-#6e6d6b border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 shadow-lg group"
            title="LeetCode"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black group-hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"/>
              <path d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"/>
            </svg>
          </a>

          {/* X (Twitter) */}
          <a
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 sm:w-14 sm:h-14 bg-#6e6d6b border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 shadow-lg group"
            title="X (Twitter)"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black group-hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 sm:w-14 sm:h-14 bg-#6e6d6b border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 shadow-lg group"
            title="LinkedIn"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black group-hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </main>

      {/* Footer - Responsive */}
      <Footer/>
    </div>
  );
};
