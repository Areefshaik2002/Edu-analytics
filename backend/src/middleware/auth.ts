import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    username: string;
  };
}

export const authGuard = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      status: "error",
      message: "Access denied. No authentication token provided."
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "replace_with_secure_secret";
    const decoded = jwt.verify(token, secret) as { username: string };
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Invalid or expired token."
    });
  }
};
