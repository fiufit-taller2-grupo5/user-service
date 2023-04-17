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
    /**
     * @openapi
     * 'api/users':
     *   get:
     *     tags:
     *       - User
     *     description: "Returns all users"
     *     responses:
     *       200:
     *         description: "A list of users"
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserList'
     *
     */
    this.router.get("/", this.bind(this.userController.getAllUsers));
    this.router.get("/:id", this.bind(this.userController.getUserById));
    this.router.delete("/:id", this.bind(this.userController.deleteUser));
    this.router.get(
      "/:id/metadata",
      this.bind(this.userController.getUserData)
    );
    this.router.put(
      "/:id/metadata",
      this.bind(this.userController.addUserData)
    );

    /**
     * @openapi
     * '/api/users':
     *   post:
     *     tags:
     *       - User
     *     summary: Creates new User
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateUserInput'
     *     responses:
     *       201:
     *         description: Successfully created user
     *       400:
     *         description: Invalid request body
     *       409:
     *         description: User already exists
     */
    this.router.post("/", this.bind(this.userController.newUser));
  }

  private bind(method: Function) {
    return method.bind(this.userController);
  }
}
