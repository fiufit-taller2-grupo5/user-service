import { Router } from "express";
import { UserController } from "../controllers/UserController";

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor(router: Router, userController: UserController) {
    this.router = router;
    this.userController = userController;
    this.initRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private initRoutes() {
    this.router.get("/", this.bind(this.userController.getAllUsers));
    this.router.get("/:id", this.bind(this.userController.getUserById));
    this.router.get(
      "/:id/metadata",
      this.bind(this.userController.getUserData)
    );
    this.router.put(
      "/:id/metadata",
      this.bind(this.userController.addUserData)
    );
    this.router.post("/", this.bind(this.userController.newUser));
  }

  private bind(method: Function) {
    return method.bind(this.userController);
  }
}
