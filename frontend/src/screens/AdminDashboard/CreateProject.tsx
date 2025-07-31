import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ArrowLeft } from "lucide-react";

export const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the project data
    console.log('Creating project:', { title, description, year });
    // Navigate back to projects list after creation
    navigate('/admin/projects');
  };

  const handleCancel = () => {
    navigate('/admin/projects');
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
            <h1 className="text-3xl font-bold text-[#3b3a39] [font-family:'Lexend_Deca',Helvetica]">Add New Project</h1>
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
                Add Project
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
