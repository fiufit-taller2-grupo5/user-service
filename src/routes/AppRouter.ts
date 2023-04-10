import { Express } from "express";
import { UserRouter } from "./UserRouter";
import { HealthCheckRouter } from "./HealthCheckRouter";
import express, { Request, Response } from 'express';

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
    // catch-all route for 404 errors
    expressApp.use((req: Request, res: Response) => {
      this.handleNotFound(req, res);
    });
  }
  private handleNotFound(req: Request, res: Response) {
    res.status(404).send("Endpoint not found");

  }
}
