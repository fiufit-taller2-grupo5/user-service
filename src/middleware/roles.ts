import { Request, Response, NextFunction } from "express";

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

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden, requires admin role" });
  }

  next();
};
