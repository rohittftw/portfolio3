// API configuration
export const API_BASE_URL = "http://localhost:3000/api";

// Admin user interface
export interface AdminUser {
  admin_id: number;
  username: string;
}
interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
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
  getCurrentAdmin: (): AdminUser | null => {
    try {
      const adminData = localStorage.getItem("admin");
      return adminData ? JSON.parse(adminData) : null;
    } catch (error) {
      console.error("Error parsing admin data:", error);
      return null;
    }
  },

  // Set admin data in localStorage
  setAdmin: (admin: AdminUser): void => {
    localStorage.setItem("admin", JSON.stringify(admin));
  },

  // Clear admin session
  clearAdmin: (): void => {
    localStorage.removeItem("admin");
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return adminAuth.getCurrentAdmin() !== null;
  },
};

// API functions
// Login function
export const loginAdmin = async (username: string, password: string) => {
  return apiRequest<{
    msg: string;
    admin?: AdminUser;
  }>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
};

// Logout function (client-side)
export const logoutAdmin = (): void => {
  adminAuth.clearAdmin();
  // You could also make an API call here if you have a logout endpoint
  // apiRequest("/admin/logout", { method: "POST" });
};

// Create admin function
export const createAdmin = async (username: string, password: string) => {
  return apiRequest<{ msg: string }>("/admin", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
};

// Additional admin API functions
export const updateAdmin = async (adminId: number, username: string, password: string) => {
  return apiRequest<{ msg: string }>(`/admin/${adminId}`, {
    method: "PUT",
    body: JSON.stringify({ username, password }),
  });
};

export const deleteAdmin = async (adminId: number) => {
  return apiRequest<{ msg: string }>(`/admin/${adminId}`, {
    method: "DELETE",
  });
};

// Define BlogCreateRequest interface
interface BlogCreateRequest {
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

// The actual createBlog function which expects an object with blog data
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
  },
  jwtToken: string
) => {
  const response = await fetch("http://localhost:3000/api/blogs/createBlog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwtToken}`,
    },
    body: JSON.stringify(blogData),
  });

  const data = await response.json();
  return data;
};

export interface BlogData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  content?: string;
  published?: boolean;
  tags?: string[];
  author?: string;
  read_time?: number;
  createdAt?: string;
}



export const getBlogs = async (): Promise<BlogApiResponse> => {
  const response = await fetch("http://localhost:3000/api/blogs/getPublishedBlogs", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Error fetching blogs: ${response.status}`);
  }

  const data: BlogApiResponse = await response.json();
  return data;
};


export const getBlogById = async (id: string) => {
  const response = await fetch(`http://localhost:3000/api/blogs/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blog");
  }

  const data = await response.json();
  return data;
};
export const updateBlog = async (
  id: string,
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
  },
  jwtToken: string
) => {
  const response = await fetch(`http://localhost:3000/api/blogs/${id}`, {
    method: "PUT", // or PATCH depending on backend
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwtToken}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error("Failed to update blog");
  }

  const data = await response.json();
  return data;
};
export const deleteBlog = async (id: string, jwtToken: string) => {
  const response = await fetch(`http://localhost:3000/api/blogs/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete blog");
  }

  const data = await response.json();
  return data;
};


enum ProjectStatus {
  IN_PROGRESS,
  COMPLETED,
  ARCHIVED
}

export interface ProjectData{
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
  blogs: ProjectData[];
  pagination: Pagination;
}
export const getProjects = async (): Promise<ProjectApiResponse> => {
  const response = await fetch("http://localhost:3000/api/projects/GetAllProjects", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Error fetching blogs: ${response.status}`);
  }

  const data: ProjectApiResponse = await response.json();
  return data;
};
