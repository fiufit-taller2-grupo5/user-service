import { PrismaClient } from "@prisma/client";
import { HealthCheckController } from "../controllers/HealthCheckController";
import { UserController } from "../controllers/UserController";
import { AppRouter } from "../routes/AppRouter";
import { HealthCheckRouter } from "../routes/HealthCheckRouter";
import { UserRouter } from "../routes/UserRouter";
import express from "express";
import { UserDal } from "../dal/UserDal";
import { IUserDal } from "../dal/IUserDal";
import { IAppProvider } from "./IAppProvider";
import { AdminRouter } from "../routes/AdminsRouter";
import { AdminController } from "../controllers/AdminController";
import { IAdminDal } from "../dal/IAdminDal";
import { AdminDal } from "../dal/AdminDal";

export class AppProvider implements IAppProvider {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public getUserDal(): IUserDal {
    return new UserDal(this.prisma);
  }

  public getAdminDal(): IAdminDal {
    return new AdminDal(this.prisma);
  }

  public getAppRouter() {
    return new AppRouter(
      new HealthCheckRouter(express.Router(), new HealthCheckController()),
      new UserRouter(express.Router(), new UserController(this.getUserDal())),
      new AdminRouter(express.Router(), new AdminController(this.getAdminDal()))
    );
  }
}
