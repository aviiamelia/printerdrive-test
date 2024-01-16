import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { UserModel } from "./userModel";
import { GeneratedIdModel } from "./baseModel";
import { PermissionModel } from "./permissionModel";

@Entity()
export class Folder extends GeneratedIdModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  folderName: string;

  @ManyToOne(() => UserModel, (user) => user.folders, { onDelete: "CASCADE" })
  @JoinColumn()
  user: UserModel;

  @Column({ nullable: true })
  contentFilePath: string;

  @ManyToOne(() => Folder, (folder) => folder.childFolders, { nullable: true })
  parentFolder: Folder;

  @OneToMany(() => Folder, (folder) => folder.parentFolder)
  childFolders: Folder[];

  @OneToMany(() => PermissionModel, (permission) => permission.folder, {
    onDelete: "CASCADE",
  })
  permissions: PermissionModel[];
}
