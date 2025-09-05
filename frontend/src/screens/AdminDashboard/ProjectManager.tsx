import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getProjects, ProjectData,deleteProject } from "../../lib/ProjectAPI";

export const ProjectManager = () => {
  // State should be an array of ProjectData
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        console.log("API response:", data);

        // If API returns project_id but interface expects id, map it
        const transformedProjects = data.projects.map(project => ({
          ...project,
          id: project.project_id.toString() // or just project.project_id if it's already a string
        }));

        setProjects(transformedProjects);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  const handleNewProject = () => {
    navigate("/admin/projects/new");
  };

  const handleEditProject = (projectId: string | undefined) => {
    console.log("Editing project ID:", projectId, typeof projectId);
    console.log("Current projects:", projects); // Check if projects still exist
    if (!projectId) {
      console.error("Project ID is undefined");
      return;
    }
    navigate(`/admin/projects/edit/${projectId}`);
  };
  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(projectId);

      setProjects((prev) => prev.filter((project) => project.id !== projectId)); // update UI
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("Failed to delete project. Please try again.");
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
            <div
              key={project.id}
              className="flex items-center justify-between bg-[#f4f2ee] rounded-lg p-4"
            >
              <div>
                <div className="font-medium text-[#3b3a39]">{project.title}</div>

              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  title="Edit"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    console.log("Edit clicked - ID:", project.id, "Type:", typeof project.id);
                    handleEditProject(project.id);
                  }}
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
