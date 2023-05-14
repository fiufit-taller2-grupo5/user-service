import { PrismaClient, User } from "@prisma/client";
import { ACTIVE_USER, BLOCKED_USER, REGULAR_USER } from "../constants/userStateConstants";
import { IUserDal } from "./IUserDal";
import { UserMetadata } from "@prisma/client";
import { Interests } from "@prisma/client";
import {
  NOT_FOUND,
  NO_METADATA_FOUND,
  USER_IS_ADMIN,
  EMAIL_IN_USE,
} from "../constants/responseMessages";
import { ConflictError, NotFoundError } from "../Error";
export class UserDal implements IUserDal {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async findAll({ skipBlocked }: { skipBlocked: boolean }): Promise<User[]> {
    return await this.prismaClient.user.findMany({
      where: {
        role: REGULAR_USER,
        state: skipBlocked ? { not: BLOCKED_USER } : undefined,
      },
    });
  }

  public async findById(userId: number): Promise<User> {
    const user = await this.prismaClient.user.findFirst({
      where: { id: userId, role: REGULAR_USER },
    });
    if (user === null) {
      throw new NotFoundError(`user with id ${userId} not found`);
    }
    return user;
  }

  public async findByIdWithMetadata(userId: number): Promise<User & UserMetadata> {
    const userWithMetadata = await this.prismaClient.user.findFirst({
      where: { id: userId, role: REGULAR_USER },
      include: { UserMetadata: true },
    });
    if (userWithMetadata === null) {
      throw new NotFoundError(`user with id ${userId} not found`);
    }

    const flattenedUser: any = {
      ...userWithMetadata,
      ...userWithMetadata.UserMetadata
    };

    // Remove the original UserMetadata object from the flattened user
    delete flattenedUser.UserMetadata;
    delete flattenedUser.userId;

    return flattenedUser;
  }

  public async deleteById(userId: number): Promise<User> {
    await this.findById(userId);
    return await this.prismaClient.user.delete({
      where: { id: userId },
    });
  }

  public async deleteAllUsers(): Promise<void> {
    const userIds = await this.prismaClient.user.findMany({
      where: { role: REGULAR_USER },
      select: { id: true },
    });

    for (const userId of userIds) {
      await this.deleteById(userId.id);
    }
  }

  public async findByName(name: string): Promise<User> {
    const user = await this.prismaClient.user.findFirst({
      where: { name: name, role: REGULAR_USER },
    });
    if (user === null) {
      throw new NotFoundError(`user with name${name} not found`);
    }
    return user;
  }

  public async findByEmail(email: string, skipAdmins: boolean): Promise<User> {
    const user = await this.prismaClient.user.findFirst({
      where: { email: email, role: skipAdmins ? REGULAR_USER : undefined },
    });
    if (user === null) {
      throw new NotFoundError(`user with email ${email} not found`);
    }
    return user;
  }

  public async create(name: string, email: string): Promise<User> {
    // check if mail is already in use
    const user = await this.prismaClient.user.findFirst({
      where: { email: email },
    });
    if (user) {
      throw new ConflictError(`user with email ${email} already exists`);
    }
    return await this.prismaClient.user.create({
      data: {
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
        state: ACTIVE_USER,
        role: REGULAR_USER,
      },
    });
  }

  public async getInterests(): Promise<string[]> {
    return Object.values(Interests);
  }

  public async addData(userMetadata: UserMetadata): Promise<void> {
    await this.findById(userMetadata.userId);
    const userData = await this.prismaClient.userMetadata.findUnique({
      where: { userId: userMetadata.userId },
    });
    if (!userData) {
      await this.prismaClient.userMetadata.create({
        data: {
          userId: userMetadata.userId,
          weight: userMetadata.weight,
          height: userMetadata.height,
          birthDate: userMetadata.birthDate,
          location: userMetadata.location,
          interests: userMetadata.interests,
        },
      });
    } else {
      await this.prismaClient.userMetadata.update({
        where: { userId: userMetadata.userId },
        data: {
          weight: userMetadata.weight,
          height: userMetadata.height,
          birthDate: userMetadata.birthDate,
          location: userMetadata.location,
          interests: userMetadata.interests,
        },
      });
    }
  }

  public async blockUser(userId: number): Promise<void> {
    await this.findById(userId);
    await this.prismaClient.user.update({
      where: { id: userId },
      data: { state: "blocked" },
    });
  }

  public async getData(userId: number): Promise<UserMetadata> {
    this.findById(userId);
    const userMetadata = await this.prismaClient.userMetadata.findUnique({
      where: { userId: userId },
    });
    if (!userMetadata) {
      throw new NotFoundError(NO_METADATA_FOUND);
    }
    return userMetadata;
  }

  public unblockUser(userId: number): Promise<User> {
    this.findById(userId);
    return this.prismaClient.user.update({
      where: { id: userId },
      data: { state: ACTIVE_USER },
    });
  }

  public blockedUsers(): Promise<User[]> {
    const users = this.prismaClient.user.findMany({
      where: { state: BLOCKED_USER },
    });
    return users;
  }
}
