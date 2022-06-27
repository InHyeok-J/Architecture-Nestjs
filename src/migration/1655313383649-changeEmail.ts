import { Column, MigrationInterface, QueryRunner } from 'typeorm';

export class changeEmail1655313383649 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE User CHANGE emailChange email varchar(60);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
