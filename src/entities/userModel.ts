import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { GeneratedIdModel } from "./baseModel";
import { Folder } from "./folderModel";

export class UserModel extends GeneratedIdModel {
  @Column({ name: "user" })
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Folder, (folder) => folder.user)
  folders: Folder[];
}
