import { User, UserMetadata } from "@prisma/client";

export interface IUserDal {
  findAll(): Promise<User[]>;
  findById(userId: number): Promise<User | null>;
  findByName(name: string): Promise<User | null>;
  deleteById(userId: number): Promise<User>;
  create(name: string, email: string): Promise<User>;
  addData(data: UserMetadata): Promise<void>;
  getData(userId: number): Promise<UserMetadata | null>;
  getInterests(): Promise<string[]>;
  deleteAllUsers(): Promise<void>;
}
