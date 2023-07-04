import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "../controllers/UserController";
type MiddlewareFn = (req: Request, res: Response) => Promise<any>;
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


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

  public checkBlockedUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let userId = req.params.id || req.body.userId;
      if (isNaN(userId as any)) {
        return res.status(404).json({ message: `Invalid id: ${userId}` });
      }

      const isRequestedUserBlocked = await this.userController.isBlocked(Number.parseInt(userId, 10));

      if (req.headers["x-role"] !== "admin" && isRequestedUserBlocked) {
        return res.status(403).json({ message: "User is blocked" });
      }
      next();
    } catch (err) {
      next(err);
    }
  };

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
    this.router.get("/interests", this.routeHandler(this.userController.getInterests));
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
    this.router.get("/", this.routeHandler(this.userController.getAllUsers));

    this.router.get("/by_email/:email", this.routeHandler(this.userController.findUserByEmail));

    this.router.delete("/", this.routeHandler(this.userController.deleteAllUsers));


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
    this.router.delete("/:id", this.routeHandler(this.userController.deleteUser));

    this.router.get(
      "/:id",
      this.checkBlockedUser,
      this.routeHandler(this.userController.getUserEntireDataById)
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
      this.checkBlockedUser,
      this.routeHandler(this.userController.getUserData)
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
      this.checkBlockedUser,
      this.routeHandler(this.userController.addUserData)
    );

    this.router.put(
      "/:id",
      this.checkBlockedUser,
      this.routeHandler(this.userController.updateUser)
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
    this.router.post("/", this.routeHandler(this.userController.newUser));

    this.router.post(
      "/resetPasswordEmail",
      this.routeHandler(this.userController.changePassword)
    );

    this.router.post(
      "/block",
      this.checkBlockedUser,
      this.routeHandler(this.userController.blockUser)
    );

    this.router.post("/follow",
      this.routeHandler(this.userController.followUser));

    this.router.post("/unfollow",
      this.routeHandler(this.userController.unfollowUser));

    this.router.get("/:id/followers",
      this.routeHandler(this.userController.getFollowers));

    this.router.get("/:id/following",
      this.routeHandler(this.userController.getFollowedUsers));

    this.router.post("/unblock",
      this.routeHandler(this.userController.unblockUser));

    this.router.get("/blocked", this.routeHandler(this.userController.getBlockedUsers));

    this.router.post("/:id/set-push-token", this.routeHandler(this.userController.setPushToken));

    this.router.get("/:id/get-push-token", this.routeHandler(this.userController.getPushToken));
    this.router.post(
      "/:id/profilePicture",
      upload.single('file'), // Use Multer middleware to handle the file upload
      this.routeHandler(this.userController.addProfilePicture)
    );

    this.router.get(
      "/:id/profilePicture",
      this.routeHandler(this.userController.getProfilePicture)
    );

    this.router.post(
      "/:id/notifications",
      this.routeHandler(this.userController.newNotification)
    );

    this.router.get(
      "/:id/notifications",
      this.routeHandler(this.userController.getNotifications)
    );

    this.router.put(
      "/:id/name",
      this.routeHandler(this.userController.changeName)
    );
  }

  private routeHandler(method: Function) {
    return asyncErrorHandler(async (req, res) => {
      await this.bind(method)(req, res);
    });
  }
  private bind(method: Function) {
    return method.bind(this.userController);
  }
}
