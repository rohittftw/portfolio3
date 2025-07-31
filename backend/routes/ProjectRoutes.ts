import express from "express";
import {
  CreateProject,
  GetAllProjects,
  GetFeaturedProjects,
  GetProjectsByStatus,
  GetProjectById,
  GetProjectBySlug,
  UpdateProject,
  DeleteProject,
  GetProjectTechnologies,
  ReorderProjects
} from "../controller/ProjectController";
import { authenticateAdmin } from "../middleware/auth";
import { validateSchema, projectSchemas } from "../middleware/validation";

const router = express.Router();

// Helper to wrap async route handlers
function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Public routes (no authentication required)
router.get("/GetAllProjects",

  asyncHandler(GetAllProjects)
);
router.get("/featured", asyncHandler(GetFeaturedProjects));
router.get("/status/:status",
  validateSchema(projectSchemas.byStatus),
  asyncHandler(GetProjectsByStatus)
);
router.get("/technologies", asyncHandler(GetProjectTechnologies));
router.get("/slug/:slug",
  validateSchema(projectSchemas.bySlug),
  asyncHandler(GetProjectBySlug)
);

// Protected admin routes (authentication required)
router.post("/createProject",
  // authenticateAdmin,
  validateSchema(projectSchemas.create),
  asyncHandler(CreateProject)
);
router.get("/admin",
  authenticateAdmin,
  validateSchema(projectSchemas.query),
  asyncHandler(GetAllProjects)
);
router.get("/admin/:project_id",
  authenticateAdmin,
  validateSchema(projectSchemas.byId),
  asyncHandler(GetProjectById)
);
router.put("/:project_id",
  authenticateAdmin,
  validateSchema(projectSchemas.update),
  asyncHandler(UpdateProject)
);
router.delete("/:project_id",
  authenticateAdmin,
  validateSchema(projectSchemas.byId),
  asyncHandler(DeleteProject)
);
router.post("/reorder",
  authenticateAdmin,
  validateSchema(projectSchemas.reorder),
  asyncHandler(ReorderProjects)
);

export default router;
