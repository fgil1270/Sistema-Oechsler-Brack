import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeeJobHistoryTable1742842807073 implements MigrationInterface {
    name = 'CreateEmployeeJobHistoryTable1742842807073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`employee_job_history\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`employeeId\` int NULL, \`jobId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`employee_job_history\` ADD CONSTRAINT \`FK_eab735ee54e48d6b802bad969d2\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_job_history\` ADD CONSTRAINT \`FK_c9093bc9f045a7194162f21e34c\` FOREIGN KEY (\`jobId\`) REFERENCES \`job\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_job_history\` DROP FOREIGN KEY \`FK_c9093bc9f045a7194162f21e34c\``);
        await queryRunner.query(`ALTER TABLE \`employee_job_history\` DROP FOREIGN KEY \`FK_eab735ee54e48d6b802bad969d2\``);
        await queryRunner.query(`DROP TABLE \`employee_job_history\``);
    }

}
