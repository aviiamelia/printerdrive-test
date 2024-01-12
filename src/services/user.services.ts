import { BcryptAdapter } from "../adapters/bcrypt.adapter";
import { UserRepo } from "../repository/user.repository";
import { IUser } from "../types/Iuser";

export class UserService {
  constructor(private readonly bcrypt: BcryptAdapter) {}

  async create(data: IUser) {
    const repository = UserRepo();
    const hashPassword = this.bcrypt.hash(data.password);
    data.password = hashPassword;
    const user = repository.create(data);
    await repository.save(user);
    const { password: erase, ...response } = user;
    return response;
  }
}
