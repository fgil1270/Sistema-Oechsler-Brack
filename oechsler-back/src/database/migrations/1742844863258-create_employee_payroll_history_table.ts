import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeePayrollHistoryTable1742844863258 implements MigrationInterface {
    name = 'CreateEmployeePayrollHistoryTable1742844863258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`employee_payroll_history\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`employeeId\` int NULL, \`payrollId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`employee_payroll_history\` ADD CONSTRAINT \`FK_7c5a0faa9627d09f28bd15abba4\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_payroll_history\` ADD CONSTRAINT \`FK_efa536a052d929e8d004bee5b6e\` FOREIGN KEY (\`payrollId\`) REFERENCES \`payroll\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_payroll_history\` DROP FOREIGN KEY \`FK_efa536a052d929e8d004bee5b6e\``);
        await queryRunner.query(`ALTER TABLE \`employee_payroll_history\` DROP FOREIGN KEY \`FK_7c5a0faa9627d09f28bd15abba4\``);
        await queryRunner.query(`DROP TABLE \`employee_payroll_history\``);
    }

}
