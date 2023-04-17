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
    this.router.get("/", this.bind(this.AdminController.getAllAdmins));

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
    this.router.get("/:id", this.bind(this.AdminController.getAdminById));

    /**
     * @openapi
     * /api/users/{adminId}:
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
    this.router.delete("/:id", this.bind(this.AdminController.deleteAdmin));

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
    this.router.post("/", this.bind(this.AdminController.newAdmin));
  }

  private bind(method: Function) {
    return method.bind(this.AdminController);
  }
}
