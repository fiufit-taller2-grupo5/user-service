import { PrismaClient, User } from "@prisma/client";
import { ACTIVE_USER } from "../constants/userStateConstants";
import { IUserDal } from "./IUserDal";
import { UserMetadata } from "@prisma/client";
import { Interests } from "@prisma/client";

export class UserDal implements IUserDal {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async findAll(): Promise<User[]> {
    return await this.prismaClient.user.findMany({
      where: {
        role: "user",
      },
    });
  }

  public async findById(userId: number): Promise<User | null> {
    return await this.prismaClient.user.findFirst({
      where: { id: userId, role: "user" },
    });
  }

  public async findByIdWithMetadata(userId: number): Promise<User | null> {
    return await this.prismaClient.user.findFirst({
      where: { id: userId, role: "user" },
      include: { UserMetadata: true },
    });
  }

  public async deleteById(userId: number): Promise<User> {
    // delete the metadata
    const user = await this.findById(userId);
    if (user === null) {
      throw new Error("User not found");
    }
    if (user.role !== "user") {
      throw new Error("User is not a user");
    }
    return await this.prismaClient.user.delete({
      where: { id: userId },
    });
  }

  public async deleteAllUsers(): Promise<void> {
    // Find all user IDs with role "user"
    const userIds = await this.prismaClient.user.findMany({
      where: { role: "user" },
      select: { id: true },
    });

    // Delete all users
    for (const userId of userIds) {
      await this.deleteById(userId.id);
    }
  }

  public async findByName(name: string): Promise<User | null> {
    return await this.prismaClient.user.findFirst({
      where: { name: name, role: "user" },
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.prismaClient.user.findFirst({
      where: { email: email, role: "user" },
    });
  }

  public async create(name: string, email: string): Promise<User> {
    // check if mail is already in use
    const user = await this.prismaClient.user.findFirst({
      where: { email: email },
    });
    if (user) {
      throw new Error("Email already in use");
    }
    return await this.prismaClient.user.create({
      data: {
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
        state: ACTIVE_USER,
        role: "user",
      },
    });
  }

  public async getInterests(): Promise<string[]> {
    return Object.values(Interests);
  }

  public async addData(userMetadata: UserMetadata): Promise<void> {
    // if no user with this id exists return error 
    const user = await this.findById(userMetadata.userId);
    if (!user) {
      const id = userMetadata.userId;
      throw new Error("User with id " + id + " not found");
    }
    const userData = await this.getData(userMetadata.userId);
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

  public async getData(userId: number): Promise<UserMetadata | null> {
    const userMetadata = await this.prismaClient.userMetadata.findUnique({
      where: { userId: userId },
    });

    if (!userMetadata) {
      return null;
    }

    return {
      userId: userMetadata.userId,
      weight: userMetadata.weight,
      height: userMetadata.height,
      birthDate: userMetadata.birthDate,
      location: userMetadata.location,
      interests: userMetadata.interests,
    };
  }

  public blockUser(userId: number): Promise<User> {
    return this.prismaClient.user.update({
      where: { id: userId },
      data: { state: "blocked" },
    });
  }

  public unblockUser(userId: number): Promise<User> {
    return this.prismaClient.user.update({
      where: { id: userId },
      data: { state: "active" },
    });
  }

  public blockedUsers(): Promise<User[]> {
    return this.prismaClient.user.findMany({
      where: { state: "blocked" },
    });
  }
}
