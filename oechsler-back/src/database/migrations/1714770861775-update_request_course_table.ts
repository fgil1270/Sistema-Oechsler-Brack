import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRequestCourseTable1714770861775
  implements MigrationInterface
{
  name = 'UpdateRequestCourseTable1714770861775';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`request_course\` ADD \`origin\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`request_course\` ADD \`requestById\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`request_course\` ADD CONSTRAINT \`FK_ac5a13c9c68906a068220114249\` FOREIGN KEY (\`requestById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`request_course\` DROP FOREIGN KEY \`FK_ac5a13c9c68906a068220114249\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`request_course\` DROP COLUMN \`requestById\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`request_course\` DROP COLUMN \`origin\``,
    );
  }
}
