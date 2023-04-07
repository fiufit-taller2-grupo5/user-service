import { Request, Response } from "express";
import { BAD_REQUEST, CONFLICT, CREATED, OK } from "../constants/httpConstants";
import { User } from "@prisma/client";
import { IUserDal } from "../dal/IUserDal";

export class UserController {
  private userDal: IUserDal;

  constructor(userDal: IUserDal) {
    this.userDal = userDal;
  }

  public async getAllUsers(_req: Request, res: Response) {
    res.status(OK).json({ users: await this.userDal.findAll() });
  }

  public async getUserById(req: Request, res: Response) {
    const userId: number = +req.params.id;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST).json({ error: "Invalid id" });
    }

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
      return res.status(BAD_REQUEST).json({ error: "Missing name or email" });
    }

    if (await this.userDal.findByName(name)) {
      return res
        .status(CONFLICT)
        .json({ error: `User with name ${name} already exists` });
    }

    const newUser = await this.userDal.create(name, email);
    console.log(newUser);
    res.status(CREATED).json({
      status: `User ${newUser.name} with id ${newUser.id} created`,
    });
  }
}
