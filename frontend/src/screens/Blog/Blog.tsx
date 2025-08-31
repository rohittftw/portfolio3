import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from '../../hooks/useAnalytics';
import { getPublishedBlogs, BlogData } from "../../lib/api";
import { Navbar } from '../../components/ui/Navbar';

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
      setLoading(true);
      setError(null);
      const data: BlogApiResponse = await getPublishedBlogs(pageNum, 10);
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
    fetchBlogs(page);
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2ee]">
      <Navbar />

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header with subtle animation */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-4">
            Blog
          </h1>
          <div className="w-20 h-1 bg-[#3b3a39] mx-auto rounded-full"></div>
          <p className="text-[#6e6d6b] text-lg sm:text-xl mt-4 max-w-2xl mx-auto [font-family:'Lexend_Deca',Helvetica] font-light">
            Thoughts, tutorials, and insights about backend development
          </p>
        </div>

        {/* Loading State with better animation */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#dfdeda] border-t-[#3b3a39]"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#3b3a39] animate-pulse"></div>
            </div>
            <p className="text-[#6e6d6b] text-base mt-4 [font-family:'Lexend_Deca',Helvetica]">Loading amazing content...</p>
          </div>
        )}

        {/* Enhanced Error State */}
        {error && (
          <div className="w-full max-w-4xl mb-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700 font-medium [font-family:'Lexend_Deca',Helvetica]">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Blog Cards Grid */}
        {!loading && !error && (
          <div className="w-full max-w-6xl">
            {blogs.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-6">
                  <svg className="mx-auto h-16 w-16 text-[#dfdeda]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#3b3a39] mb-2 [font-family:'Lexend_Deca',Helvetica]">No blog posts yet</h3>
                <p className="text-[#6e6d6b] [font-family:'Lexend_Deca',Helvetica]">Check back later for new content!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 sm:gap-8">
                {blogs.map((blog, index) => (
                  <article
                    key={blog.blog_id}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#dfdeda] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full max-w-2xl"
                  >
                    {/* Featured Image with overlay effect */}
                    {blog.featured_image && (
                      <div className="relative overflow-hidden h-48 sm:h-56">
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.parentElement?.classList.add('hidden');
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-6 sm:p-8">
                      {/* Tags - Improved styling */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-[#3b3a39] text-white px-3 py-1 rounded-full text-xs font-medium tracking-wide"
                            >
                              {tag}
                            </span>
                          ))}
                          {blog.tags.length > 2 && (
                            <span className="text-[#b0afad] text-xs self-center font-medium">
                              +{blog.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Title with better typography */}
                      <Link to={`/blog/${blog.slug}`}>
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#3b3a39] group-hover:text-[#232221] transition-colors leading-tight [font-family:'Lexend_Deca',Helvetica] line-clamp-2">
                          {blog.title}
                        </h2>
                      </Link>

                      {/* Excerpt with better spacing */}
                      {blog.excerpt && (
                        <p className="text-[#6e6d6b] mb-6 leading-relaxed text-sm sm:text-base [font-family:'Lexend_Deca',Helvetica] font-light line-clamp-3">
                          {blog.excerpt}
                        </p>
                      )}

                      {/* Meta info and Read More - Enhanced design */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#f4f2ee]">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-[#b0afad] [font-family:'Lexend_Deca',Helvetica]">
                            <span className="font-medium">By {blog.author}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#b0afad] [font-family:'Lexend_Deca',Helvetica]">
                            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                            {blog.read_time && (
                              <>
                                <span>•</span>
                                <span>{blog.read_time} min read</span>
                              </>
                            )}
                          </div>
                        </div>

                        <Link
                          to={`/blog/${blog.slug}`}
                          className="inline-flex items-center gap-2 bg-[#3b3a39] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#232221] transition-all duration-200 [font-family:'Lexend_Deca',Helvetica] group-hover:translate-x-1"
                        >
                          Read More
                          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enhanced Pagination */}
        {pagination && pagination.totalPages > 1 && !loading && (
          <div className="w-full max-w-4xl mt-12 flex justify-center items-center gap-4 px-4">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => goToPage(pagination.currentPage - 1)}
              className={`group flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 text-sm font-medium [font-family:'Lexend_Deca',Helvetica] ${
                pagination.hasPrev
                  ? 'bg-white text-[#3b3a39] border-2 border-[#3b3a39] hover:bg-[#3b3a39] hover:text-white shadow-sm hover:shadow-md'
                  : 'bg-[#f4f2ee] text-[#b0afad] cursor-not-allowed border-2 border-[#dfdeda]'
              }`}
            >
              <svg className={`w-4 h-4 transition-transform ${pagination.hasPrev ? 'group-hover:-translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-3">
              {/* Page numbers with dots for large page counts */}
              {pagination.totalPages <= 7 ? (
                // Show all page numbers if 7 or fewer
                Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-all duration-200 text-sm font-medium [font-family:'Lexend_Deca',Helvetica] ${
                      pageNum === pagination.currentPage
                        ? 'bg-[#3b3a39] text-white shadow-md'
                        : 'bg-white text-[#3b3a39] border border-[#dfdeda] hover:border-[#3b3a39] hover:shadow-sm'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))
              ) : (
                // Simplified pagination for many pages
                <div className="bg-white px-4 py-2 rounded-lg border border-[#dfdeda] shadow-sm">
                  <span className="text-[#3b3a39] font-medium text-sm [font-family:'Lexend_Deca',Helvetica]">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                </div>
              )}
            </div>

            <button
              disabled={!pagination.hasNext}
              onClick={() => goToPage(pagination.currentPage + 1)}
              className={`group flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 text-sm font-medium [font-family:'Lexend_Deca',Helvetica] ${
                pagination.hasNext
                  ? 'bg-white text-[#3b3a39] border-2 border-[#3b3a39] hover:bg-[#3b3a39] hover:text-white shadow-sm hover:shadow-md'
                  : 'bg-[#f4f2ee] text-[#b0afad] cursor-not-allowed border-2 border-[#dfdeda]'
              }`}
            >
              Next
              <svg className={`w-4 h-4 transition-transform ${pagination.hasNext ? 'group-hover:translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="w-full bg-white border-t border-[#dfdeda] py-6 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#6e6d6b] text-sm [font-family:'Lexend_Deca',Helvetica]">
            © {new Date().getFullYear()} Rohit — Backend Developer
          </p>
          <div className="w-12 h-px bg-[#dfdeda] mx-auto mt-3"></div>
        </div>
      </footer>
    </div>
  );
};
