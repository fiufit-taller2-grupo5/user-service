/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - email
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           default: "johndoe@mail.com"
 *         name:
 *          type: string
 *          default: "johndoe"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         email:
 *           type: string
 *         name:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         state:
 *           type: string
 *         role:
 *           type: string
 *     UserList:
 *       type: object
 *       properties:
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 */
