import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export const NotFound = (): JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2ee]">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-[#dfdeda] py-4 px-8 flex items-center justify-between">
        <div className="text-2xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39]">BackendDev</div>
        <div className="flex gap-6">
          <Link to="/" className="text-[#3b3a39] font-medium hover:underline">Home</Link>
          <Link to="/projects" className="text-[#3b3a39] font-medium hover:underline">Projects</Link>
          <Link to="/blogs" className="text-[#3b3a39] font-medium hover:underline">Blogs</Link>
          <Link to="/resume" className="text-[#3b3a39] font-medium hover:underline">Resume</Link>
        </div>
      </nav>

      {/* 404 Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* Large 404 Number */}
        <div className="text-[12rem] font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] leading-none mb-4 opacity-20">
          404
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-4">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-lg font-light [font-family:'Lexend_Deca',Helvetica] text-[#6e6d6b] mb-12 max-w-md">
          Sorry, the page you're looking for doesn't exist or has been moved to a different location.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link to="/">
            <Button className="bg-[#3b3a39] hover:bg-[#2d2c2b] text-white px-8 py-3 rounded-lg [font-family:'Lexend_Deca',Helvetica] font-medium flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-[#dfdeda] text-[#3b3a39] hover:bg-[#f4f2ee] px-8 py-3 rounded-lg [font-family:'Lexend_Deca',Helvetica] font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-16 text-sm text-[#6e6d6b] [font-family:'Lexend_Deca',Helvetica]">
          Looking for something specific? Try visiting our{" "}
          <Link to="/projects" className="text-[#3b3a39] font-medium hover:underline">
            projects
          </Link>{" "}
          or{" "}
          <Link to="/blogs" className="text-[#3b3a39] font-medium hover:underline">
            blog posts
          </Link>
          .
        </div>
      </main>
    </div>
  );
};
