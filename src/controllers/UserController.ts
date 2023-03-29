import { Request, Response } from 'express';

export class UserController {
  public async getAllUsers(_req: Request, res: Response) {
    res.status(200).json({ users: [] });
  }

  public async createNewUser(req: Request, res: Response) {
    const { username, email, password } = req.body;
  }
}
