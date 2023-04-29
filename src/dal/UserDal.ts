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
      }
    });
  }

  public async findById(userId: number): Promise<User | null> {
    return await this.prismaClient.user.findFirst({
      where: { id: userId, role: "user" },
    });
  }

  public async deleteById(userId: number): Promise<User> {
    // delete the metadata 
    return await this.prismaClient.user.delete({
      where: { id: userId },
    });
  }

  public async deleteAllUsers(): Promise<void> {
    // Find all user IDs
    const userIds = await this.prismaClient.user.findMany({ select: { id: true } });



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
}
