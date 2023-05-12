import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "../controllers/UserController";

type MiddlewareFn = (req: Request, res: Response) => Promise<any>;

const asyncErrorHandler =
  (fn: MiddlewareFn) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

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
     * '/api/users/interests':
     *   get:
     *     tags:
     *       - Users
     *     description: "Returns all interests"
     *     responses:
     *       200:
     *         description: "A list of interests"
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: string
     *             example:
     *               - "Outdoor"
     *               - "Indoor"
     *               - "Gym"
     *               - "Cardio"
     *               - "Groups"
     *               - "Solo"
     *               - "Intense"
     *               - "Relaxing"
     */
    this.router.get("/interests", this.bind(this.userController.getInterests));
    /**
     * @openapi
     * '/api/users':
     *   get:
     *     tags:
     *       - Users
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

    this.router.delete("/", this.bind(this.userController.deleteAllUsers));

    /**
     * @openapi
     * /api/users/{userId}:
     *   delete:
     *     summary: Delete a user by ID
     *     tags:
     *       - Users
     *     parameters:
     *       - name: userId
     *         in: path
     *         description: ID of the user to delete
     *         required: true
     *         schema:
     *           type: integer
     *           format: int64
     *     responses:
     *       '204':
     *         description: User deleted successfully
     *       '404':
     *         description: User not found
     *       '500':
     *         description: Internal Server Error
     */
    this.router.delete("/:id", this.bind(this.userController.deleteUser));

    this.router.get(
      "/:id",
      this.bind(this.userController.getUserEntireDataById)
    );

    /**
     * @openapi
     * /api/users/{userId}/metadata:
     *   get:
     *     summary: Retrieve metadata for a user by ID
     *     tags:
     *       - Users
     *     parameters:
     *       - name: userId
     *         in: path
     *         description: ID of the user to retrieve metadata for
     *         required: true
     *         schema:
     *           type: integer
     *           format: int64
     *     responses:
     *       '200':
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserMetadata'
     *       '404':
     *         description: User metadata not found
     *       '500':
     *         description: Internal Server Error
     */
    this.router.get(
      "/:id/metadata",
      this.bind(this.userController.getUserData)
    );

    /**
     * @openapi
     * /api/users/{userId}/metadata:
     *   put:
     *     summary: Update metadata for a user by ID
     *     tags:
     *       - Users
     *     parameters:
     *       - name: userId
     *         in: path
     *         description: ID of the user to update metadata for
     *         required: true
     *         schema:
     *           type: integer
     *           format: int64
     *     requestBody:
     *       description: Updated metadata for the user
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserMetadata'
     *     responses:
     *       '204':
     *         description: User metadata updated successfully
     *       '404':
     *         description: User metadata not found
     *       '500':
     *         description: Internal Server Error
     */
    this.router.put(
      "/:id/metadata",
      this.bind(this.userController.addUserData)
    );

    /**
     * @openapi
     * '/api/users':
     *   post:
     *     tags:
     *       - Users
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

    this.router.post(
      "/changepassword",
      this.bind(this.userController.changePassword)
    );

    this.router.post(
      "/block",
      asyncErrorHandler(async (req, res) => {
        await this.bind(this.userController.blockUser)(req, res);
      })
    );

    this.router.post("/unblock", this.bind(this.userController.unblockUser));

    this.router.get("/blocked", this.bind(this.userController.getBlockedUsers));
  }

  private bind(method: Function) {
    return method.bind(this.userController);
  }
}
