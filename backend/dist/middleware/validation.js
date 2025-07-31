"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectSchemas = exports.blogSchemas = exports.adminSchemas = void 0;
exports.validateSchema = validateSchema;
exports.validateBody = validateBody;
exports.validateParams = validateParams;
exports.validateQuery = validateQuery;
const zod_1 = require("zod");
// Helper function to format Zod errors
function formatZodError(error) {
    return error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
    }));
}
// Generic validation middleware
function validateSchema(schema) {
    return (req, res, next) => {
        try {
            // Validate request body, params, and query
            const validationData = Object.assign(Object.assign(Object.assign({}, (Object.keys(req.body).length > 0 && { body: req.body })), (Object.keys(req.params).length > 0 && { params: req.params })), (Object.keys(req.query).length > 0 && { query: req.query }));
            schema.parse(validationData);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
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
function validateBody(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
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
function validateParams(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.params);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
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
function validateQuery(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.query);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
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
exports.adminSchemas = {
    // Admin creation/registration
    create: zod_1.z.object({
        body: zod_1.z.object({
            username: zod_1.z.string()
                .min(3, "Username must be at least 3 characters long")
                .max(50, "Username must not exceed 50 characters")
                .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
            password: zod_1.z.string()
                .min(6, "Password must be at least 6 characters long")
                .max(100, "Password must not exceed 100 characters")
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
        }),
    }),
    // Admin login
    login: zod_1.z.object({
        body: zod_1.z.object({
            username: zod_1.z.string().min(1, "Username is required"),
            password: zod_1.z.string().min(1, "Password is required"),
        }),
    }),
    // Admin update
    update: zod_1.z.object({
        params: zod_1.z.object({
            Admin_id: zod_1.z.string().regex(/^\d+$/, "Admin ID must be a valid number"),
        }),
        body: zod_1.z.object({
            username: zod_1.z.string()
                .min(3, "Username must be at least 3 characters long")
                .max(50, "Username must not exceed 50 characters")
                .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
            password: zod_1.z.string()
                .min(6, "Password must be at least 6 characters long")
                .max(100, "Password must not exceed 100 characters")
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
        }),
    }),
    // Admin deletion
    delete: zod_1.z.object({
        params: zod_1.z.object({
            Admin_id: zod_1.z.string().regex(/^\d+$/, "Admin ID must be a valid number"),
        }),
    }),
};
// Blog validation schemas
exports.blogSchemas = {
    // Blog creation
    create: zod_1.z.object({
        body: zod_1.z.object({
            title: zod_1.z.string()
                .min(1, "Title is required")
                .max(200, "Title must not exceed 200 characters"),
            slug: zod_1.z.string()
                .min(1, "Slug is required")
                .max(200, "Slug must not exceed 200 characters")
                .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
            content: zod_1.z.string().min(1, "Content is required"),
            excerpt: zod_1.z.string().max(500, "Excerpt must not exceed 500 characters").optional(),
            featured_image: zod_1.z.string().url("Featured image must be a valid URL").optional().or(zod_1.z.literal("")),
            published: zod_1.z.boolean().optional(),
            tags: zod_1.z.array(zod_1.z.string().min(1, "Tag cannot be empty")).optional(),
            author: zod_1.z.string().min(1, "Author name is required").optional(),
            read_time: zod_1.z.number().int().positive("Read time must be a positive integer").optional(),
        }),
    }),
    // Blog update
    update: zod_1.z.object({
        params: zod_1.z.object({
            blog_id: zod_1.z.string().regex(/^\d+$/, "Blog ID must be a valid number"),
        }),
        body: zod_1.z.object({
            title: zod_1.z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters").optional(),
            slug: zod_1.z.string().min(1, "Slug is required").max(200, "Slug must not exceed 200 characters")
                .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens").optional(),
            content: zod_1.z.string().min(1, "Content is required").optional(),
            excerpt: zod_1.z.string().max(500, "Excerpt must not exceed 500 characters").optional(),
            featured_image: zod_1.z.string().url("Featured image must be a valid URL").optional().or(zod_1.z.literal("")),
            published: zod_1.z.boolean().optional(),
            tags: zod_1.z.array(zod_1.z.string().min(1, "Tag cannot be empty")).optional(),
            author: zod_1.z.string().min(1, "Author name is required").optional(),
            read_time: zod_1.z.number().int().positive("Read time must be a positive integer").optional(),
        }),
    }),
    // Blog ID parameter
    byId: zod_1.z.object({
        params: zod_1.z.object({
            blog_id: zod_1.z.string().regex(/^\d+$/, "Blog ID must be a valid number"),
        }),
    }),
    // Blog slug parameter
    bySlug: zod_1.z.object({
        params: zod_1.z.object({
            slug: zod_1.z.string().min(1, "Slug is required"),
        }),
    }),
    // Blog query parameters
    query: zod_1.z.object({
        query: zod_1.z.object({
            page: zod_1.z.string().regex(/^\d+$/, "Page must be a valid number").optional(),
            limit: zod_1.z.string().regex(/^\d+$/, "Limit must be a valid number").optional(),
            published: zod_1.z.enum(["true", "false"]).optional(),
            tag: zod_1.z.string().optional(),
            search: zod_1.z.string().optional(),
        }),
    }),
};
// Project validation schemas
exports.projectSchemas = {
    // Project creation
    create: zod_1.z.object({
        body: zod_1.z.object({
            title: zod_1.z.string()
                .min(1, "Title is required")
                .max(200, "Title must not exceed 200 characters"),
            slug: zod_1.z.string()
                .min(1, "Slug is required")
                .max(200, "Slug must not exceed 200 characters")
                .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
            description: zod_1.z.string().min(1, "Description is required"),
            short_description: zod_1.z.string().max(300, "Short description must not exceed 300 characters").optional(),
            featured_image: zod_1.z.string().url("Featured image must be a valid URL").optional().or(zod_1.z.literal("")),
            gallery_images: zod_1.z.array(zod_1.z.string().url("Gallery image must be a valid URL")).optional(),
            technologies: zod_1.z.array(zod_1.z.string().min(1, "Technology name cannot be empty")).optional(),
            github_url: zod_1.z.string().url("GitHub URL must be a valid URL").optional().or(zod_1.z.literal("")),
            live_url: zod_1.z.string().url("Live URL must be a valid URL").optional().or(zod_1.z.literal("")),
            status: zod_1.z.enum(["IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional(),
            featured: zod_1.z.boolean().optional(),
            order_index: zod_1.z.number().int().optional(),
        }),
    }),
    // Project update
    update: zod_1.z.object({
        params: zod_1.z.object({
            project_id: zod_1.z.string().regex(/^\d+$/, "Project ID must be a valid number"),
        }),
        body: zod_1.z.object({
            title: zod_1.z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters").optional(),
            slug: zod_1.z.string().min(1, "Slug is required").max(200, "Slug must not exceed 200 characters")
                .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens").optional(),
            description: zod_1.z.string().min(1, "Description is required").optional(),
            short_description: zod_1.z.string().max(300, "Short description must not exceed 300 characters").optional(),
            featured_image: zod_1.z.string().url("Featured image must be a valid URL").optional().or(zod_1.z.literal("")),
            gallery_images: zod_1.z.array(zod_1.z.string().url("Gallery image must be a valid URL")).optional(),
            technologies: zod_1.z.array(zod_1.z.string().min(1, "Technology name cannot be empty")).optional(),
            github_url: zod_1.z.string().url("GitHub URL must be a valid URL").optional().or(zod_1.z.literal("")),
            live_url: zod_1.z.string().url("Live URL must be a valid URL").optional().or(zod_1.z.literal("")),
            status: zod_1.z.enum(["IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional(),
            featured: zod_1.z.boolean().optional(),
            order_index: zod_1.z.number().int().optional(),
        }),
    }),
    // Project ID parameter
    byId: zod_1.z.object({
        params: zod_1.z.object({
            project_id: zod_1.z.string().regex(/^\d+$/, "Project ID must be a valid number"),
        }),
    }),
    // Project slug parameter
    bySlug: zod_1.z.object({
        params: zod_1.z.object({
            slug: zod_1.z.string().min(1, "Slug is required"),
        }),
    }),
    // Project status parameter
    byStatus: zod_1.z.object({
        params: zod_1.z.object({
            status: zod_1.z.enum(["IN_PROGRESS", "COMPLETED", "ARCHIVED"]),
        }),
    }),
    // Project query parameters
    query: zod_1.z.object({
        query: zod_1.z.object({
            page: zod_1.z.string().regex(/^\d+$/, "Page must be a valid number").optional(),
            limit: zod_1.z.string().regex(/^\d+$/, "Limit must be a valid number").optional(),
            status: zod_1.z.enum(["IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional(),
            technology: zod_1.z.string().optional(),
            featured: zod_1.z.enum(["true", "false"]).optional(),
            search: zod_1.z.string().optional(),
        }),
    }),
    // Project reorder
    reorder: zod_1.z.object({
        body: zod_1.z.object({
            projectOrders: zod_1.z.array(zod_1.z.object({
                project_id: zod_1.z.number().int().positive("Project ID must be a positive integer"),
                order_index: zod_1.z.number().int("Order index must be an integer"),
            })).min(1, "At least one project order is required"),
        }),
    }),
};
