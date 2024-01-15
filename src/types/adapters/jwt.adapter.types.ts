export interface userData {
  username: string;
  email: string;
  isAdmin?: boolean;
}
interface expiresInInterface {
  expiresIn: string;
}

export interface jwtAdapterInterface {
  generateToken: (data: userData) => string;
  verify: (token: string) => any;
}
