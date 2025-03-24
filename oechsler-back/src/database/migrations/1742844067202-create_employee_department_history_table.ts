import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeeDepartmentHistoryTable1742844067202 implements MigrationInterface {
    name = 'CreateEmployeeDepartmentHistoryTable1742844067202'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`employee_department_history\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`employeeId\` int NULL, \`departmentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`employee_department_history\` ADD CONSTRAINT \`FK_63247c1adf5472ad167f10eddb2\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_department_history\` ADD CONSTRAINT \`FK_5a0027e06156252e814c77f4ebe\` FOREIGN KEY (\`departmentId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_department_history\` DROP FOREIGN KEY \`FK_5a0027e06156252e814c77f4ebe\``);
        await queryRunner.query(`ALTER TABLE \`employee_department_history\` DROP FOREIGN KEY \`FK_63247c1adf5472ad167f10eddb2\``);
        await queryRunner.query(`DROP TABLE \`employee_department_history\``);
    }

}
