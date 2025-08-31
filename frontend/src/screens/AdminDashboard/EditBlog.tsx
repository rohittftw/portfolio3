import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { getBlogById, updateBlog, BlogData } from "../../lib/api";

export const EditBlog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image: "",
    tags: [] as string[],
    author: "",
    read_time: 0,
    published: false
  });

  const [originalData, setOriginalData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      console.log('=== fetchBlog called ===');
      console.log('Raw ID from URL:', id);
      console.log('Type of ID:', typeof id);

      if (!id) {
        console.log('❌ No ID provided');
        setError("Blog ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const parsedId = parseInt(id);
        console.log('Parsed ID:', parsedId);
        console.log('Is NaN?', isNaN(parsedId));

        if (isNaN(parsedId)) {
          throw new Error(`Invalid ID: "${id}" could not be parsed to a number`);
        }

        console.log('✅ About to call getBlogById with:', parsedId);
        const blog = await getBlogById(parsedId);
        console.log('✅ Blog fetched successfully:', blog);

        setOriginalData(blog);

        setFormData({
          title: blog.title,
          slug: blog.slug,
          content: blog.content,
          excerpt: blog.excerpt || "",
          featured_image: blog.featured_image || "",
          tags: blog.tags || [],
          author: blog.author,
          read_time: blog.read_time || 0,
          published: blog.published
        });
      } catch (err) {
        console.error("❌ Failed to fetch blog:", err);
        console.error("Error details:", {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined
        });
        setError(`Failed to load blog post: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);


  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    handleInputChange('tags', tags);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      throw new Error("Title is required");
    }
    if (!formData.slug.trim()) {
      throw new Error("Slug is required");
    }
    if (!formData.content.trim()) {
      throw new Error("Content is required");
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;

    return (
      formData.title !== originalData.title ||
      formData.slug !== originalData.slug ||
      formData.content !== originalData.content ||
      formData.excerpt !== (originalData.excerpt || "") ||
      formData.featured_image !== (originalData.featured_image || "") ||
      JSON.stringify(formData.tags) !== JSON.stringify(originalData.tags || []) ||
      formData.author !== originalData.author ||
      formData.read_time !== (originalData.read_time || 0) ||
      formData.published !== originalData.published
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !originalData) {
      setError("Blog ID is missing");
      return;
    }

    try {
      setSaving(true);
      setSuccess(null);
      setError(null);

      validateForm();

      const updateData = {
        ...formData,
        read_time: formData.read_time || undefined
      };

      const response = await updateBlog(parseInt(id), updateData);

      if (response.msg) {
        setSuccess("✅ Blog post updated successfully!");
        setOriginalData(response.blog);

        // Navigate back to blog manager after a delay
        setTimeout(() => {
          navigate('/admin/blogs');
        }, 2000);
      }
    } catch (err) {
      console.error("Blog update error:", err);
      if (err instanceof Error) {
        setError(`❌ ${err.message}`);
      } else {
        setError("❌ Failed to update the blog post. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges()) {
      if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
        navigate('/admin/blogs');
      }
    } else {
      navigate('/admin/blogs');
    }
  };

  const handlePreview = () => {
    if (originalData && originalData.published) {
      window.open(`/blog/${originalData.slug}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f4f2ee] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b3a39] mx-auto mb-4"></div>
          <p className="text-[#6e6d6b]">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error && !originalData) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f4f2ee] items-center justify-center py-12">
        <Card className="w-full max-w-md bg-white rounded-[20px] border-[#dfdeda] shadow-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-[#3b3a39] mb-4">Error</h1>
            <p className="text-[#6e6d6b] mb-6">{error}</p>
            <Button onClick={() => navigate('/admin/blogs')} className="bg-[#3b3a39] hover:bg-[#232221]">
              Back to Blog Manager
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2ee] items-center justify-center py-12">
      <Card className="w-full max-w-2xl bg-white rounded-[20px] border-[#dfdeda] shadow-md">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#3b3a39] [font-family:'Lexend_Deca',Helvetica]">
              Edit Blog Post
            </h1>
            <div className="flex gap-2">
              {originalData?.published && (
                <Button
                  variant="outline"
                  onClick={handlePreview}
                  className="border-[#dfdeda] text-[#3b3a39]"
                >
                  Preview
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-[#dfdeda] text-[#6e6d6b] hover:bg-[#f4f2ee]"
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Blog Status Info */}
          {originalData && (
            <div className="bg-[#f4f2ee] rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    originalData.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {originalData.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-[#6e6d6b]">
                    Created: {new Date(originalData.createdAt).toLocaleDateString()}
                  </span>
                  {originalData.publishedAt && (
                    <span className="text-[#6e6d6b]">
                      Published: {new Date(originalData.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {hasChanges() && (
                  <span className="text-orange-600 font-medium">Unsaved changes</span>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-sm animate-in fade-in duration-300">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm animate-in fade-in duration-300">
                {error}
              </div>
            )}

            {/* Title Input */}
            <div>
              <Label htmlFor="title" className="block text-lg text-[#3b3a39] mb-1">
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="Enter blog title"
                required
              />
            </div>

            {/* Slug Input */}
            <div>
              <Label htmlFor="slug" className="block text-lg text-[#3b3a39] mb-1">
                Slug *
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={e => handleInputChange('slug', e.target.value)}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="URL-friendly version of title"
                required
              />
              <p className="text-xs text-[#b0afad] mt-1">
                This will be the URL: /blog/{formData.slug || 'your-slug-here'}
              </p>
            </div>

            {/* Excerpt Input */}
            <div>
              <Label htmlFor="excerpt" className="block text-lg text-[#3b3a39] mb-1">
                Excerpt
              </Label>
              <textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={e => handleInputChange('excerpt', e.target.value)}
                className="w-full h-24 rounded-lg border-[#dfdeda] p-3 text-base resize-none"
                placeholder="Brief description of the blog post (optional)"
              />
            </div>

            {/* Featured Image Input */}
            <div>
              <Label htmlFor="featured_image" className="block text-lg text-[#3b3a39] mb-1">
                Featured Image URL
              </Label>
              <Input
                id="featured_image"
                value={formData.featured_image}
                onChange={e => handleInputChange('featured_image', e.target.value)}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="https://example.com/image.jpg (optional)"
                type="url"
              />
              {formData.featured_image && (
                <div className="mt-2">
                  <img
                    src={formData.featured_image}
                    alt="Featured image preview"
                    className="h-24 w-auto rounded-lg border border-[#dfdeda] object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Content Textarea */}
            <div>
              <Label htmlFor="content" className="block text-lg text-[#3b3a39] mb-1">
                Content *
              </Label>
              <textarea
                id="content"
                value={formData.content}
                onChange={e => handleInputChange('content', e.target.value)}
                className="w-full h-48 rounded-lg border-[#dfdeda] p-3 text-base"
                placeholder="Write your blog content here..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Author Input */}
              <div>
                <Label htmlFor="author" className="block text-lg text-[#3b3a39] mb-1">
                  Author
                </Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={e => handleInputChange('author', e.target.value)}
                  className="h-12 rounded-lg border-[#dfdeda]"
                  placeholder="Author name"
                />
              </div>

              {/* Read Time Input */}
              <div>
                <Label htmlFor="read_time" className="block text-lg text-[#3b3a39] mb-1">
                  Read Time (minutes)
                </Label>
                <Input
                  id="read_time"
                  type="number"
                  min="0"
                  value={formData.read_time || ''}
                  onChange={e => handleInputChange('read_time', parseInt(e.target.value) || 0)}
                  className="h-12 rounded-lg border-[#dfdeda]"
                  placeholder="Estimated read time"
                />
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <Label htmlFor="tags" className="block text-lg text-[#3b3a39] mb-1">
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags.join(', ')}
                onChange={e => handleTagsChange(e.target.value)}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="Enter comma-separated tags (e.g., javascript, nodejs, api)"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#f4f2ee] text-[#3b3a39] px-2 py-1 rounded-full text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Published Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={e => handleInputChange('published', e.target.checked)}
                className="rounded border-[#dfdeda] text-[#3b3a39] focus:ring-[#3b3a39]"
              />
              <Label htmlFor="published" className="text-lg text-[#3b3a39]">
                Published
              </Label>
              <span className="text-sm text-[#6e6d6b]">
                {formData.published ? "(Visible to public)" : "(Draft - only visible to admins)"}
              </span>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 h-12 bg-[#3b3a39] hover:bg-[#232221] text-white rounded-[180px] text-lg font-semibold [font-family:'Lexend_Deca',Helvetica] shadow-md transition"
                disabled={saving || !hasChanges()}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>

              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="h-12 px-6 border-[#dfdeda] text-[#6e6d6b] hover:bg-[#f4f2ee] rounded-[180px] font-semibold transition"
                disabled={saving}
              >
                Cancel
              </Button>
            </div>

            {/* Save Status */}
            {!hasChanges() && originalData && (
              <p className="text-center text-sm text-[#6e6d6b] italic">
                All changes saved
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
