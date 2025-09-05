const API_BASE_URL = "http://localhost:3000/api";

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}
export enum ProjectStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED"
}

export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  featured_image?: string;
  gallery_images?: string[];
  technologies?: string[];
  github_url?: string;
  live_url?: string;
  status?: ProjectStatus;
  featured?: boolean;
  order_index?: number;
}

export interface ProjectApiResponse {
  projects: ProjectData[];
  pagination: Pagination;
}

export const getProjects = async (): Promise<ProjectApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/projects/GetAllProjects`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Error fetching projects: ${response.status}`);
  }

  const data: ProjectApiResponse = await response.json();
  return data;
};

export const getProjectByID = async (project_id:string): Promise<ProjectApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/projects/${project_id}`, {
    method: "GET",
    credentials:"include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Error fetching projects: ${response.status}`);
  }

  const data: ProjectApiResponse = await response.json();
  return data;
}


export const CreateProject = async (
  projectData: {
    title: string;
    slug: string;
    description: string;
    short_description?: string;
    featured_image?: string;
    gallery_images?: string[];
    technologies?: string[];
    github_url?: string;
    live_url?: string;
    status?: ProjectStatus;
    featured?: boolean;
    order_index?: number;
  }
): Promise<ProjectApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/projects/CreateProject`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(projectData)
  });

  if (!response.ok) {
    throw new Error(`Error creating project: ${response.status}`);
  }

  const data: ProjectApiResponse = await response.json();
  return data;
};

export const updateProject = async (id:string,
  projectData:{
  title?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  featured_image?: string;
  gallery_images?: string[];
  technologies?: string[];
  github_url?: string;
  live_url?: string;
  status?: ProjectStatus;
  featured?: boolean;
  order_index?: number;
  })=>{
  const response = await fetch(`${API_BASE_URL}/projects/${id}`,{
    method:"PUT",
    credentials:"include",
    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify(projectData)


  })

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Failed to update project");
  }

  return data;
}

export const deleteProject = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Failed to delete blog");
  }

  return data;
};
