import { NextFunction, Request, Response } from "express";
import {
  BAD_REQUEST_CODE,
  CONFLICT_CODE,
  CREATED_CODE,
  DELETED_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
  OK_CODE,
} from "../constants/httpConstants";
import { IUserDal } from "../dal/IUserDal";
import { getResetPasswordUrl } from "../firebase/frebaseUtils";
import { Error } from "../Error";

export class UserController {
  private userDal: IUserDal;

  constructor(userDal: IUserDal) {
    this.userDal = userDal;
  }

  public errorHandler(error: any, res: Response) {
    if (error instanceof Error) {
      return res.status(error.getCode()).json({ error: error.getMessage() });
    } else {
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .json({ unexpectedError: error.message });
    }
  }

  public async getAllUsers(req: Request, res: Response) {
    if (req.query.id !== undefined) {
      return await this.getUserById(req, res, +req.query.id);
    }
    if (req.query.email !== undefined) {
      return await this.getUserByEmail(req, res, req.query.email as string);
    }

    const users = await this.userDal.findAll();
    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.set("X-Total-Count", `${users.length}`);
    if (users.length === 0) {
      return res.status(OK_CODE).json({ message: "No users found" });
    }
    return res.status(OK_CODE).json(users);
  }

  public async deleteUser(req: Request, res: Response) {
    const userId: number = +req.params.id;
    try {
      const user = await this.userDal.deleteById(userId);
      return res
        .status(DELETED_CODE)
        .json({ status: `User of id ${user.id} deleted_CODE` });
    } catch (error: any) {
      return this.errorHandler(error, res);
    }
  }

  public async deleteAllUsers(req: Request, res: Response) {
    try {
      await this.userDal.deleteAllUsers();
      return res
        .status(DELETED_CODE)
        .json({ status: "All users deleted_CODE" });
    } catch (error: any) {
      return this.errorHandler(error, res);
    }
  }

  private async getUserById(req: Request, res: Response, userId: number) {
    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }
    try {
      const user = await this.userDal.findById(userId);
      return res.status(OK_CODE).json(user);
    } catch (error: any) {
      return this.errorHandler(error, res);
    }
  }

  private async getUserByEmail(req: Request, res: Response, email: string) {
    try {
      const user = await this.userDal.findByEmail(email);
      return res.status(OK_CODE).json(user);
    } catch (error: any) {
      return this.errorHandler(error, res);
    }
  }

  public async newUser(req: Request, res: Response) {
    const { name, email } = req.body;
    if (!name || !email) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ error: "Missing name or email" });
    }

    try {
      const newUser = await this.userDal.create(name, email);
      return res.status(CREATED_CODE).json({
        status: `User ${newUser.name} with id ${newUser.id} created_CODE`,
      });
    } catch (error: any) {
      return this.errorHandler(error, res);
    }
  }

  public async getInterests(req: Request, res: Response) {
    const enumValues = await this.userDal.getInterests();
    return res.json(enumValues);
  }

  public async addUserData(req: Request, res: Response) {
    const userId = +req.params.id;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }

    const { weight, height, birthDate, location, interests } = req.body;
    if (!location) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Missing location" });
    }

    try {
      await this.userDal.addData({
        userId,
        weight,
        height,
        birthDate,
        location,
        interests,
      });

      return res
        .status(OK_CODE)
        .json({ status: `Metadata added for user with id ${userId}` });
    } catch (error: any) {
      return this.errorHandler(error, res);
    }
  }

  public async getUserEntireDataById(req: Request, res: Response) {
    const userId = +req.params.id;
    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }
    try {
      const userWithMetadata = await this.userDal.findByIdWithMetadata(userId);
      if (!userWithMetadata) {
        return res.status(NOT_FOUND_CODE).json({ error: "User not found" });
      }
      return res.status(OK_CODE).json(userWithMetadata);
    } catch (error: any) {
      return this.errorHandler(error, res);
    }
  }

  public async getUserData(req: Request, res: Response) {
    const userId = +req.params.id;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }

    try {
      const metaData = await this.userDal.getData(userId);
      return res.status(OK_CODE).json(metaData);
    } catch (error: any) {
      return this.errorHandler(error, res);
    }
  }

  public async changePassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res
          .status(BAD_REQUEST_CODE)
          .json({ error: "email is required" });
      }

      const url = await getResetPasswordUrl(email);
      return res.status(OK_CODE).json({ url: url });
    } catch (err) {
      console.log(err);
      return res.status(NOT_FOUND_CODE).json({ error: err });
    }
  }

  public async blockUser(req: Request, res: Response) {
    await this.userDal.blockUser(req.body.userId);
    return res.status(OK_CODE).json({ status: "User blocked" });
  }

  public async unblockUser(req: Request, res: Response) {
    const userId = +req.body.userId;
    if (!userId) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }

    try {
      const user = await this.userDal.unblockUser(userId);
      return res.status(OK_CODE).json({ status: "User unblocked" });
    } catch (error: any) {
      return this.errorHandler(error, res);
    }
  }

  public async getBlockedUsers(_req: Request, res: Response) {
    try {
      const users = await this.userDal.blockedUsers();
      console.log(`Found ${users.length} blocked users`);

      if (users && users.length === 0) {
        return res.status(OK_CODE).json({ error: "No blocked users found" });
      }

      return res.status(OK_CODE).json(users);
    } catch (error: any) {
      return this.errorHandler(error, res);
    }
  }
}
