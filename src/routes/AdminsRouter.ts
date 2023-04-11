import { Router } from "express";
import { AdminController } from "../controllers/AdminController";

export class AdminRouter {
  private router: Router;
  private AdminController: AdminController;

  constructor(router: Router, AdminController: AdminController) {
    this.router = router;
    this.AdminController = AdminController;
    this.initRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private initRoutes() {
    this.router.get("/", this.bind(this.AdminController.getAllAdmins));
    this.router.get("/:id", this.bind(this.AdminController.getAdminById));
    this.router.delete("/:id", this.bind(this.AdminController.deleteAdmin));
    this.router.post("/", this.bind(this.AdminController.newAdmin));
  }

  private bind(method: Function) {
    return method.bind(this.AdminController);
  }
}
