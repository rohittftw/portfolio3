import { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../controller/prisma";

// Extend Request interface to include admin user info
declare global {
  namespace Express {
    interface Request {
      admin?: {
        admin_id: number;
        username: string;
      };
    }
  }
}

// JWT Secret - In production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

// Parse JWT_EXPIRES_IN to handle both string and number types correctly
const JWT_EXPIRES_IN: string | number = (() => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "24h";
  return isNaN(Number(expiresIn)) ? expiresIn : Number(expiresIn);
})();
// If the value is a string like '24h', it's fine. If it's a numeric value, use it as seconds.
export function generateToken(admin: { admin_id: number; username: string }): string {
  const signOptions: SignOptions = {
     // No type error now
    issuer: 'portfolio-api',
    audience: 'portfolio-admin'
  };

  return jwt.sign(
    {
      admin_id: admin.admin_id,
      username: admin.username
    },
    JWT_SECRET,
    signOptions
  );
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'portfolio-api',
      audience: 'portfolio-admin'
    });
  } catch (error) {
    return null;
  }
}

// Authentication middleware
export async function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
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
    const admin = await prisma.admin.findUnique({
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
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      msg: "Internal server error during authentication.",
      code: "AUTH_ERROR"
    });
  }
}

// Optional middleware to check if admin is authenticated but don't require it
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      if (decoded) {
        const admin = await prisma.admin.findUnique({
          where: { admin_id: decoded.admin_id },
          select: { admin_id: true, username: true }
        });

        if (admin) {
          req.admin = admin;
        }
      }
    }

    next();
  } catch (error) {
    // Don't fail on optional auth errors, just continue without admin info
    next();
  }
}
