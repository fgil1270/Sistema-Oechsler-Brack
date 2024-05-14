import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEmployee1689799938335 implements MigrationInterface {
  name = 'UpdateEmployee1689799938335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_47ecc6defa7f5bce51123dc9b8c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_522090569201477f1f74ea365a6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_7492433e3b484693eabe4c260ea\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_c25546d583fae618f7001696341\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_c35abb5e89b95a7df25a6b0b902\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP COLUMN \`payRollIdId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP COLUMN \`departmentIdId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP COLUMN \`vacationProfileIdId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP COLUMN \`employeeProfileIdId\``,
    );
    await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`jobIdId\``);
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD \`payRollId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD \`departmentId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD \`vacationProfileId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD \`employeeProfileId\` int NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`employee\` ADD \`jobId\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_719548bff7c5141bebbc57e51eb\` FOREIGN KEY (\`payRollId\`) REFERENCES \`payroll\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_9ad20e4029f9458b6eed0b0c454\` FOREIGN KEY (\`departmentId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_dd1d21f922449b84d6eeaffe6b6\` FOREIGN KEY (\`vacationProfileId\`) REFERENCES \`vacations_profile\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_be897f489d68367d37b5dfe0be8\` FOREIGN KEY (\`employeeProfileId\`) REFERENCES \`employee_profile\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_613dae25595589e2fc85d57e0cf\` FOREIGN KEY (\`jobId\`) REFERENCES \`job\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_613dae25595589e2fc85d57e0cf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_be897f489d68367d37b5dfe0be8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_dd1d21f922449b84d6eeaffe6b6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_9ad20e4029f9458b6eed0b0c454\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_719548bff7c5141bebbc57e51eb\``,
    );
    await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`jobId\``);
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP COLUMN \`employeeProfileId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP COLUMN \`vacationProfileId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP COLUMN \`departmentId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP COLUMN \`payRollId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD \`jobIdId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD \`employeeProfileIdId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD \`vacationProfileIdId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD \`departmentIdId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD \`payRollIdId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_c35abb5e89b95a7df25a6b0b902\` FOREIGN KEY (\`jobIdId\`) REFERENCES \`job\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_c25546d583fae618f7001696341\` FOREIGN KEY (\`departmentIdId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_7492433e3b484693eabe4c260ea\` FOREIGN KEY (\`vacationProfileIdId\`) REFERENCES \`vacations_profile\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_522090569201477f1f74ea365a6\` FOREIGN KEY (\`payRollIdId\`) REFERENCES \`payroll\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_47ecc6defa7f5bce51123dc9b8c\` FOREIGN KEY (\`employeeProfileIdId\`) REFERENCES \`employee_profile\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
