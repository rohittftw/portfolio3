import express from "express";
import {
  CreateBlog,
  GetAllBlogs,
  GetPublishedBlogs,
  GetBlogById,
  GetBlogBySlug,
  UpdateBlog,
  DeleteBlog,
  GetBlogTags
} from "../controller/BlogController";
import { authenticateAdmin } from "../middleware/auth";
import { validateSchema, blogSchemas } from "../middleware/validation";

const router = express.Router();

// Helper to wrap async route handlers
function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Public routes (no authentication required)
router.get("/getPublishedBlogs",

  asyncHandler(GetPublishedBlogs)
);
router.get("/tags", asyncHandler(GetBlogTags));
router.get("/slug/:slug",
  validateSchema(blogSchemas.bySlug),
  asyncHandler(GetBlogBySlug)
);

// Protected admin routes (authentication required)
router.post("/createBlog",
  // authenticateAdmin,
  validateSchema(blogSchemas.create),
  asyncHandler(CreateBlog)
);
router.get("/admin",
  authenticateAdmin,
  validateSchema(blogSchemas.query),
  asyncHandler(GetAllBlogs)
);
router.get("/admin/:blog_id",
  authenticateAdmin,
  validateSchema(blogSchemas.byId),
  asyncHandler(GetBlogById)
);
router.put("/:blog_id",
  authenticateAdmin,
  validateSchema(blogSchemas.update),
  asyncHandler(UpdateBlog)
);
router.delete("/:blog_id",
  // authenticateAdmin,
  validateSchema(blogSchemas.byId),
  asyncHandler(DeleteBlog)
);

export default router;
