import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeeVacationProfileHistoryTable1742852921734 implements MigrationInterface {
    name = 'CreateEmployeeVacationProfileHistoryTable1742852921734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`employee_vacation_profile_history\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`employeeId\` int NULL, \`vacationProfileId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`employee_vacation_profile_history\` ADD CONSTRAINT \`FK_0fd1bf56b59217e2a65b6fe354c\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_vacation_profile_history\` ADD CONSTRAINT \`FK_5a34802d7728df746e93b4323f6\` FOREIGN KEY (\`vacationProfileId\`) REFERENCES \`vacations_profile\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_vacation_profile_history\` DROP FOREIGN KEY \`FK_5a34802d7728df746e93b4323f6\``);
        await queryRunner.query(`ALTER TABLE \`employee_vacation_profile_history\` DROP FOREIGN KEY \`FK_0fd1bf56b59217e2a65b6fe354c\``);
        await queryRunner.query(`DROP TABLE \`employee_vacation_profile_history\``);
    }

}
