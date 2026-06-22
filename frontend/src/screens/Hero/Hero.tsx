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
    linkedin: "https://linkedin.com/in/rohitdhawadkar",
    substack: "https://your-substack-url.substack.com",
     email: "mailto:rohit.dhawadkar@gmail.com"
  };

  // Experience - update with your actual roles
  const experience = [
    {
      role: "Research Intern",
      company: "ApTSi (Applied Technology Solutions, Inc.)",
      duration: "Jan 2026 - Present",
      description: "Conducted research on machine learning algorithms and software solutions, including data analysis, model development, and performance evaluation. Collaborated with teams to implement and optimize ML models using Python and modern ML frameworks, while documenting findings and presenting results."
    },
    ];

  // Education - update with your actual education
  const education = [
    {
      degree: "B.Tech in Computer Science",
      institution: "Jawaharlal Nehru Engineering College",
      duration: "2022 - 2026",
      description: "Relevant Coursework: Data Structures \& Algorithms, Database Management Systems, Object-Oriented Programming, Operating Systems, Computer Networks, Software Engineering, Machine Learning, Web Development"
    },

  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2ee]">
      {/* Use the separate Navbar component */}
      {/*<Navbar />*/}

      {/* Social Media Buttons - stacked vertically, top-right of page, beside profile pic */}
      <div className="fixed top-8 sm:top-12 right-4 sm:right-6 lg:right-8 flex flex-col gap-3 sm:gap-4 z-10">
        {/* GitHub */}
        <a
          href={socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 sm:w-12 sm:h-12 bg-[#6e6d6b] border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 shadow-lg group"
          title="GitHub"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black group-hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>

        {/* LeetCode */}
        <a
          href={socialLinks.leetcode}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 sm:w-12 sm:h-12 bg-[#6e6d6b] border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 shadow-lg group"
          title="LeetCode"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black group-hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"/>
            <path d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"/>
          </svg>
        </a>

        {/* X (Twitter) */}
        <a
          href={socialLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 sm:w-12 sm:h-12 bg-[#6e6d6b] border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 shadow-lg group"
          title="X (Twitter)"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black group-hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href={socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 sm:w-12 sm:h-12 bg-[#6e6d6b] border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 shadow-lg group"
          title="LinkedIn"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black group-hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        <a
          href={socialLinks.substack}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 sm:w-12 sm:h-12 bg-[#6e6d6b] border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 shadow-lg group"
          title="Substack"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-black group-hover:text-white transition-colors duration-200"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4 3h16v3H4V3zm0 5h16v2H4V8zm0 4h16v9l-8-4-8 4v-9z" />
          </svg>
        </a>
        <a
          href={socialLinks.email}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-[#6e6d6b] border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 shadow-lg group"
          title="Email"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-black group-hover:text-white transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </a>
      </div>

      {/* Hero Section - Mobile Optimized */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
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
          Hi, I'm Rohit
        </h1>

        {/* Description - Responsive text and spacing */}
        <p className="text-base sm:text-lg md:text-xl font-light [font-family:'Lexend_Deca',Helvetica] text-[#6e6d6b] mb-6 sm:mb-8 max-w-sm sm:max-w-xl md:max-w-2xl mx-auto leading-relaxed px-2 ">
           a Computer Science undergraduate from Jawaharlal Nehru Engineering College,Ch.Sambhajinagar (Aurangabad), with a strong passion for software development and problem-solving.
         I am currently building expertise in full-stack web development using the MERN stack (MongoDB, Express.js, React, Node.js), where I focus on creating scalable and efficient web applications. My hands-on experience includes developing projects like Pet Buddy, a comprehensive pet care platform with features including health record management, community forums, and real-time chat functionality, and TweetWatch, an AI-powered content moderation system that analyzes social media posts using natural language processing.
         Alongside web development, I am strengthening my foundation in Data Structures and Algorithms using C++, which helps me approach complex problems with analytical thinking and optimized solutions. I have solved over 170 problems on LeetCode and 100+ problems on GeeksforGeeks, demonstrating my commitment to continuous learning and technical growth.
         I have experience working with technologies including TypeScript, PostgreSQL, Redis, Docker, and machine learning frameworks like TensorFlow and Hugging Face. My projects showcase my ability to design normalized database schemas, implement secure authentication systems, optimize application performance, and integrate advanced features like machine learning recommendations and OCR pipelines.
         Feel free to reach out at rohit.dhawadkar@gmail.com or connect with me here on LinkedIn. I'm always open to discussing technology, collaboration opportunities, and learning from experienced professionals in the field.        </p>

        {/* Experience & Education - LinkedIn style stacked sections */}
        <div className="w-full max-w-2xl mx-auto mb-8 sm:mb-10 text-left">

          {/* Experience Section */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-4 sm:mb-5 pb-2 border-b-2 border-black">
              Experience
            </h2>
            <div className="flex flex-col gap-5 sm:gap-6">
              {experience.map((item, index) => (
                <div key={index} className="flex gap-4">
                  {/* Company icon placeholder - LinkedIn style square logo */}
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-md border-2 border-black bg-[#f4f2ee] flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m-4 6v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39]">
                      {item.role}
                    </h3>
                    <p className="text-sm sm:text-base font-medium [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39]">
                      {item.company}
                    </p>
                    <p className="text-xs sm:text-sm font-light [font-family:'Lexend_Deca',Helvetica] text-[#6e6d6b] mb-1">
                      {item.duration}
                    </p>
                    <p className="text-sm sm:text-base font-light [font-family:'Lexend_Deca',Helvetica] text-[#6e6d6b] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-4 sm:mb-5 pb-2 border-b-2 border-black">
              Education
            </h2>
            <div className="flex flex-col gap-5 sm:gap-6">
              {education.map((item, index) => (
                <div key={index} className="flex gap-4">
                  {/* Institution icon placeholder - LinkedIn style square logo */}
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-md border-2 border-black bg-[#f4f2ee] flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39]">
                      {item.degree}
                    </h3>
                    <p className="text-sm sm:text-base font-medium [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39]">
                      {item.institution}
                    </p>
                    <p className="text-xs sm:text-sm font-light [font-family:'Lexend_Deca',Helvetica] text-[#6e6d6b] mb-1">
                      {item.duration}
                    </p>
                    <p className="text-sm sm:text-base font-light [font-family:'Lexend_Deca',Helvetica] text-[#6e6d6b] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </main>

      {/* Footer - Responsive */}
      <Footer/>
    </div>
  );
};
