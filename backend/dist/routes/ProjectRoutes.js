"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProjectController_1 = require("../controller/ProjectController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Helper to wrap async route handlers
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
// Public routes (no authentication required)
router.get("/GetAllProjects", asyncHandler(ProjectController_1.GetAllProjects));
router.get("/featured", asyncHandler(ProjectController_1.GetFeaturedProjects));
router.get("/status/:id$", (0, validation_1.validateSchema)(validation_1.projectSchemas.byStatus), asyncHandler(ProjectController_1.GetProjectsByStatus));
router.get("/technologies", asyncHandler(ProjectController_1.GetProjectTechnologies));
router.get("/slug/:slug$", (0, validation_1.validateSchema)(validation_1.projectSchemas.bySlug), asyncHandler(ProjectController_1.GetProjectBySlug));
// Protected admin routes (authentication required)
router.post("/createProject", auth_1.authenticateAdmin, (0, validation_1.validateSchema)(validation_1.projectSchemas.create), asyncHandler(ProjectController_1.CreateProject));
router.get("/:id$", auth_1.authenticateAdmin, (0, validation_1.validateSchema)(validation_1.projectSchemas.byId), asyncHandler(ProjectController_1.GetProjectById));
router.put("/:id$", auth_1.authenticateAdmin, (0, validation_1.validateSchema)(validation_1.projectSchemas.update), asyncHandler(ProjectController_1.UpdateProject));
router.delete("/:id$", auth_1.authenticateAdmin, (0, validation_1.validateSchema)(validation_1.projectSchemas.byId), asyncHandler(ProjectController_1.DeleteProject));
router.post("/reorder", auth_1.authenticateAdmin, (0, validation_1.validateSchema)(validation_1.projectSchemas.reorder), asyncHandler(ProjectController_1.ReorderProjects));
exports.default = router;
