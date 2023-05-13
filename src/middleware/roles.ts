import { Request, Response, NextFunction } from "express";
import { ADMIN_USER } from "../constants/userStateConstants";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body.user;
  if (!user) {
    return res
      .status(401)
      .json({ message: "Unauthorized, user not found in body" });
  }

  if (user.role !== ADMIN_USER) {
    return res.status(403).json({ message: "Forbidden, requires admin role" });
  }

  next();
};
