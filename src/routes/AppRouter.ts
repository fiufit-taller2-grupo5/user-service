import { Express } from "express";
import { UserRouter } from "./UserRouter";
import { HealthCheckRouter } from "./HealthCheckRouter";

export class AppRouter {
  private healthCheckRouter: HealthCheckRouter;
  private userRouter: UserRouter;

  constructor(healthCheckRouter: HealthCheckRouter, userRouter: UserRouter) {
    this.healthCheckRouter = healthCheckRouter;
    this.userRouter = userRouter;
  }

  public initRoutes(expressApp: Express) {
    expressApp.use("/api/user", this.userRouter.getRouter());
    expressApp.use("/api/healh-check", this.healthCheckRouter.getRouter());
  }
}
