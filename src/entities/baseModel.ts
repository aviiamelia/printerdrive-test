import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseModel {
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

export abstract class GeneratedIdModel extends BaseModel {
  @PrimaryColumn({ name: "id", generated: true })
  id: number;
}
