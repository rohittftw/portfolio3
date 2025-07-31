import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from "../../hooks/useAnalytics";
import { usePageTracking } from '../../hooks/usePageTracking';
import { getProjects, ProjectData } from "../../lib/api";

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ProjectApiResponse {
  projects?: ProjectData[]; // Made optional
  pagination: Pagination;
}

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" fill="#fff"/>
  </svg>
);

const GitLabIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M22.545 13.577l-2.07-6.37a1.01 1.01 0 0 0-1.92-.06l-1.47 4.51H6.915l-1.47-4.51a1.01 1.01 0 0 0-1.92.06l-2.07 6.37a1.01 1.01 0 0 0 .37 1.13l9.06 6.59a1.01 1.01 0 0 0 1.18 0l9.06-6.59a1.01 1.01 0 0 0 .37-1.13z" fill="#FC6D26"/>
      <path d="M12 21.297a1.01 1.01 0 0 1-.59-.19l-9.06-6.59a1.01 1.01 0 0 1-.37-1.13l2.07-6.37a1.01 1.01 0 0 1 1.92-.06l1.47 4.51h7.07l1.47-4.51a1.01 1.01 0 0 1 1.92.06l2.07 6.37a1.01 1.01 0 0 1-.37 1.13l-9.06 6.59a1.01 1.01 0 0 1-.59.19z" fill="#E24329"/>
      <path d="M12 21.297a1.01 1.01 0 0 1-.59-.19l-9.06-6.59a1.01 1.01 0 0 1-.37-1.13l2.07-6.37a1.01 1.01 0 0 1 1.92-.06l1.47 4.51h7.07l1.47-4.51a1.01 1.01 0 0 1 1.92.06l2.07 6.37a1.01 1.01 0 0 1-.37 1.13l-9.06 6.59a1.01 1.01 0 0 1-.59.19z" fill="#FCA326"/>
    </g>
  </svg>
);

const VercelIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 6l12 20H4L16 6z" fill="#fff"/>
  </svg>
);

export const Projects = (): JSX.Element => {
  const { trackPageView } = useAnalytics();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch projects from the API
  const fetchProjects = async (pageNum: number = 1) => {
    try {
      const data: ProjectApiResponse = await getProjects();

      if (data.projects) {
        setProjects(data.projects);
      } else {
        setError("No projects found.");
      }

      setPagination(data.pagination);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Could not load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    trackPageView('projects');
  }, [trackPageView]);

  useEffect(() => {
    fetchProjects(); // Default to page 1
  }, []);

  const goToPage = (page: number) => {
    if (page < 1 || page > (pagination?.totalPages || 1)) return; // Prevent invalid page

    setLoading(true);
    setError(null);

    // Call fetchProjects for the new page
    fetchProjects(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2ee]">
      {/* Navbar - Responsive */}
      <nav className="w-full bg-white border-b border-[#dfdeda] py-3 sm:py-4 px-4 sm:px-8 flex items-center justify-between">
        <div className="text-xl sm:text-2xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39]">
          BackendDev
        </div>
        <div className="flex gap-3 sm:gap-6 text-sm sm:text-base">
          <a href="/" className="text-[#3b3a39] font-medium hover:underline">Home</a>
          <a href="/projects" className="text-[#3b3a39] font-medium underline">Projects</a>
          <a href="/blogs" className="text-[#3b3a39] font-medium hover:underline">Blogs</a>
          <Link to="/resume" className="text-[#3b3a39] font-medium hover:underline">Resume</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-4 py-8 sm:py-12">
        {/* Page Title - Responsive */}
        <h1 className="text-3xl sm:text-4xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-6 sm:mb-8 text-center">
          Projects
        </h1>

        {/* Loading and Error States - Mobile friendly */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <p className="text-[#6e6d6b] text-sm sm:text-base">Loading projects...</p>
          </div>
        )}
        {error && (
          <div className="w-full max-w-2xl mb-6">
            <p className="text-red-600 text-center text-sm sm:text-base bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </p>
          </div>
        )}

        {/* Projects List - Responsive */}
        <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
          {projects.map((project) => (
            <section
              key={project.slug}
              className="bg-white rounded-xl p-4 sm:p-6 border border-[#dfdeda] shadow hover:shadow-lg transition-shadow flex flex-col gap-3 sm:gap-4 relative"
            >
              {/* Featured Image - Responsive sizing */}
              {project.featured_image && (
                <img
                  src={project.featured_image}
                  alt={project.title}
                  className="w-full h-40 sm:h-48 object-cover rounded-lg mb-2 sm:mb-4"
                />
              )}

              {/* Title - Responsive typography */}
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-[#3b3a39] leading-tight pr-20 sm:pr-24">
                {project.title}
              </h2>

              {/* Description - Responsive */}
              <p className="text-[#6e6d6b] mb-2 text-sm sm:text-base leading-relaxed pr-20 sm:pr-24">
                {project.description}
              </p>

              {/* Short Description - Mobile optimized */}
              {project.short_description && (
                <p className="text-xs sm:text-sm text-[#b0afad] leading-relaxed pr-20 sm:pr-24">
                  {project.short_description}
                </p>
              )}

              {/* Action Links - Mobile optimized positioning */}
              <div className="absolute right-3 sm:right-4 top-3 sm:top-4 flex gap-2">
                {/* GitHub link - Touch-friendly sizing */}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-9 sm:h-9 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-[#232221] transition-colors"
                    title="View on GitHub"
                  >
                    <GitHubIcon />
                  </a>
                )}

                {/* Live URL link - Touch-friendly sizing */}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-9 sm:h-9 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-[#232221] transition-colors"
                    title="View Live Project"
                  >
                    <VercelIcon />
                  </a>
                )}
              </div>

              {/* Mobile: Add bottom padding to prevent content overlap with action buttons */}
              <div className="h-2 sm:h-0"></div>
            </section>
          ))}
        </div>

        {/* Pagination - Mobile optimized */}
        {pagination && (
          <div className="w-full max-w-2xl mt-6 sm:mt-8 flex justify-center items-center gap-3 sm:gap-4 px-4">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => goToPage(pagination.currentPage - 1)}
              className="px-3 sm:px-4 py-2 bg-black text-white rounded-lg disabled:bg-[#e0e0e0] disabled:text-[#6e6d6b] hover:bg-[#232221] transition-colors text-sm sm:text-base min-h-[40px] sm:min-h-[44px]"
            >
              Prev
            </button>

            <span className="text-[#3b3a39] font-medium text-sm sm:text-base text-center min-w-[120px] sm:min-w-[140px]">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={!pagination.hasNext}
              onClick={() => goToPage(pagination.currentPage + 1)}
              className="px-3 sm:px-4 py-2 bg-black text-white rounded-lg disabled:bg-[#e0e0e0] disabled:text-[#6e6d6b] hover:bg-[#232221] transition-colors text-sm sm:text-base min-h-[40px] sm:min-h-[44px]"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Footer - Responsive */}
      <footer className="w-full bg-white border-t border-[#dfdeda] py-3 sm:py-4 px-4 sm:px-8 text-center text-[#6e6d6b] text-xs sm:text-sm">
        © {new Date().getFullYear()} Rohit — Backend Developer.
      </footer>
    </div>
  );
};
