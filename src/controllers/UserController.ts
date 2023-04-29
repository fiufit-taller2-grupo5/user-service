import { Request, Response } from "express";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  DELETED,
  INTERNAL_SERVER_ERROR,
  OK,
} from "../constants/httpConstants";
import { IUserDal } from "../dal/IUserDal";

export class UserController {
  private userDal: IUserDal;

  constructor(userDal: IUserDal) {
    this.userDal = userDal;
  }

  public errorHandler(e: any, res: Response) {
    return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message, metadata: e.meta });
  }

  public async getAllUsers(_req: Request, res: Response) {
    const users = await this.userDal.findAll();
    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.set("X-Total-Count", `${users.length}`);
    return res.status(OK).json(users);
  }

  public async deleteUser(req: Request, res: Response) {
    const userId: number = +req.params.id;
    try {
      const user = await this.userDal.deleteById(userId);
      console.log(`Deleting user of id ${user.id}...`);
      return res.status(DELETED).json({ status: "User deleted" });
    } catch (error: any) {
      return res.status(INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }


  public async deleteAllUsers(req: Request, res: Response) {
    try {
      await this.userDal.deleteAllUsers();
      return res.status(DELETED).json({ status: "All users deleted" });
    } catch (error: any) {
      return res.status(INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }



  public async getUserById(req: Request, res: Response) {
    const userId: number = +req.params.id;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST).json({ error: "Invalid id" });
    }

    const user = await this.userDal.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(OK).json({
      id: user.id,
      name: user.name,
      email: user.email,
      state: user.state,
    });
  }

  public async newUser(req: Request, res: Response) {
    const { name, email } = req.body;
    if (!name || !email) {
      console.error("Missing name or email");
      return res.status(BAD_REQUEST).json({ error: "Missing name or email" });
    }

    if (await this.userDal.findByName(name)) {
      return res
        .status(CONFLICT)
        .json({ error: `User with name ${name} already exists` });
    }

    if (await this.userDal.findByEmail(email)) {
      return res
        .status(CONFLICT)
        .json({ error: `User with email ${email} already exists` });
    }

    const newUser = await this.userDal.create(name, email);
    console.log(newUser);
    return res.status(CREATED).json({
      status: `User ${newUser.name} with id ${newUser.id} created`,
    });
  }
  // get all possible interest of enum in prisma schema
  public async getInterests(req: Request, res: Response) {
    const enumValues = await this.userDal.getInterests();
    return res.json(enumValues);

  }

  public async addUserData(req: Request, res: Response) {
    const userId = +req.params.id;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST).json({ error: "Invalid id" });
    }

    const { weight, height, birthDate, location, interests } = req.body;
    if (!location) {
      return res.status(BAD_REQUEST).json({ error: "Missing location" });
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

      console.log("Successfully added xdd user metadata for user with id " + userId);

      return res.status(OK).json({ status: `Metadata added for user with id ${userId}` });
    } catch (err: any) {
      console.log("Error:");
      console.log(err);
      return res.status(409).json({ error: err.message })
    }
  }

  public async getUserData(req: Request, res: Response) {
    const userId = +req.params.id;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST).json({ error: "Invalid id" });
    }

    const userMetadata = await this.userDal.getData(userId);

    if (!userMetadata) {
      console.log("No metadata found for user with id " + userId);
      return res
        .status(404)
        .json({ error: `No metadata found for user with id ${userId}` });
    }

    console.log(`Got metadata for user with id ${userId}:`);
    console.log(userMetadata);

    return res.status(OK).json({
      weight: userMetadata.weight,
      height: userMetadata.height,
      birthDate: userMetadata.birthDate,
      location: userMetadata.location,
      interests: userMetadata.interests,
    });
  }
}
