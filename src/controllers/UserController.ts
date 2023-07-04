import { NextFunction, Request, Response } from "express";

import {
  BAD_REQUEST_CODE,
  CREATED_CODE,
  DELETED_CODE,
  NOT_FOUND_CODE,
  OK_CODE,
  INTERNAL_SERVER_ERROR_CODE
} from "../constants/httpConstants";
import { IUserDal } from "../dal/IUserDal";
import { sendResetPasswordEmail, uploadFile } from "../firebase/firebaseUtils";
import { ACTIVE_USER } from "../constants/userStateConstants";
import { User } from "@prisma/client";
import { MetricName } from "../metrics/metrics_types";
import { sendSystemMetric } from "../metrics/metrics_service";
import multer from "multer";
import { send } from "process";
var storage = multer.memoryStorage(); 
 var upload = multer({ storage: storage });


export class UserController {
  private userDal: IUserDal;

  constructor(userDal: IUserDal) {
    this.userDal = userDal;
  }

  private isAdmin(req: Request) {
    return req.headers["x-role"] === "admin"
  }


  public async getAllUsers(req: Request, res: Response) {
    let users: User[] = [];
    if (this.isAdmin(req)) {
      users = await this.userDal.findAll({
        skipBlocked: false,
      });
    } else {
      users = await this.userDal.findAll({ skipBlocked: true });
    }

    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.set("X-Total-Count", `${users.length}`);
    return res.status(OK_CODE).json(users);
  }

  public async deleteUser(req: Request, res: Response) {
    const userId: number = +req.params.id;

    const user = await this.userDal.deleteById(userId);
    return res
      .status(DELETED_CODE)
      .json({ status: `User of id ${user.id} deleted` });

  }

  public async deleteAllUsers(req: Request, res: Response) {

    await this.userDal.deleteAllUsers();
    return res
      .status(DELETED_CODE)
      .json({ status: "All users deleted_CODE" });

  }
  public async userByEmail(email: string, skipAdmins: boolean) {
    const user = await this.userDal.findByEmail(email, skipAdmins);
    return user;
  }

  public async findUserByEmail(req: Request, res: Response) {
    const email = req.params.email;
    const user = await this.userDal.findByEmail(email, false);
    return res.status(OK_CODE).json(user);
  }

