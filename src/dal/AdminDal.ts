import { PrismaClient } from "@prisma/client";
import { ACTIVE_USER, ADMIN_USER } from "../constants/userStateConstants";
import { Admin, IAdminDal } from "./IAdminDal";
import { EMAIL_IN_USE } from "../constants/responseMessages";
import { NotFoundError } from "../Error";

export class AdminDal implements IAdminDal {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async findAll(): Promise<Admin[]> {
    return (await this.prismaClient.user.findMany({
      where: { role: ADMIN_USER },
    })) as Admin[];
  }

  public async findById(userId: number): Promise<Admin> {
    const user = await this.prismaClient.user.findFirst({
      where: { id: userId, role: ADMIN_USER },
    });
    if (user === null) {
      throw new NotFoundError(`admin with id ${userId} not found`);
    }
    return user as Admin;
  }

  public async findByName(name: string): Promise<Admin> {
    const user = await this.prismaClient.user.findFirst({
      where: { name: name, role: ADMIN_USER },
    });
    if (user === null) {
      throw new NotFoundError(`admin with name ${name} not found`);
    }
    return user as Admin;
  }

  public async findByEmail(email: string): Promise<Admin> {
    const user = await this.prismaClient.user.findFirst({
      where: { email: email, role: ADMIN_USER },
    });
    if (user === null) {
      throw new NotFoundError(`admin with email ${email} not found`);
    }
    return user as Admin;
  }

  public async deleteById(userId: number): Promise<Admin> {
    const user = this.prismaClient.user.findFirst({
      where: { id: userId, role: ADMIN_USER },
    });
    if (user === null) {
      throw new NotFoundError(`admin with id ${userId} not found`);
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
        role: ADMIN_USER,
      },
    })) as Admin;
  }
}
