import { AppDataSource } from "../data-source";
import { UserModel } from "../entities/userModel";

export const UserRepo = () => {
  const userRepo = AppDataSource.getRepository(UserModel);
  return userRepo;
};
