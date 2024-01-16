import * as bcrypt from "bcryptjs";
import { bcryptAdapterInterface } from "../types/adapters/bcryt.adapter.types";

export class BcryptAdapter implements bcryptAdapterInterface {
  constructor() {}
  hash(password: string) {
    const hashed = bcrypt.hashSync(password, 10);
    return hashed;
  }
  compare(dbPassword: string, valuePassword: string) {
    const compared = bcrypt.compareSync(valuePassword, dbPassword);
    return compared;
  }
}
