import express, { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../controller/prisma";


const app = express();


// Extend Request interface
// declare global {
//   namespace Express {
//     interface Request {
//       admin?: {
//         admin_id: number;
//         username: string;
//       };
//     }
//   }
// }


interface AuthenticatedRequest extends Request{
  admin?: {
    admin_id: number;
    username: string;
  };
}
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

const JWT_EXPIRES_IN: string | number = (() => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "24h";
  return isNaN(Number(expiresIn)) ? expiresIn : Number(expiresIn);
})();

export function generateToken(admin: { admin_id: number; username: string }): string {
  console.log("Generating token for admin:", admin);

  const signOptions: SignOptions = {
    issuer: "portfolio-api",
    audience: "portfolio-admin",
    expiresIn: JWT_EXPIRES_IN as any,
  };

  const token = jwt.sign(
    {
      admin_id: admin.admin_id,
      username: admin.username,
    },
    JWT_SECRET,
    signOptions
  );

  console.log("Generated JWT token:", token);
  return token;
}

export function verifyToken(token: string): any {
  try {
    console.log("Verifying token:", token);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Token decoded:", decoded);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export const authenticateAdmin = (
  req:AuthenticatedRequest,
  res:Response,
  next: NextFunction
): Response | void => {
  try {


    console.log("Authenticating admin...");

    // Check if cookies are present at all
    if (!req.cookies) {
      console.warn("No cookies found in the request!");
      return res.status(401).json({ msg: "Access denied. No cookies found." });
    }

    // Get token from cookie
    const token = req.cookies.authToken;
    console.log("authToken from cookie:", token);

    if (!token) {
      console.warn("No authToken cookie found");
      return res.status(401).json({ msg: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      console.warn("Decoded token is null or invalid");
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      res.clearCookie("authExpiry", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return res.status(401).json({ msg: "Invalid or expired token" });
    }

    // Attach admin info to request
    req.admin = {
      admin_id: decoded.admin_id,
      username: decoded.username,
    };

    console.log("Admin authenticated:", req.admin);
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);

    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.clearCookie("authExpiry", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

// export async function optionalAuth(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   try {
//     console.log("Running optionalAuth middleware");
//     const authHeader = req.headers.authorization;
//     console.log("Authorization header:", authHeader);

//     if (authHeader && authHeader.startsWith("Bearer ")) {
//       const token = authHeader.substring(7);
//       const decoded = verifyToken(token);
//       if (decoded) {
//         const admin = await prisma.admin.findUnique({
//           where: { admin_id: decoded.admin_id },
//           select: { admin_id: true, username: true },
//         });

//         if (admin) {
//           req.admin = admin;
//           console.log("Optional auth success - admin attached to req:", admin);
//         }
//       }
//     }
//     next();
//   } catch (error) {
//     console.error("optionalAuth middleware error:", error);
//     next();
//   }
// }
