import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from '../../hooks/useAnalytics';
import { getBlogs, BlogData } from "../../lib/api";

// Interfaces for Pagination and Blog API Response
interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface BlogApiResponse {
  blogs: BlogData[];
  pagination: Pagination;
}

export const Blog = (): JSX.Element => {
  const { trackPageView } = useAnalytics();
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch blogs from the API
  const fetchBlogs = async (pageNum: number = 1) => {
    try {
      const data: BlogApiResponse = await getBlogs();
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setError("Could not load blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Tracking page view with analytics
  useEffect(() => {
    trackPageView('blog');
  }, [trackPageView]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchBlogs(); // Default to page 1
  }, []);

  // Function to handle page navigation
  const goToPage = (page: number) => {
    if (page < 1 || page > (pagination?.totalPages || 1)) return; // Prevent invalid page

    setLoading(true);
    setError(null);

    // Call fetchBlogs for the new page
    fetchBlogs(page);
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
          <Link to="/projects" className="text-[#3b3a39] font-medium hover:underline">Projects</Link>
          <Link to="/blogs" className="text-[#3b3a39] font-medium hover:underline">Blogs</Link>
          <Link to="/resume" className="text-[#3b3a39] font-medium hover:underline">Resume</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-4 py-8 sm:py-12">
        {/* Page Title - Responsive */}
        <h1 className="text-3xl sm:text-4xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-6 sm:mb-8 text-center">
          Blog
        </h1>

        {/* Loading and Error States - Mobile friendly */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <p className="text-[#6e6d6b] text-sm sm:text-base">Loading blogs...</p>
          </div>
        )}
        {error && (
          <div className="w-full max-w-4xl mb-6">
            <p className="text-red-600 text-center text-sm sm:text-base bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </p>
          </div>
        )}

        {/* Blog List - Responsive layout */}
        <div className="w-full max-w-4xl space-y-6 sm:space-y-8">
          {blogs.map(blog => (
            <article
              key={blog.id}
              className="bg-white rounded-xl p-4 sm:p-6 border border-[#dfdeda] shadow hover:shadow-lg transition-shadow"
            >
              {/* Mobile: Stack vertically, Desktop: Side by side */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Featured Image - Responsive sizing */}
                {blog.featured_image && (
                  <div className="flex-shrink-0 w-full sm:w-48">
                    <img
                      src={blog.featured_image}
                      alt={blog.title}
                      className="w-full h-48 sm:w-48 sm:h-32 object-cover rounded-lg border border-[#dfdeda]"
                    />
                  </div>
                )}

                {/* Content - Responsive typography */}
                <div className="flex-1 flex flex-col">
                  <Link to={`/blog/${blog.slug}`}>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-[#3b3a39] hover:text-[#232221] cursor-pointer transition-colors leading-tight">
                      {blog.title}
                    </h2>
                  </Link>

                  <p className="text-[#6e6d6b] mb-4 flex-1 leading-relaxed text-sm sm:text-base line-clamp-3 sm:line-clamp-none">
                    {blog.excerpt}
                  </p>

                  {/* Meta info - Mobile optimized */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <span className="text-xs sm:text-sm text-[#b0afad] order-2 sm:order-1">
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ''}
                    </span>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="text-sm sm:text-sm text-[#3b3a39] font-medium hover:underline transition-all self-start sm:self-auto order-1 sm:order-2"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination - Mobile optimized */}
        {pagination && (
          <div className="w-full max-w-4xl mt-6 sm:mt-8 flex justify-center items-center gap-3 sm:gap-4 px-4">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => goToPage(pagination.currentPage - 1)}
              className="px-3 sm:px-4 py-2 bg-black text-white rounded-lg  transition-colors text-sm sm:text-base min-h-[40px] sm:min-h-[44px]"
            >
              Prev
            </button>

            <span className="text-[#3b3a39] font-medium text-sm sm:text-base text-center min-w-[120px] sm:min-w-[140px]">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={!pagination.hasNext}
              onClick={() => goToPage(pagination.currentPage + 1)}
              className="px-3 sm:px-4 py-2 bg-black text-white rounded-lg transition-colors text-sm sm:text-base min-h-[40px] sm:min-h-[44px]"
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
