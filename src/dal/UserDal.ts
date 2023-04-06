import { PrismaClient, User } from "@prisma/client";
import { ACTIVE_USER } from "../constants/userStateConstants";
import { IUserDal } from "./IUserDal";

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
}
