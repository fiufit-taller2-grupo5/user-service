import { Request, Response } from "express";
import {
  BAD_REQUEST_CODE,
  CREATED_CODE,
  OK_CODE,
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
    if (admins.length === 0) {
      return res.status(OK_CODE).json({ message: "No admins found" });
    }
    return res.status(OK_CODE).json(admins);
  }

  public async deleteAdmin(req: Request, res: Response) {
    const adminId: number = +req.params.id;

    const admin = await this.adminDal.deleteById(adminId);
    console.log(`Deleting admin of id ${admin.id}`);
    return res.status(OK_CODE).json({ status: "Admin deleted" });

  }


  public async findByName(req: Request, res: Response) {
    const name: string = req.params.name;

    const admin = await this.adminDal.findByName(name);
    return res.status(OK_CODE).json(admin);

  }

  public async findAdminByEmail(req: Request, res: Response) {
    const email: string = req.params.email;

    const admin = await this.adminDal.findByEmail(email);
    return res.status(OK_CODE).json(admin);
  }


  public async getAdminById(req: Request, res: Response) {
    const adminId: number = +req.params.id;

    if (isNaN(adminId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }


    const admin = await this.adminDal.findById(adminId);
    return res.status(OK_CODE).json(admin);
  }

  public async newAdmin(req: Request, res: Response) {
    const { name, email, password } = req.body;
    if (!name || !email) {
      console.error("Missing name or email");
      return res.status(BAD_REQUEST_CODE).json({ error: "Missing name or email" });
    }

    const admin = await this.adminDal.create(name, email);
    return res.status(CREATED_CODE).json(admin);
  }
}
