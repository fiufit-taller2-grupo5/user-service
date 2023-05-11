import { PrismaClient } from "@prisma/client";
import { ACTIVE_USER } from "../constants/userStateConstants";
import { Admin, IAdminDal } from "./IAdminDal";
import { Error } from "../Error";
import { NOT_FOUND, USER_NOT_ADMIN, EMAIL_IN_USE } from "../constants/responseMessages";

export class AdminDal implements IAdminDal {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async findAll(): Promise<Admin[]> {
    return (await this.prismaClient.user.findMany({
      where: { role: "admin" },
    })) as Admin[];
  }

  public async findById(userId: number): Promise<Admin> {
    const user = await this.prismaClient.user.findFirst({
      where: { id: userId, role: "admin" },
    });
    if (user === null) {
      throw new Error(NOT_FOUND);
    }
    return user as Admin;
  }

  public async findByName(name: string): Promise<Admin> {
    const user = await this.prismaClient.user.findFirst({
      where: { name: name, role: "admin" },
    });
    if (user === null) {
      throw new Error(NOT_FOUND);
    }
    return user as Admin;
  }

  public async findByEmail(email: string): Promise<Admin> {
    const user = await this.prismaClient.user.findFirst({
      where: { email: email, role: "admin" },
    });
    if (user === null) {
      throw new Error(NOT_FOUND);
    }
    return user as Admin;
  }

  public async deleteById(userId: number): Promise<Admin> {
    const user = await this.findById(userId);
    if (user === null) {
      throw new Error(NOT_FOUND);
    }
    if (user.role !== "admin") {
      throw new Error(USER_NOT_ADMIN);
    }
    return (await this.prismaClient.user.delete({
      where: { id: userId },
    })) as Admin;
  }


  public async create(name: string, email: string): Promise<Admin> {
    const user = await this.prismaClient.user.findFirst({
      where: { email: email },
    });
    if (user !== null) {
      throw new Error(EMAIL_IN_USE);
    }
    return (await this.prismaClient.user.create({
      data: {
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
        state: ACTIVE_USER,
        role: "admin",
      },
    })) as Admin;
  }
}
