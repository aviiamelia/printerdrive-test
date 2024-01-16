import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Folder } from "./folderModel";

@Entity()
export class FileModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @JoinColumn()
  @ManyToOne(() => Folder, (folder) => folder.files)
  folder!: Folder; // Ensure this line is present
}
