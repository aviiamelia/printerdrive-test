export interface IUser {
  name: string;
  password: string;
  email: string;
  isAdm: boolean;
  uuid?: string;
  createOn?: Date;
  updatedOn?: Date;
}

export interface ILogin {
  email: string;
  password: string;
}
