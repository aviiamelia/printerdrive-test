import { BcryptAdapter } from "../adapters/bcrypt.adapter";
import { JwtAdapter } from "../adapters/jwt.adapter";
import { AccessDeniedError } from "../errorHandler/accessDeniedError";
import { UserRepo } from "../repository/user.repository";
import { ILogin } from "../types/Ilogin";

export class LoginService {
  constructor(
    private readonly bcrypt: BcryptAdapter,
    private readonly jwt: JwtAdapter
  ) {}
  async login(data: ILogin) {
    const userRepo = UserRepo();
    const user = await userRepo.findOne({ where: { email: data.email } });
    const isMatched = this.bcrypt.compare(user.password, data.password);
    if (!user || !isMatched) {
      throw new AccessDeniedError();
    }
    const token = this.jwt.generateToken(user);

    return token;
  }
}
