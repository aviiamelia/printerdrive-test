import { MigrationInterface, QueryRunner } from "typeorm";

export class Folder1705058287455 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE Folder (
            id SERIAL PRIMARY KEY,
            folderName VARCHAR(255) NOT NULL,
            userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
        `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("folder");
  }
}
