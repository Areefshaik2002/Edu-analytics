import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "password123";

    if (username === adminUsername && password === adminPassword) {
      const secret = process.env.JWT_SECRET || "replace_with_secure_secret";
      const token = jwt.sign({ username }, secret, { expiresIn: "24h" });
      
      res.json({ token });
      return;
    }

    res.status(401).json({
      status: "error",
      message: "Invalid username or password"
    });
  } catch (error) {
    next(error);
  }
};
