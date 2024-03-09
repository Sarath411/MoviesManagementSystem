import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/users.model";

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUser;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return res.status(401).send({ error: "Not authorized" });
  }

  const token = req.headers.authorization.split("Bearer ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new Error("User not found");
    }
    req.currentUser = user;

    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized" });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.currentUser?.role !== "admin") {
    return res.status(403).send({ error: "Requires admin role" });
  }
  next();
};
