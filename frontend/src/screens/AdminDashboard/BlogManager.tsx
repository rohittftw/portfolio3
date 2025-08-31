import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { getAllBlogs, deleteBlog, BlogData } from "../../lib/api";

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const BlogManager = () => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchBlogs = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllBlogs(page, 10);
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setError("Failed to load blogs. Please check your authentication.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleNewBlog = () => {
    navigate('/admin/blogs/new');
  };

  const handleEditBlog = (blogId: number) => {
    navigate(`/admin/blogs/edit/${blogId}`);
  };

  const handleDeleteBlog = async (blogId: number) => {
    if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingId(blogId);
      await deleteBlog(blogId);

      // Remove the deleted blog from the current list
      setBlogs(blogs.filter(blog => blog.blog_id !== blogId));

      // If this was the last blog on the page and we're not on page 1, go to previous page
      if (blogs.length === 1 && pagination && pagination.currentPage > 1) {
        fetchBlogs(pagination.currentPage - 1);
      }
    } catch (err) {
      console.error("Failed to delete blog:", err);
      setError("Failed to delete blog. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewBlog = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank');
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      fetchBlogs(page);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="rounded-xl border-[#dfdeda] shadow-sm mt-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#3b3a39]">Manage Blogs</h2>
            {pagination && (
              <p className="text-sm text-[#6e6d6b] mt-1">
                {pagination.totalCount} total posts
              </p>
            )}
          </div>
          <Button
            className="bg-[#3b3a39] hover:bg-[#232221] text-white"
            size="sm"
            onClick={handleNewBlog}
          >
            <Plus className="w-4 h-4 mr-2" /> New Blog
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3b3a39] mr-3"></div>
            <span className="text-[#6e6d6b]">Loading blogs...</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#6e6d6b] mb-4">No blog posts found.</p>
            <Button onClick={handleNewBlog} className="bg-[#3b3a39] hover:bg-[#232221] text-white">
              Create Your First Blog Post
            </Button>
          </div>
        ) : (
          <>
            {/* Blog List */}
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog.blog_id} className="flex items-center justify-between bg-[#f4f2ee] rounded-lg p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-[#3b3a39] line-clamp-1">{blog.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          blog.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                        {blog.tags && blog.tags.length > 0 && (
                          <span className="text-xs text-[#b0afad]">
                            {blog.tags.length} tag{blog.tags.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#b0afad]">
                      <span>By {blog.author}</span>
                      <span>•</span>
                      <span>Created {formatDate(blog.createdAt)}</span>
                      {blog.publishedAt && (
                        <>
                          <span>•</span>
                          <span>Published {formatDate(blog.publishedAt)}</span>
                        </>
                      )}
                      {blog.read_time && (
                        <>
                          <span>•</span>
                          <span>{blog.read_time} min read</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {blog.published && (
                      <Button
                        variant="outline"
                        size="icon"
                        title="View Published Post"
                        onClick={() => handleViewBlog(blog.slug)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      title="Edit"
                      onClick={() => handleEditBlog(blog.blog_id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Delete"
                      onClick={() => handleDeleteBlog(blog.blog_id)}
                      disabled={deletingId === blog.blog_id}
                    >
                      {deletingId === blog.blog_id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-[#dfdeda]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                >
                  Previous
                </Button>
                <span className="text-sm text-[#6e6d6b] min-w-[100px] text-center">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
