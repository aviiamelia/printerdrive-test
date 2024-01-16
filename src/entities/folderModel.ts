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
import { FileModel } from "./filesModel";

@Entity()
export class Folder extends GeneratedIdModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  folderName: string;

  @ManyToOne(() => UserModel, (user) => user.folders, { onDelete: "CASCADE" })
  @JoinColumn()
  user: UserModel;

  @JoinColumn()
  @OneToMany(() => FileModel, (file) => file.folder, { cascade: true })
  files!: File[]; // Add this line to define the 'files' property

  @ManyToOne(() => Folder, (folder) => folder.childFolders, { nullable: true })
  parentFolder: Folder;

  @OneToMany(() => Folder, (folder) => folder.parentFolder)
  childFolders: Folder[];

  @OneToMany(() => PermissionModel, (permission) => permission.folder, {
    onDelete: "CASCADE",
  })
  permissions: PermissionModel[];
}
