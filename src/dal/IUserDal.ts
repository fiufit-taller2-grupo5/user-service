import { User, UserMetadata } from "@prisma/client";

export interface IUserDal {
  findAll(): Promise<User[]>;
  findById(userId: number): Promise<User | null>;
  findByIdWithMetadata(userId: number): Promise<User | null>;
  findByName(name: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  deleteById(userId: number): Promise<User>;
  create(name: string, email: string): Promise<User>;
  addData(data: UserMetadata): Promise<void>;
  getData(userId: number): Promise<UserMetadata | null>;
  getInterests(): Promise<string[]>;
  deleteAllUsers(): Promise<void>;
  blockUser(userId: number): Promise<void>;
  unblockUser(userId: number): Promise<User | null>;
  blockedUsers(): Promise<User[]>;
}
