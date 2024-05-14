import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateChecador1702050566886 implements MigrationInterface {
  name = 'UpdateChecador1702050566886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Checador\` ADD \`status\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`Checador\` DROP COLUMN \`status\``);
  }
}
