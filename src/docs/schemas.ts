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

/**
 * @openapi
 * components:
 *   schemas:
 *     UserMetadata:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           format: int64
 *         weight:
 *           type: number
 *           format: float
 *           nullable: true
 *         height:
 *           type: number
 *           format: float
 *           nullable: true
 *         birthDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         latitude:
 *           type: number
 *           format: float
 *         longitude:
 *           type: number
 *           format: float
 *       required:
 *         - userId
 *         - latitude
 *         - longitude
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Admin:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           properties:
 *             role:
 *               type: string
 *               enum: ['admin']
 */
