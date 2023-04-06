import { User } from "@prisma/client";

export interface IUserDal {
  findAll(): Promise<User[]>;
  findById(userId: number): Promise<User | null>;
  findByName(name: string): Promise<User | null>;
  create(name: string, email: string): Promise<User>;
}
