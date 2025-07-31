import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { createBlog } from "../../lib/api";

// Define BlogCreateRequest interface

export const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState(""); // Optional field for excerpt
  const [tags, setTags] = useState<string[]>([]); // Optional field for tags
  const [author, setAuthor] = useState(""); // Optional field for author
  const [readTime, setReadTime] = useState<number>(0); // Optional field for read time
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const jwtToken = localStorage.getItem("jwtToken");
  const [success, setSuccess] = useState<string | null>(null);


  // Handler for the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    try {
      setIsLoading(true);
        setSuccess(null); // clear previous messages
        setError(null)
      // Set loading state before the API call
      if (!jwtToken) {
        alert("You must be logged in to create a blog!");
        return;
      }
      // Send the request to your backend (use the appropriate API endpoint)
      const response = await createBlog({
        title,
        slug,
        content,
        excerpt,
        featured_image: image,
        published: true, // Set to true for published state
        tags,
        author,
        read_time: readTime,
      },jwtToken);

      // Assuming the response contains a status or success property
      if (response.success) {
        // Redirect to admin dashboard or handle success state
        // Example: navigate('/admin-dashboard');
        setSuccess("✅ Blog post successfully created!");
           setError(null);
           // Optional: clear form fields here if needed
           setTitle("");
           setSlug("");
           setContent("");
           setImage("");
           setExcerpt("");
           setTags([]);
           setAuthor("");
           setReadTime(0);
        alert("Blog post successfully created!");
      } else {
        // Handle failure response if necessary
          setError("❌ Failed to create the blog post. Please try again.");
        setError("Failed to create the blog post. Please try again.");
      }
    } catch (err) {
      console.error("Blog creation error:", err);

      // Set error state with specific error messages
      if (err instanceof Error) {
        setError(err.message); // Set error message from the thrown error
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false); // Reset loading state after the process
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2ee] items-center justify-center py-12">
      <Card className="w-full max-w-2xl bg-white rounded-[20px] border-[#dfdeda] shadow-md">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-[#3b3a39] mb-6 [font-family:'Lexend_Deca',Helvetica]">
            Write a New Blog Post
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            {success && (
              <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-sm animate-in fade-in duration-300">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm animate-in fade-in duration-300">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="title" className="block text-lg text-[#3b3a39] mb-1">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="Enter blog title"
              />
            </div>

            {/* Slug Input */}
            <div>
              <Label htmlFor="slug" className="block text-lg text-[#3b3a39] mb-1">
                Slug
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="Enter Slug"
              />
            </div>

            {/* Image URL Input */}
            <div>
              <Label htmlFor="image" className="block text-lg text-[#3b3a39] mb-1">
                Image URL
              </Label>
              <Input
                id="image"
                value={image}
                onChange={e => setImage(e.target.value)}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="Paste image URL (optional)"
              />
            </div>

            {/* Content Textarea */}
            <div>
              <Label htmlFor="content" className="block text-lg text-[#3b3a39] mb-1">
                Content
              </Label>
              <textarea
                id="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full h-48 rounded-lg border-[#dfdeda] p-3 text-base"
                placeholder="Write your blog content here..."
              />
            </div>

            {/* Optional Excerpt */}
            <div>
              <Label htmlFor="excerpt" className="block text-lg text-[#3b3a39] mb-1">
                Excerpt
              </Label>
              <Input
                id="excerpt"
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="Enter blog excerpt (optional)"
              />
            </div>

            {/* Optional Tags */}
            <div>
              <Label htmlFor="tags" className="block text-lg text-[#3b3a39] mb-1">
                Tags
              </Label>
              <Input
                id="tags"
                value={tags.join(", ")}
                onChange={e => setTags(e.target.value.split(",").map(tag => tag.trim()))}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="Enter comma-separated tags (optional)"
              />
            </div>

            {/* Optional Author */}
            <div>
              <Label htmlFor="author" className="block text-lg text-[#3b3a39] mb-1">
                Author
              </Label>
              <Input
                id="author"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="Enter author name (optional)"
              />
            </div>

            {/* Optional Read Time */}
            <div>
              <Label htmlFor="read_time" className="block text-lg text-[#3b3a39] mb-1">
                Read Time (in minutes)
              </Label>
              <Input
                id="read_time"
                type="number"
                value={readTime}
                onChange={e => setReadTime(Number(e.target.value))}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="Enter read time (optional)"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#3b3a39] hover:bg-[#232221] text-white rounded-[180px] text-lg font-semibold [font-family:'Lexend_Deca',Helvetica] shadow-md transition"
              disabled={isLoading} // Disable the button during loading
            >
              {isLoading ? "Publishing..." : "Publish Blog"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
