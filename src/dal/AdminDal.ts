import { PrismaClient, User } from "@prisma/client";
import { ACTIVE_USER } from "../constants/userStateConstants";
import { Admin, IAdminDal } from "./IAdminDal";

export class AdminDal implements IAdminDal {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async findAll(): Promise<Admin[]> {
    return await this.prismaClient.user.findMany({
        where: { role: "admin" },
    }) as Admin[];
  }

  public async findById(userId: number): Promise<Admin | null> {
    return await this.prismaClient.user.findFirst({
      where: { id: userId, role: "admin" },
    }) as Admin;
  }

  public async deleteById(userId: number): Promise<Admin> {
    return await this.prismaClient.user.delete({
      where: { id: userId},
    }) as Admin;
  }


  public async create(name: string, email: string): Promise<Admin> {
    return await this.prismaClient.user.create({
      data: {
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
        state: ACTIVE_USER,
        role: "admin",
      },
    }) as Admin;
  }
}
