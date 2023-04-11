import { User } from "@prisma/client";

export type Admin = User & { role: "admin" };

export interface IAdminDal {
  findAll(): Promise<Admin[]>;
  findById(userId: number): Promise<Admin | null>;
  deleteById(userId: number): Promise<Admin>;
  create(name: string, email: string): Promise<Admin>;
}
