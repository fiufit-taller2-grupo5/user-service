import { Request, Response } from "express";
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  OK,
  CONFLICT,
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
    const adminId: number = +req.params.id;
    try {
      const admin = await this.adminDal.deleteById(adminId);
      console.log(`Deleting admin of id ${admin.id}`);
      res.status(OK).json({ status: "Admin deleted" });
    } catch (error: any) {
      res.status(INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }


  public async findByName(req: Request, res: Response) {
    const name: string = req.params.name;
    const admin = await this.adminDal.findByName(name);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(OK).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      state: admin.state,
    });
  }

  public async findAdminByEmail(req: Request, res: Response) {
    const email: string = req.params.email;
    const admin = await this.adminDal.findByEmail(email);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(OK).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      state: admin.state,
    });
  }


  public async getAdminById(req: Request, res: Response) {
    const adminId: number = +req.params.id;

    if (isNaN(adminId)) {
      return res.status(BAD_REQUEST).json({ error: "Invalid id" });
    }

    const admin = await this.adminDal.findById(adminId);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(OK).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      state: admin.state,
    });
  }

  public async newAdmin(req: Request, res: Response) {
    const { name, email, password } = req.body;
    if (!name || !email) {
      console.error("Missing name or email");
      return res.status(BAD_REQUEST).json({ error: "Missing name or email" });
    }

    if (await this.adminDal.findByEmail(email)) {
      console.error(`Admin with email ${email} already exists`);
      return res
        .status(CONFLICT)
        .json({ error: `Admin with email ${email} already exists` });
    }

    const newAdminCreated = await this.adminDal.create(name, email);
    console.log(newAdminCreated);
    return res.status(CREATED).json({
      status: `Admin ${newAdminCreated.name} with id ${newAdminCreated.id} created`,
    });
  }


}
