import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { GeneratedIdModel } from "./baseModel";
import { Folder } from "./folderModel";
import { PermissionModel } from "./permissionModel";

@Entity("users")
export class UserModel extends GeneratedIdModel {
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Folder, (folder) => folder.user)
  @JoinColumn()
  folders: Folder[];

  @OneToMany(() => PermissionModel, (permission) => permission.user, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  permissions: PermissionModel[];

  @Column({ default: false })
  isAdmin?: boolean;
}
