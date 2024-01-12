import { Column, Entity, OneToMany } from "typeorm";
import { GeneratedIdModel } from "./baseModel";
import { Folder } from "./folderModel";

@Entity("users")
export class UserModel extends GeneratedIdModel {
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Folder, (folder) => folder.user)
  folders: Folder[];
}
