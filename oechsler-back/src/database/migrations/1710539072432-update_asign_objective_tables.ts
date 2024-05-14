import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAsignObjectiveTables1710539072432
  implements MigrationInterface
{
  name = 'UpdateAsignObjectiveTables1710539072432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employee_objective\` CHANGE \`comment\` \`comment\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`dnc_course_manual\` CHANGE \`comment\` \`comment\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`dnc_course\` CHANGE \`comment\` \`comment\` text NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`dnc_course\` CHANGE \`comment\` \`comment\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`dnc_course_manual\` CHANGE \`comment\` \`comment\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee_objective\` CHANGE \`comment\` \`comment\` text NOT NULL`,
    );
  }
}
