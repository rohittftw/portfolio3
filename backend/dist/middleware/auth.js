"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.authenticateAdmin = authenticateAdmin;
exports.optionalAuth = optionalAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../controller/prisma");
// JWT Secret - In production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
// Parse JWT_EXPIRES_IN to handle both string and number types correctly
const JWT_EXPIRES_IN = (() => {
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";
    return isNaN(Number(expiresIn)) ? expiresIn : Number(expiresIn);
})();
// If the value is a string like '24h', it's fine. If it's a numeric value, use it as seconds.
function generateToken(admin) {
    const signOptions = {
        // No type error now
        issuer: 'portfolio-api',
        audience: 'portfolio-admin'
    };
    return jsonwebtoken_1.default.sign({
        admin_id: admin.admin_id,
        username: admin.username
    }, JWT_SECRET, signOptions);
}
// Verify JWT token
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET, {
            issuer: 'portfolio-api',
            audience: 'portfolio-admin'
        });
    }
    catch (error) {
        return null;
    }
}
// Authentication middleware
function authenticateAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json({
                    msg: "Access denied. No token provided or invalid format.",
                    code: "NO_TOKEN"
                });
                return;
            }
            // Extract token
            const token = authHeader.substring(7); // Remove "Bearer " prefix
            // Verify token
            const decoded = verifyToken(token);
            if (!decoded) {
                res.status(401).json({
                    msg: "Invalid or expired token.",
                    code: "INVALID_TOKEN"
                });
                return;
            }
            // Check if admin still exists in database
            const admin = yield prisma_1.prisma.admin.findUnique({
                where: { admin_id: decoded.admin_id },
                select: { admin_id: true, username: true }
            });
            if (!admin) {
                res.status(401).json({
                    msg: "Admin account not found.",
                    code: "ADMIN_NOT_FOUND"
                });
                return;
            }
            // Add admin info to request object
            req.admin = admin;
            next();
        }
        catch (error) {
            console.error("Authentication error:", error);
            res.status(500).json({
                msg: "Internal server error during authentication.",
                code: "AUTH_ERROR"
            });
        }
    });
}
// Optional middleware to check if admin is authenticated but don't require it
function optionalAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                const token = authHeader.substring(7);
                const decoded = verifyToken(token);
                if (decoded) {
                    const admin = yield prisma_1.prisma.admin.findUnique({
                        where: { admin_id: decoded.admin_id },
                        select: { admin_id: true, username: true }
                    });
                    if (admin) {
                        req.admin = admin;
                    }
                }
            }
            next();
        }
        catch (error) {
            // Don't fail on optional auth errors, just continue without admin info
            next();
        }
    });
}
