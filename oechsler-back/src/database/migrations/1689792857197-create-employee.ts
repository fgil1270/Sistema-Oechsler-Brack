import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmployee1689792857197 implements MigrationInterface {
  name = 'CreateEmployee1689792857197';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`employee\` (\`id\` int NOT NULL AUTO_INCREMENT, \`worker\` varchar(255) NOT NULL, \`employee_number\` int NOT NULL DEFAULT '0', \`name\` varchar(255) NOT NULL, \`paternal_surname\` varchar(255) NOT NULL, \`maternal_surname\` varchar(255) NOT NULL, \`gender\` varchar(255) NOT NULL, \`birthdate\` date NOT NULL, \`country\` varchar(255) NOT NULL, \`citizenship\` varchar(255) NOT NULL, \`state\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`location\` varchar(255) NOT NULL, \`rfc\` varchar(255) NOT NULL, \`curp\` varchar(255) NOT NULL, \`nss\` varchar(255) NOT NULL, \`date_employment\` date NOT NULL, \`work_term_date\` date NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`marital_status\` varchar(255) NOT NULL, \`salary\` decimal(10,2) NOT NULL DEFAULT '0.00', \`daily_salary\` decimal(10,2) NOT NULL DEFAULT '0.00', \`quote\` decimal(10,2) NOT NULL DEFAULT '0.00', \`type_contract\` varchar(255) NOT NULL, \`visa\` tinyint NOT NULL DEFAULT 0, \`fm_two\` tinyint NOT NULL DEFAULT 0, \`travel\` tinyint NOT NULL DEFAULT 0, \`brigade_member\` tinyint NOT NULL DEFAULT 0, \`worker_status\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`payRollIdId\` int NULL, \`departmentIdId\` int NULL, \`vacationProfileIdId\` int NULL, \`employeeProfileIdId\` int NULL, \`jobIdId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_522090569201477f1f74ea365a6\` FOREIGN KEY (\`payRollIdId\`) REFERENCES \`payroll\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_c25546d583fae618f7001696341\` FOREIGN KEY (\`departmentIdId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_7492433e3b484693eabe4c260ea\` FOREIGN KEY (\`vacationProfileIdId\`) REFERENCES \`vacations_profile\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_47ecc6defa7f5bce51123dc9b8c\` FOREIGN KEY (\`employeeProfileIdId\`) REFERENCES \`employee_profile\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_c35abb5e89b95a7df25a6b0b902\` FOREIGN KEY (\`jobIdId\`) REFERENCES \`job\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_c35abb5e89b95a7df25a6b0b902\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_47ecc6defa7f5bce51123dc9b8c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_7492433e3b484693eabe4c260ea\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_c25546d583fae618f7001696341\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_522090569201477f1f74ea365a6\``,
    );
    await queryRunner.query(`DROP TABLE \`employee\``);
  }
}
