import { Request, Response, NextFunction } from "express";
import { ZodError,ZodIssue } from "zod";
import {z} from "zod";

// Custom validation error response
interface ValidationError {
  field: string;
  message: string;
}



// Helper function to format Zod errors
function formatZodError(error: ZodError<any>): ValidationError[] {
  return error.errors.map((err:ZodIssue) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

// Generic validation middleware
export function validateSchema(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body, params, and query
      const validationData = {
        ...(Object.keys(req.body).length > 0 && { body: req.body }),
        ...(Object.keys(req.params).length > 0 && { params: req.params }),
        ...(Object.keys(req.query).length > 0 && { query: req.query }),
      };

      schema.parse(validationData);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = formatZodError(error);
        return res.status(400).json({
          msg: "Validation failed",
          errors: validationErrors,
        });
      }

      console.error("Validation middleware error:", error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };
}

// Validate only request body
export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = formatZodError(error);
        return res.status(400).json({
          msg: "Request body validation failed",
          errors: validationErrors,
        });
      }

      console.error("Body validation error:", error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };
}

// Validate only request params
export function validateParams(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = formatZodError(error);
        return res.status(400).json({
          msg: "Request parameters validation failed",
          errors: validationErrors,
        });
      }

      console.error("Params validation error:", error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };
}

// Validate only query parameters
export function validateQuery(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = formatZodError(error);
        return res.status(400).json({
          msg: "Query parameters validation failed",
          errors: validationErrors,
        });
      }

      console.error("Query validation error:", error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };
}

