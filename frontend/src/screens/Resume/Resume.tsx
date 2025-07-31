import React from "react";
import { Link } from "react-router-dom";

export const Resume = (): JSX.Element => {
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
          <Link to="/resume" className="text-[#3b3a39] font-medium underline">Resume</Link>
        </div>
      </nav>

      {/* Resume Section - Mobile optimized */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-4 py-8 sm:py-12">
        {/* Page Title - Responsive */}
        <h1 className="text-3xl sm:text-4xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-6 sm:mb-8 text-center">
          My Resume
        </h1>

        {/* Resume Container - Responsive sizing */}
        <div className="w-full max-w-4xl">
          {/* Mobile: Stack buttons and viewer vertically */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
            {/* Download/View buttons - Mobile friendly */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <a
                href="/path-to-your-resume.pdf" // Replace with your actual resume PDF path
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#3b3a39] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base shadow hover:bg-[#232221] transition-colors min-h-[44px]"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </a>
              <a
                href="/path-to-your-resume.pdf" // Replace with your actual resume PDF path
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white text-[#3b3a39] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base border border-[#dfdeda] shadow hover:bg-[#f9f8f6] transition-colors min-h-[44px]"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View in New Tab
              </a>
            </div>

            {/* File info - Mobile responsive */}
            <div className="text-xs sm:text-sm text-[#6e6d6b] text-center sm:text-right">
              <p>Last updated: January 2025</p>
              <p className="hidden sm:block">PDF • 2 pages</p>
            </div>
          </div>

          {/* Resume Viewer - Responsive height and styling */}
          <div className="w-full bg-white border border-[#dfdeda] rounded-lg shadow-lg overflow-hidden">
            {/* Mobile: Shorter height, Desktop: Taller */}
            <div className="h-[500px] sm:h-[700px] lg:h-[800px] flex items-center justify-center bg-gray-50">
              {/* Placeholder content - Replace with actual PDF embed */}
              <div className="text-center p-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#3b3a39] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#3b3a39] mb-2">
                  Resume Preview
                </h3>
                <p className="text-sm sm:text-base text-[#6e6d6b] mb-4 max-w-md mx-auto leading-relaxed">
                  Your resume will be embedded here. You can use an iframe, PDF.js, or another PDF viewer.
                </p>
                <p className="text-xs sm:text-sm text-[#b0afad]">
                  Click the buttons above to download or view in full screen
                </p>
              </div>

              {/* Example of how to embed a PDF (uncomment and replace with your PDF URL) */}
              {/*
              <iframe
                src="/path-to-your-resume.pdf#toolbar=0&navpanes=0&scrollbar=0"
                className="w-full h-full border-0"
                title="Resume PDF"
              />
              */}
            </div>
          </div>

          {/* Mobile: Additional info section */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-[#6e6d6b] leading-relaxed">
              Having trouble viewing? Try downloading the PDF or opening in a new tab.
            </p>
          </div>
        </div>
      </main>

      {/* Footer - Responsive */}
      <footer className="w-full bg-white border-t border-[#dfdeda] py-3 sm:py-4 px-4 sm:px-8 text-center text-[#6e6d6b] text-xs sm:text-sm">
        © {new Date().getFullYear()} Rohit — Backend Developer.
      </footer>
    </div>
  );
};
