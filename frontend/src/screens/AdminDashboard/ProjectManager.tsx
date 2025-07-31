import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

// Dummy project data for UI
const initialProjects = [
  {
    id: 1,
    title: "Portfolio Website",
    date: "2024",
  },
  {
    id: 2,
    title: "RESTful API for E-commerce",
    date: "2023",
  },
];

export const ProjectManager = () => {
  const [projects, setProjects] = useState(initialProjects);
  const navigate = useNavigate();

  const handleNewProject = () => {
    navigate('/admin/projects/new');
  };

  const handleEditProject = (projectId: number) => {
    navigate(`/admin/projects/edit/${projectId}`);
  };

  const handleDeleteProject = (projectId: number) => {
    // Add confirmation dialog in real app
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(project => project.id !== projectId));
    }
  };

  return (
    <Card className="rounded-xl border-[#dfdeda] shadow-sm mt-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#3b3a39]">Manage Projects</h2>
          <Button
            className="bg-[#3b3a39] hover:bg-[#232221] text-white"
            size="sm"
            onClick={handleNewProject}
          >
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        </div>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between bg-[#f4f2ee] rounded-lg p-4">
              <div>
                <div className="font-medium text-[#3b3a39]">{project.title}</div>
                <div className="text-xs text-[#b0afad]">{project.date}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  title="Edit"
                  onClick={() => handleEditProject(project.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Delete"
                  onClick={() => handleDeleteProject(project.id)}
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
