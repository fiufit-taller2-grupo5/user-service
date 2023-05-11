import { Request, Response } from "express";
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  OK,
  CONFLICT,
} from "../constants/httpConstants";
import { IAdminDal } from "../dal/IAdminDal";
import { Error } from "../Error";

export class AdminController {
  private adminDal: IAdminDal;

  constructor(adminDal: IAdminDal) {
    this.adminDal = adminDal;
  }

  public errorHandler(error: any, res: Response) {
    if (error instanceof Error) {
      return res.status(error.getCode()).json({ error: error.getMessage() });
    } else {
      return res.status(INTERNAL_SERVER_ERROR).json({ unexpectedError: error.message });
    }
  }

  public async getAllAdmins(_req: Request, res: Response) {
    const admins = await this.adminDal.findAll();
    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.set("X-Total-Count", `${admins.length}`);
    if (admins.length === 0) {
      return res.status(OK).json({ message: "No admins found" });
    }
    return res.status(OK).json(admins);
  }

  public async deleteAdmin(req: Request, res: Response) {
    const adminId: number = +req.params.id;
    try {
      const admin = await this.adminDal.deleteById(adminId);
      console.log(`Deleting admin of id ${admin.id}`);
      return res.status(OK).json({ status: "Admin deleted" });
    } catch (error: any) {
      return this.errorHandler(error, res);
    }
  }


  public async findByName(req: Request, res: Response) {
    const name: string = req.params.name;
    try {
      const admin = await this.adminDal.findByName(name);
      return res.status(OK).json(admin);
    } catch (error: any) {
      return this.errorHandler(error, res);
    }
  }

  public async findAdminByEmail(req: Request, res: Response) {
    const email: string = req.params.email;
    try {
      const admin = await this.adminDal.findByEmail(email);
      return res.status(OK).json(admin);
    }
    catch (error: any) {
      return this.errorHandler(error, res);
    }
  }


  public async getAdminById(req: Request, res: Response) {
    const adminId: number = +req.params.id;

    if (isNaN(adminId)) {
      return res.status(BAD_REQUEST).json({ error: "Invalid id" });
    }

    try {
      const admin = await this.adminDal.findById(adminId);
      return res.status(OK).json(admin);
    }
    catch (error: any) {
      return this.errorHandler(error, res);
    }
  }

  public async newAdmin(req: Request, res: Response) {
    const { name, email, password } = req.body;
    if (!name || !email) {
      console.error("Missing name or email");
      return res.status(BAD_REQUEST).json({ error: "Missing name or email" });
    }

    try {
      const admin = await this.adminDal.create(name, email);
      return res.status(CREATED).json({
        status: `Admin created`,
      });

    }
    catch (error: any) {
      return this.errorHandler(error, res);
    }
  }


}