  public async newUser(req: Request, res: Response) {
    const { name, email } = req.body;
    if (!name || !email) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ error: "Falta nombre o contraseña" });
    }

    const newUser = await this.userDal.create(name, email);

    sendSystemMetric(MetricName.USER_CREATED);

    return res.status(CREATED_CODE).json(newUser);

  }

  public async getInterests(req: Request, res: Response) {
    const enumValues = await this.userDal.getInterests();
    return res.json(enumValues);
  }

  public async addUserData(req: Request, res: Response) {
    const userId = +req.params.id;
    const { weight, height, birthDate, location, interests } = req.body;
    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }
    if (!location) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ error: "Falta ubicación para continuar" });
    }

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

  }

  public async updateUser(req: Request, res: Response) {
    // this endpoint was only created for blocking and unblocking user from admin dashboard
    const userId = +req.params.id;
    const { state } = req.body;

    if (isNaN(userId) || state === undefined) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id or state" });
    }
    let user;
    if (state === ACTIVE_USER) {
      user = await this.userDal.unblockUser(userId);
    } else {
      user = await this.userDal.blockUser(userId);
    }
    return res.status(OK_CODE).json(user);
  }

  public async isBlocked(userId: any) {
    const user = await this.userDal.findById(userId);
    const isBlocked = user?.state !== ACTIVE_USER ?? false;
    return isBlocked
  }

  public async getUserEntireDataById(req: Request, res: Response) {
    const userId = +req.params.id;
    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }

    const userWithMetadata = await this.userDal.findByIdWithMetadata(userId);
    if (!userWithMetadata) {
      return res.status(NOT_FOUND_CODE).json({ error: "User not found!" });
    }
    return res.status(OK_CODE).json(userWithMetadata);

  }

  public async getUserData(req: Request, res: Response) {
    const userId = +req.params.id;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }


    const metaData = await this.userDal.getData(userId);
    return res.status(OK_CODE).json(metaData);

  }

  public async changePassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ error: "email is required" });
    }

    const emailSentOk = await sendResetPasswordEmail(email);
    if (emailSentOk) {
      return res.status(OK_CODE).json({ "message": "Email de recuperación enviado" });
    } else {
      return res.status(INTERNAL_SERVER_ERROR_CODE).json({ "message": "error al mandar email de recuperación" })
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

    await this.userDal.unblockUser(userId);
    return res.status(OK_CODE).json({ status: "User unblocked" });

  }

  public async getBlockedUsers(_req: Request, res: Response) {

    const users = await this.userDal.blockedUsers();
    console.log(`Found ${users.length} blocked users`);

    return res.status(OK_CODE).json(users);

  }

  public async followUser(req: Request, res: Response) {
    const userId = +req.body.id;
    const followedId = +req.body.followedId;

    if (isNaN(userId) || isNaN(followedId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Missing ids" });
    }

    await this.userDal.followUser(userId, followedId);
    return res.status(OK_CODE).json({
      status: `User with id ${userId} followed user with id ${followedId}`,
    });
  }

  public async unfollowUser(req: Request, res: Response) {
    const userId = +req.body.id;
    const followedId = +req.body.followedId;

    if (isNaN(userId) || isNaN(followedId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Missing ids" });
    }

    await this.userDal.unfollowUser(userId, followedId);
    // return user with text saying that user was unfollowed
    return res.status(OK_CODE).json({
      status: `User with id ${userId} unfollowed user with id ${followedId}`,
    });


  }

  public async getFollowedUsers(req: Request, res: Response) {
    const userId = +req.params.id;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }

    const users = await this.userDal.getFollowedUsers(userId);
    return res.status(OK_CODE).json(users);
  }

  public async getFollowers(req: Request, res: Response) {
    console.log("getFollowers");
    const userId = +req.params.id;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }

    const users = await this.userDal.getFollowers(userId);
    return res.status(OK_CODE).json(users);
  }

  public async setPushToken(req: Request, res: Response) {
    const userId = +req.params.id;
    const { token } = req.body;

    if (isNaN(userId) || !token) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid user id or token" });
    }

    await this.userDal.setPushToken(userId, token);
    return res.status(OK_CODE).json({ status: "Push token set" });
  }

  public async getPushToken(req: Request, res: Response) {
    const userId = +req.params.id;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }

    const token = await this.userDal.getPushToken(userId);
    return res.status(OK_CODE).json(token);
  }

  public async addProfilePicture(req: Request, res: Response) {
    console.log("uploadedFile", req.file);
    try {
      const userId = +req.params.id;
      const uploadedFile = req.file;
  
      if (!uploadedFile) {
        return res.status(400).json({ error: 'Missing file' });
      }

      if (isNaN(userId)) {
        return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
      }
  
      const filePath = `profilePictures/user${userId}`;
      const downloadURL = await uploadFile(uploadedFile, filePath);
  
      await this.userDal.addProfilePicture(userId, downloadURL);
      res.status(200).json({ message: 'Profile picture uploaded successfully. Download in: ' + downloadURL});
    } catch (error) {
      console.log('Failed uploading profile picture:', error);
      res.status(500).json({ error: 'Failed to upload profile picture: ' + error });
    }
  }

  public async getProfilePicture(req: Request, res: Response) {
    const userId = +req.params.id;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }

    const pictureUrl = await this.userDal.getProfilePicture(userId);
    console.log("pictureUrl", pictureUrl);
    return res.status(OK_CODE).json(pictureUrl);
  }

  public async newNotification(req: Request, res: Response) {
    const userId = +req.params.id;
    const { title, body } = req.body;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }

    if (!title || !body) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Missing title or body" });
    }

    await this.userDal.newNotification(userId, title, body);

    const token = await this.userDal.getPushToken(userId);
    if (token) {
      const notification = {
        to: token,
        title: title,
        body: body,
      };
      await sendPushNotification(notification);
    } else {
      return res.status(CREATED_CODE).json({ status: "Notification saved but not sended" });
    }

    return res.status(OK_CODE).json({ status: "Notification saved and sended" });
  }

  public async getNotifications(req: Request, res: Response) {
    const userId = +req.params.id;

    if (isNaN(userId)) {
      return res.status(BAD_REQUEST_CODE).json({ error: "Invalid id" });
    }

    const notifications = await this.userDal.getNotifications(userId);
    return res.status(OK_CODE).json(notifications);
  }
}

async function sendPushNotification(message: any) {
  await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
}