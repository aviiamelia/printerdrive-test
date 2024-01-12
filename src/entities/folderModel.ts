import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserModel } from "./userModel";
import { GeneratedIdModel } from "./baseModel";

@Entity()
export class Folder extends GeneratedIdModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  folderName: string;

  @ManyToOne(() => UserModel, (user) => user.folders)
  user: UserModel;
}
