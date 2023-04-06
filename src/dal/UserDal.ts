import { PrismaClient, User } from "@prisma/client";
import { ACTIVE_USER } from "../constants/userStateConstants";

export class UserDal {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
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
