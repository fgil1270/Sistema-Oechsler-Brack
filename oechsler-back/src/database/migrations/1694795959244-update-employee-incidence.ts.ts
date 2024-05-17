import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEmployeeIncidence1694795959244
  implements MigrationInterface
{
  name = 'UpdateEmployeeIncidence1694795959244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` ADD \`createdById\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` ADD CONSTRAINT \`FK_e9b019ee9075f3e7c61e49b8043\` FOREIGN KEY (\`createdById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` DROP FOREIGN KEY \`FK_e9b019ee9075f3e7c61e49b8043\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` DROP COLUMN \`createdById\``,
    );
  }
}
