import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { updateProject, getProjectByID } from '../../lib/ProjectAPI';
import { ProjectData, ProjectStatus } from '../../lib/ProjectAPI';

interface FormErrors {
  [key: string]: string;
}

export const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<ProjectData>({
    id: '',
    title: '',
    slug: '',
    description: '',
    short_description: '',
    featured_image: '',
    gallery_images: [''],
    technologies: [''],
    github_url: '',
    live_url: '',
    status: ProjectStatus.COMPLETED,
    featured: false,
    order_index: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch project on mount
  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        console.error('Project ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getProjectByID(id);
        console.log('API Response:', response); // Debug log
        const project = response.project;
        console.log('Project data:', project); // Debug log

        setFormData({
          id: String(project.id), // Fixed: removed redundant || project.id
          title: project.title || '',
          slug: project.slug || '',
          description: project.description || '',
          short_description: project.short_description || '',
          featured_image: project.featured_image || '',
          gallery_images: project.gallery_images && project.gallery_images.length > 0
            ? project.gallery_images
            : [''],
          technologies: project.technologies && project.technologies.length > 0
            ? project.technologies
            : [''],
          github_url: project.github_url || '',
          live_url: project.live_url || '',
          status: project.status || ProjectStatus.COMPLETED,
          featured: project.featured || false,
          order_index: project.order_index || 0,
        });
      } catch (error) {
        console.error('Error loading project:', error);
        // Show user-friendly error
        alert('Failed to load project. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  // Generate slug from title
  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => {
      if (name === 'title') {
        return { ...prev, title: value, slug: generateSlug(value) };
      }
      if (name === 'status') {
        return { ...prev, status: value as ProjectStatus };
      }
      if (name === 'order_index') {
        return { ...prev, order_index: parseInt(value) || 0 };
      }
      return { ...prev, [name]: type === 'checkbox' ? checked : value };
    });
  };

  const handleArrayInputChange = (
    index: number,
    value: string,
    field: keyof Pick<ProjectData, 'gallery_images' | 'technologies'>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] ?? [])].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (
    field: keyof Pick<ProjectData, 'gallery_images' | 'technologies'>
  ) => {
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] ?? []), ''] }));
  };

  const removeArrayItem = (
    index: number,
    field: keyof Pick<ProjectData, 'gallery_images' | 'technologies'>
  ) => {
    const arr = formData[field];
    if (arr && arr.length > 1) {
      setFormData(prev => ({ ...prev, [field]: arr.filter((_, i) => i !== index) }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (isNaN(formData.order_index ?? 0)) newErrors.order_index = 'Order index must be a number';
    const urlPattern = /^https?:\/\/.+/;
    if (formData.github_url && !urlPattern.test(formData.github_url)) newErrors.github_url = 'Invalid URL';
    if (formData.live_url && !urlPattern.test(formData.live_url)) newErrors.live_url = 'Invalid URL';
    if (formData.featured_image && !urlPattern.test(formData.featured_image)) newErrors.featured_image = 'Invalid URL';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      // Create a copy of formData without the id field
      const { id: _, ...submissionData } = formData;

      await updateProject(id, submissionData);
      alert('Project updated successfully!');
    } catch (err) {
      console.error('Error updating project:', err);
      alert('Failed to update project.');
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="min-h-screen p-6 bg-[#faf8f4]">
      <Card className="max-w-4xl mx-auto bg-white border-[#dfdeda] rounded-3xl shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl font-bold text-center text-[#3b3a39]">
            Edit Project
          </CardTitle>
          <p className="text-center text-[#6b7280] mt-2">
            Updating: {formData.title || 'Untitled Project'}
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-[#3b3a39] mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-lg text-[#3b3a39] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent"
                  placeholder="Enter project title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-lg font-semibold text-[#3b3a39] mb-2">
                  Slug (auto-generated)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-lg text-[#3b3a39] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent"
                  placeholder="project-slug"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold text-[#3b3a39] mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-[#f9f7f1] border border-[#dfdeda] rounded-2xl text-lg text-[#3b3a39] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent resize-vertical"
                placeholder="Detailed project description"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-lg font-semibold text-[#3b3a39] mb-2">Short Description</label>
              <input
                type="text"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                className="w-full h-12 px-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-lg text-[#3b3a39] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent"
                placeholder="Brief project summary"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-lg font-semibold text-[#3b3a39] mb-2">Featured Image URL</label>
              <input
                type="url"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleInputChange}
                className="w-full h-12 px-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-lg text-[#3b3a39] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              {errors.featured_image && <p className="text-red-500 text-sm mt-1">{errors.featured_image}</p>}
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-lg font-semibold text-[#3b3a39] mb-2">Gallery Images</label>
              {formData.gallery_images?.map((image, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'gallery_images')}
                    className="flex-1 h-12 px-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-lg text-[#3b3a39] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent"
                    placeholder="https://example.com/gallery-image.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'gallery_images')}
                    className="h-12 px-4 bg-red-100 text-red-600 border border-red-200 rounded-[180px] hover:bg-red-200 font-semibold"
                    disabled={formData.gallery_images?.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('gallery_images')}
                className="h-10 px-4 bg-[#3b3a39] text-white rounded-[180px] hover:bg-[#2a2928] font-semibold"
              >
                Add Gallery Image
              </button>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-lg font-semibold text-[#3b3a39] mb-2">Technologies</label>
              {formData.technologies?.map((tech, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'technologies')}
                    className="flex-1 h-12 px-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-lg text-[#3b3a39] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent"
                    placeholder="React, Node.js, etc."
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'technologies')}
                    className="h-12 px-4 bg-red-100 text-red-600 border border-red-200 rounded-[180px] hover:bg-red-200 font-semibold"
                    disabled={formData.technologies?.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('technologies')}
                className="h-10 px-4 bg-[#3b3a39] text-white rounded-[180px] hover:bg-[#2a2928] font-semibold"
              >
                Add Technology
              </button>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-[#3b3a39] mb-2">GitHub URL</label>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-lg text-[#3b3a39] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent"
                  placeholder="https://github.com/user/repo"
                />
                {errors.github_url && <p className="text-red-500 text-sm mt-1">{errors.github_url}</p>}
              </div>

              <div>
                <label className="block text-lg font-semibold text-[#3b3a39] mb-2">Live URL</label>
                <input
                  type="url"
                  name="live_url"
                  value={formData.live_url}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-lg text-[#3b3a39] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent"
                  placeholder="https://your-project.com"
                />
                {errors.live_url && <p className="text-red-500 text-sm mt-1">{errors.live_url}</p>}
              </div>
            </div>

            {/* Status, Featured, Order Index */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-semibold text-[#3b3a39] mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-lg text-[#3b3a39] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent"
                >
                  <option value={ProjectStatus.COMPLETED}>Completed</option>
                  <option value={ProjectStatus.IN_PROGRESS}>In Progress</option>
                  <option value={ProjectStatus.ARCHIVED}>Archived</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 pt-8">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-[#3b3a39] bg-[#f9f7f1] border-[#dfdeda] rounded focus:ring-[#3b3a39] focus:ring-2"
                />
                <label className="text-lg font-semibold text-[#3b3a39]">Featured Project</label>
              </div>

              <div>
                <label className="block text-lg font-semibold text-[#3b3a39] mb-2">Order Index</label>
                <input
                  type="number"
                  name="order_index"
                  value={formData.order_index}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-lg text-[#3b3a39] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent"
                  placeholder="1, 2, 3..."
                />
                {errors.order_index && <p className="text-red-500 text-sm mt-1">{errors.order_index}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 h-12 bg-[#3b3a39] text-white hover:bg-[#2a2928] rounded-[180px] text-lg font-semibold transition-colors disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Project'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProject;
