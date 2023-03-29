import { Router } from "express";
import { HealthCheckContrller } from "../controllers/HealthCheckController";

export class HealthCheckRouter {
  private router: Router;
  private healthCheckController: HealthCheckContrller;

  constructor(router: Router, healthCheckController: HealthCheckContrller) {
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
