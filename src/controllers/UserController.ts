import { Request, Response } from "express";
import { OK } from "../constants/http";

export class UserController {
  public async getAllUsers(_req: Request, res: Response) {
    res.status(OK).json({ users: [] });
  }
}
