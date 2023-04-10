import { Router } from "express";
import { HealthCheckController } from "../controllers/HealthCheckController";
import express, { Request, Response } from 'express';

export class HealthCheckRouter {
  private router: Router;
  private healthCheckController: HealthCheckController;

  constructor(router: Router, healthCheckController: HealthCheckController) {
    this.router = router;
    this.healthCheckController = healthCheckController;
    this.initRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private initRoutes() {
    this.router.get("/", this.bind(this.healthCheckController.healthCheck));
    // catch-all route
    this.router.all("*", this.bind(this.handleNotFound));
  }


  private bind(method: Function) {
    return method.bind(this.healthCheckController);
  }

  private handleNotFound(req: Request, res: Response) {
    res.status(404).send("Endpoint not found");

  }
}