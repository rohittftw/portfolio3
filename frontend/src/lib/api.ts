// API configuration

import axios from 'axios';

const API_BASE_URL = "https://rohitdhawadkar.in/api";
// Admin user interface
interface Admin {
  admin_id: string;
  username: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Updated BlogData interface to match backend
export interface BlogData {
  blog_id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  published: boolean;
  tags: string[];
  author: string;
  read_time?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface BlogApiResponse {
  blogs: BlogData[];
  pagination: Pagination;
}

// API utility function
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || `HTTP error! status: ${response.status}`);
  }

  return data;
};

// Admin session management utilities
export const adminAuth = {
  // Get current admin from localStorage
  getCurrentAdmin: (): Admin | null => {
    try {
      const adminData = localStorage.getItem("admin");
      return adminData ? JSON.parse(adminData) : null;
    } catch (error) {
      console.error("Error parsing admin data:", error);
      return null;
    }
  },

  // Set admin data in localStorage
  setAdmin: (admin: Admin): void => {
    localStorage.setItem("admin", JSON.stringify(admin));
  },

  // Clear admin session
  clearAdmin: (): void => {
    localStorage.removeItem("admin");
    localStorage.removeItem("authToken");
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return adminAuth.getCurrentAdmin() !== null && localStorage.getItem("authToken") !== null;
  },
};

// Auth API functions
interface LoginResponse {
  msg: string;
  admin: Admin;
  token: string;
  expiresIn: string;
}

export const loginAdmin = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/admin/login`,
      { username, password },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );

    // Store token and admin data
    localStorage.setItem('authToken', response.data.token);
    adminAuth.setAdmin(response.data.admin);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data as { error?: string };
      throw new Error(serverError?.error || 'Login failed');
    }
    throw new Error('Network error');
  }
};

// Logout function
export const logoutAdmin = (): void => {
  adminAuth.clearAdmin();
};

// Create admin function
export const createAdmin = async (username: string, password: string) => {
  return apiRequest<{ msg: string }>("/admin", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
};

// Blog API Functions

// Get published blogs (public)
export const getPublishedBlogs = async (page: number = 1, limit: number = 10): Promise<BlogApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/blogs/getPublishedBlogs?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Error fetching blogs: ${response.status}`);
  }

  const data: BlogApiResponse = await response.json();
  return data;
};

// Get all blogs (admin only)
export const getAllBlogs = async (page: number = 1, limit: number = 10): Promise<BlogApiResponse> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/blogs/get-all-blogs?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blogs");
  }

  const data: BlogApiResponse = await response.json();
  return data;
};

// Get blog by ID (admin only)
// Get blog by ID (admin only) - with enhanced debugging
export const getBlogById = async (id: number): Promise<BlogData> => {
  console.log('=== getBlogById called ===');
  console.log('ID parameter:', id);

  const token = localStorage.getItem('authToken');
  console.log('Auth token exists:', !!token);
  console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'null');

  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  const url = `${API_BASE_URL}/blogs/${id}`;
  console.log('Making request to:', url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log('Response received:');
    console.log('- Status:', response.status);
    console.log('- Status Text:', response.statusText);
    console.log('- Content-Type:', response.headers.get('content-type'));
    console.log('- Response OK:', response.ok);

    // Get the raw text first to see what we're actually receiving
    const responseText = await response.text();
    console.log('Raw response text:', responseText.substring(0, 500)); // First 500 chars

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Successfully parsed JSON:', data);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      console.error('Full response text:', responseText);
      throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      throw new Error(data.msg || `Failed to fetch blog: ${response.status}`);
    }

    console.log('✅ Returning blog data:', data.blog);
    return data.blog;
  } catch (error) {
    console.error('❌ getBlogById error:', error);
    throw error;
  }
};


// Get blog by slug (public)
export const getBlogBySlug = async (slug: string): Promise<BlogData> => {
  const response = await fetch(`${API_BASE_URL}/blogs/slug/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blog");
  }

  const data = await response.json();
  return data.blog;
};

// Create blog
export const createBlog = async (
  blogData: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featured_image?: string;
    published?: boolean;
    tags?: string[];
    author?: string;
    read_time?: number;
  }
) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/blogs/createBlog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(blogData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Failed to create blog");
  }

  return data;
};

// Update blog
export const updateBlog = async (
  id: number,
  updatedData: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    featured_image?: string;
    published?: boolean;
    tags?: string[];
    author?: string;
    read_time?: number;
  }
) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Failed to update blog");
  }

  return data;
};

// Delete blog
export const deleteBlog = async (id: number) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Failed to delete blog");
  }

  return data;
};

// Get blog tags
export const getBlogTags = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/blogs/tags`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }

  const data = await response.json();
  return data.tags;
};

// Legacy function for backward compatibility
export const getBlogs = getPublishedBlogs;

// Project-related interfaces and functions
enum ProjectStatus {
  IN_PROGRESS,
  COMPLETED,
  ARCHIVED
}

export interface ProjectData {
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

interface ProjectApiResponse {
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
