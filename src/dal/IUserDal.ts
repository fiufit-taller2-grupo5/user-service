import { User, UserMetadata } from "@prisma/client";

export interface IUserDal {
  findAll(opts: {
    skipBlocked: boolean
  }): Promise<User[]>;
  findById(userId: number): Promise<User | null>;
  findByIdWithMetadata(userId: number): Promise<User & UserMetadata>;
  findByName(name: string): Promise<User | null>;
  findByEmail(email: string, skipAdmins: boolean): Promise<User | null>;
  deleteById(userId: number): Promise<User>;
  create(name: string, email: string): Promise<User>;
  addData(data: UserMetadata): Promise<void>;
  getData(userId: number): Promise<UserMetadata | null>;
  getInterests(): Promise<string[]>;
  deleteAllUsers(): Promise<void>;
  blockUser(userId: number): Promise<User>;
  unblockUser(userId: number): Promise<User | null>;
  blockedUsers(): Promise<User[]>;
  followUser(userId: number, followedId: number): Promise<void>;
  unfollowUser(userId: number, followedId: number): Promise<void>;
  getFollowedUsers(userId: number): Promise<User[]>;
  getFollowers(userId: number): Promise<User[]>;
  setPushToken(userId: number, token: string): Promise<void>;
  getPushToken(userId: number): Promise<string | null>;
  addProfilePicture(userId: number, pictureUrl: string): Promise<void>;
  getProfilePicture(userId: number): Promise<string | null>;
  newNotification(userId: number, title: string, body: string): Promise<void>;
  getNotifications(userId: number): Promise<string[]>;
  changeName(userId: number, newName: string): Promise<void>;
}
