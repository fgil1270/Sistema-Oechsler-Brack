import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployeeIncidence1698166196199 implements MigrationInterface {
    name = 'UpdateEmployeeIncidence1698166196199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP COLUMN \`total_hour\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD \`total_hour\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }

}
