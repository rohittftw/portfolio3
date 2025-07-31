import React,{useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import { useAnalytics } from '../../hooks/useAnalytics';
// Simple mock blog data
import { usePageTracking } from '../../hooks/usePageTracking';
const blogPosts = {
  "how-to-build-rest-api-nodejs": {
    title: "How to Build a REST API with Node.js",
    date: "April 15, 2024",
    readTime: "8 min read",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=center",
    content: "This is a comprehensive guide to building REST APIs with Node.js and Express. You'll learn about routing, middleware, authentication, and deployment best practices."
  },
  "database-optimization-tips": {
    title: "Database Optimization Tips",
    date: "March 28, 2024",
    readTime: "12 min read",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop&crop=center",
    content: "Learn essential techniques for optimizing database performance including indexing strategies, query optimization, and connection pooling."
  },
  "deploying-applications-aws": {
    title: "Deploying Applications to AWS",
    date: "March 10, 2024",
    readTime: "15 min read",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&crop=center",
    content: "Step-by-step guide to deploying Node.js applications on AWS using EC2, RDS, and Load Balancers with security best practices."
  },
  "microservices-architecture-patterns": {
    title: "Microservices Architecture Patterns",
    date: "February 22, 2024",
    readTime: "18 min read",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&crop=center",
    content: "Explore common microservices patterns including API Gateway, Circuit Breaker, and Event Sourcing for building scalable distributed systems."
  }
};

export const BlogDetail = (): JSX.Element => {
  const { slug } = useParams();
  usePageTracking('blog')
  const blog = slug ? blogPosts[slug as keyof typeof blogPosts] : null;

  if (!blog) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f4f2ee]">
        {/* Navbar */}
        <nav className="w-full bg-white border-b border-[#dfdeda] py-4 px-8 flex items-center justify-between">
          <div className="text-2xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39]">BackendDev</div>
          <div className="flex gap-6">
            <a href="/" className="text-[#3b3a39] font-medium hover:underline">Home</a>
            <a href="/projects" className="text-[#3b3a39] font-medium hover:underline">Projects</a>
            <Link to="/blogs" className="text-[#3b3a39] font-medium hover:underline">Blogs</Link>
            <Link to="/resume" className="text-[#3b3a39] font-medium hover:underline">Resume</Link>
          </div>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-4">
            Blog Not Found
          </h1>
          <p className="text-lg text-[#6e6d6b] mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blogs"
            className="inline-block bg-[#3b3a39] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#232221] transition"
          >
            Back to Blogs
          </Link>
        </main>

        <footer className="w-full bg-white border-t border-[#dfdeda] py-4 px-8 text-center text-[#6e6d6b] text-sm">
          © {new Date().getFullYear()} Rohit — Backend Developer.
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2ee]">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-[#dfdeda] py-4 px-8 flex items-center justify-between">
        <div className="text-2xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39]">BackendDev</div>
        <div className="flex gap-6">
          <a href="/" className="text-[#3b3a39] font-medium hover:underline">Home</a>
          <a href="/projects" className="text-[#3b3a39] font-medium hover:underline">Projects</a>
          <Link to="/blogs" className="text-[#3b3a39] font-medium hover:underline">Blogs</Link>
          <Link to="/resume" className="text-[#3b3a39] font-medium hover:underline">Resume</Link>
        </div>
      </nav>

      {/* Blog Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blogs"
            className="inline-flex items-center text-[#3b3a39] hover:text-[#232221] font-medium mb-8 transition-colors"
          >
            ← Back to Blogs
          </Link>

          <article className="bg-white rounded-xl p-8 border border-[#dfdeda] shadow">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            <header className="mb-6">
              <h1 className="text-4xl font-bold [font-family:'Lexend_Deca',Helvetica] text-[#3b3a39] mb-4">
                {blog.title}
              </h1>
              <div className="flex items-center gap-4 text-[#6e6d6b] text-sm">
                <span>{blog.date}</span>
                <span>•</span>
                <span>{blog.readTime}</span>
              </div>
            </header>

            <div className="text-[#6e6d6b] leading-relaxed text-lg">
              <p>{blog.content}</p>
              <p className="mt-4">
                This is where the full blog content would go. You can add more paragraphs,
                code examples, images, and other content as needed.
              </p>
            </div>
          </article>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-[#dfdeda] py-4 px-8 text-center text-[#6e6d6b] text-sm">
        © {new Date().getFullYear()} Rohit — Backend Developer.
      </footer>
    </div>
  );
};
