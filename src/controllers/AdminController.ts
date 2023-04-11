import { Request, Response } from "express";
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  OK,
} from "../constants/httpConstants";
import { IAdminDal } from "../dal/IAdminDal";

export class AdminController {
  private adminDal: IAdminDal;

  constructor(adminDal: IAdminDal) {
    this.adminDal = adminDal;
  }

  public async getAllAdmins(_req: Request, res: Response) {
    const admins = await this.adminDal.findAll();
    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.set("X-Total-Count", `${admins.length}`);
    return res.status(OK).json(admins);
  }

  public async deleteAdmin(req: Request, res: Response) {
    const userId: number = +req.params.id;
    try {
      const user = await this.adminDal.deleteById(userId);
      console.log(`Deleting admin of id ${user.id}`);
      res.status(OK).json({ status: "User deleted" });
    } catch (error: any) {
      res.status(INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  public async getAdminById(req: Request, res: Response) {
    const userId: number = +req.params.id;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST).json({ error: "Invalid id" });
    }

    const user = await this.adminDal.findById(userId);

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

  public async newAdmin(req: Request, res: Response) {
    const { name, email } = req.body;
    if (!name || !email) {
      console.error("Missing name or email");
      return res.status(BAD_REQUEST).json({ error: "Missing name or email" });
    }

    const newUser = await this.adminDal.create(name, email);
    console.log(newUser);
    res.status(CREATED).json({
      status: `User ${newUser.name} with id ${newUser.id} created`,
    });
  }
}