// Admin validation schemas
export const adminSchemas = {
  // Admin creation/registration
  create: z.object({
    body: z.object({
      username: z.string()
        .min(3, "Username must be at least 3 characters long")
        .max(50, "Username must not exceed 50 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
      password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must not exceed 100 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
    }),
  }),

  // Admin login
  login: z.object({
    body: z.object({
      username: z.string().min(1, "Username is required"),
      password: z.string().min(1, "Password is required"),
    }),
  }),

  // Admin update
  update: z.object({
    params: z.object({
      Admin_id: z.string().regex(/^\d+$/, "Admin ID must be a valid number"),
    }),
    body: z.object({
      username: z.string()
        .min(3, "Username must be at least 3 characters long")
        .max(50, "Username must not exceed 50 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
      password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must not exceed 100 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
    }),
  }),

  // Admin deletion
  delete: z.object({
    params: z.object({
      Admin_id: z.string().regex(/^\d+$/, "Admin ID must be a valid number"),
    }),
  }),
};

// Blog validation schemas
export const blogSchemas = {
  // Blog creation
  create: z.object({
    body: z.object({
      title: z.string()
        .min(1, "Title is required")
        .max(200, "Title must not exceed 200 characters"),
      slug: z.string()
        .min(1, "Slug is required")
        .max(200, "Slug must not exceed 200 characters")
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
      content: z.string().min(1, "Content is required"),
      excerpt: z.string().max(500, "Excerpt must not exceed 500 characters").optional(),
      featured_image: z.string().url("Featured image must be a valid URL").optional().or(z.literal("")),
      published: z.boolean().optional(),
      tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
      author: z.string().min(1, "Author name is required").optional(),
      read_time: z.number().int().positive("Read time must be a positive integer").optional(),
    }),
  }),

  // Blog update
  update: z.object({
    params: z.object({
      blog_id: z.string().regex(/^\d+$/, "Blog ID must be a valid number"),
    }),
    body: z.object({
      title: z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters").optional(),
      slug: z.string().min(1, "Slug is required").max(200, "Slug must not exceed 200 characters")
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens").optional(),
      content: z.string().min(1, "Content is required").optional(),
      excerpt: z.string().max(500, "Excerpt must not exceed 500 characters").optional(),
      featured_image: z.string().url("Featured image must be a valid URL").optional().or(z.literal("")),
      published: z.boolean().optional(),
      tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
      author: z.string().min(1, "Author name is required").optional(),
      read_time: z.number().int().positive("Read time must be a positive integer").optional(),
    }),
  }),

  // Blog ID parameter
  byId: z.object({
    params: z.object({
      blog_id: z.string().regex(/^\d+$/, "Blog ID must be a valid number"),
    }),
  }),

  // Blog slug parameter
  bySlug: z.object({
    params: z.object({
      slug: z.string().min(1, "Slug is required"),
    }),
  }),

  // Blog query parameters
  query: z.object({
    query: z.object({
      page: z.string().regex(/^\d+$/, "Page must be a valid number").optional(),
      limit: z.string().regex(/^\d+$/, "Limit must be a valid number").optional(),
      published: z.enum(["true", "false"]).optional(),
      tag: z.string().optional(),
      search: z.string().optional(),
    }),
  }),
};

// Project validation schemas
export const projectSchemas = {
  // Project creation
  create: z.object({
    body: z.object({
      title: z.string()
        .min(1, "Title is required")
        .max(200, "Title must not exceed 200 characters"),
      slug: z.string()
        .min(1, "Slug is required")
        .max(200, "Slug must not exceed 200 characters")
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
      description: z.string().min(1, "Description is required"),
      short_description: z.string().max(300, "Short description must not exceed 300 characters").optional(),
      featured_image: z.string().url("Featured image must be a valid URL").optional().or(z.literal("")),
      gallery_images: z.array(z.string().url("Gallery image must be a valid URL")).optional(),
      technologies: z.array(z.string().min(1, "Technology name cannot be empty")).optional(),
      github_url: z.string().url("GitHub URL must be a valid URL").optional().or(z.literal("")),
      live_url: z.string().url("Live URL must be a valid URL").optional().or(z.literal("")),
      status: z.enum(["IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional(),
      featured: z.boolean().optional(),
      order_index: z.number().int().optional(),
    }),
  }),

  // Project update
  update: z.object({
    params: z.object({
      project_id: z.string().regex(/^\d+$/, "Project ID must be a valid number"),
    }),
    body: z.object({
      title: z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters").optional(),
      slug: z.string().min(1, "Slug is required").max(200, "Slug must not exceed 200 characters")
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens").optional(),
      description: z.string().min(1, "Description is required").optional(),
      short_description: z.string().max(300, "Short description must not exceed 300 characters").optional(),
      featured_image: z.string().url("Featured image must be a valid URL").optional().or(z.literal("")),
      gallery_images: z.array(z.string().url("Gallery image must be a valid URL")).optional(),
      technologies: z.array(z.string().min(1, "Technology name cannot be empty")).optional(),
      github_url: z.string().url("GitHub URL must be a valid URL").optional().or(z.literal("")),
      live_url: z.string().url("Live URL must be a valid URL").optional().or(z.literal("")),
      status: z.enum(["IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional(),
      featured: z.boolean().optional(),
      order_index: z.number().int().optional(),
    }),
  }),

  // Project ID parameter
  byId: z.object({
    params: z.object({
      project_id: z.string().regex(/^\d+$/, "Project ID must be a valid number"),
    }),
  }),

  // Project slug parameter
  bySlug: z.object({
    params: z.object({
      slug: z.string().min(1, "Slug is required"),
    }),
  }),

  // Project status parameter
  byStatus: z.object({
    params: z.object({
      status: z.enum(["IN_PROGRESS", "COMPLETED", "ARCHIVED"]),
    }),
  }),

  // Project query parameters
  query: z.object({
    query: z.object({
      page: z.string().regex(/^\d+$/, "Page must be a valid number").optional(),
      limit: z.string().regex(/^\d+$/, "Limit must be a valid number").optional(),
      status: z.enum(["IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional(),
      technology: z.string().optional(),
      featured: z.enum(["true", "false"]).optional(),
      search: z.string().optional(),
    }),
  }),

  // Project reorder
  reorder: z.object({
    body: z.object({
      projectOrders: z.array(
        z.object({
          project_id: z.number().int().positive("Project ID must be a positive integer"),
          order_index: z.number().int("Order index must be an integer"),
        })
      ).min(1, "At least one project order is required"),
    }),
  }),
};
