import { Express, NextFunction } from "express";
import { UserRouter } from "./UserRouter";
import { HealthCheckRouter } from "./HealthCheckRouter";
import { AdminRouter } from "./AdminsRouter";
export class AppRouter {
  private healthCheckRouter: HealthCheckRouter;
  private userRouter: UserRouter;
  private adminRouter: AdminRouter;

  constructor(
    healthCheckRouter: HealthCheckRouter,
    userRouter: UserRouter,
    adminRouter: AdminRouter
  ) {
    this.healthCheckRouter = healthCheckRouter;
    this.userRouter = userRouter;
    this.adminRouter = adminRouter;
  }

  public initRoutes(expressApp: Express) {
    expressApp.use("/health", this.healthCheckRouter.getRouter());
    expressApp.use("/api/users", this.userRouter.getRouter());
    expressApp.use("/api/admins", this.adminRouter.getRouter());
  }
}
