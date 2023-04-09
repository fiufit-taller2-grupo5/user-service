import { Express } from "express";
import { UserRouter } from "./UserRouter";
import { HealthCheckRouter } from "./HealthCheckRouter";
// import functions from auth-middleware.js 

export class AppRouter {
  private healthCheckRouter: HealthCheckRouter;
  private userRouter: UserRouter;

  constructor(healthCheckRouter: HealthCheckRouter, userRouter: UserRouter) {
    this.healthCheckRouter = healthCheckRouter;
    this.userRouter = userRouter;
  }

  public initRoutes(expressApp: Express) {
    expressApp.use("/health-check", this.healthCheckRouter.getRouter());
    expressApp.use("/api/users", this.userRouter.getRouter());
  }
}
