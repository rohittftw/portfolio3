import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAnalytics } from '../../hooks/useAnalytics';
import { getBlogBySlug, BlogData } from "../../lib/api";

export const BlogDetail = (): JSX.Element => {
  const { slug } = useParams<{ slug: string }>();
  const { trackPageView } = useAnalytics();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackPageView('blog-detail');
  }, [trackPageView]);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) {
        setError("Blog slug is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const blogData = await getBlogBySlug(slug);
        setBlog(blogData);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Failed to load blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f4f2ee]">
        {/* Navbar */}
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

        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b3a39] mx-auto mb-4"></div>
            <p className="text-[#6e6d6b] text-sm sm:text-base">Loading blog post...</p>
          </div>
        </main>

        <footer className="w-full bg-white border-t border-[#dfdeda] py-3 sm:py-4 px-4 sm:px-8 text-center text-[#6e6d6b] text-xs sm:text-sm">
          © {new Date().getFullYear()} Rohit — Backend Developer.
        </footer>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f4f2ee]">
        {/* Navbar */}
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

        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-4 text-center">
            {error ? "Error Loading Blog" : "Blog Not Found"}
          </h1>
          <p className="text-lg text-[#6e6d6b] mb-8 text-center max-w-md">
            {error || "The blog post you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/blogs"
            className="inline-block bg-[#3b3a39] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#232221] transition"
          >
            Back to Blogs
          </Link>
        </main>

        <footer className="w-full bg-white border-t border-[#dfdeda] py-3 sm:py-4 px-4 sm:px-8 text-center text-[#6e6d6b] text-xs sm:text-sm">
          © {new Date().getFullYear()} Rohit — Backend Developer.
        </footer>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

      {/* Blog Content - Responsive */}
      <main className="flex-1 px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blogs"
            className="inline-flex items-center text-[#3b3a39] hover:text-[#232221] font-medium mb-6 sm:mb-8 transition-colors text-sm sm:text-base"
          >
            ← Back to Blogs
          </Link>

          <article className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 border border-[#dfdeda] shadow">
            {/* Featured Image - Responsive */}
            {blog.featured_image && (
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-lg mb-4 sm:mb-6"
              />
            )}

            <header className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-3 sm:mb-4 leading-tight">
                {blog.title}
              </h1>

              {/* Meta information - Mobile optimized */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[#6e6d6b] text-xs sm:text-sm mb-3 sm:mb-4">
                <span>By {blog.author}</span>
                <span>•</span>
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                {blog.read_time && (
                  <>
                    <span>•</span>
                    <span>{blog.read_time} min read</span>
                  </>
                )}
              </div>

              {/* Tags - Mobile optimized */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#f4f2ee] text-[#3b3a39] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-[#6e6d6b] text-base sm:text-lg leading-relaxed italic border-l-4 border-[#dfdeda] pl-4 bg-[#f9f8f6] py-3 rounded-r-lg">
                  {blog.excerpt}
                </p>
              )}
            </header>

            {/* Blog Content - Responsive typography */}
            <div className="text-[#6e6d6b] leading-relaxed text-sm sm:text-base lg:text-lg">
              <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                {blog.content.split('\n').map((paragraph, index) => {
                  if (paragraph.trim() === '') {
                    return <br key={index} />;
                  }
                  return (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Back to blogs link at bottom - Mobile friendly */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#dfdeda]">
              <Link
                to="/blogs"
                className="inline-flex items-center text-[#3b3a39] hover:text-[#232221] font-medium transition-colors text-sm sm:text-base"
              >
                ← Back to All Blogs
              </Link>
            </div>
          </article>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-[#dfdeda] py-3 sm:py-4 px-4 sm:px-8 text-center text-[#6e6d6b] text-xs sm:text-sm">
        © {new Date().getFullYear()} Rohit — Backend Developer.
      </footer>
    </div>
  );
};
