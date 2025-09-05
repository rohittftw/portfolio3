import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getProjectByID } from '../../lib/ProjectAPI';
import { ProjectData, ProjectStatus } from '../../lib/ProjectAPI';
import { ExternalLink, Github, Calendar, Tag, Star, Edit } from 'lucide-react';

export const ViewProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError('Project ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getProjectByID(id);
        const projectData = response.project || response; // Handle different response formats

        setProject(projectData);
        // Set the first available image as selected
        if (projectData.featured_image) {
          setSelectedImage(projectData.featured_image);
        } else if (projectData.gallery_images && projectData.gallery_images.length > 0) {
          setSelectedImage(projectData.gallery_images[0]);
        }
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Failed to load project. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case ProjectStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case ProjectStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return 'Completed';
      case ProjectStatus.IN_PROGRESS:
        return 'In Progress';
      case ProjectStatus.ARCHIVED:
        return 'Archived';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f4] p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3b3a39] mx-auto"></div>
          <p className="mt-4 text-lg text-[#3b3a39]">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f4] p-6">
        <Card className="max-w-md mx-auto bg-white border-[#dfdeda] rounded-3xl shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-[#3b3a39] mb-2">Project Not Found</h2>
            <p className="text-[#6b7280] mb-6">{error || 'The requested project could not be found.'}</p>
            <Link
              to="/projects"
              className="inline-block px-6 py-3 bg-[#3b3a39] text-white rounded-[180px] hover:bg-[#2a2928] transition-colors"
            >
              Back to Projects
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/projects"
            className="text-[#3b3a39] hover:text-[#2a2928] flex items-center gap-2 text-lg"
          >
            ← Back to Projects
          </Link>

        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Status */}
            <Card className="bg-white border-[#dfdeda] rounded-3xl shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-[#3b3a39] mb-2">
                      {project.title}
                      {project.featured && (
                        <Star className="inline ml-3 text-yellow-500 fill-yellow-500" size={24} />
                      )}
                    </h1>
                    <p className="text-[#6b7280] text-lg">/{project.slug}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full border text-sm font-semibold ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </div>
                </div>

                {project.short_description && (
                  <p className="description-content text-xs sm:text-sm text-[#b0afad] leading-relaxed mb-4">
                    {project.short_description}
                  </p>
                )}

                <div className="prose max-w-none">

                  <p className="description-content text-[#6e6d6b] mb-2 text-sm sm:text-base leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <Card className="bg-white border-[#dfdeda] rounded-3xl shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-[#3b3a39]">
                    <Tag size={20} />
                    Technologies Used
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.filter(tech => tech.trim()).map((tech, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-[#3b3a39] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {((project.featured_image) || (project.gallery_images && project.gallery_images.length > 0)) && (
              <Card className="bg-white border-[#dfdeda] rounded-3xl shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[#3b3a39]">Project Gallery</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Main Image */}
                  {selectedImage && (
                    <div className="mb-6">
                      <img
                        src={selectedImage}
                        alt={project.title}
                        className="w-full h-96 object-cover rounded-2xl border border-[#dfdeda]"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280">Image not available</text></svg>';
                        }}
                      />
                    </div>
                  )}

                  {/* Thumbnail Gallery */}
                  {((project.featured_image && project.gallery_images && project.gallery_images.length > 0) ||
                    (project.gallery_images && project.gallery_images.length > 1)) && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {project.featured_image && (
                        <button
                          onClick={() => setSelectedImage(project.featured_image!)}
                          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            selectedImage === project.featured_image
                              ? 'border-[#3b3a39] ring-2 ring-[#3b3a39] ring-opacity-20'
                              : 'border-[#dfdeda] hover:border-[#3b3a39]'
                          }`}
                        >
                          <img
                            src={project.featured_image}
                            alt="Featured"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="12">No Image</text></svg>';
                            }}
                          />
                        </button>
                      )}
                      {project.gallery_images?.filter(img => img.trim()).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(image)}
                          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            selectedImage === image
                              ? 'border-[#3b3a39] ring-2 ring-[#3b3a39] ring-opacity-20'
                              : 'border-[#dfdeda] hover:border-[#3b3a39]'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="12">No Image</text></svg>';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Actions and Meta */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="bg-white border-[#dfdeda] rounded-3xl shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-[#3b3a39]">Project Links</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full p-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-2xl hover:bg-[#f4f2ee] transition-colors text-[#3b3a39]"
                  >
                    <Github size={20} />
                    <span className="font-semibold">View Source Code</span>
                    <ExternalLink size={16} className="ml-auto" />
                  </a>
                )}

                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full p-4 bg-[#3b3a39] text-white rounded-2xl hover:bg-[#2a2928] transition-colors"
                  >
                    <ExternalLink size={20} />
                    <span className="font-semibold">View Live Project</span>
                    <ExternalLink size={16} className="ml-auto" />
                  </a>
                )}

                {!project.github_url && !project.live_url && (
                  <p className="text-[#6b7280] text-center py-8">No external links available</p>
                )}
              </CardContent>
            </Card>

            {/* Project Meta */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProject
