import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAnalytics } from '../../hooks/useAnalytics';
import { getBlogBySlug, BlogData } from "../../lib/api";
import { Navbar } from '../../components/ui/Navbar';

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
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#dfdeda] border-t-[#3b3a39] mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#3b3a39] animate-pulse"></div>
            </div>
            <p className="text-[#6e6d6b] text-lg [font-family:'Lexend_Deca',Helvetica] font-light">Loading your story...</p>
          </div>
        </main>

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
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f4f2ee]">
        <Navbar />

        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-lg">
            <div className="mb-8">
              <svg className="mx-auto h-20 w-20 text-[#dfdeda] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.044-5.709-2.573M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-4">
              {error ? "Oops! Something went wrong" : "Blog Post Not Found"}
            </h1>
            <p className="text-lg text-[#6e6d6b] mb-8 [font-family:'Lexend_Deca',Helvetica] font-light leading-relaxed">
              {error || "The blog post you're looking for doesn't exist or has been moved."}
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 bg-[#3b3a39] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#232221] transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 [font-family:'Lexend_Deca',Helvetica]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Blogs
            </Link>
          </div>
        </main>

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
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation - Enhanced */}
          <Link
            to="/blogs"
            className="group inline-flex items-center gap-2 text-[#3b3a39] hover:text-[#232221] font-medium mb-8 sm:mb-12 transition-all duration-200 bg-white px-4 py-2 rounded-lg border border-[#dfdeda] hover:shadow-md [font-family:'Lexend_Deca',Helvetica]"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Blogs
          </Link>

          {/* Blog Article - Enhanced card design */}
          <article className="bg-white rounded-2xl overflow-hidden border border-[#dfdeda] shadow-lg">
            {/* Featured Image with gradient overlay */}
            {blog.featured_image && (
              <div className="relative overflow-hidden">
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
            )}

            {/* Article Header */}
            <header className="p-6 sm:p-8 lg:p-12">
              {/* Tags - Enhanced styling */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#3b3a39] text-white px-4 py-2 rounded-full text-sm font-medium tracking-wide [font-family:'Lexend_Deca',Helvetica] hover:bg-[#232221] transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title - Enhanced typography */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Excerpt - Enhanced presentation */}
              {blog.excerpt && (
                <div className="bg-gradient-to-r from-[#f9f8f6] to-[#f4f2ee] border-l-4 border-[#3b3a39] p-6 rounded-r-xl mb-8">
                  <p className="text-[#3b3a39] text-lg sm:text-xl leading-relaxed italic [font-family:'Lexend_Deca',Helvetica] font-light">
                    "{blog.excerpt}"
                  </p>
                </div>
              )}

              {/* Meta information - Enhanced design */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-[#f9f8f6] rounded-xl border border-[#f4f2ee]">
                <div className="flex flex-wrap items-center gap-3 text-[#6e6d6b] text-sm [font-family:'Lexend_Deca',Helvetica]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#3b3a39] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{blog.author.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-medium">By {blog.author}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                  {blog.read_time && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {blog.read_time} min read
                      </span>
                    </>
                  )}
                </div>

                {/* Share button placeholder */}
                <button className="self-start sm:self-auto bg-[#3b3a39] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#232221] transition-all duration-200 flex items-center gap-2 [font-family:'Lexend_Deca',Helvetica]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </header>

            {/* Enhanced Blog Content */}
            <div className="px-6 sm:px-8 lg:px-12 pb-8 sm:pb-12">
              <div className="prose prose-lg max-w-none [font-family:'Lexend_Deca',Helvetica]">
                <div className="text-[#3b3a39] leading-relaxed text-base sm:text-lg space-y-6">
                  {blog.content.split('\n').map((paragraph, index) => {
                    if (paragraph.trim() === '') {
                      return <div key={index} className="h-4"></div>;
                    }

                    // Handle different paragraph types
                    if (paragraph.startsWith('# ')) {
                      return (
                        <h2 key={index} className="text-2xl sm:text-3xl font-bold text-[#3b3a39] mt-12 mb-6 pb-3 border-b border-[#dfdeda]">
                          {paragraph.slice(2)}
                        </h2>
                      );
                    }

                    if (paragraph.startsWith('## ')) {
                      return (
                        <h3 key={index} className="text-xl sm:text-2xl font-semibold text-[#3b3a39] mt-8 mb-4">
                          {paragraph.slice(3)}
                        </h3>
                      );
                    }

                    if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                      return (
                        <li key={index} className="text-[#6e6d6b] ml-6 list-disc mb-2">
                          {paragraph.slice(2)}
                        </li>
                      );
                    }

                    // Find the first actual paragraph (not heading or list item)
                    const isFirstParagraph = blog.content.split('\n')
                      .slice(0, index + 1)
                      .filter(p => p.trim() && !p.startsWith('#') && !p.startsWith('-') && !p.startsWith('*'))
                      .length === 1;

                    return (
                      <p key={index} className={`text-[#6e6d6b] leading-relaxed mb-6 ${
                        isFirstParagraph
                          ? 'first-letter:text-3xl first-letter:font-bold first-letter:text-[#3b3a39] first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:mt-1'
                          : ''
                      }`}>
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced bottom navigation */}
              <div className="mt-12 pt-8 border-t border-[#dfdeda]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <Link
                    to="/blogs"
                    className="group inline-flex items-center gap-3 text-[#3b3a39] hover:text-[#232221] font-medium transition-all duration-200 bg-[#f4f2ee] hover:bg-white px-6 py-3 rounded-xl border border-[#dfdeda] hover:shadow-md [font-family:'Lexend_Deca',Helvetica]"
                  >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    All Blog Posts
                  </Link>

                  {/* Reading progress indicator */}
                  <div className="flex items-center gap-3 text-[#6e6d6b] text-sm [font-family:'Lexend_Deca',Helvetica]">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>Thanks for reading!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts Placeholder */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-6 text-center">
              More Stories
            </h3>
            <div className="bg-white rounded-2xl p-8 border border-[#dfdeda] shadow-sm text-center">
              <p className="text-[#6e6d6b] [font-family:'Lexend_Deca',Helvetica] font-light">
                Discover more insights and tutorials
              </p>
              <Link
                to="/blogs"
                className="inline-block mt-4 text-[#3b3a39] font-medium hover:underline [font-family:'Lexend_Deca',Helvetica]"
              >
                Browse All Posts →
              </Link>
            </div>
          </div>
        </div>
      </main>

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
