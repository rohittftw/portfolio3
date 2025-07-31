import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ArrowLeft } from "lucide-react";

// Dummy initial data for editing (in real app, fetch by ID)
const dummyProject = {
  title: "Portfolio Website",
  description: "A personal portfolio website built with React, showcasing my work and skills as a backend developer.",
  year: "2024"
};

export const EditProject = () => {
  const [title, setTitle] = useState(dummyProject.title);
  const [description, setDescription] = useState(dummyProject.description);
  const [year, setYear] = useState(dummyProject.year);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the updated project data
    console.log('Updating project:', { id, title, description, year });
    // Navigate back to projects list after update
    navigate('/admin/projects');
  };

  const handleCancel = () => {
    navigate('/admin/projects');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      // Here you would typically delete the project
      console.log('Deleting project:', id);
      navigate('/admin/projects');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2ee] items-center justify-center py-12">
      <Card className="w-full max-w-2xl bg-white rounded-[20px] border-[#dfdeda] shadow-md">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-[#3b3a39] [font-family:'Lexend_Deca',Helvetica]">Edit Project</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="block text-lg text-[#3b3a39] mb-1">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="Enter project title"
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="block text-lg text-[#3b3a39] mb-1">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full h-32 rounded-lg border-[#dfdeda] p-3 text-base"
                placeholder="Project description"
                required
              />
            </div>
            <div>
              <Label htmlFor="year" className="block text-lg text-[#3b3a39] mb-1">Year</Label>
              <Input
                id="year"
                value={year}
                onChange={e => setYear(e.target.value)}
                className="h-12 rounded-lg border-[#dfdeda]"
                placeholder="e.g. 2024"
                required
              />
            </div>
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 h-12 bg-[#3b3a39] hover:bg-[#232221] text-white rounded-[180px] text-lg font-semibold [font-family:'Lexend_Deca',Helvetica] shadow-md transition"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 h-12 border-[#dfdeda] text-[#3b3a39] hover:bg-[#f4f2ee] rounded-[180px] text-lg font-semibold [font-family:'Lexend_Deca',Helvetica]"
              >
                Cancel
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              className="w-full h-12 border-red-300 text-red-600 hover:bg-red-50 rounded-[180px] text-lg font-semibold [font-family:'Lexend_Deca',Helvetica]"
            >
              Delete Project
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
