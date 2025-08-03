"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminController_1 = require("../controller/AdminController");
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
router.post("/login", (0, validation_1.validateSchema)(validation_1.adminSchemas.login), asyncHandler(AdminController_1.AdminLogin));
router.post("/register", (0, validation_1.validateSchema)(validation_1.adminSchemas.create), asyncHandler(AdminController_1.CreateAdmin));
// Protected routes (authentication required)
router.get("/profile", auth_1.authenticateAdmin, asyncHandler(AdminController_1.GetAdminProfile));
router.put("/:id$", auth_1.authenticateAdmin, (0, validation_1.validateSchema)(validation_1.adminSchemas.update), asyncHandler(AdminController_1.UpdateAdmin));
router.delete("/:id$", auth_1.authenticateAdmin, (0, validation_1.validateSchema)(validation_1.adminSchemas.delete), asyncHandler(AdminController_1.deleteAdmin));
exports.default = router;
