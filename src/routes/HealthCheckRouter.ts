import { Router } from "express";
import { HealthCheckController } from "../controllers/HealthCheckController";

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
  }

  private bind(method: Function) {
    return method.bind(this.healthCheckController);
  }
}
