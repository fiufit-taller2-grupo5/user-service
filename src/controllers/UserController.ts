import { Request, Response } from "express";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
  OK,
} from "../constants/httpConstants";
import { IUserDal } from "../dal/IUserDal";

export class UserController {
  private userDal: IUserDal;

  constructor(userDal: IUserDal) {
    this.userDal = userDal;
  }

  public async getAllUsers(_req: Request, res: Response) {
    const users = await this.userDal.findAll();
    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.set("X-Total-Count", `${users.length}`);
    return res.status(OK).json({ data: users });
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

    res.status(OK).json({
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

    const newUser = await this.userDal.create(name, email);
    console.log(newUser);
    res.status(CREATED).json({
      status: `User ${newUser.name} with id ${newUser.id} created`,
    });
  }

  public async addUserData(req: Request, res: Response) {
    const userId = +req.params.id;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST).json({ error: "Invalid id" });
    }

    const { weight, height, birthDate, latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res
        .status(BAD_REQUEST)
        .json({ error: "Missing latitude or longitude" });
    }

    try {
      await this.userDal.addData({
        userId,
        weight,
        height,
        birthDate,
        latitude,
        longitude,
      });

      console.log("Successfuly added user metadata for user with id " + userId);

      res
        .status(OK)
        .json({ status: `Metadatadata added for user with id ${userId}` });
    } catch (err: any) {
      console.log("Failed adding user metadata for user with id " + userId);
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({ error: err.message });
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

    res.status(OK).json({
      weight: userMetadata.weight,
      height: userMetadata.height,
      birthDate: userMetadata.birthDate,
      latitude: userMetadata.latitude,
      longitude: userMetadata.longitude,
    });
  }
}
