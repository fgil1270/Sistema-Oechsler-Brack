import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployeeIncidence1700164775207 implements MigrationInterface {
    name = 'UpdateEmployeeIncidence1700164775207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD \`type\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP COLUMN \`type\``);

    }

}
