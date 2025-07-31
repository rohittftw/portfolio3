import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

// Dummy initial data for editing
const dummyBlog = {
  title: "How to Build a REST API with Node.js",
  content: "A comprehensive step-by-step guide to building scalable REST APIs using Express and Node.js...",
  image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop&crop=center"
};

export const EditBlog = () => {
  const [title, setTitle] = useState(dummyBlog.title);
  const [content, setContent] = useState(dummyBlog.content);
  const [image, setImage] = useState(dummyBlog.image);

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2ee] items-center justify-center py-12">
      <Card className="w-full max-w-2xl bg-white rounded-[20px] border-[#dfdeda] shadow-md">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-[#3b3a39] mb-6 [font-family:'Lexend_Deca',Helvetica]">Edit Blog Post</h1>
          <form className="space-y-6">
            <div>
              <Label htmlFor="title" className="block text-lg text-[#3b3a39] mb-1">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="Enter blog title"
              />
            </div>
            <div>
              <Label htmlFor="image" className="block text-lg text-[#3b3a39] mb-1">Image URL</Label>
              <Input
                id="image"
                value={image}
                onChange={e => setImage(e.target.value)}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="Paste image URL (optional)"
              />
            </div>
            <div>
              <Label htmlFor="content" className="block text-lg text-[#3b3a39] mb-1">Content</Label>
              <textarea
                id="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full h-48 rounded-lg border-[#dfdeda] p-3 text-base"
                placeholder="Write your blog content here..."
              />
            </div>
            <Button className="w-full h-12 bg-[#3b3a39] hover:bg-[#232221] text-white rounded-[180px] text-lg font-semibold [font-family:'Lexend_Deca',Helvetica] shadow-md transition">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 