import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from "typeorm";
import { Folder } from "./folderModel";
import { UserModel } from "./userModel";

export enum PermissionType {
  READER = "reader",
  WRITER = "writer",
  FULL = "full",
}

@Entity()
export class PermissionModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserModel, (user) => user.permissions)
  @JoinColumn()
  user: UserModel;

  @ManyToOne(() => Folder, { onDelete: "CASCADE" })
  @JoinColumn()
  folder: Folder;

  @Column({
    type: "enum",
    enum: PermissionType,
    default: PermissionType.READER,
  })
  permissionType: PermissionType;
}
