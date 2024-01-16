import { BcryptAdapter } from "../adapters/bcrypt.adapter";
import { UserRepo } from "../repository/user.repository";
import { IUser } from "../types/Iuser";

export class UserService {
  constructor(private readonly bcrypt: BcryptAdapter) {}

  async create(data: IUser) {
    const userRepo = UserRepo();
    const hashPassword = this.bcrypt.hash(data.password);
    data.password = hashPassword;
    const user = userRepo.create(data);
    await userRepo.save(user);
    const { password: erase, ...response } = user;
    return response;
  }
  async list() {
    const userRepo = UserRepo();
    const users = await userRepo.find({
      relations: [
        "permissions",
        "permissions.folder",
        "permissions.folder.childFolders",
      ],
    });
    users.map((user) => delete user.password);
    return users;
  }
}
