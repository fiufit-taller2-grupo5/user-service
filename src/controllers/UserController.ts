import { Request, Response } from "express";
import { OK } from "../constants/httpConstants";
import { User } from "@prisma/client";
import { UserDal } from "../dal/UserDal";

export class UserController {
  private userDal: UserDal;

  constructor(userDal: UserDal) {
    this.userDal = userDal;
  }

  public async getAllUsers(_req: Request, res: Response) {
    res.status(OK).json({ users: await this.userDal.findAll() });
  }

  public async getUserById(req: Request, res: Response) {
    const userId: number = +req.params.id;
    const user: User | null = await this.userDal.findById(userId);

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

    if (await this.userDal.findByName(name)) {
      res.status(409).json({ error: `User with name ${name} already exists` });
    }

    const newUser = await this.userDal.create(name, email);
    res.status(OK).json({ newUser });
  }
}
