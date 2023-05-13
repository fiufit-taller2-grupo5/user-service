import { NextFunction, Router, Request, Response } from "express";
import { AdminController } from "../controllers/AdminController";

export type MiddlewareFn = (req: Request, res: Response) => Promise<any>;

const asyncErrorHandler =
  (fn: MiddlewareFn) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

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
    /**
     * @openapi
     * '/api/admins':
     *   get:
     *     tags:
     *       - Admins
     *     description: "Returns all admins"
     *     responses:
     *       200:
     *         description: "A list of admins"
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Admin'
     *
     */
    this.router.get("/", this.routeHandler(this.AdminController.getAllAdmins));

    /**
     * @openapi
     * /api/admins/{adminId}:
     *   get:
     *     summary: Retrieve an admin by ID
     *     tags:
     *       - Admins
     *     parameters:
     *       - name: adminId
     *         in: path
     *         description: ID of the admin to retrieve
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
     *               $ref: '#/components/schemas/Admin'
     *       '404':
     *         description: Admin not found
     *       '500':
     *         description: Internal Server Error
     */
    this.router.get("/:id", this.routeHandler(this.AdminController.getAdminById));

    /**
     * @openapi
     * /api/admins/{adminId}:
     *   delete:
     *     summary: Delete an admin by ID
     *     tags:
     *       - Admins
     *     parameters:
     *       - name: adminId
     *         in: path
     *         description: ID of the user to delete
     *         required: true
     *         schema:
     *           type: integer
     *           format: int64
     *     responses:
     *       '204':
     *         description: Admin deleted successfully
     *       '404':
     *         description: Admin not found
     *       '500':
     *         description: Internal Server Error
     */
    this.router.delete("/:id", this.routeHandler(this.AdminController.deleteAdmin));


    /**
     * @openapi
     * '/api/admins':
     *   post:
     *     tags:
     *       - Admins
     *     summary: Creates new Admin
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateUserInput'
     *     responses:
     *       201:
     *         description: Successfully created new Admin
     *       400:
     *         description: Invalid request body
     *       409:
     *         description: Admin already exists
     */
    this.router.post("/", this.routeHandler(this.AdminController.newAdmin));
  }

  private routeHandler(method: Function) {
    return asyncErrorHandler(async (req, res) => {
      await this.bind(method)(req, res);
    });
  }

  private bind(method: Function) {
    return method.bind(this.AdminController);
  }
}
