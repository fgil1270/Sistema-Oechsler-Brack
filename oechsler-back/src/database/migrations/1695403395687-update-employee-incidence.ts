import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEmployeeIncidence1695403395687
  implements MigrationInterface
{
  name = 'UpdateEmployeeIncidence1695403395687';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` DROP FOREIGN KEY \`FK_9ed0cfbecf9857f1e95f799a7e0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` CHANGE \`cancelledById\` \`canceledById\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` ADD CONSTRAINT \`FK_acf363a6064da6ec40e63cb12a9\` FOREIGN KEY (\`canceledById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` DROP FOREIGN KEY \`FK_acf363a6064da6ec40e63cb12a9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` CHANGE \`canceledById\` \`cancelledById\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` ADD CONSTRAINT \`FK_9ed0cfbecf9857f1e95f799a7e0\` FOREIGN KEY (\`cancelledById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
