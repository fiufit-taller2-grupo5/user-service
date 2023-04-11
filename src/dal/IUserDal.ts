import { User } from "@prisma/client";

export interface UserMetadata {
  userId: number;
  weight?: number;
  height?: number;
  birthDate?: Date;
  latitude: number;
  longitude: number;
}

export interface IUserDal {
  findAll(): Promise<User[]>;
  findById(userId: number): Promise<User | null>;
  findByName(name: string): Promise<User | null>;
  create(name: string, email: string): Promise<User>;
  addData(data: UserMetadata): Promise<void>;
  getData(userId: number): Promise<UserMetadata | null>;
}
