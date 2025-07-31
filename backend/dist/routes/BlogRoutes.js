"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BlogController_1 = require("../controller/BlogController");
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
router.get("/getPublishedBlogs", asyncHandler(BlogController_1.GetPublishedBlogs));
router.get("/tags", asyncHandler(BlogController_1.GetBlogTags));
router.get("/slug/:slug", (0, validation_1.validateSchema)(validation_1.blogSchemas.bySlug), asyncHandler(BlogController_1.GetBlogBySlug));
// Protected admin routes (authentication required)
router.post("/createBlog", 
// authenticateAdmin,
(0, validation_1.validateSchema)(validation_1.blogSchemas.create), asyncHandler(BlogController_1.CreateBlog));
router.get("/admin", auth_1.authenticateAdmin, (0, validation_1.validateSchema)(validation_1.blogSchemas.query), asyncHandler(BlogController_1.GetAllBlogs));
router.get("/admin/:blog_id", auth_1.authenticateAdmin, (0, validation_1.validateSchema)(validation_1.blogSchemas.byId), asyncHandler(BlogController_1.GetBlogById));
router.put("/:blog_id", auth_1.authenticateAdmin, (0, validation_1.validateSchema)(validation_1.blogSchemas.update), asyncHandler(BlogController_1.UpdateBlog));
router.delete("/:blog_id", 
// authenticateAdmin,
(0, validation_1.validateSchema)(validation_1.blogSchemas.byId), asyncHandler(BlogController_1.DeleteBlog));
exports.default = router;
