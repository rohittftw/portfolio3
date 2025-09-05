import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { CreateProject } from '../../lib/ProjectAPI';
import { ProjectData,ProjectStatus } from '../../lib/ProjectAPI';





interface FormErrors {
  [key: string]: string;
}

export const CreateProject2: React.FC = () => {
  const [formData, setFormData] = useState<ProjectData>({
    id:'',
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
    order_index:0
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Auto-generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => {
      if (name === "title") {
        return {
          ...prev,
          title: value,
          slug: generateSlug(value)
        };
      }

      if (name === "status") {
        return {
          ...prev,
          status: value as unknown as ProjectStatus // ✅ cast string to enum
        };
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value
      };
    });
  };


  const handleArrayInputChange = (index: number, value: string, field: keyof Pick<ProjectData, 'gallery_images' | 'technologies'>) => {
    setFormData(prev => ({
      ...prev,
      [field]:[ ...prev[field]??[]].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (
    field: keyof Pick<ProjectData, 'gallery_images' | 'technologies'>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] ?? []), '']
    }));
  };


  const removeArrayItem = (index: number, field: keyof Pick<ProjectData, 'gallery_images' | 'technologies'>) => {
    if ([field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]:[ ...prev[field]??[]].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (typeof formData.order_index !== 'number' || isNaN(formData.order_index)) {
      newErrors.order_index = 'Order index must be a number';
    }


    // Validate URLs
    const urlPattern = /^https?:\/\/.+/;
    if (formData.github_url && !urlPattern.test(formData.github_url)) {
      newErrors.github_url = 'Please enter a valid URL';
    }
    if (formData.live_url && !urlPattern.test(formData.live_url)) {
      newErrors.live_url = 'Please enter a valid URL';
    }
    if (formData.featured_image && !urlPattern.test(formData.featured_image)) {
      newErrors.featured_image = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleCancel = () => {
    setFormData({
      id:'',
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
      order_index:0
    });
    setErrors({});
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Clean up data before submission
      const submissionData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        short_description: formData.short_description || undefined,
        featured_image: formData.featured_image || undefined,
        gallery_images: formData.gallery_images?.filter(img => img.trim()) ?? [],
        technologies: formData.technologies?.filter(tech => tech.trim()) ?? [],

        github_url: formData.github_url || undefined,
        live_url: formData.live_url || undefined,
        status: formData.status,
        featured: formData.featured,
        order_index: formData.order_index || 0
      };


      const response = await CreateProject(submissionData);
      console.log('Project created successfully:', response);

      // Reset form after successful submission
      handleCancel();

    } catch (error) {
      console.error('Error creating project:', error);
      // Handle error - maybe show a toast notification
    }
  };
  return (
    <div className="min-h-screen bg-[#faf8f4] p-6">
      <Card className="max-w-4xl mx-auto bg-white border-[#dfdeda] rounded-3xl shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl font-bold text-[#3b3a39] text-center [font-family:'Lexend_Deca',Helvetica]">
            Create New Project
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-lg font-semibold text-[#3b3a39] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-lg text-[#3b3a39] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent"
                  placeholder="Enter project title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="slug" className="block text-lg font-semibold text-[#3b3a39] mb-2">
                  Slug (auto-generated)
                </label>
                <input
                  type="text"
                  id="slug"
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
              <label htmlFor="description" className="block text-lg font-semibold text-[#3b3a39] mb-2">
                Description *
              </label>
              <textarea
                id="description"
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
              <label htmlFor="short_description" className="block text-lg font-semibold text-[#3b3a39] mb-2">
                Short Description
              </label>
              <input
                type="text"
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                className="w-full h-12 px-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-lg text-[#3b3a39] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent"
                placeholder="Brief project summary"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label htmlFor="featured_image" className="block text-lg font-semibold text-[#3b3a39] mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                id="featured_image"
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
              <label className="block text-lg font-semibold text-[#3b3a39] mb-2">
                Gallery Images
              </label>
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
              <label className="block text-lg font-semibold text-[#3b3a39] mb-2">
                Technologies
              </label>
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
                <label htmlFor="github_url" className="block text-lg font-semibold text-[#3b3a39] mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  id="github_url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-lg text-[#3b3a39] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent"
                  placeholder="https://github.com/user/repo"
                />
                {errors.github_url && <p className="text-red-500 text-sm mt-1">{errors.github_url}</p>}
              </div>

              <div>
                <label htmlFor="live_url" className="block text-lg font-semibold text-[#3b3a39] mb-2">
                  Live URL
                </label>
                <input
                  type="url"
                  id="live_url"
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
                <label htmlFor="status" className="block text-lg font-semibold text-[#3b3a39] mb-2">
                  Status
                </label>
                <select
                  id="status"
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
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-[#3b3a39] bg-[#f9f7f1] border-[#dfdeda] rounded focus:ring-[#3b3a39] focus:ring-2"
                />
                <label htmlFor="featured" className="text-lg font-semibold text-[#3b3a39]">
                  Featured Project
                </label>
              </div>

              <div>
                <label htmlFor="order_index" className="block text-lg font-semibold text-[#3b3a39] mb-2">
                  Order Index
                </label>
                <input
                  type="number"
                  id="order_index"
                  name="order_index"
                  value={formData.order_index}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 bg-[#f9f7f1] border border-[#dfdeda] rounded-[180px] text-lg text-[#3b3a39] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b3a39] focus:border-transparent"
                  placeholder="1, 2, 3..."
                />
                {errors.order_index && <p className="text-red-500 text-sm mt-1">{errors.order_index}</p>}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 h-12 bg-[#3b3a39] text-white hover:bg-[#2a2928] rounded-[180px] text-lg font-semibold [font-family:'Lexend_Deca',Helvetica] transition-colors"
              >
                Add Project
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 h-12 border-[#dfdeda] text-[#3b3a39] hover:bg-[#f4f2ee] rounded-[180px] text-lg font-semibold [font-family:'Lexend_Deca',Helvetica] border bg-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProject2;
