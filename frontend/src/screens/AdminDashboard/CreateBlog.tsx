import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { createBlog } from "../../lib/api";

export const CreateBlog = () => {
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug when title changes
    if (field === 'title' && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setSuccess(null);
      setError(null);

      validateForm();

      const blogData = {
        ...formData,
        author: formData.author || "Admin",
        read_time: formData.read_time || undefined
      };

      const response = await createBlog(blogData);

      if (response.msg) {
        setSuccess("✅ Blog post successfully created!");

        // Reset form
        setFormData({
          title: "",
          slug: "",
          content: "",
          excerpt: "",
          featured_image: "",
          tags: [],
          author: "",
          read_time: 0,
          published: false
        });

        // Navigate back to blog manager after a delay
        setTimeout(() => {
          navigate('/admin/blogs');
        }, 2000);
      }
    } catch (err) {
      console.error("Blog creation error:", err);
      if (err instanceof Error) {
        setError(`❌ ${err.message}`);
      } else {
        setError("❌ Failed to create the blog post. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      navigate('/admin/blogs');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2ee] items-center justify-center py-12">
      <Card className="w-full max-w-2xl bg-white rounded-[20px] border-[#dfdeda] shadow-md">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#3b3a39] [font-family:'Lexend_Deca',Helvetica]">
              Create New Blog Post
            </h1>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-[#dfdeda] text-[#6e6d6b] hover:bg-[#f4f2ee]"
            >
              Cancel
            </Button>
          </div>

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
                  placeholder="Author name (defaults to Admin)"
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
                Publish immediately
              </Label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 h-12 bg-[#3b3a39] hover:bg-[#232221] text-white rounded-[180px] text-lg font-semibold [font-family:'Lexend_Deca',Helvetica] shadow-md transition"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Blog Post"}
              </Button>

              {!formData.published && (
                <Button
                  type="button"
                  onClick={() => {
                    handleInputChange('published', true);
                    // Submit form programmatically
                    handleSubmit(new Event('submit') as any);
                  }}
                  variant="outline"
                  className="h-12 px-6 border-[#3b3a39] text-[#3b3a39] hover:bg-[#3b3a39] hover:text-white rounded-[180px] font-semibold transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Publishing..." : "Publish Now"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
