import { Request, Response } from "express";
import { OK } from "../constants/http";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class UserController {
  public async getAllUsers(_req: Request, res: Response) {
    res.status(OK).json({ users: await prisma.user.findMany() });
  }

  public async getUserById(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id);
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    res.status(OK).json({ user });
  }

  public async newUser(req: Request, res: Response) {
    const { name, email } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
        state: "ACTIVE",
      },
    });

    res.status(OK).json({ user });
  }
}
