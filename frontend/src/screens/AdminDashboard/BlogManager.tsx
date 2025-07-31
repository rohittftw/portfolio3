import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

// Dummy blog data for UI
const initialBlogs = [
  {
    id: 1,
    title: "How to Build a REST API with Node.js",
    date: "April 15, 2024",
  },
  {
    id: 2,
    title: "Database Optimization Tips",
    date: "March 28, 2024",
  },
  {
    id: 3,
    title: "Deploying Applications to AWS",
    date: "March 10, 2024",
  },
];

export const BlogManager = () => {
  const [blogs, setBlogs] = useState(initialBlogs);
  const navigate = useNavigate();

  const handleNewBlog = () => {
    navigate('/admin/blogs/new');
  };

  const handleEditBlog = (blogId: number) => {
    navigate(`/admin/blogs/edit/${blogId}`);
  };

  const handleDeleteBlog = (blogId: number) => {
    // Add confirmation dialog in real app
    setBlogs(blogs.filter(blog => blog.id !== blogId));
  };

  return (
    <Card className="rounded-xl border-[#dfdeda] shadow-sm mt-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#3b3a39]">Manage Blogs</h2>
          <Button
            className="bg-[#3b3a39] hover:bg-[#232221] text-white"
            size="sm"
            onClick={handleNewBlog}
          >
            <Plus className="w-4 h-4 mr-2" /> New Blog
          </Button>
        </div>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="flex items-center justify-between bg-[#f4f2ee] rounded-lg p-4">
              <div>
                <div className="font-medium text-[#3b3a39]">{blog.title}</div>
                <div className="text-xs text-[#b0afad]">{blog.date}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  title="Edit"
                  onClick={() => handleEditBlog(blog.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Delete"
                  onClick={() => handleDeleteBlog(blog.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
