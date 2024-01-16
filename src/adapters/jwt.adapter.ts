import { sign, verify, decode as jwtdecode, JwtPayload } from "jsonwebtoken";
import {
  jwtAdapterInterface,
  userData,
} from "../types/adapters/jwt.adapter.types";

export class JwtAdapter implements jwtAdapterInterface {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string
  ) {}
  generateToken(data: userData) {
    const token = sign({ data }, this.secret, { expiresIn: this.expiresIn });
    return token;
  }
  verify(token: string) {
    try {
      const result = verify(token, this.secret);
      return result;
    } catch {
      return null;
    }
  }
  decode(token: string) {
    const decode = jwtdecode(token);
    return decode as JwtPayload;
  }
}
