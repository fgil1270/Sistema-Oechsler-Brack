import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEmployeeTable1706898500272 implements MigrationInterface {
  name = 'UpdateEmployeeTable1706898500272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employee\` CHANGE \`email\` \`email\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` CHANGE \`phone\` \`phone\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` CHANGE \`marital_status\` \`marital_status\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` CHANGE \`visa\` \`visa\` tinyint NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` CHANGE \`fm_two\` \`fm_two\` tinyint NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` CHANGE \`travel\` \`travel\` tinyint NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` CHANGE \`brigade_member\` \`brigade_member\` tinyint NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employee\` CHANGE \`brigade_member\` \`brigade_member\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` CHANGE \`travel\` \`travel\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` CHANGE \`fm_two\` \`fm_two\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` CHANGE \`visa\` \`visa\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` CHANGE \`marital_status\` \`marital_status\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` CHANGE \`phone\` \`phone\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` CHANGE \`email\` \`email\` varchar(255) NOT NULL`,
    );
  }
}
