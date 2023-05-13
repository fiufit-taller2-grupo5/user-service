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
      throw new Error(NOT_FOUND);
    }
    return user;
  }

  public async findByIdWithMetadata(userId: number): Promise<User> {
    const userWithMetadata = await this.prismaClient.user.findFirst({
      where: { id: userId, role: REGULAR_USER },
      include: { UserMetadata: true },
    });
    if (userWithMetadata === null) {
      throw new Error(NOT_FOUND);
    }
    return userWithMetadata;
  }

  public async deleteById(userId: number): Promise<User> {
    const user = await this.findById(userId);
    if (user === null) {
      throw new Error(NOT_FOUND);
    }
    if (user.role !== REGULAR_USER) {
      throw new Error(USER_IS_ADMIN);
    }
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
      throw new Error(NOT_FOUND);
    }
    return user;
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.prismaClient.user.findFirst({
      where: { email: email, role: REGULAR_USER },
    });
    if (user === null) {
      throw new Error(NOT_FOUND);
    }
    return user;
  }

  public async create(name: string, email: string): Promise<User> {
    // check if mail is already in use
    const user = await this.prismaClient.user.findFirst({
      where: { email: email },
    });
    if (user) {
      throw new Error(EMAIL_IN_USE);
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

  public async getData(userId: number): Promise<UserMetadata> {
    const userMetadata = await this.prismaClient.userMetadata.findUnique({
      where: { userId: userId },
    });
    if (!userMetadata) {
      throw new Error(NO_METADATA_FOUND);
    }
    return userMetadata;
  }

  public async blockUser(userId: number): Promise<void> {
    await this.prismaClient.user.update({
      where: { id: userId },
      data: { state: "blocked" },
    });
  }

  public unblockUser(userId: number): Promise<User> {
    const user = this.findById(userId);
    if (user === null) {
      throw new Error(NOT_FOUND);
    }
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
