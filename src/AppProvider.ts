import { PrismaClient } from "@prisma/client";
import { HealthCheckController } from "./controllers/HealthCheckController";
import { UserController } from "./controllers/UserController";
import { AppRouter } from "./routes/AppRouter";
import { HealthCheckRouter } from "./routes/HealthCheckRouter";
import { UserRouter } from "./routes/UserRouter";
import express from "express";
import { UserDal } from "./dal/UserDal";
import { IUserDal } from "./dal/IUserDal";

export class AppProvider {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private getUserDal(): IUserDal {
    return new UserDal(this.prisma);
  }

  public getAppRouter() {
    return new AppRouter(
      new HealthCheckRouter(express.Router(), new HealthCheckController()),
      new UserRouter(express.Router(), new UserController(this.getUserDal()))
    );
  }
}
