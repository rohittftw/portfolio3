import { Request, Response } from "express";
import { prisma } from "./prisma";

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

interface BlogUpdateRequest {
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

interface BlogQuery {
  page?: string;
  limit?: string;
  published?: string;
  tag?: string;
  search?: string;
}

// Create a new blog
export async function CreateBlog(
  req: Request<{}, {}, BlogCreateRequest>,
  res: Response
): Promise<Response> {
  const {
    title,
    slug,
    content,
    excerpt,
    featured_image,
    published = false,
    tags = [],
    author = "Admin",
    read_time
  } = req.body;

  try {
    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug }
    });

    if (existingBlog) {
      return res.status(400).json({ msg: "Blog with this slug already exists" });
    }

    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        featured_image,
        published,
        tags,
        author,
        read_time,
        publishedAt: published ? new Date() : null
      }
    });

    return res.status(201).json({
      msg: "Blog created successfully",
      blog: newBlog
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

// Get all blogs with pagination and filtering
export async function GetAllBlogs(
  req: Request<{}, {}, {}, BlogQuery>,
  res: Response
): Promise<Response> {
  const {
    page = "1",
    limit = "10",
    published,
    tag,
    search
  } = req.query;

  try {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    if (published !== undefined) {
      where.published = published === "true";
    }

    if (tag) {
      where.tags = {
        has: tag
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } }
      ];
    }

    const [blogs, totalCount] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum
      }),
      prisma.blog.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    return res.status(200).json({
      blogs,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

// Get published blogs only (for public API)
export async function GetPublishedBlogs(
  req: Request<{}, {}, {}, BlogQuery>,
  res: Response
): Promise<Response> {
  const {
    page = "1",
    limit = "10",
    tag,
    search
  } = req.query;

  try {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { published: true };

    if (tag) {
      where.tags = {
        has: tag
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } }
      ];
    }

    const [blogs, totalCount] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limitNum,
        select: {
          blog_id: true,
          title: true,
          slug: true,
          excerpt: true,
          featured_image: true,
          tags: true,
          author: true,
          read_time: true,
          publishedAt: true
        }
      }),
      prisma.blog.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    return res.status(200).json({
      blogs,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

// Get single blog by ID
export async function GetBlogById(
  req: Request<{ blog_id: string }>,
  res: Response
): Promise<Response> {
  const { blog_id } = req.params;

  try {
    const blogId = parseInt(blog_id);
    if (isNaN(blogId)) {
      return res.status(400).json({ msg: "Invalid blog ID" });
    }

    const blog = await prisma.blog.findUnique({
      where: { blog_id: blogId }
    });

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

// Get single blog by slug (for public API)
export async function GetBlogBySlug(
  req: Request<{ slug: string }>,
  res: Response
): Promise<Response> {
  const { slug } = req.params;

  try {
    const blog = await prisma.blog.findUnique({
      where: { slug }
    });

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    // Only return published blogs for public API
    if (!blog.published) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

// Update blog
export async function UpdateBlog(
  req: Request<{ blog_id: string }, {}, BlogUpdateRequest>,
  res: Response
): Promise<Response> {
  const { blog_id } = req.params;
  const updateData = req.body;

  try {
    const blogId = parseInt(blog_id);
    if (isNaN(blogId)) {
      return res.status(400).json({ msg: "Invalid blog ID" });
    }

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { blog_id: blogId }
    });

    if (!existingBlog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    // Check if slug is being updated and if it already exists
    if (updateData.slug && updateData.slug !== existingBlog.slug) {
      const slugExists = await prisma.blog.findUnique({
        where: { slug: updateData.slug }
      });

      if (slugExists) {
        return res.status(400).json({ msg: "Blog with this slug already exists" });
      }
    }

    // Handle publishedAt field
    const dataToUpdate: any = { ...updateData };
    if (updateData.published !== undefined) {
      if (updateData.published && !existingBlog.published) {
        // Publishing for the first time
        dataToUpdate.publishedAt = new Date();
      } else if (!updateData.published) {
        // Unpublishing
        dataToUpdate.publishedAt = null;
      }
    }

    const updatedBlog = await prisma.blog.update({
      where: { blog_id: blogId },
      data: dataToUpdate
    });

    return res.status(200).json({
      msg: "Blog updated successfully",
      blog: updatedBlog
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

// Delete blog
export async function DeleteBlog(
  req: Request<{ blog_id: string }>,
  res: Response
): Promise<Response> {
  const { blog_id } = req.params;

  try {
    const blogId = parseInt(blog_id);
    if (isNaN(blogId)) {
      return res.status(400).json({ msg: "Invalid blog ID" });
    }

    const existingBlog = await prisma.blog.findUnique({
      where: { blog_id: blogId }
    });

    if (!existingBlog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    await prisma.blog.delete({
      where: { blog_id: blogId }
    });

    return res.status(200).json({ msg: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

// Get all unique tags
export async function GetBlogTags(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      select: { tags: true }
    });

    const allTags = blogs.flatMap(blog => blog.tags);
    const uniqueTags = [...new Set(allTags)];

    return res.status(200).json({ tags: uniqueTags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}
