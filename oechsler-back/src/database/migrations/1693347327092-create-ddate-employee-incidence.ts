import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDdateEmployeeIncidence1693347327092
  implements MigrationInterface
{
  name = 'CreateDdateEmployeeIncidence1693347327092';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`date_employee_incidence\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`employeeIncidenceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` DROP COLUMN \`start_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` DROP COLUMN \`end_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`date_employee_incidence\` ADD CONSTRAINT \`FK_48caf184c57fa37315ad8f2666b\` FOREIGN KEY (\`employeeIncidenceId\`) REFERENCES \`employee_incidence\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`date_employee_incidence\` DROP FOREIGN KEY \`FK_48caf184c57fa37315ad8f2666b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` ADD \`end_date\` date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` ADD \`start_date\` date NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE \`date_employee_incidence\``);
  }
}
