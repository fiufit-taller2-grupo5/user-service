import { PrismaClient } from "@prisma/client";
import { ACTIVE_USER } from "../constants/userStateConstants";
import { Admin, IAdminDal } from "./IAdminDal";

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

  public async findById(userId: number): Promise<Admin | null> {
    return (await this.prismaClient.user.findFirst({
      where: { id: userId, role: "admin" },
    })) as Admin;
  }

  public async findByName(name: string): Promise<Admin | null> {
    return (await this.prismaClient.user.findFirst({
      where: { name: name, role: "admin" },
    })) as Admin;
  }

  public async findByEmail(email: string): Promise<Admin | null> {
    return (await this.prismaClient.user.findFirst({
      where: { email: email, role: "admin" },
    })) as Admin;
  }

  public async deleteById(userId: number): Promise<Admin> {
    const user = await this.findById(userId);
    if (user === null) {
      throw new Error("User not found");
    }
    if (user.role !== "admin") {
      throw new Error("User is not an admin");
    }
    return (await this.prismaClient.user.delete({
      where: { id: userId },
    })) as Admin;
  }


  public async create(name: string, email: string): Promise<Admin> {
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
