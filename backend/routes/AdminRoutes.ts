import express from "express";
import { CreateAdmin, UpdateAdmin, deleteAdmin, GetAdminProfile, AdminLogin } from "../controller/AdminController";
import { authenticateAdmin } from "../middleware/auth";
import { validateSchema, adminSchemas } from "../middleware/validation";

const router = express.Router();

// Helper to wrap async route handlers
function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Public routes (no authentication required)
router.post("/login", validateSchema(adminSchemas.login), asyncHandler(AdminLogin));
router.post("/register", validateSchema(adminSchemas.create), asyncHandler(CreateAdmin));

// Protected routes (authentication required)
router.get("/profile", authenticateAdmin, asyncHandler(GetAdminProfile));
router.put("/:id$",
  authenticateAdmin,
  validateSchema(adminSchemas.update),
  asyncHandler(UpdateAdmin)
);
router.delete("/:id$",
  authenticateAdmin,
  validateSchema(adminSchemas.delete),
  asyncHandler(deleteAdmin)
);

export default router;
