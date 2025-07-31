"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLogin = AdminLogin;
exports.CreateAdmin = CreateAdmin;
exports.UpdateAdmin = UpdateAdmin;
exports.deleteAdmin = deleteAdmin;
exports.GetAdminProfile = GetAdminProfile;
const prisma_1 = require("./prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const metrics_1 = require("../middleware/metrics");
const auth_1 = require("../middleware/auth");
async function AdminLogin(req, res) {
    const { username, password } = req.body;
    try {
        // Validate input
        if (!username || !password) {
            metrics_1.portfolioMetrics.recordLoginAttempt(false);
            return res.status(400).json({ msg: "Username and password are required" });
        }
        // Find admin by username
        const admin = await prisma_1.prisma.admin.findUnique({
            where: { username },
        });
        if (!admin) {
            metrics_1.portfolioMetrics.recordLoginAttempt(false);
            return res.status(401).json({ msg: "Invalid username or password" });
        }
        // Compare password
        const isMatch = await bcrypt_1.default.compare(password, admin.password);
        if (!isMatch) {
            metrics_1.portfolioMetrics.recordLoginAttempt(false);
            return res.status(401).json({ msg: "Invalid username or password" });
        }
        // Generate JWT token
        const token = (0, auth_1.generateToken)({
            admin_id: admin.admin_id,
            username: admin.username
        });
        // Success
        metrics_1.portfolioMetrics.recordLoginAttempt(true);
        return res.status(200).json({
            msg: "Login successful",
            admin: {
                admin_id: admin.admin_id,
                username: admin.username
            },
            token,
            expiresIn: "24h"
        });
    }
    catch (error) {
        console.error("Login error:", error);
        metrics_1.portfolioMetrics.recordLoginAttempt(false);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
async function CreateAdmin(req, res) {
    const { username, password } = req.body;
    try {
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ msg: "Username and password are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ msg: "Password must be at least 6 characters long" });
        }
        const ExistingAdmin = await prisma_1.prisma.admin.findUnique({
            where: {
                username,
            },
        });
        if (ExistingAdmin) {
            return res.status(409).json({ msg: "Admin with this username already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const NewAdmin = await prisma_1.prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
            },
            select: {
                admin_id: true,
                username: true,
                createdAt: true
            }
        });
        return res.status(201).json({
            msg: "Admin created successfully",
            admin: NewAdmin
        });
    }
    catch (error) {
        console.error("Error creating admin:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
async function UpdateAdmin(req, res) {
    const Admin_id = req.params.Admin_id;
    const { username, password } = req.body;
    try {
        const adminId = parseInt(Admin_id);
        if (isNaN(adminId)) {
            return res.status(400).json({ msg: "Invalid admin ID" });
        }
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ msg: "Username and password are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ msg: "Password must be at least 6 characters long" });
        }
        const existingAdmin = await prisma_1.prisma.admin.findUnique({
            where: {
                admin_id: adminId,
            },
        });
        if (!existingAdmin) {
            return res.status(404).json({ msg: "Admin not found" });
        }
        // Check if username is taken by another admin
        if (username !== existingAdmin.username) {
            const usernameExists = await prisma_1.prisma.admin.findUnique({
                where: { username }
            });
            if (usernameExists) {
                return res.status(409).json({ msg: "Username already taken" });
            }
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const UpdatedAdmin = await prisma_1.prisma.admin.update({
            where: {
                admin_id: adminId,
            },
            data: {
                username,
                password: hashedPassword,
            },
            select: {
                admin_id: true,
                username: true,
                updatedAt: true
            }
        });
        return res.status(200).json({
            msg: "Admin updated successfully",
            admin: UpdatedAdmin
        });
    }
    catch (error) {
        console.error("Error updating admin:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
async function deleteAdmin(req, res) {
    const Admin_id = req.params.Admin_id;
    try {
        const adminId = parseInt(Admin_id);
        if (isNaN(adminId)) {
            return res.status(400).json({ msg: "Invalid admin ID" });
        }
        const ExistingAdmin = await prisma_1.prisma.admin.findUnique({
            where: {
                admin_id: adminId,
            },
        });
        if (!ExistingAdmin) {
            return res.status(404).json({ msg: "Admin not found" });
        }
        await prisma_1.prisma.admin.delete({
            where: {
                admin_id: adminId,
            },
        });
        return res.status(200).json({
            msg: "Admin deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting admin:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
// Get current admin profile (requires authentication)
async function GetAdminProfile(req, res) {
    try {
        // req.admin is set by the authenticateAdmin middleware
        if (!req.admin) {
            return res.status(401).json({ msg: "Authentication required" });
        }
        const admin = await prisma_1.prisma.admin.findUnique({
            where: { admin_id: req.admin.admin_id },
            select: {
                admin_id: true,
                username: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!admin) {
            return res.status(404).json({ msg: "Admin not found" });
        }
        return res.status(200).json({ admin });
    }
    catch (error) {
        console.error("Error fetching admin profile:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
