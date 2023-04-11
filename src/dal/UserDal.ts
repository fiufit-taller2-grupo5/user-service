import { PrismaClient, User } from "@prisma/client";
import { ACTIVE_USER } from "../constants/userStateConstants";
import { IUserDal, UserMetadata } from "./IUserDal";

export class UserDal implements IUserDal {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async findAll(): Promise<User[]> {
    return await this.prismaClient.user.findMany();
  }

  public async findById(userId: number): Promise<User | null> {
    return await this.prismaClient.user.findUnique({
      where: { id: userId },
    });
  }

  public async deleteById(userId: number): Promise<User> {
    return await this.prismaClient.user.delete({
      where: { id: userId },
    });
  }

  public async findByName(name: string): Promise<User | null> {
    return await this.prismaClient.user.findFirst({
      where: { name: name },
    });
  }

  public async create(name: string, email: string): Promise<User> {
    return await this.prismaClient.user.create({
      data: {
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
        state: ACTIVE_USER,
      },
    });
  }

  public async addData(userMetadata: UserMetadata): Promise<void> {
    await this.prismaClient.userMetadata.create({
      data: {
        userId: userMetadata.userId,
        weight: userMetadata.weight,
        height: userMetadata.height,
        birthDate: userMetadata.birthDate,
        latitude: userMetadata.latitude,
        longitude: userMetadata.longitude,
      },
    });
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
      weight: userMetadata.weight || undefined,
      height: userMetadata.height || undefined,
      birthDate: userMetadata.birthDate || undefined,
      latitude: userMetadata.latitude,
      longitude: userMetadata.longitude,
    };
  }
}
