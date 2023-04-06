import { Request, Response } from "express";
import { OK } from "../constants/httpConstants";
import { PrismaClient, User } from "@prisma/client";
import { ACTIVE_USER } from "../constants/userStateConstants";

export class UserController {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async getAllUsers(_req: Request, res: Response) {
    res.status(OK).json({ users: await this.prisma.user.findMany() });
  }

  public async getUserById(req: Request, res: Response) {
    const userId: number = +req.params.id;

    const user: User | null = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(OK).json({
      id: user.id,
      name: user.name,
      email: user.email,
      state: user.state,
    });
  }

  public async newUser(req: Request, res: Response) {
    const { name, email } = req.body;
    if (!name || !email) {
      console.error("Missing name or email");
      res.status(400).json({ error: "Missing name or email" });
    }

    if (await this.prisma.user.findFirst({ where: { name: name } })) {
      res.status(409).json({ error: `User with name ${name} already exists` });
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
        state: ACTIVE_USER,
      },
    });

    res.status(OK).json({ user });
  }
}
